import type { Request, Response, NextFunction } from 'express';
import { verifyCognitoAccessToken } from '../services/cognito';

export interface AuthenticatedRequest extends Request {
  user?: any;
}

export async function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice('Bearer '.length) : null;

  if (!token) return res.status(401).json({ error: 'Missing Authorization header' });

  try {
    const payload = await verifyCognitoAccessToken(token);
    req.user = payload;
    return next();
  } catch (err: any) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}