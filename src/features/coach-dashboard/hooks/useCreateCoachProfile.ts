import { useMutation, useQueryClient } from '@tanstack/react-query'
import { coachKeys, createCoachProfile } from '../api'

export function useCreateCoachProfile(userId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createCoachProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: coachKeys.profile(userId) })
    },
  })
}
