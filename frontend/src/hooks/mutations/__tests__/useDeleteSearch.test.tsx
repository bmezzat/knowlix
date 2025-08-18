import { renderHook, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider, useQueryClient } from '@tanstack/react-query';
import { useDeleteSearch } from '@/hooks/mutations/useDeleteSearch';
import * as api from '@/api/apiClient';
import { vi } from 'vitest';

describe('useDeleteSearch', () => {
  const queryClient = new QueryClient();

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  beforeEach(() => {
    queryClient.setQueryData(['searchHistory'], ['search1', 'search2']);
  });

  it('deletes a search item optimistically and updates the cache', async () => {
    vi.spyOn(api, 'deleteSearch').mockResolvedValue(undefined);

    const { result } = renderHook(() => useDeleteSearch(), { wrapper });

    await act(async () => {
      await result.current.mutateAsync('search1');
    });

    // The deleted item should be removed from cache
    const cache = queryClient.getQueryData<string[]>(['searchHistory']);
    expect(cache).toEqual(['search2']);

    // deleteSearch API should be called once
    expect(api.deleteSearch).toHaveBeenCalledTimes(1);
    expect(api.deleteSearch).toHaveBeenCalledWith('search1');
  });

  it('rolls back cache if mutation fails', async () => {
    vi.spyOn(api, 'deleteSearch').mockRejectedValue(new Error('Failed'));

    const { result } = renderHook(() => useDeleteSearch(), { wrapper });

    await act(async () => {
      try {
        await result.current.mutateAsync('search1');
      } catch (e) {
        null
      }
    });

    // Cache should remain unchanged
    const cache = queryClient.getQueryData<string[]>(['searchHistory']);
    expect(cache).toEqual(['search1', 'search2']);
  });
});
