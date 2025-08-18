import { useQuery } from '@tanstack/react-query';
import { listSavedSearches } from '@/api/apiClient';

export const useSearchHistory = () => {
  return useQuery({
    queryKey: ['searchHistory'],
    queryFn: listSavedSearches,
    staleTime: 5 * 60 * 1000, // cache for 5 min
    refetchOnWindowFocus: true,
    refetchInterval: 2 * 60 * 1000, // refetches every 5 minutes 
  });
};
