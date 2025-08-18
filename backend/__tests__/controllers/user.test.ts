import request from 'supertest';
import express from 'express';
import userRoutes from '../../src/routes/user.routes';
import * as userDb from '../../src/db/user';
import { requireAuth } from '../../src/middleware/auth';

jest.mock('../../src/db/user');
jest.mock('../../src/middleware/auth', () => ({
  requireAuth: jest.fn((req, _res, next) => {
    // attach a default user
    req.user = { sub: 'u1' };
    next();
  }),
}));

const app = express();
app.use(express.json());
app.use('/api/user', userRoutes);

describe('User routes', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('GET /api/user/preferences returns prefs', async () => {
    (userDb.getPrefs as jest.Mock).mockReturnValue({ theme: 'dark' });

    const res = await request(app)
      .get('/api/user/preferences')
      .set('Authorization', 'Bearer token');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ preferences: { theme: 'dark' } });
  });

  it('GET /api/user/preferences returns 401 if no auth', async () => {
    (requireAuth as jest.Mock).mockImplementationOnce((_req, res, _next) => {
      res.status(401).json({ error: 'Unauthorized' });
    });

    const res = await request(app).get('/api/user/preferences');

    expect(res.status).toBe(401);
    expect(res.body).toEqual({ error: 'Unauthorized' });
  });

  it('POST /api/user/preferences saves prefs', async () => {
    (userDb.setPrefs as jest.Mock).mockReturnValue({ theme: 'light' });

    const res = await request(app)
      .post('/api/user/preferences')
      .send({ prefs: { theme: 'light' } })
      .set('Authorization', 'Bearer token');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ preferences: { theme: 'light' } });
  });

  it('POST /api/user/preferences defaults to empty object if none provided', async () => {
    (userDb.setPrefs as jest.Mock).mockReturnValue({});

    const res = await request(app)
      .post('/api/user/preferences')
      .send({})
      .set('Authorization', 'Bearer token');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ preferences: {} });
  });
});
