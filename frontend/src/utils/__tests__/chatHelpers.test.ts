import { describe, it, expect } from 'vitest';
import { parseUserCommand } from '../chatHelpers';

describe('parseUserCommand', () => {
  it('should parse "get search history"', () => {
    const result = parseUserCommand('get search history');
    expect(result).toEqual({
      commandType: 'getSearchHistory',
      apiId: 'backend',
      searchQuery: 'history',
    });
  });

  it('should parse "save my preferences dark mode"', () => {
    const result = parseUserCommand('save my preferences dark');
    expect(result).toEqual({
      commandType: 'savePreferences',
      apiId: 'backend',
      searchQuery: 'dark',
    });
  });

  it('should parse unknown command', () => {
    const result = parseUserCommand('chuck joke random');
    expect(result).toEqual({
      commandType: 'chuck',
      apiId: 'joke',
      searchQuery: 'random',
    });
  });
});
