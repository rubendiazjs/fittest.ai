export const coachKeys = {
  all: ['coach-dashboard'] as const,
  profiles: () => [...coachKeys.all, 'profiles'] as const,
  profile: (userId: string) => [...coachKeys.profiles(), userId] as const,
}
