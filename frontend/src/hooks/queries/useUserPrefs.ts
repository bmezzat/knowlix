import { useQuery } from '@tanstack/react-query';
import { getUserPrefs } from '@/api/apiClient';

export const useUserPrefs = () => {
  return useQuery({
    queryKey: ['userPrefs'],
    queryFn: getUserPrefs,
    staleTime: 5 * 60 * 1000, // cache for 5 min
    refetchOnWindowFocus: true,
    refetchInterval: 2 * 60 * 1000, // refetches every 5 minutes 
  });
};
