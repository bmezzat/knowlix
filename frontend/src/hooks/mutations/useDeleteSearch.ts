import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteSearch } from '@/api/apiClient';

export const useDeleteSearch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteSearch(id),
    onMutate: async (id: string) => {
      // Cancel any refetches
      await queryClient.cancelQueries({ queryKey: ['searchHistory'] });
      const previous = queryClient.getQueryData<string[]>(['searchHistory']);

      // Optimistically update the cache
      queryClient.setQueryData(['searchHistory'], (old: unknown) => {
        if (!Array.isArray(old)) return [];
        return old.filter((item) => item !== id);
      });

      return { previous };
    },

    // Rollback if the mutation fails
    onError: (_err, _id, context: any) => {
      if (context?.previous) {
        queryClient.setQueryData(['searchHistory'], context.previous);
      }
    },

    // Finally for succes and error do the below (invalidate the query to be refethced again)
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['searchHistory'] });
    },
  });
};
