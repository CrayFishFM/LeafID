import fs from 'node:fs';
import path from 'node:path';
import mysql from 'mysql2/promise';

export const DATA_DIR = path.resolve(/*turbopackIgnore: true*/ process.env.DATA_DIR ?? path.join(process.cwd(), 'data'));
export const UPLOAD_DIR = path.join(DATA_DIR, 'uploads');

function createPool() {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  return mysql.createPool({
    host: process.env.MYSQL_HOST ?? 'localhost',
    port: Number(process.env.MYSQL_PORT ?? 3306),
    database: process.env.MYSQL_DATABASE,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    connectionLimit: 10,
    charset: 'utf8mb4',
    // SUM()/AVG() return DECIMAL; read them as numbers instead of strings.
    decimalNumbers: true,
    // Better Auth stores dates as DATETIME; keep them in UTC.
    timezone: 'Z',
  });
}

// Reuse one pool across hot reloads in development.
const g = globalThis as unknown as { __leafPool?: mysql.Pool };
export const pool = g.__leafPool ?? (g.__leafPool = createPool());

export type Params = (string | number | boolean | null | Date)[];

export async function query<T>(sql: string, params: Params = []): Promise<T[]> {
  const [rows] = await pool.query(sql, params);
  return rows as T[];
}

export async function one<T>(sql: string, params: Params = []): Promise<T | undefined> {
  return (await query<T>(sql, params))[0];
}

export async function exec(sql: string, params: Params = []) {
  const [result] = await pool.execute(sql, params);
  return result as mysql.ResultSetHeader;
}

/** Run statements on one connection inside a transaction. */
export async function transaction<T>(fn: (conn: mysql.PoolConnection) => Promise<T>): Promise<T> {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const out = await fn(conn);
    await conn.commit();
    return out;
  } catch (e) {
    await conn.rollback();
    throw e;
  } finally {
    conn.release();
  }
}

/**
 * Species ids that were renamed (old → new). Rows saved under an old id are moved on start.
 * Ss became Sumac because Ss is the official Ontario code for sassafras.
 */
const RENAMED_SPECIES: Record<string, string> = { Ss: 'Sumac' };

async function renameSpeciesIds() {
  for (const [from, to] of Object.entries(RENAMED_SPECIES)) {
    await pool.execute(`UPDATE attempt SET species = ? WHERE species = ?`, [to, from]);
    await pool.execute(`UPDATE attempt SET chosen = ? WHERE chosen = ?`, [to, from]);
    await pool.execute(`UPDATE attempt SET image = CONCAT(?, SUBSTRING(image, ?)) WHERE image LIKE ?`, [
      `lib:${to}/`, `lib:${from}/`.length + 1, `lib:${from}/%`,
    ]);
    await pool.execute(`UPDATE submission SET claimed = ? WHERE claimed = ?`, [to, from]);
    await pool.execute(`UPDATE submission SET consensus = ? WHERE consensus = ?`, [to, from]);
    await pool.execute(`UPDATE vote SET species = ? WHERE species = ?`, [to, from]);
  }
}

/** App tables (Better Auth creates its own). Safe to run on every start. */
export async function ensureSchema() {
  // No explicit charset/collation: inherit the database default, like Better Auth's tables,
  // so joins on user ids never hit "Illegal mix of collations".
  const opts = 'ENGINE=InnoDB';
  await pool.query(`
    CREATE TABLE IF NOT EXISTS attempt (
      id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      user_id VARCHAR(64) NOT NULL,
      species VARCHAR(16) NOT NULL,
      chosen VARCHAR(16) NOT NULL,
      correct TINYINT(1) NOT NULL,
      hints TINYINT UNSIGNED NOT NULL DEFAULT 0,
      image VARCHAR(255) NOT NULL,
      created_at BIGINT NOT NULL,
      INDEX attempt_user (user_id, created_at),
      INDEX attempt_time (created_at)
    ) ${opts}`);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS submission (
      id CHAR(36) PRIMARY KEY,
      user_id VARCHAR(64) NOT NULL,
      claimed VARCHAR(16) NOT NULL,
      file VARCHAR(64) NOT NULL,
      note TEXT NULL,
      status VARCHAR(16) NOT NULL DEFAULT 'pending',
      consensus VARCHAR(16) NULL,
      moderated TINYINT(1) NOT NULL DEFAULT 0,
      created_at BIGINT NOT NULL,
      INDEX submission_status (status, created_at),
      INDEX submission_user (user_id)
    ) ${opts}`);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS vote (
      submission_id CHAR(36) NOT NULL,
      user_id VARCHAR(64) NOT NULL,
      species VARCHAR(16) NOT NULL,
      created_at BIGINT NOT NULL,
      PRIMARY KEY (submission_id, user_id),
      INDEX vote_user (user_id),
      CONSTRAINT vote_submission FOREIGN KEY (submission_id) REFERENCES submission(id) ON DELETE CASCADE
    ) ${opts}`);
  await renameSpeciesIds();
}
