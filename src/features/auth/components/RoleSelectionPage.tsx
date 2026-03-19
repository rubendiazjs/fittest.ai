import { useState } from 'react'
import { Loader2, ShieldCheck, UserRound } from 'lucide-react'
import { useAuth } from '../useAuth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

type RoleOption = {
  description: string
  icon: typeof UserRound
  title: string
  value: 'athlete' | 'coach'
}

const ROLE_OPTIONS: RoleOption[] = [
  {
    value: 'athlete',
    title: 'Soy atleta',
    description: 'Continua con tu onboarding actual, check-ins diarios y calentamientos personalizados.',
    icon: UserRound,
  },
  {
    value: 'coach',
    title: 'Soy coach',
    description: 'Activa el nuevo recorrido profesional para preparar tu perfil y el futuro panel de roster.',
    icon: ShieldCheck,
  },
]

export function RoleSelectionPage() {
  const { selectRole, signOut } = useAuth()
  const [selectedRole, setSelectedRole] = useState<RoleOption['value'] | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleSelectRole = async (role: RoleOption['value']) => {
    setSelectedRole(role)
    setErrorMessage(null)

    try {
      await selectRole(role)
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'No se pudo guardar tu rol'
      setErrorMessage(message)
      setSelectedRole(null)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-5xl space-y-6">
        <div className="text-center">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Primer acceso
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight">
            Elige tu recorrido en Fittest.ai
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Esta selección define el dashboard y el onboarding inicial. Podrás continuar con el
            flujo de atleta actual o preparar el nuevo espacio profesional para coaches.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {ROLE_OPTIONS.map((option) => {
            const Icon = option.icon
            const isPending = selectedRole === option.value

            return (
              <Card key={option.value} className="border-border/70">
                <CardHeader>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>{option.title}</CardTitle>
                  <CardDescription>{option.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    className="w-full"
                    disabled={selectedRole !== null}
                    onClick={() => handleSelectRole(option.value)}
                  >
                    {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isPending ? 'Guardando selección...' : 'Continuar'}
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {errorMessage && (
          <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {errorMessage}
          </div>
        )}

        <div className="flex justify-center">
          <Button variant="ghost" onClick={() => signOut()}>
            Cerrar sesión
          </Button>
        </div>
      </div>
    </div>
  )
}
