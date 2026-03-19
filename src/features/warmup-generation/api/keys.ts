/**
 * Query key factory for warm-up sessions.
 */
export const warmupKeys = {
  all: ['warmup-sessions'] as const,
  lists: () => [...warmupKeys.all, 'list'] as const,
  list: (userId: string) => [...warmupKeys.lists(), userId] as const,
  details: () => [...warmupKeys.all, 'detail'] as const,
  detail: (id: string) => [...warmupKeys.details(), id] as const,
}
