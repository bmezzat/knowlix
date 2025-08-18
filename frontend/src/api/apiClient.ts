import axiosPrivate from './axios';

export const getUserPrefs = async () => {
  const response = await axiosPrivate.get('/user/preferences');
  return response.data;
};

export const saveUserPreferences = async (theme: Record<string, any>) => {
  const response = await axiosPrivate.post('/user/preferences', theme);
  return response.data;
};

export const listSavedSearches = async () => {
  const response = await axiosPrivate.get('/searches/history');
  return response.data;
};

export const saveSearch = async (query: string) => {
  const response = await axiosPrivate.post('/searches', { query });
  return response.data;
};

export const deleteSearch = async (id: string) => {
  const response = await axiosPrivate.delete(`/searches/${id}`);
  return response.data;
};
