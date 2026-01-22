-- =============================================
-- LIBRERÍA CHROMA - CREAR USUARIO ADMINISTRADOR
-- =============================================
--
-- INSTRUCCIONES:
--
-- 1. Ve a tu proyecto en Supabase Dashboard
--    https://supabase.com/dashboard/project/fbniqxgwjbhabtbbktiy
--
-- 2. Ve a Authentication > Users
--
-- 3. Click en "Add user" > "Create new user"
--
-- 4. Ingresa:
--    - Email: jorgemazaromero@hotmail.com
--    - Password: (elige una contraseña segura)
--    - Marca "Auto Confirm User"
--
-- 5. Click en "Create user"
--
-- 6. Copia el UUID del usuario creado (lo verás en la tabla)
--
-- 7. Ejecuta el siguiente SQL reemplazando el UUID:
-- =============================================

-- REEMPLAZA 'TU-UUID-AQUI' con el UUID real del usuario
-- Ejemplo: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'

-- INSERT INTO admin_users (id, email, name, role)
-- VALUES (
--     'TU-UUID-AQUI'::uuid,
--     'jorgemazaromero@hotmail.com',
--     'Jorge Maza',
--     'admin'
-- );

-- =============================================
-- ALTERNATIVA: Trigger automático
-- Este trigger agrega automáticamente a admin_users
-- cuando se crea un usuario con email específico
-- =============================================

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Si es el email del admin principal, agregarlo como admin
    IF NEW.email = 'jorgemazaromero@hotmail.com' THEN
        INSERT INTO admin_users (id, email, name, role)
        VALUES (NEW.id, NEW.email, 'Jorge Maza', 'admin')
        ON CONFLICT (id) DO NOTHING;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Crear el trigger en auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION handle_new_user();

-- =============================================
-- FUNCIÓN: Crear primer admin (solo si no existe ninguno)
-- Esta función permite crear el primer admin desde la API
-- =============================================

CREATE OR REPLACE FUNCTION create_first_admin(user_id UUID, user_email TEXT, user_name TEXT)
RETURNS BOOLEAN AS $$
DECLARE
    admin_count INTEGER;
BEGIN
    -- Verificar si ya existe algún admin
    SELECT COUNT(*) INTO admin_count FROM admin_users WHERE role = 'admin';

    -- Solo crear si no existe ningún admin
    IF admin_count = 0 THEN
        INSERT INTO admin_users (id, email, name, role)
        VALUES (user_id, user_email, user_name, 'admin')
        ON CONFLICT (id) DO NOTHING;
        RETURN TRUE;
    END IF;

    RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- MENSAJE
-- =============================================
DO $$
BEGIN
    RAISE NOTICE '✅ Trigger para crear admin configurado';
    RAISE NOTICE '';
    RAISE NOTICE 'Ahora ve a Supabase Dashboard > Authentication > Users';
    RAISE NOTICE 'y crea un usuario con email: jorgemazaromero@hotmail.com';
    RAISE NOTICE '';
    RAISE NOTICE 'El usuario será automáticamente agregado como administrador.';
END $$;
