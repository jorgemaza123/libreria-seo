"use client"

import { createBrowserClient } from '@supabase/ssr'
import type { Database } from './types'

// Cliente de Supabase para el navegador (autenticación)
function getSupabaseClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// =============================================
// FUNCIONES DE AUTENTICACIÓN
// =============================================

type AdminUser = Database['public']['Tables']['admin_users']['Row']

/**
 * Iniciar sesión con email y contraseña
 */
export async function signIn(email: string, password: string) {
  const supabase = getSupabaseClient()

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    throw new Error(error.message)
  }

  // Verificar si el usuario es admin
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: adminUser, error: adminError } = await (supabase as any)
    .from('admin_users')
    .select('role')
    .eq('id', data.user.id)
    .single() as { data: { role: AdminUser['role'] } | null; error: Error | null }

  if (adminError || !adminUser) {
    // Si no es admin, cerrar sesión
    await supabase.auth.signOut()
    throw new Error('No tienes permisos de administrador')
  }

  return { user: data.user, session: data.session, role: adminUser.role }
}

/**
 * Cerrar sesión
 */
export async function signOut() {
  const supabase = getSupabaseClient()
  const { error } = await supabase.auth.signOut()

  if (error) {
    throw new Error(error.message)
  }
}

/**
 * Obtener sesión actual
 */
export async function getSession() {
  const supabase = getSupabaseClient()
  const { data: { session }, error } = await supabase.auth.getSession()

  if (error) {
    throw new Error(error.message)
  }

  return session
}

/**
 * Obtener usuario actual
 */
export async function getCurrentUser() {
  const supabase = getSupabaseClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error) {
    return null
  }

  return user
}

/**
 * Verificar si el usuario actual es admin
 */
export async function isCurrentUserAdmin() {
  const supabase = getSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return false

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: adminUser } = await (supabase as any)
    .from('admin_users')
    .select('role')
    .eq('id', user.id)
    .single()

  return !!adminUser
}

/**
 * Obtener información del admin actual
 */
export async function getCurrentAdmin(): Promise<{
  id: string
  email: string
  name: string
  role: 'admin' | 'editor'
} | null> {
  const supabase = getSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: adminUser } = await (supabase as any)
    .from('admin_users')
    .select('*')
    .eq('id', user.id)
    .single() as { data: AdminUser | null }

  if (!adminUser) return null

  return {
    id: adminUser.id,
    email: adminUser.email,
    name: adminUser.name,
    role: adminUser.role,
  }
}

// =============================================
// GESTIÓN DE CONTRASEÑA
// =============================================

/**
 * Cambiar contraseña (usuario autenticado)
 */
export async function changePassword(newPassword: string) {
  const supabase = getSupabaseClient()

  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  })

  if (error) {
    throw new Error(error.message)
  }
}

/**
 * Enviar email de recuperación de contraseña
 */
export async function sendPasswordResetEmail(email: string) {
  const supabase = getSupabaseClient()

  // La URL de redirección después de hacer clic en el link
  const redirectTo = typeof window !== 'undefined'
    ? `${window.location.origin}/admin/reset-password`
    : process.env.NEXT_PUBLIC_SITE_URL + '/admin/reset-password'

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo,
  })

  if (error) {
    throw new Error(error.message)
  }
}

/**
 * Actualizar contraseña con token de recuperación
 * (se llama después de hacer clic en el link del email)
 */
export async function updatePasswordWithToken(newPassword: string) {
  const supabase = getSupabaseClient()

  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  })

  if (error) {
    throw new Error(error.message)
  }
}

// =============================================
// GESTIÓN DE PERFIL
// =============================================

/**
 * Actualizar nombre del admin
 */
export async function updateAdminProfile(name: string) {
  const supabase = getSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('No hay sesión activa')
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from('admin_users')
    .update({ name })
    .eq('id', user.id)

  if (error) {
    throw new Error(error.message)
  }
}

/**
 * Actualizar email (requiere confirmación)
 */
export async function updateEmail(newEmail: string) {
  const supabase = getSupabaseClient()

  const { error } = await supabase.auth.updateUser({
    email: newEmail,
  })

  if (error) {
    throw new Error(error.message)
  }
}

// =============================================
// LISTENER DE CAMBIOS DE AUTENTICACIÓN
// =============================================

/**
 * Suscribirse a cambios de autenticación
 */
export function onAuthStateChange(callback: (event: string, session: unknown) => void) {
  const supabase = getSupabaseClient()

  const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
    callback(event, session)
  })

  return subscription
}
