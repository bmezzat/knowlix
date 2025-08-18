import { renderHook, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useSaveUserPrefs } from '@/hooks/mutations/useSaveUserPrefs';
import * as api from '@/api/apiClient';
import { vi } from 'vitest';

describe('useSaveUserPrefs', () => {
  const queryClient = new QueryClient();

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  beforeEach(() => {
    // Set initial cache for userPrefs
    queryClient.setQueryData(['userPrefs'], { theme: 'light', fontSize: 14 });
  });

  it('updates user preferences optimistically and updates the cache', async () => {
    const newPrefs = { theme: 'dark' };
    vi.spyOn(api, 'saveUserPreferences').mockResolvedValue(newPrefs);

    const { result } = renderHook(() => useSaveUserPrefs(), { wrapper });

    await act(async () => {
      await result.current.mutateAsync(newPrefs);
    });

    // Cache should be updated optimistically
    const cache = queryClient.getQueryData<Record<string, any>>(['userPrefs']);
    expect(cache).toEqual({ theme: 'dark', fontSize: 14 });

    // API should be called correctly
    expect(api.saveUserPreferences).toHaveBeenCalledTimes(1);
    expect(api.saveUserPreferences).toHaveBeenCalledWith(newPrefs);
  });

  it('rolls back cache if mutation fails', async () => {
    const newPrefs = { theme: 'dark' };
    vi.spyOn(api, 'saveUserPreferences').mockRejectedValue(new Error('Failed'));

    const { result } = renderHook(() => useSaveUserPrefs(), { wrapper });

    await act(async () => {
      try {
        await result.current.mutateAsync(newPrefs);
      } catch (e) {
        // ignore error
      }
    });

    // Cache should remain unchanged
    const cache = queryClient.getQueryData<Record<string, any>>(['userPrefs']);
    expect(cache).toEqual({ theme: 'light', fontSize: 14 });
  });
});
