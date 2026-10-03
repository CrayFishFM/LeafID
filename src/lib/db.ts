import Database from 'better-sqlite3';
import fs from 'node:fs';
import path from 'node:path';

export const DATA_DIR = path.resolve(/*turbopackIgnore: true*/ process.env.DATA_DIR ?? path.join(process.cwd(), 'data'));
export const UPLOAD_DIR = path.join(DATA_DIR, 'uploads');

function open() {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  const db = new Database(path.join(/*turbopackIgnore: true*/ DATA_DIR, 'leafid.db'));
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');
  db.exec(`
    CREATE TABLE IF NOT EXISTS attempt (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      species TEXT NOT NULL,
      chosen TEXT NOT NULL,
      correct INTEGER NOT NULL,
      hints INTEGER NOT NULL DEFAULT 0,
      image TEXT NOT NULL,
      created_at INTEGER NOT NULL
    );
    CREATE INDEX IF NOT EXISTS attempt_user ON attempt(user_id, created_at);

    CREATE TABLE IF NOT EXISTS submission (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      claimed TEXT NOT NULL,
      file TEXT NOT NULL,
      note TEXT,
      status TEXT NOT NULL DEFAULT 'pending',
      consensus TEXT,
      created_at INTEGER NOT NULL
    );
    CREATE INDEX IF NOT EXISTS submission_status ON submission(status, created_at);

    CREATE TABLE IF NOT EXISTS vote (
      submission_id TEXT NOT NULL REFERENCES submission(id) ON DELETE CASCADE,
      user_id TEXT NOT NULL,
      species TEXT NOT NULL,
      created_at INTEGER NOT NULL,
      PRIMARY KEY (submission_id, user_id)
    );
  `);
  return db;
}

// Reuse one connection across hot reloads in development.
const g = globalThis as unknown as { __leafDb?: Database.Database };
export const db = g.__leafDb ?? (g.__leafDb = open());
