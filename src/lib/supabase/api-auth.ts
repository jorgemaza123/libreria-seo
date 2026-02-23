import { NextResponse } from 'next/server'
import { createClient } from './server'

type AuthError = { error: NextResponse }
type AuthSuccess = { userId: string }

/**
 * Verifica que la petición viene de un usuario administrador autenticado.
 * Usar en API routes que requieren permisos de admin (POST/PUT/DELETE).
 *
 * Uso:
 *   const auth = await requireAdminAuth()
 *   if ('error' in auth) return auth.error
 *   // auth.userId disponible aquí
 */
export async function requireAdminAuth(): Promise<AuthError | AuthSuccess> {
  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return {
        error: NextResponse.json(
          { error: 'No autorizado. Inicia sesión para continuar.' },
          { status: 401 }
        ),
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: adminUser } = await (supabase as any)
      .from('admin_users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!adminUser) {
      return {
        error: NextResponse.json(
          { error: 'Acceso denegado. No tienes permisos de administrador.' },
          { status: 403 }
        ),
      }
    }

    return { userId: user.id }
  } catch {
    return {
      error: NextResponse.json(
        { error: 'Error de autenticación.' },
        { status: 500 }
      ),
    }
  }
}
