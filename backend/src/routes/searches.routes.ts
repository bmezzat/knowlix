import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { getHistory, saveSearch, deleteSearch } from '../controllers/searches.controller';

const r = Router();
r.get('/history', requireAuth, getHistory);
r.post('/', requireAuth, saveSearch);
r.delete('/:id', requireAuth, deleteSearch);
export default r;