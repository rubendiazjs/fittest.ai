import { useQuery } from '@tanstack/react-query'
import { fetchAthleteDirectory, rosterKeys } from '../api'

export function useAthleteDirectory(search: string) {
  return useQuery({
    queryKey: rosterKeys.athleteDirectory(search),
    queryFn: () => fetchAthleteDirectory(search),
    staleTime: 60 * 1000,
  })
}
