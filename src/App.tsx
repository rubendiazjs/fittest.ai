import { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Loader2, CheckCircle2 } from 'lucide-react'
import { AuthProvider, useAuth, LoginPage } from '@/features/auth'
import { OnboardingWizard, ProfileDashboard } from '@/features/player-onboarding'
import { usePlayerProfile } from '@/features/player-onboarding/hooks'
import {
  CheckinModal,
  CheckinHistoryModal,
  StreakIndicator,
  useDailyCheckin,
  useCheckinHistory,
} from '@/features/daily-checkin'

// Create a client outside the component to avoid re-creating on every render
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Sensible defaults for a production app
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
    mutations: {
      // Retry mutations once on failure
      retry: 1,
    },
  },
})

function AppContent() {
  const { data: profile, isLoading, error } = usePlayerProfile()
  const [forceOnboarding, setForceOnboarding] = useState(false)
  const [checkinDismissed, setCheckinDismissed] = useState(false)
  const [showHistory, setShowHistory] = useState(false)

  // Daily check-in state (only active when user has a profile)
  const checkin = useDailyCheckin({
    injuryStatus: profile?.injury_status,
  })

  // Check-in history for the modal
  const { data: history = [], isLoading: historyLoading } = useCheckinHistory(30)

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  // Error state (rare, but handle gracefully)
  if (error) {
    console.error('Failed to load profile:', error)
    // Fall through to onboarding on error
  }

  // If user wants to redo onboarding
  if (forceOnboarding) {
    return <OnboardingWizard />
  }

  // If profile exists, show dashboard (with optional check-in modal)
  if (profile) {
    // Show check-in modal if:
    // - Not loading check-in data
    // - User hasn't checked in today
    // - User hasn't dismissed the modal this session
    // - There's a question to show
    const showCheckinModal =
      !checkin.isLoading &&
      !checkin.hasCheckedInToday &&
      !checkinDismissed &&
      checkin.todayQuestion

    return (
      <>
        {/* Check-in modal on app open */}
        {showCheckinModal && checkin.todayQuestion && (
          <CheckinModal
            question={checkin.todayQuestion}
            streak={checkin.streak}
            onSubmit={(value) => {
              checkin.submitCheckin(value)
            }}
            onSkip={() => {
              checkin.skipCheckin()
            }}
            onClose={() => setCheckinDismissed(true)}
            isSubmitting={checkin.isSubmitting}
          />
        )}

        {/* History modal when clicking streak */}
        {showHistory && (
          <CheckinHistoryModal
            streak={checkin.streak}
            history={history}
            isLoading={historyLoading}
            todayQuestion={checkin.todayQuestion}
            onClose={() => setShowHistory(false)}
            onEditToday={(value) => {
              checkin.submitCheckin(value)
            }}
            isSubmitting={checkin.isSubmitting}
          />
        )}

        {/* Floating streak indicator */}
        {!showCheckinModal && !showHistory && (
          <div className="fixed top-4 right-4 z-40">
            <StreakIndicator
              streak={checkin.streak}
              size="md"
              onClick={() => setShowHistory(true)}
            />
          </div>
        )}

        <ProfileDashboard
          profile={profile}
          onEditProfile={() => setForceOnboarding(true)}
        />
      </>
    )
  }

  // No profile - show onboarding
  return <OnboardingWizard />
}

// Detect if the user just arrived from an email confirmation link
const isEmailConfirmRedirect = window.location.search.includes('code=')

function AuthGate() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    // Show a confirmation message while the code exchange is in progress
    if (isEmailConfirmRedirect) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-3">
          <CheckCircle2 className="h-10 w-10 text-primary" />
          <p className="text-lg font-medium">Email confirmado</p>
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      )
    }

    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user) {
    return <LoginPage />
  }

  return <AppContent />
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AuthGate />
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App
