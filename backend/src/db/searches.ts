import { db } from './index';
import { v4 as uuid } from 'uuid';

export type SavedSearch = {
  id: string;
  query: string;
  createdAt: string;
};

export function listSearches(userId: string): SavedSearch[] {
  return db
    .prepare('SELECT * FROM saved_searches WHERE userId = ? ORDER BY createdAt DESC')
    .all(userId) as SavedSearch[];
}

export function addSearch(userId: string, query: string): SavedSearch {
  const entry: SavedSearch = { id: uuid(), query, createdAt: new Date().toISOString() };
  db.prepare('INSERT INTO saved_searches(id, userId, query, createdAt) VALUES (?, ?, ?, ?)')
    .run(entry.id, userId, entry.query, entry.createdAt);
  return entry;
}

export function deleteSearchById(userId: string, id: string): boolean {
  const result = db.prepare('DELETE FROM saved_searches WHERE id = ? AND userId = ?').run(id, userId);
  return result.changes > 0;
}
