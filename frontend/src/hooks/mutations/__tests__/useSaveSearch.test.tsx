import { renderHook, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useSaveSearch } from '@/hooks/mutations/useSaveSearch';
import * as api from '@/api/apiClient';
import { vi } from 'vitest';

describe('useSaveSearch', () => {
  const queryClient = new QueryClient();

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  beforeEach(() => {
    // Set initial cache for searchHistory
    queryClient.setQueryData(['searchHistory'], ['search1', 'search2']);
  });

  it('adds a new search optimistically and updates the cache', async () => {
    const newSearch = 'search3';
    vi.spyOn(api, 'saveSearch').mockResolvedValue(newSearch);

    const { result } = renderHook(() => useSaveSearch(), { wrapper });

    await act(async () => {
      await result.current.mutateAsync(newSearch);
    });

    const cache = queryClient.getQueryData<string[]>(['searchHistory']);
    expect(cache).toEqual(['search1', 'search2', 'search3']);
    expect(api.saveSearch).toHaveBeenCalledTimes(1);
    expect(api.saveSearch).toHaveBeenCalledWith(newSearch);
  });

  it('rolls back cache if mutation fails', async () => {
    const newSearch = 'search3';
    vi.spyOn(api, 'saveSearch').mockRejectedValue(new Error('Failed'));

    const { result } = renderHook(() => useSaveSearch(), { wrapper });

    await act(async () => {
      try {
        await result.current.mutateAsync(newSearch);
      } catch (e) {
        // ignore error
      }
    });

    // Cache should remain unchanged
    const cache = queryClient.getQueryData<string[]>(['searchHistory']);
    expect(cache).toEqual(['search1', 'search2']);
  });
});
