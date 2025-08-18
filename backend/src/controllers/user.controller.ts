import type { Response } from 'express';
import type { AuthenticatedRequest } from '../middleware/auth';
import { getPrefs, setPrefs } from '../db/user';

export function getPreferences(req: AuthenticatedRequest, res: Response) {
  const sub = req.user?.sub as string;
  res.json({ preferences: getPrefs(sub) });
}

export function savePreferences(req: AuthenticatedRequest, res: Response) {
  const sub = req.user?.sub as string;
  const next = setPrefs(sub, req.body.prefs || {});
  res.status(200).json({ preferences: next });
}
