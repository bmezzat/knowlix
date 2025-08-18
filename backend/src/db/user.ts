import { db } from './index';

export type Preferences = {
  theme?: string;
};

export function getPrefs(userId: string): Preferences {
  const row = db.prepare('SELECT theme FROM preferences WHERE userId = ?').get(userId);
  return row || {};
}

export function setPrefs(userId: string, theme: string): Preferences {
  const preferences = {theme}
  db.prepare(
    `
        INSERT INTO preferences(userId, theme) 
        VALUES (@userId,@theme)
        ON CONFLICT(userId) DO UPDATE SET theme=@theme
    `
  ).run({ userId, theme: preferences.theme });

  return preferences;
}
