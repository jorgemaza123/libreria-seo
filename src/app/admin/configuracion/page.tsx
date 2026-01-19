"use client"

import { useState, useEffect } from 'react'
import { Save, Phone, Mail, MapPin, Instagram, Key, User, Eye, EyeOff, Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CONTACT, BUSINESS_INFO, SOCIAL_MEDIA } from '@/lib/constants'
import { toast } from 'sonner'
import { changePassword, updateAdminProfile, getCurrentAdmin } from '@/lib/supabase/auth'

export default function ConfiguracionPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'general' | 'password' | 'profile'>('general')

  // Estado para información de contacto
  const [contactInfo, setContactInfo] = useState<{
    whatsapp: string
    phone: string
    email: string
  }>({
    whatsapp: CONTACT.whatsapp,
    phone: CONTACT.phone,
    email: CONTACT.email,
  })

  // Estado para información del negocio
  const [businessInfo, setBusinessInfo] = useState<{
    name: string
    street: string
    city: string
    state: string
  }>({
    name: BUSINESS_INFO.name,
    street: BUSINESS_INFO.address.street,
    city: BUSINESS_INFO.address.city,
    state: BUSINESS_INFO.address.state,
  })

  // Estado para redes sociales
  const [socialMedia, setSocialMedia] = useState<{
    facebook: string
    instagram: string
  }>({
    facebook: SOCIAL_MEDIA.facebook,
    instagram: SOCIAL_MEDIA.instagram,
  })

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

  // Cargar datos del admin actual
  useEffect(() => {
    getCurrentAdmin().then(admin => {
      if (admin) {
        setProfileForm({
          name: admin.name,
          email: admin.email,
        })
      }
    })

    // Check if we need to scroll to password section
    if (window.location.hash === '#password') {
      setActiveTab('password')
    }
  }, [])

  const handleSave = async () => {
    setIsLoading(true)
    try {
      // TODO: Save to Supabase when configured
      toast.success('Configuración guardada')
      toast.info('Nota: Para cambios permanentes, edita src/lib/constants.ts')
    } catch (error) {
      toast.error('Error al guardar')
    } finally {
      setIsLoading(false)
    }
  }

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
      const message = error instanceof Error ? error.message : 'Error al cambiar la contraseña'
      setPasswordError(message)
    } finally {
      setPasswordLoading(false)
    }
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setProfileLoading(true)

    try {
      await updateAdminProfile(profileForm.name)
      toast.success('Perfil actualizado')
    } catch (error) {
      toast.error('Error al actualizar el perfil')
    } finally {
      setProfileLoading(false)
    }
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-heading font-bold">Configuración</h2>
        <p className="text-muted-foreground">
          Información general, perfil y seguridad
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border">
        <button
          onClick={() => setActiveTab('general')}
          className={`px-4 py-2 font-medium transition-colors border-b-2 -mb-px ${
            activeTab === 'general'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          General
        </button>
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
          Contraseña
        </button>
      </div>

      {/* General Tab */}
      {activeTab === 'general' && (
        <div className="space-y-6">
          {/* Contact Info */}
          <div className="bg-card rounded-xl p-6 border border-border space-y-4">
            <h3 className="font-heading font-bold flex items-center gap-2">
              <Phone className="w-5 h-5 text-primary" />
              Información de Contacto
            </h3>

            <div className="grid gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">WhatsApp</label>
                <input
                  type="text"
                  value={contactInfo.whatsapp}
                  onChange={(e) => setContactInfo({ ...contactInfo, whatsapp: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="51987654321"
                />
                <p className="text-xs text-muted-foreground mt-1">Sin espacios ni símbolos, solo números con código de país</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Teléfono (formato display)</label>
                <input
                  type="text"
                  value={contactInfo.phone}
                  onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="+51 987 654 321"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={contactInfo.email}
                  onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="contacto@ejemplo.com"
                />
              </div>
            </div>
          </div>

          {/* Business Info */}
          <div className="bg-card rounded-xl p-6 border border-border space-y-4">
            <h3 className="font-heading font-bold flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              Información del Negocio
            </h3>

            <div className="grid gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Nombre del Negocio</label>
                <input
                  type="text"
                  value={businessInfo.name}
                  onChange={(e) => setBusinessInfo({ ...businessInfo, name: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Dirección</label>
                <input
                  type="text"
                  value={businessInfo.street}
                  onChange={(e) => setBusinessInfo({ ...businessInfo, street: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Ciudad</label>
                  <input
                    type="text"
                    value={businessInfo.city}
                    onChange={(e) => setBusinessInfo({ ...businessInfo, city: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Estado/Región</label>
                  <input
                    type="text"
                    value={businessInfo.state}
                    onChange={(e) => setBusinessInfo({ ...businessInfo, state: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className="bg-card rounded-xl p-6 border border-border space-y-4">
            <h3 className="font-heading font-bold flex items-center gap-2">
              <Instagram className="w-5 h-5 text-primary" />
              Redes Sociales
            </h3>

            <div className="grid gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Facebook</label>
                <input
                  type="url"
                  value={socialMedia.facebook}
                  onChange={(e) => setSocialMedia({ ...socialMedia, facebook: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="https://facebook.com/..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Instagram</label>
                <input
                  type="url"
                  value={socialMedia.instagram}
                  onChange={(e) => setSocialMedia({ ...socialMedia, instagram: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="https://instagram.com/..."
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={isLoading}>
              <Save className="w-4 h-4 mr-2" />
              {isLoading ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </div>

          {/* Info */}
          <div className="bg-amber-500/10 rounded-xl p-4 border border-amber-500/20">
            <p className="text-sm text-amber-600 dark:text-amber-400">
              <strong>Nota:</strong> Los cambios aquí se guardarán en Supabase.
              Mientras configuras la base de datos, puedes editar directamente el archivo <code className="bg-muted px-1 rounded">src/lib/constants.ts</code>
            </p>
          </div>
        </div>
      )}

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="bg-card rounded-xl p-6 border border-border">
          <h3 className="font-heading font-bold flex items-center gap-2 mb-6">
            <User className="w-5 h-5 text-primary" />
            Información del Perfil
          </h3>

          <form onSubmit={handleUpdateProfile} className="space-y-4 max-w-md">
            <div>
              <label className="block text-sm font-medium mb-2">Nombre</label>
              <input
                type="text"
                value={profileForm.name}
                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value={profileForm.email}
                disabled
                className="w-full px-4 py-2 rounded-lg border border-input bg-muted text-muted-foreground cursor-not-allowed"
              />
              <p className="text-xs text-muted-foreground mt-1">
                El email no se puede cambiar directamente. Contacta al administrador.
              </p>
            </div>

            <Button type="submit" disabled={profileLoading}>
              {profileLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Guardar Perfil
                </>
              )}
            </Button>
          </form>
        </div>
      )}

      {/* Password Tab */}
      {activeTab === 'password' && (
        <div className="bg-card rounded-xl p-6 border border-border">
          <h3 className="font-heading font-bold flex items-center gap-2 mb-6">
            <Key className="w-5 h-5 text-primary" />
            Cambiar Contraseña
          </h3>

          {passwordSuccess ? (
            <div className="flex items-center gap-3 p-4 bg-emerald-500/10 rounded-lg text-emerald-600 dark:text-emerald-400">
              <CheckCircle className="w-5 h-5" />
              <span>Tu contraseña ha sido actualizada correctamente.</span>
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
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Mínimo 6 caracteres</p>
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
                <div className="flex items-center gap-2 p-3 bg-destructive/10 text-destructive rounded-lg text-sm">
                  <AlertCircle className="w-5 h-5" />
                  <span>{passwordError}</span>
                </div>
              )}

              <Button type="submit" disabled={passwordLoading}>
                {passwordLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Actualizando...
                  </>
                ) : (
                  <>
                    <Key className="w-4 h-4 mr-2" />
                    Cambiar Contraseña
                  </>
                )}
              </Button>
            </form>
          )}
        </div>
      )}
    </div>
  )
}
