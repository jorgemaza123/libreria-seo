"use client"

import { useState, useEffect } from 'react'
import { Save, Key, User, Eye, EyeOff, Loader2, CheckCircle, AlertCircle, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
// Importamos tus funciones de auth.ts existente
import { changePassword, updateAdminProfile, getCurrentAdmin } from '@/lib/supabase/auth'

export default function ConfiguracionPage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'password'>('profile')

  // Estado para cambio de contraseña
  const [passwordForm, setPasswordForm] = useState({
    newPassword: '',
    confirmPassword: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [passwordError, setPasswordError] = useState('')
  const [passwordSuccess, setPasswordSuccess] = useState(false)

  // Estado para perfil
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
  })
  const [profileLoading, setProfileLoading] = useState(false)

  // Cargar datos del admin actual al entrar
  useEffect(() => {
    async function loadAdmin() {
      try {
        const admin = await getCurrentAdmin()
        if (admin) {
          setProfileForm({
            name: admin.name || '',
            email: admin.email || '',
          })
        }
      } catch (error) {
        console.error("Error cargando admin:", error)
      }
    }
    loadAdmin()
  }, [])

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordError('')
    setPasswordSuccess(false)

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('Las contraseñas no coinciden')
      return
    }

    if (passwordForm.newPassword.length < 6) {
      setPasswordError('La contraseña debe tener al menos 6 caracteres')
      return
    }

    setPasswordLoading(true)

    try {
      await changePassword(passwordForm.newPassword)
      setPasswordSuccess(true)
      setPasswordForm({ newPassword: '', confirmPassword: '' })
      toast.success('Contraseña actualizada correctamente')
    } catch (error) {
      // Manejo seguro del error
      const message = error instanceof Error ? error.message : 'Error al cambiar la contraseña'
      setPasswordError(message)
      toast.error(message)
    } finally {
      setPasswordLoading(false)
    }
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setProfileLoading(true)

    try {
      await updateAdminProfile(profileForm.name)
      toast.success('Perfil actualizado correctamente')
    } catch (error) {
      console.error(error)
      toast.error('Error al actualizar el perfil')
    } finally {
      setProfileLoading(false)
    }
  }

  return (
    <div className="space-y-6 max-w-4xl animate-fade-in pb-10">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-heading font-bold">Mi Cuenta</h2>
        <p className="text-muted-foreground">
          Gestiona tus credenciales de acceso y perfil de administrador.
        </p>
      </div>

      {/* Info Box */}
      <div className="bg-blue-500/10 rounded-xl p-4 border border-blue-500/20 flex gap-3 items-start">
        <ShieldCheck className="w-5 h-5 text-blue-600 mt-0.5" />
        <div>
            <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                ¿Buscas cambiar el teléfono o la dirección?
            </p>
            <p className="text-sm text-blue-600/80 dark:text-blue-400/80">
                Esa información ahora se gestiona en la sección <strong>Contenido</strong> para que se actualice automáticamente en toda la página web.
            </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border">
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2 font-medium transition-colors border-b-2 -mb-px ${
            activeTab === 'profile'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Perfil
        </button>
        <button
          onClick={() => setActiveTab('password')}
          className={`px-4 py-2 font-medium transition-colors border-b-2 -mb-px ${
            activeTab === 'password'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Seguridad
        </button>
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
          <h3 className="font-heading font-bold flex items-center gap-2 mb-6 text-lg">
            <User className="w-5 h-5 text-primary" />
            Información del Administrador
          </h3>

          <form onSubmit={handleUpdateProfile} className="space-y-4 max-w-md">
            <div>
              <label className="block text-sm font-medium mb-2">Nombre para mostrar</label>
              <input
                type="text"
                value={profileForm.name}
                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="Admin"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Correo Electrónico</label>
              <input
                type="email"
                value={profileForm.email}
                disabled
                className="w-full px-4 py-2 rounded-lg border border-input bg-muted text-muted-foreground cursor-not-allowed opacity-70"
              />
              <p className="text-xs text-muted-foreground mt-1">
                El correo electrónico es tu identificador único y no se puede cambiar aquí.
              </p>
            </div>

            <div className="pt-2">
                <Button type="submit" disabled={profileLoading}>
                {profileLoading ? (
                    <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Guardando...
                    </>
                ) : (
                    <>
                    <Save className="w-4 h-4 mr-2" />
                    Actualizar Perfil
                    </>
                )}
                </Button>
            </div>
          </form>
        </div>
      )}

      {/* Password Tab */}
      {activeTab === 'password' && (
        <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
          <h3 className="font-heading font-bold flex items-center gap-2 mb-6 text-lg">
            <Key className="w-5 h-5 text-primary" />
            Cambiar Contraseña
          </h3>

          {passwordSuccess ? (
            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3 p-4 bg-emerald-500/10 rounded-lg text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    <CheckCircle className="w-6 h-6" />
                    <div>
                        <p className="font-bold">¡Contraseña actualizada!</p>
                        <p className="text-sm">Tu contraseña ha sido cambiada exitosamente. Úsala la próxima vez que inicies sesión.</p>
                    </div>
                </div>
                <Button variant="outline" onClick={() => setPasswordSuccess(false)} className="w-fit">
                    Cambiar otra vez
                </Button>
            </div>
          ) : (
            <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
              <div>
                <label className="block text-sm font-medium mb-2">Nueva Contraseña</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    className="w-full px-4 py-2 pr-12 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="••••••••"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Mínimo 6 caracteres.</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Confirmar Contraseña</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>

              {passwordError && (
                <div className="flex items-center gap-2 p-3 bg-destructive/10 text-destructive rounded-lg text-sm border border-destructive/20">
                  <AlertCircle className="w-5 h-5" />
                  <span>{passwordError}</span>
                </div>
              )}

              <div className="pt-2">
                <Button type="submit" disabled={passwordLoading} variant="destructive">
                    {passwordLoading ? (
                    <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Actualizando...
                    </>
                    ) : (
                    <>
                        <Key className="w-4 h-4 mr-2" />
                        Actualizar Contraseña
                    </>
                    )}
                </Button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  )
}