import { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Loader2, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AuthProvider, useAuth, LoginPage, RoleSelectionPage } from '@/features/auth'
import { CoachDashboard, CoachOnboarding, useCoachProfile } from '@/features/coach-dashboard'
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

function FullScreenLoader({ message }: { message?: string }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-3">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      {message && <p className="text-sm text-muted-foreground">{message}</p>}
    </div>
  )
}

function AthleteApp() {
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
    return <FullScreenLoader />
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

function CoachApp() {
  const { data, isLoading, error } = useCoachProfile()

  if (isLoading) {
    return <FullScreenLoader message="Preparando el espacio del coach..." />
  }

  if (error) {
    throw error
  }

  if (!data?.profile) {
    return <CoachOnboarding schemaReady={data?.schemaReady ?? true} />
  }

  return <CoachDashboard profile={data.profile} />
}

function AdminPlaceholder() {
  const { signOut } = useAuth()

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-xl space-y-4 text-center">
        <h1 className="text-3xl font-semibold tracking-tight">Rol admin detectado</h1>
        <p className="text-sm text-muted-foreground">
          La app todavía no tiene una experiencia de administración. El flujo de athlete y el nuevo
          flujo de coach quedan separados, pero admin sigue pendiente.
        </p>
        <Button variant="outline" onClick={() => signOut()}>
          Cerrar sesión
        </Button>
      </div>
    </div>
  )
}

function AuthenticatedApp() {
  const { role } = useAuth()

  if (!role) {
    return <RoleSelectionPage />
  }

  if (role === 'athlete') {
    return <AthleteApp />
  }

  if (role === 'coach') {
    return <CoachApp />
  }

  return <AdminPlaceholder />
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
      <FullScreenLoader />
    )
  }

  if (!user) {
    return <LoginPage />
  }

  return <AuthenticatedApp />
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
