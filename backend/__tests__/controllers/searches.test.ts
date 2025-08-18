// import { getHistory, saveSearch, deleteSearch } from '../../../src/controllers/search.controller';#
import { getHistory, saveSearch, deleteSearch } from '../../src/controllers/searches.controller';
import * as searchesDb from '../../src/db/searches';
import httpMocks from 'node-mocks-http';

jest.mock('../../src/db/searches');

describe('search.controller', () => {
  const sub = 'user-123';

  it('getHistory returns list of searches', () => {
    (searchesDb.listSearches as jest.Mock).mockReturnValue([{ id: '1', query: 'foo' }]);
    const req = httpMocks.createRequest({ user: { sub } });
    const res = httpMocks.createResponse();

    getHistory(req as any, res);

    expect(res._getJSONData()).toEqual({ history: [{ id: '1', query: 'foo' }] });
  });

  it('saveSearch requires query', () => {
    const req = httpMocks.createRequest({ user: { sub }, body: {} });
    const res = httpMocks.createResponse();

    saveSearch(req as any, res);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({ error: 'query is required' });
  });

  it('saveSearch saves a search', () => {
    const entry = { id: '2', query: 'bar' };
    (searchesDb.addSearch as jest.Mock).mockReturnValue(entry);

    const req = httpMocks.createRequest({ user: { sub }, body: { query: 'bar' } });
    const res = httpMocks.createResponse();

    saveSearch(req as any, res);

    expect(res.statusCode).toBe(201);
    expect(res._getJSONData()).toEqual({ search: entry });
  });

  it('deleteSearch returns 200 with error if id not found', () => {
    (searchesDb.deleteSearchById as jest.Mock).mockReturnValue(false);

    const req = httpMocks.createRequest({ user: { sub }, params: { id: '99' } });
    const res = httpMocks.createResponse();

    deleteSearch(req as any, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({ error: 'Id "99" not found' });
  });

  it('deleteSearch returns 204 when deletion succeeds', () => {
    (searchesDb.deleteSearchById as jest.Mock).mockReturnValue(true);

    const req = httpMocks.createRequest({ user: { sub }, params: { id: '1' } });
    const res = httpMocks.createResponse();

    deleteSearch(req as any, res);

    expect(res.statusCode).toBe(204);
    expect(res._getData()).toBe('');
  });
});
