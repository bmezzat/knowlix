import { useMutation, useQueryClient } from '@tanstack/react-query';
import { saveUserPreferences } from '@/api/apiClient';

export const useSaveUserPrefs = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (theme: Record<string, any>) => saveUserPreferences(theme),
    onMutate: async (newPrefs: Record<string, any>) => {
      await queryClient.cancelQueries({ queryKey: ['userPrefs'] });
      // Cach old results
      const previous = queryClient.getQueryData<Record<string, any>>(['userPrefs']);
      // Optimistically update cache
      queryClient.setQueryData(['userPrefs'], (old: unknown) => {
        if (!old || typeof old !== 'object') return newPrefs;
        return { ...old, ...newPrefs };
      });

      return { previous };
    },

    // Rollback if the mutation fails
    onError: (_err, _newPrefs, context: any) => {
      if (context?.previous) {
        queryClient.setQueryData(['userPrefs'], context.previous);
      }
    },

    // Always refetch after mutation to sync with backend
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['userPrefs'] });
    },
  });
};