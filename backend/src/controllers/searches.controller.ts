import type { Response } from 'express';
import type { AuthenticatedRequest } from '../middleware/auth';
import { listSearches, addSearch, deleteSearchById } from '../db/searches';
import { db } from '../db';

export function getHistory(req: AuthenticatedRequest, res: Response) {
  const sub = req.user?.sub as string;
  res.json({ history: listSearches(sub) });
}

export function saveSearch(req: AuthenticatedRequest, res: Response) {
  const sub = req.user?.sub as string;
  const { query } = req.body || {};
  if (!query) return res.status(400).json({ error: 'query is required' });
  const userExists = db.prepare('SELECT 1 FROM preferences WHERE userId = ?').get(sub);
  if (!userExists) {
    db.prepare('INSERT INTO preferences (userId, theme) VALUES (?, ?)').run(sub, 'default');
  }
  const entry = addSearch(sub, query);
  res.status(201).json({ search: entry });
}

export function deleteSearch(req: AuthenticatedRequest, res: Response) {
  const sub = req.user?.sub as string;
  const id = req.params.id;
  const ok = deleteSearchById(sub, id);
  if (!ok) return res.status(200).json({ error: 'Id "' + id + '" not found' });
  res.status(204).end();
}
