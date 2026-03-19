import { useMutation, useQueryClient } from '@tanstack/react-query'
import { acceptRosterInvite, rosterKeys } from '../api'

export function useAcceptRosterInvite(athleteId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: acceptRosterInvite,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: rosterKeys.pendingInvites(athleteId) })
    },
  })
}
