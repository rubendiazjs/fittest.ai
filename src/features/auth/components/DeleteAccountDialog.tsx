import { useState } from 'react'
import { Loader2, AlertTriangle } from 'lucide-react'
import { useAuth } from '../AuthProvider'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const CONFIRM_KEYWORD = 'ELIMINAR'

interface DeleteAccountDialogProps {
  open: boolean
  onClose: () => void
}

export function DeleteAccountDialog({ open, onClose }: DeleteAccountDialogProps) {
  const { deleteAccount } = useAuth()
  const [confirmText, setConfirmText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!open) return null

  const canConfirm = confirmText === CONFIRM_KEYWORD

  const handleDelete = async () => {
    if (!canConfirm) return
    setError(null)
    setIsDeleting(true)
    try {
      await deleteAccount()
      // Auth state change will redirect to LoginPage
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'No se pudo eliminar la cuenta'
      setError(message)
      setIsDeleting(false)
    }
  }

  const handleClose = () => {
    if (isDeleting) return
    setConfirmText('')
    setError(null)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="h-6 w-6 text-destructive" />
          </div>
          <CardTitle className="text-center text-xl">Eliminar cuenta</CardTitle>
          <CardDescription className="text-center">
            Esta acción es irreversible. Se eliminarán permanentemente tu perfil, historial de check-ins, rachas y sesiones de calentamiento.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="confirm-delete">
              Escribe <span className="font-bold text-destructive">{CONFIRM_KEYWORD}</span> para confirmar
            </Label>
            <Input
              id="confirm-delete"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder={CONFIRM_KEYWORD}
              disabled={isDeleting}
              autoComplete="off"
            />
          </div>
          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
        </CardContent>
        <CardFooter className="flex gap-2">
          <Button variant="outline" className="flex-1" onClick={handleClose} disabled={isDeleting}>
            Cancelar
          </Button>
          <Button
            variant="destructive"
            className="flex-1"
            onClick={handleDelete}
            disabled={!canConfirm || isDeleting}
          >
            {isDeleting && <Loader2 className="animate-spin" />}
            Eliminar cuenta
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
