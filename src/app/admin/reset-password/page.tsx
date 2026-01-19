"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Lock, Eye, EyeOff, AlertCircle, Loader2, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { BUSINESS_INFO } from '@/lib/constants'
import { updatePasswordWithToken } from '@/lib/supabase/auth'

export default function ResetPasswordPage() {
  const router = useRouter()

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validar que las contraseñas coincidan
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }

    // Validar longitud mínima
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return
    }

    setIsLoading(true)

    try {
      await updatePasswordWithToken(password)
      setSuccess(true)

      // Redirigir al login después de 2 segundos
      setTimeout(() => {
        router.push('/admin/login')
      }, 2000)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al actualizar la contraseña'

      if (message.includes('Auth session missing')) {
        setError('El enlace ha expirado. Por favor solicita uno nuevo.')
      } else {
        setError(message)
      }
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-emerald-500 rounded-xl flex items-center justify-center text-white text-2xl">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-heading font-bold">¡Contraseña Actualizada!</h1>
            <p className="text-muted-foreground mt-2">
              Tu contraseña ha sido cambiada exitosamente.
            </p>
          </div>

          <div className="bg-card rounded-2xl p-6 sm:p-8 shadow-lg border border-border text-center">
            <p className="text-muted-foreground mb-4">
              Serás redirigido al inicio de sesión...
            </p>
            <Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-primary rounded-xl flex items-center justify-center text-primary-foreground text-2xl font-bold">
            LC
          </div>
          <h1 className="text-2xl font-heading font-bold">{BUSINESS_INFO.name}</h1>
          <p className="text-muted-foreground">Restablecer Contraseña</p>
        </div>

        {/* Form Card */}
        <div className="bg-card rounded-2xl p-6 sm:p-8 shadow-lg border border-border">
          <h2 className="text-xl font-heading font-bold mb-2">Nueva Contraseña</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Ingresa tu nueva contraseña. Debe tener al menos 6 caracteres.
          </p>

          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                Nueva contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  minLength={6}
                  className="w-full pl-10 pr-12 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium mb-2">
                Confirmar contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="confirm-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  minLength={6}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Actualizando...
                </>
              ) : (
                'Actualizar Contraseña'
              )}
            </Button>
          </form>
        </div>

        {/* Back link */}
        <p className="text-center mt-6 text-sm text-muted-foreground">
          <Link href="/admin/login" className="hover:text-primary transition-colors">
            ← Volver al inicio de sesión
          </Link>
        </p>
      </div>
    </div>
  )
}
