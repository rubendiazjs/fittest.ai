import { CalendarClock, LogOut, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/features/auth'
import { CoachRosterPanel } from '@/features/roster'
import type { Tables } from '@/lib/database.types'

type CoachProfile = Tables<'coach_profiles'>

interface CoachDashboardProps {
  profile: CoachProfile
}

export function CoachDashboard({ profile }: CoachDashboardProps) {
  const { signOut, user } = useAuth()

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex flex-col gap-4 rounded-3xl border bg-card p-6 shadow-sm md:flex-row md:items-end md:justify-between">
          <div className="space-y-3">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Coach workspace
            </p>
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">
                {profile.organization_name || user?.email || 'Coach'}
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                {profile.bio || 'Perfil profesional listo. El siguiente paso es conectar invitaciones y roster.'}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {(profile.specialties ?? []).map((specialty) => (
                <span
                  key={specialty}
                  className="rounded-full border px-3 py-1 text-xs font-medium uppercase tracking-wide text-muted-foreground"
                >
                  {specialty}
                </span>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => signOut()}>
              <LogOut className="mr-2 h-4 w-4" />
              Cerrar sesión
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <CalendarClock className="h-5 w-5 text-primary" />
                Próxima capa
              </CardTitle>
              <CardDescription>Lo que este slice desbloquea</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>Invitaciones de atleta.</p>
              <p>Aceptación desde el panel athlete.</p>
              <p>Base lista para añadir readiness y lectura de check-ins.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <ShieldCheck className="h-5 w-5 text-primary" />
                Perfil profesional
              </CardTitle>
              <CardDescription>Base para discovery y permisos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>Certificaciones cargadas: {(profile.certifications ?? []).length}</p>
              <p>Verificado: {profile.is_verified ? 'Sí' : 'Pendiente'}</p>
              <p>Este registro ya puede crear vínculos en `roster_links`.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <CalendarClock className="h-5 w-5 text-primary" />
                Operativa actual
              </CardTitle>
              <CardDescription>Qué queda fuera de este slice</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>No hay lecturas de readiness todavía.</p>
              <p>No hay invitaciones por email o link mágico.</p>
              <p>No hay herramientas de programación grupal aún.</p>
            </CardContent>
          </Card>
        </div>

        <CoachRosterPanel coachId={profile.id} />
      </div>
    </div>
  )
}
