export async function register() {
  if (process.env.NEXT_RUNTIME !== 'nodejs') return;
  // Create/upgrade Better Auth tables on startup so there is no separate migrate step.
  const { getMigrations } = await import('better-auth/db/migration');
  const { auth } = await import('./lib/auth');
  const { runMigrations } = await getMigrations(auth.options);
  await runMigrations();
}
