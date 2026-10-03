// MySQL errors meaning "this schema change is already in place".
const ALREADY_APPLIED = new Set([
  1050, // ER_TABLE_EXISTS_ERROR
  1060, // ER_DUP_FIELDNAME
  1061, // ER_DUP_KEYNAME
]);

function alreadyApplied(e: unknown) {
  const err = e as { errno?: number; message?: string };
  return (
    (err.errno !== undefined && ALREADY_APPLIED.has(err.errno)) ||
    /Duplicate column|already exists|Duplicate key name/i.test(err.message ?? '')
  );
}

export async function register() {
  if (process.env.NEXT_RUNTIME !== 'nodejs') return;
  const { getMigrations } = await import('better-auth/db/migration');
  const { auth, ADMIN_EMAILS } = await import('./lib/auth');
  const { ensureSchema, exec, pool } = await import('./lib/db');

  // Create/upgrade all tables on startup so there is no separate migrate step.
  // Hosts often start several app processes at once; a MySQL named lock makes them
  // migrate one at a time, so the others find nothing left to do.
  const lock = await pool.getConnection();
  try {
    await lock.query(`SELECT GET_LOCK('leafid_migrations', 60)`);
    // If a step turns out to be applied already (another process got there first, e.g. the
    // lock timed out), re-read the schema and run whatever is still missing.
    for (let attempt = 1; ; attempt++) {
      try {
        await (await getMigrations(auth.options)).runMigrations();
        break;
      } catch (e) {
        if (!alreadyApplied(e)) throw e;
        console.warn(`[migrate] already applied, re-checking: ${(e as Error).message}`);
        if (attempt === 3) break;
      }
    }
    await ensureSchema();
    // Photos used to be files in the app folder; move any that are left into the database.
    const { importLegacyImages } = await import('./lib/community');
    await importLegacyImages();
  } finally {
    await lock.query(`SELECT RELEASE_LOCK('leafid_migrations')`).catch(() => {});
    lock.release();
  }

  // Apply the current voting rules to photos still waiting (e.g. after MIN_VOTES changed).
  const { recheckOpenSubmissions } = await import('./lib/community');
  await recheckOpenSubmissions().catch((e) => console.error('[community] recheck failed:', e.message));

  // Remove guests whose session ended without leaving anything, now and daily.
  const { cleanupGuests } = await import('./lib/guests');
  const sweep = () => cleanupGuests().catch((e) => console.error('[guests] cleanup failed:', e.message));
  await sweep();
  setInterval(sweep, 24 * 60 * 60 * 1000).unref();

  // Promote existing accounts listed in ADMIN_EMAILS.
  for (const email of ADMIN_EMAILS) {
    await exec("UPDATE `user` SET role = 'admin' WHERE LOWER(email) = ? AND (role IS NULL OR role != 'admin')", [email]);
  }
}
