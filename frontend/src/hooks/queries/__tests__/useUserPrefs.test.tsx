import { renderHook } from '@testing-library/react';
import { waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useUserPrefs } from '@/hooks/queries/useUserPrefs';
import * as api from '@/api/apiClient';
import { vi } from 'vitest';

describe('useUserPrefs', () => {
  const queryClient = new QueryClient();

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  it('fetches and returns user preferences', async () => {
    const mockPrefs = { theme: 'dark', notifications: true };
    vi.spyOn(api, 'getUserPrefs').mockResolvedValue(mockPrefs);

    const { result } = renderHook(() => useUserPrefs(), { wrapper });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockPrefs);
    expect(api.getUserPrefs).toHaveBeenCalledTimes(1);
  });
});
