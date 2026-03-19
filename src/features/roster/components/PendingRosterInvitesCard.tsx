import { Loader2, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAcceptRosterInvite, usePendingRosterInvites } from '../hooks'

interface PendingRosterInvitesCardProps {
  athleteId: string
}

export function PendingRosterInvitesCard({ athleteId }: PendingRosterInvitesCardProps) {
  const invitesQuery = usePendingRosterInvites(athleteId)
  const acceptInvite = useAcceptRosterInvite(athleteId)

  if (invitesQuery.isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center gap-2 py-6 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Cargando invitaciones...
        </CardContent>
      </Card>
    )
  }

  if (!invitesQuery.data?.schemaReady || invitesQuery.data.invites.length === 0) {
    return null
  }

  return (
    <Card className="border-primary/30 bg-primary/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <ShieldCheck className="h-5 w-5 text-primary" />
          Invitaciones de coach pendientes
        </CardTitle>
        <CardDescription>
          Acepta un vínculo para compartir tu progreso con un coach activo.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {acceptInvite.error && (
          <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {acceptInvite.error.message}
          </div>
        )}

        {invitesQuery.data.invites.map((invite) => (
          <div
            key={invite.id}
            className="flex flex-col gap-3 rounded-xl border bg-background p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="font-medium">{invite.organizationName || invite.coachName}</p>
              <p className="text-sm text-muted-foreground">
                Coach: {invite.coachName}
              </p>
            </div>
            <Button
              disabled={acceptInvite.isPending}
              onClick={() => acceptInvite.mutate(invite.id)}
            >
              {acceptInvite.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Aceptar invitación
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
