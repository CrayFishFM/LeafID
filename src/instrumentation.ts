export async function register() {
  if (process.env.NEXT_RUNTIME !== 'nodejs') return;
  // Create/upgrade all tables on startup so there is no separate migrate step.
  const { getMigrations } = await import('better-auth/db/migration');
  const { auth, ADMIN_EMAILS } = await import('./lib/auth');
  const { ensureSchema, exec } = await import('./lib/db');
  const { runMigrations } = await getMigrations(auth.options);
  await runMigrations();
  await ensureSchema();

  // Promote existing accounts listed in ADMIN_EMAILS.
  for (const email of ADMIN_EMAILS) {
    await exec("UPDATE `user` SET role = 'admin' WHERE LOWER(email) = ? AND (role IS NULL OR role != 'admin')", [email]);
  }
}
