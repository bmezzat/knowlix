import { renderHook } from '@testing-library/react';
import { waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useSearchHistory } from '@/hooks/queries/useSearchHistory';
import * as api from '@/api/apiClient';
import { vi } from 'vitest';

describe('useSearchHistory', () => {
  const queryClient = new QueryClient();

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  it('fetches and returns search history', async () => {
    const mockData = ['search1', 'search2'];
    vi.spyOn(api, 'listSavedSearches').mockResolvedValue(mockData);

    const { result } = renderHook(() => useSearchHistory(), { wrapper });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockData);
    expect(api.listSavedSearches).toHaveBeenCalledTimes(1);
  });
});
