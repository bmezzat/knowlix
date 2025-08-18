import { requireAuth } from '../../src/middleware/auth';
import { verifyCognitoAccessToken } from '../../src/services/cognito';
import httpMocks from 'node-mocks-http';

jest.mock('../../src/services/cognito');

describe('requireAuth middleware', () => {
  it('rejects when no token', async () => {
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();
    const next = jest.fn();

    await requireAuth(req, res, next);
    expect(res.statusCode).toBe(401);
  });

  it('accepts valid token', async () => {
    (verifyCognitoAccessToken as jest.Mock).mockResolvedValue({ sub: 'u1' });
    const req = httpMocks.createRequest({ headers: { authorization: 'Bearer abc' } });
    const res = httpMocks.createResponse();
    const next = jest.fn();

    await requireAuth(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(req.user).toEqual({ sub: 'u1' });
  });

  it('rejects invalid token', async () => {
    (verifyCognitoAccessToken as jest.Mock).mockRejectedValue(new Error('bad token'));

    const req = httpMocks.createRequest({ headers: { authorization: 'Bearer bad.jwt' } });
    const res = httpMocks.createResponse();
    const next = jest.fn();

    await requireAuth(req, res, next);

    expect(res.statusCode).toBe(401);
    expect(res._getJSONData()).toEqual({ error: 'Invalid or expired token' });
  });
  it('denies access without auth', async () => {
    const req = httpMocks.createRequest({ headers: {} });
    const res = httpMocks.createResponse();
    const next = jest.fn();

    await requireAuth(req, res, next);

    expect(res.statusCode).toBe(401);
    expect(res._getJSONData()).toEqual({ error: 'Missing Authorization header' });
  });
});
