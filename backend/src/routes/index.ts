import { Router } from 'express';
import userRoutes from './user.routes';
import searchesRoutes from './searches.routes';

const router = Router();

router.use('/user', userRoutes);
router.use('/searches', searchesRoutes);
router.get('/health', (_req, res) => res.json({ ok: true }));

export default router;
