import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createRosterInvite, rosterKeys } from '../api'

export function useCreateRosterInvite(coachId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createRosterInvite,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: rosterKeys.coachRoster(coachId) })
    },
  })
}
