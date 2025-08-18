import { describe, it, expect } from 'vitest';
import {
  parseJokeApiResponse,
  parseGithubApiResponse,
  parseWeatherApiResponse,
  parseCatApiResponse,
  getSearchHistoryParser,
  getMyPreferencesParser
} from '../apiHelpers';


describe('API response parsers', () => {

  describe('parseJokeApiResponse', () => {
    it('should parse a single joke', () => {
      const res = { data: { value: 'Funny joke' } };
      const result = parseJokeApiResponse(res);
      expect(result).toEqual([
        'You get the below random joke',
        '- Funny joke',
        ' '
      ]);
    });

    it('should parse search results', () => {
      const res = { data: { total: 2, result: [{ value: 'joke1' }, { value: 'joke2' }] } };
      const url = 'https://api.com?query=fun';
      const result = parseJokeApiResponse(res, url);
      expect(result).toEqual([
        'You have total 2 items for keyword "fun"',
        '- joke1',
        '- joke2',
        ' '
      ]);
    });

    it('should return default message if no relevant data', () => {
      const res = { data: {} };
      const result = parseJokeApiResponse(res);
      expect(result).toEqual(['No relevant data found.', ' ']);
    });
  });

  describe('parseGithubApiResponse', () => {
    it('should parse GitHub user search results', () => {
      const res = { data: { total_count: 1, items: [{ id: 123, url: 'https://github.com/user' }] } };
      const url = 'https://api.github.com/search/users?q=test';
      const result = parseGithubApiResponse(res, url);
      expect(result).toEqual([
        'You have total 1 accounts for keyword "test"',
        '- id: 123, URL: https://github.com/user',
        ' '
      ]);
    });

    it('should return default message if no relevant data', () => {
      const res = { data: {} };
      const result = parseGithubApiResponse(res);
      expect(result).toEqual(['No relevant data found.', ' ']);
    });
  });

  describe('parseWeatherApiResponse', () => {
    it('should parse current weather', () => {
      const res = { data: { current_weather: { temperature: 25 } } };
      const result = parseWeatherApiResponse(res);
      expect(result).toEqual(['- Current weather in Berlin is 25°C', ' ']);
    });

    it('should return default message if no current_weather', () => {
      const res = { data: {} };
      const result = parseWeatherApiResponse(res);
      expect(result).toEqual(['No relevant data found.', ' ']);
    });
  });

  describe('parseCatApiResponse', () => {
    it('should parse cat fact', () => {
      const res = { data: { fact: 'Cats sleep a lot' } };
      const result = parseCatApiResponse(res);
      expect(result).toEqual(['- Cats sleep a lot', ' ']);
    });

    it('should return default message if no fact', () => {
      const res = { data: {} };
      const result = parseCatApiResponse(res);
      expect(result).toEqual(['No relevant data found.', ' ']);
    });
  });

  describe('getSearchHistoryParser', () => {
    it('should parse search history', () => {
      const history = [
        { id: 1, query: 'first', createdAt: '2025-08-15T10:00:00Z' },
        { id: 2, query: 'second', createdAt: '2025-08-16T11:00:00Z' }
      ];
      const res = { history };
      const result = getSearchHistoryParser(res);
      expect(result).toEqual([
        'History is:',
        '- 2025-08-15 12:00:00  -  1:   first',
        '- 2025-08-16 13:00:00  -  2:   second',
        ' '
      ]);
    });

    it('should return default message if no history', () => {
      const res = {};
      const result = getSearchHistoryParser(res);
      expect(result).toEqual(['No history found.', ' ']);
    });
  });

  describe('getMyPreferencesParser', () => {
    it('should parse preferences', () => {
      const res = { preferences: { theme: 'dark' } };
      const result = getMyPreferencesParser(res);
      expect(result).toEqual([
        'Preferences is:"',
        '- {"theme":"dark"}',
        ' '
      ]);
    });

    it('should return default message if no preferences', () => {
      const res = {};
      const result = getMyPreferencesParser(res);
      expect(result).toEqual(['No preferences found.', ' ']);
    });
  });

});
