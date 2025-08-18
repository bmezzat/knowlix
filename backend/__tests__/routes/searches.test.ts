import request from 'supertest';
import app from '../../src/app';
import * as searchesDb from '../../src/db/searches';

jest.mock('../../src/db/searches');

// Fake auth middleware so routes see a `req.user`
jest.mock('../../src/middleware/auth', () => ({
  requireAuth: (req: any, _res: any, next: any) => {
    req.user = { sub: 'user-123' };
    next();
  },
}));

describe('Search routes', () => {
  it('GET /api/searches returns history', async () => {
    (searchesDb.listSearches as jest.Mock).mockReturnValue([{ id: '1', query: 'foo' }]);
    const res = await request(app).get('/api/searches/history');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ history: [{ id: '1', query: 'foo' }] });
  });

  it('POST /api/searches requires query', async () => {
    const res = await request(app).post('/api/searches').send({});
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'query is required' });
  });

  it('POST /api/searches saves search', async () => {
    const entry = { id: '2', query: 'bar' };
    (searchesDb.addSearch as jest.Mock).mockReturnValue(entry);

    const res = await request(app).post('/api/searches').send({ query: 'bar' });

    expect(res.status).toBe(201);
    expect(res.body).toEqual({ search: entry });
  });

  it('DELETE /api/searches/:id returns 200 if not found', async () => {
    (searchesDb.deleteSearchById as jest.Mock).mockReturnValue(false);

    const res = await request(app).delete('/api/searches/99');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ error: 'Id "99" not found' });
  });

  it('DELETE /api/searches/:id returns 204 if deleted', async () => {
    (searchesDb.deleteSearchById as jest.Mock).mockReturnValue(true);

    const res = await request(app).delete('/api/searches/1');
    expect(res.status).toBe(204);
  });
});
