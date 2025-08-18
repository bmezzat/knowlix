import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { getPreferences, savePreferences } from '../controllers/user.controller';

const r = Router();
r.get('/preferences', requireAuth, getPreferences);
r.post('/preferences', requireAuth, savePreferences);
export default r;