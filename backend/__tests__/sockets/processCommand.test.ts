import { processCommand } from '../../src/sockets/processCommand';
import * as searchesDb from '../../src/db/searches';
import * as userDb from '../../src/db/user';

jest.mock('../../src/db/searches');
jest.mock('../../src/db/user');

describe('processCommand', () => {
  const userId = 'u1';

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('returns search history formatted', async () => {
    (searchesDb.listSearches as jest.Mock).mockReturnValue([
      { id: '1', query: 'foo', createdAt: '2025-08-17T10:00:00Z' },
      { id: '2', query: 'bar', createdAt: '2025-08-17T11:00:00Z' },
    ]);

    const promise = processCommand('get search history', userId);
    jest.advanceTimersByTime(500);
    const result = await promise;

    expect(result).toContain('- 2025-08-17 12:00:00  -  1:   foo');
    expect(result).toContain('- 2025-08-17 13:00:00  -  2:   bar');
    expect(searchesDb.listSearches).toHaveBeenCalledWith(userId);
  });

  it('returns user preferences', async () => {
    const prefs = { theme: 'dark', notifications: true };
    (userDb.getPrefs as jest.Mock).mockReturnValue(prefs);

    const promise = processCommand('get my preferences', userId);
    jest.advanceTimersByTime(500);
    const result = await promise;

    expect(result).toBe(`Preferences is:\n${JSON.stringify(prefs, null, 2)}`);
    expect(userDb.getPrefs).toHaveBeenCalledWith(userId);
  });

  it('deletes a search by ID', async () => {
    const promise = processCommand('delete search 123', userId);
    jest.advanceTimersByTime(200);
    const result = await promise;

    expect(result).toBe('Search deleted successfully');
    expect(searchesDb.deleteSearchById).toHaveBeenCalledWith(userId, '123');
  });

  it('returns error if delete command missing ID', async () => {
    const promise = processCommand('delete search', userId);
    jest.advanceTimersByTime(200);
    const result = await promise;

    expect(result).toBe('No ID provided, Please provide a valid ID to delete');
    expect(searchesDb.deleteSearchById).not.toHaveBeenCalled();
  });

  it('saves user preferences', async () => {
    const promise = processCommand('save my preferences dark', userId);
    jest.advanceTimersByTime(200);
    const result = await promise;

    expect(result).toBe('Preference Saved successfully');
    expect(userDb.setPrefs).toHaveBeenCalledWith(userId, 'dark');
  });

  it('returns error if save preferences missing value', async () => {
    const promise = processCommand('save my preferences', userId);
    jest.advanceTimersByTime(200);
    const result = await promise;

    expect(result).toEqual({ status: 'error', message: 'No Preference provided' });
    expect(userDb.setPrefs).not.toHaveBeenCalled();
  });

  it('returns default message for unknown commands', async () => {
    const promise = processCommand('unknown command', userId);
    const result = await promise;
    expect(result).toBe('Not a valid command');
  });
});
