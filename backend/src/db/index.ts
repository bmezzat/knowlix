import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'backend.db');
export const db = new Database(dbPath);

// Create tables if they don't exist
export function initDb() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS preferences (
      userId TEXT PRIMARY KEY,
      theme TEXT
    );

    CREATE TABLE IF NOT EXISTS saved_searches (
      id TEXT PRIMARY KEY,
      userId TEXT,
      query TEXT,
      createdAt TEXT,
      FOREIGN KEY (userId) REFERENCES preferences(userId)
    );
  `);
  console.log('Database initialized');
}