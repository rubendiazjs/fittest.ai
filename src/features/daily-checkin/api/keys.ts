// TanStack Query keys for daily check-in feature

export const checkinKeys = {
  all: ['checkin'] as const,

  // Questions catalog
  questions: () => [...checkinKeys.all, 'questions'] as const,

  // Today's question for a user
  todayQuestion: (userId: string) => [...checkinKeys.all, 'today', userId] as const,

  // User responses
  responses: (userId: string) => [...checkinKeys.all, 'responses', userId] as const,
  responsesRecent: (userId: string, days: number) =>
    [...checkinKeys.responses(userId), 'recent', days] as const,
  todayResponse: (userId: string) =>
    [...checkinKeys.responses(userId), 'today'] as const,

  // User streak
  streak: (userId: string) => [...checkinKeys.all, 'streak', userId] as const,
}
