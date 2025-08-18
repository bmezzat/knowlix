import { useMutation, useQueryClient } from '@tanstack/react-query';
import { saveSearch } from '@/api/apiClient';

export const useSaveSearch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (query: string) => saveSearch(query),
    onMutate: async (newSearch) => {
      await queryClient.cancelQueries({ queryKey: ['searchHistory'] });
      const previous = queryClient.getQueryData<string[]>(['searchHistory']);
      // Optimistically update cache
      queryClient.setQueryData(['searchHistory'], (old: string[] | undefined) => {
        if (!Array.isArray(old)) old = [];
        return [...old, newSearch];
      });
      return { previous };
    },
    onError: (err, newSearch, context) => {
      // Rollback if failed
      if (context?.previous) {
        queryClient.setQueryData(['searchHistory'], context.previous);
      }
    },
    onSettled: () => {
      // Always refetch
      queryClient.invalidateQueries({ queryKey: ['searchHistory'] });
    },
  });
};
