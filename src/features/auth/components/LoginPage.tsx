import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2, Mail } from 'lucide-react'
import { useAuth } from '../useAuth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const signInSchema = z.object({
  email: z.string().min(1, 'El email es obligatorio').email('Email inválido'),
  password: z.string().min(1, 'La contraseña es obligatoria'),
})

const signUpSchema = z.object({
  email: z.string().min(1, 'El email es obligatorio').email('Email inválido'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
})

type FormValues = z.infer<typeof signInSchema>

type Mode = 'sign-in' | 'sign-up'

export function LoginPage() {
  const [mode, setMode] = useState<Mode>('sign-in')
  const [authError, setAuthError] = useState<string | null>(null)
  const [confirmEmail, setConfirmEmail] = useState(false)
  const { signIn, signUp } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(mode === 'sign-in' ? signInSchema : signUpSchema),
  })

  const toggleMode = () => {
    setMode((prev) => (prev === 'sign-in' ? 'sign-up' : 'sign-in'))
    setAuthError(null)
    setConfirmEmail(false)
    reset()
  }

  const onSubmit = async (data: FormValues) => {
    setAuthError(null)
    try {
      if (mode === 'sign-in') {
        await signIn(data.email, data.password)
      } else {
        const result = await signUp(data.email, data.password)
        if (result.confirmEmail) {
          setConfirmEmail(true)
        }
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Ha ocurrido un error inesperado'
      setAuthError(message)
    }
  }

  if (confirmEmail) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <Card className="w-full max-w-sm">
          <CardHeader className="text-center">
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-2xl">Revisa tu email</CardTitle>
            <CardDescription>
              Te enviamos un enlace de confirmación. Revisa tu bandeja de entrada para activar tu cuenta.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full" onClick={toggleMode}>
              Volver a iniciar sesión
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">
            {mode === 'sign-in' ? 'Iniciar sesión' : 'Crear cuenta'}
          </CardTitle>
          <CardDescription>
            {mode === 'sign-in'
              ? 'Ingresa tus credenciales para continuar'
              : 'Completa los datos para registrarte'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                autoComplete="email"
                {...register('email')}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder={mode === 'sign-up' ? 'Mínimo 8 caracteres' : ''}
                autoComplete={mode === 'sign-in' ? 'current-password' : 'new-password'}
                {...register('password')}
              />
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password.message}</p>
              )}
            </div>

            {authError && (
              <p className="text-sm text-destructive">{authError}</p>
            )}

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="animate-spin" />}
              {mode === 'sign-in' ? 'Iniciar sesión' : 'Registrarse'}
            </Button>
          </form>

          <p className="mt-4 text-center text-sm text-muted-foreground">
            {mode === 'sign-in' ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}{' '}
            <button
              type="button"
              onClick={toggleMode}
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              {mode === 'sign-in' ? 'Regístrate' : 'Inicia sesión'}
            </button>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
