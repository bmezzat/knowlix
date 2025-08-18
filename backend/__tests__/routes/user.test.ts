import request from 'supertest';
import app from '../../src/app';
import * as cognito from '../../src/services/cognito';
import * as userDb from '../../src/db/user';

jest.mock('../../src/services/cognito');
jest.mock('../../src/db/user');

describe('User Preferences API', () => {
  beforeEach(() => {
    (cognito.verifyCognitoAccessToken as jest.Mock).mockResolvedValue({ sub: 'u1' });
  });

  it('GET /api/user/preferences returns prefs', async () => {
    (userDb.getPrefs as jest.Mock).mockReturnValue({ theme: 'dark' });

    const res = await request(app)
      .get('/api/user/preferences')
      .set('Authorization', 'Bearer token');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ preferences: { theme: 'dark' } });
  });

  it('POST /api/user/preferences saves prefs', async () => {
    (userDb.setPrefs as jest.Mock).mockReturnValue({ theme: 'light' });

    const res = await request(app)
      .post('/api/user/preferences')
      .set('Authorization', 'Bearer token')
      .send({ prefs: 'light' });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ preferences: { theme: 'light' } });
  });
})