import path from 'node:path';
import mysql from 'mysql2/promise';

/**
 * Where uploads used to be stored as files. Photos now live in the database
 * (submission_image); this is only read once to import any files left over.
 */
export const LEGACY_UPLOAD_DIR = path.join(
  path.resolve(/*turbopackIgnore: true*/ process.env.DATA_DIR ?? path.join(process.cwd(), 'data')),
  'uploads',
);

function createPool() {
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

export type Params = (string | number | boolean | null | Date | Buffer)[];

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
  // Uploaded photos, kept apart from submission so listing queries never load image bytes.
  // Stored in the database because hosts like Hostinger replace the app folder on every deploy.
  await pool.query(`
    CREATE TABLE IF NOT EXISTS submission_image (
      submission_id CHAR(36) PRIMARY KEY,
      mime VARCHAR(32) NOT NULL,
      data MEDIUMBLOB NOT NULL,
      CONSTRAINT image_submission FOREIGN KEY (submission_id) REFERENCES submission(id) ON DELETE CASCADE
    ) ${opts}`);
  // Reports of bad photos. image_key is "lib:<species>/<file>" or "sub:<submission id>".
  await pool.query(`
    CREATE TABLE IF NOT EXISTS image_report (
      id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      image_key VARCHAR(64) NOT NULL,
      user_id VARCHAR(64) NOT NULL,
      reason VARCHAR(32) NOT NULL,
      note VARCHAR(500) NULL,
      status VARCHAR(16) NOT NULL DEFAULT 'open',
      created_at BIGINT NOT NULL,
      resolved_at BIGINT NULL,
      resolved_by VARCHAR(64) NULL,
      UNIQUE KEY report_once (image_key, user_id),
      INDEX report_status (status, created_at)
    ) ${opts}`);
  // Built-in library photos an admin pulled down (they're static files, so they're hidden, not deleted).
  await pool.query(`
    CREATE TABLE IF NOT EXISTS hidden_image (
      image_key VARCHAR(64) PRIMARY KEY,
      hidden_by VARCHAR(64) NOT NULL,
      hidden_at BIGINT NOT NULL
    ) ${opts}`);
  // Answers in the extra quizzes (fish, hardwood defects…). topic and item are ids from src/data/topics.
  await pool.query(`
    CREATE TABLE IF NOT EXISTS topic_attempt (
      id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      user_id VARCHAR(64) NOT NULL,
      topic VARCHAR(32) NOT NULL,
      item VARCHAR(48) NOT NULL,
      chosen VARCHAR(48) NOT NULL,
      correct TINYINT(1) NOT NULL,
      hints TINYINT UNSIGNED NOT NULL DEFAULT 0,
      created_at BIGINT NOT NULL,
      INDEX topic_attempt_user (user_id, topic, created_at)
    ) ${opts}`);
  // Leaf species content. Filled from src/data/species.ts on start, then edited by admins.
  // Ids are fixed: answers, uploads and votes refer to them.
  await pool.query(`
    CREATE TABLE IF NOT EXISTS leaf_group (
      id VARCHAR(32) PRIMARY KEY,
      label VARCHAR(80) NOT NULL,
      blurb VARCHAR(300) NOT NULL,
      sort INT NOT NULL DEFAULT 0,
      updated_at BIGINT NULL,
      updated_by VARCHAR(64) NULL
    ) ${opts}`);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS leaf_species (
      id VARCHAR(16) PRIMARY KEY,
      code VARCHAR(16) NOT NULL,
      common VARCHAR(80) NOT NULL,
      scientific VARCHAR(120) NOT NULL,
      grp VARCHAR(32) NOT NULL,
      arrangement VARCHAR(16) NOT NULL,
      leaf_type VARCHAR(16) NOT NULL,
      shape VARCHAR(200) NOT NULL,
      margin VARCHAR(200) NOT NULL,
      key_features TEXT NOT NULL,
      field_clues TEXT NOT NULL,
      lookalikes TEXT NOT NULL,
      sort INT NOT NULL DEFAULT 0,
      updated_at BIGINT NULL,
      updated_by VARCHAR(64) NULL
    ) ${opts}`);
  // Content of the extra quizzes. Filled from src/data/topics on start, then edited by admins.
  // JSON columns are stored as TEXT so older MySQL/MariaDB versions work too.
  await pool.query(`
    CREATE TABLE IF NOT EXISTS quiz_topic (
      id VARCHAR(32) PRIMARY KEY,
      title VARCHAR(80) NOT NULL,
      short VARCHAR(40) NOT NULL,
      blurb VARCHAR(300) NOT NULL,
      question VARCHAR(120) NOT NULL,
      noun VARCHAR(40) NOT NULL,
      source VARCHAR(160) NOT NULL,
      \`groups\` TEXT NOT NULL,
      sort INT NOT NULL DEFAULT 0,
      updated_at BIGINT NULL,
      updated_by VARCHAR(64) NULL
    ) ${opts}`);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS quiz_item (
      topic VARCHAR(32) NOT NULL,
      id VARCHAR(48) NOT NULL,
      name VARCHAR(80) NOT NULL,
      aka VARCHAR(80) NULL,
      note VARCHAR(80) NULL,
      scientific VARCHAR(120) NULL,
      grp VARCHAR(32) NOT NULL,
      tips TEXT NOT NULL,
      lookalikes TEXT NOT NULL,
      images TEXT NOT NULL,
      sort INT NOT NULL DEFAULT 0,
      updated_at BIGINT NULL,
      updated_by VARCHAR(64) NULL,
      PRIMARY KEY (topic, id)
    ) ${opts}`);
  await renameSpeciesIds();
}
