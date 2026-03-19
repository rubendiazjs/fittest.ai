import { useDeferredValue, useMemo, useState } from 'react'
import { Loader2, Search, UserPlus, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useAthleteDirectory, useCoachRoster, useCreateRosterInvite } from '../hooks'

interface CoachRosterPanelProps {
  coachId: string
}

function formatAthleteName(fullName: string | null, athleteId: string) {
  return fullName || `Atleta ${athleteId.slice(0, 8)}`
}

function statusLabel(status: 'pending' | 'active' | 'terminated') {
  if (status === 'active') return 'Activo'
  if (status === 'terminated') return 'Finalizado'
  return 'Pendiente'
}

function statusClassName(status: 'pending' | 'active' | 'terminated') {
  if (status === 'active') return 'border-emerald-200 bg-emerald-50 text-emerald-700'
  if (status === 'terminated') return 'border-border bg-muted text-muted-foreground'
  return 'border-amber-200 bg-amber-50 text-amber-700'
}

export function CoachRosterPanel({ coachId }: CoachRosterPanelProps) {
  const [search, setSearch] = useState('')
  const deferredSearch = useDeferredValue(search)
  const rosterQuery = useCoachRoster(coachId)
  const athleteDirectoryQuery = useAthleteDirectory(deferredSearch)
  const createInvite = useCreateRosterInvite(coachId)

  const linkedAthleteIds = useMemo(
    () => new Set((rosterQuery.data?.items ?? []).map((item) => item.athleteId)),
    [rosterQuery.data?.items]
  )

  const availableAthletes = useMemo(
    () =>
      (athleteDirectoryQuery.data ?? []).filter((athlete) => !linkedAthleteIds.has(athlete.id)),
    [athleteDirectoryQuery.data, linkedAthleteIds]
  )

  const handleInvite = (athleteId: string) => {
    createInvite.mutate({
      athleteId,
      coachId,
    })
  }

  if (rosterQuery.isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </CardContent>
      </Card>
    )
  }

  if (!rosterQuery.data?.schemaReady) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Roster no disponible todavía</CardTitle>
          <CardDescription>
            La UI ya está preparada, pero falta aplicar la migración de `coach_profiles` y
            `roster_links` en este entorno.
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <UserPlus className="h-5 w-5 text-primary" />
            Invitar atleta
          </CardTitle>
          <CardDescription>
            Primer slice funcional: crea enlaces pendientes usando perfiles de atleta existentes.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Buscar atleta por nombre"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          {createInvite.error && (
            <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {createInvite.error.message}
            </div>
          )}

          <div className="space-y-3">
            {athleteDirectoryQuery.isLoading && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Buscando atletas...
              </div>
            )}

            {!athleteDirectoryQuery.isLoading && availableAthletes.length === 0 && (
              <div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
                No hay atletas disponibles para invitar con este filtro.
              </div>
            )}

            {availableAthletes.map((athlete) => (
              <div
                key={athlete.id}
                className="flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-medium">{formatAthleteName(athlete.fullName, athlete.id)}</p>
                  <p className="text-xs text-muted-foreground">{athlete.id}</p>
                </div>
                <Button
                  disabled={createInvite.isPending}
                  onClick={() => handleInvite(athlete.id)}
                >
                  {createInvite.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Invitar
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Users className="h-5 w-5 text-primary" />
            Estado del roster
          </CardTitle>
          <CardDescription>
            Pendientes y activos del coach actual.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border bg-muted/40 p-4">
              <p className="text-sm text-muted-foreground">Activos</p>
              <p className="mt-1 text-2xl font-semibold">{rosterQuery.data.activeCount}</p>
            </div>
            <div className="rounded-xl border bg-muted/40 p-4">
              <p className="text-sm text-muted-foreground">Pendientes</p>
              <p className="mt-1 text-2xl font-semibold">{rosterQuery.data.pendingCount}</p>
            </div>
          </div>

          <div className="space-y-3">
            {rosterQuery.data.items.length === 0 && (
              <div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
                Todavía no hay vínculos creados.
              </div>
            )}

            {rosterQuery.data.items.map((item) => (
              <div key={item.id} className="rounded-xl border p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-medium">{item.athleteName}</p>
                    <p className="text-xs text-muted-foreground">
                      Invitado el {new Date(item.createdAt).toLocaleDateString('es-ES')}
                    </p>
                  </div>
                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-medium ${statusClassName(item.status)}`}
                  >
                    {statusLabel(item.status)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
