import { useState } from 'react'
import { Loader2, ShieldCheck, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/features/auth'
import { useCreateCoachProfile } from '../hooks'

const SPECIALTY_OPTIONS = [
  { label: 'Padel', value: 'padel' },
  { label: 'Strength', value: 'strength' },
  { label: 'Rehab', value: 'rehab' },
  { label: 'Technique', value: 'technique' },
  { label: 'Performance', value: 'performance' },
] as const

interface CoachOnboardingProps {
  schemaReady: boolean
}

function splitCommaSeparated(value: string) {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}

export function CoachOnboarding({ schemaReady }: CoachOnboardingProps) {
  const { user, signOut } = useAuth()
  const createCoachProfile = useCreateCoachProfile(user?.id ?? '')
  const [organizationName, setOrganizationName] = useState('')
  const [bio, setBio] = useState('')
  const [certificationsInput, setCertificationsInput] = useState('')
  const [specialties, setSpecialties] = useState<string[]>(['padel'])

  const toggleSpecialty = (value: string) => {
    setSpecialties((current) =>
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value]
    )
  }

  const handleSubmit = () => {
    if (!user || specialties.length === 0) return

    createCoachProfile.mutate({
      id: user.id,
      bio: bio.trim() || null,
      certifications: splitCommaSeparated(certificationsInput),
      organization_name: organizationName.trim() || null,
      specialties,
    })
  }

  if (!schemaReady) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <ShieldCheck className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Scaffolding de coach preparado</CardTitle>
            <CardDescription>
              La ruta de coach ya está activa en la app, pero la tabla `coach_profiles` todavía no
              existe en este entorno de Supabase. Aplica la migración del ADR 002 para completar el
              onboarding funcional.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="rounded-lg border bg-muted/40 p-4 text-sm text-muted-foreground">
              Este primer slice deja listo el flujo de rol, el onboarding profesional y el panel
              inicial. El siguiente paso real es desplegar `coach_profiles` y `roster_links`.
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border p-4">
                <p className="font-medium">Coach onboarding</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Especialidades, organización y credenciales profesionales.
                </p>
              </div>
              <div className="rounded-lg border p-4">
                <p className="font-medium">Roster dashboard</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Preparado para conectarse a invitaciones y relación coach-atleta.
                </p>
              </div>
            </div>

            <Button variant="outline" onClick={() => signOut()}>
              Cerrar sesión
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Users className="h-6 w-6 text-primary" />
          </div>
          <CardTitle>Configura tu perfil profesional</CardTitle>
          <CardDescription>
            Este primer paso deja lista la identidad del coach antes de conectar invitaciones y
            roster management.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="organization_name">Club u organización</Label>
              <Input
                id="organization_name"
                placeholder="Ej. Padel Lab Barcelona"
                value={organizationName}
                onChange={(event) => setOrganizationName(event.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="certifications">Certificaciones</Label>
              <Input
                id="certifications"
                placeholder="NSCA, PTR, FIP Coach"
                value={certificationsInput}
                onChange={(event) => setCertificationsInput(event.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Separa varias certificaciones con comas.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Enfoque profesional</Label>
            <textarea
              id="bio"
              className="flex min-h-28 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              placeholder="Describe brevemente cómo trabajas con atletas y qué tipo de preparación lideras."
              value={bio}
              onChange={(event) => setBio(event.target.value)}
            />
          </div>

          <div className="space-y-3">
            <Label>Especialidades</Label>
            <div className="grid gap-3 sm:grid-cols-2">
              {SPECIALTY_OPTIONS.map((option) => (
                <label
                  key={option.value}
                  className="flex items-center gap-3 rounded-lg border px-4 py-3 text-sm"
                >
                  <Checkbox
                    checked={specialties.includes(option.value)}
                    onCheckedChange={() => toggleSpecialty(option.value)}
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              Selecciona al menos una especialidad para activar tu dashboard.
            </p>
          </div>

          {createCoachProfile.error && (
            <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {createCoachProfile.error.message}
            </div>
          )}

          <div className="flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              El roster, las invitaciones y la vista de atletas quedan como siguiente capa encima de
              este perfil.
            </p>
            <Button
              disabled={createCoachProfile.isPending || specialties.length === 0}
              onClick={handleSubmit}
            >
              {createCoachProfile.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {createCoachProfile.isPending ? 'Guardando...' : 'Entrar al panel coach'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
