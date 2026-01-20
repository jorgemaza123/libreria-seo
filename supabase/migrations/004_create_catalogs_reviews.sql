-- =============================================
-- LIBRERÍA CENTRAL - CATÁLOGOS Y RESEÑAS
-- Script: 004_create_catalogs_reviews.sql
-- Ejecutar en Supabase SQL Editor
-- =============================================

-- =============================================
-- TABLA: catalogs (Catálogos PDF descargables)
-- =============================================
CREATE TABLE IF NOT EXISTS catalogs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    season VARCHAR(100) NOT NULL,
    year VARCHAR(10) NOT NULL,
    file_url TEXT,
    cover_image TEXT,
    page_count INTEGER DEFAULT 1,
    is_new BOOLEAN DEFAULT true,
    is_active BOOLEAN DEFAULT true,
    downloads INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para catalogs
CREATE INDEX IF NOT EXISTS idx_catalogs_active ON catalogs(is_active);
CREATE INDEX IF NOT EXISTS idx_catalogs_season ON catalogs(season);
CREATE INDEX IF NOT EXISTS idx_catalogs_year ON catalogs(year);

-- Trigger para updated_at
DROP TRIGGER IF EXISTS update_catalogs_updated_at ON catalogs;
CREATE TRIGGER update_catalogs_updated_at
    BEFORE UPDATE ON catalogs
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- TABLA: reviews (Reseñas/Testimonios)
-- =============================================
CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255),
    avatar_url TEXT,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    service_id UUID REFERENCES services(id) ON DELETE SET NULL,
    is_featured BOOLEAN DEFAULT false,
    is_verified BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    source VARCHAR(50) DEFAULT 'website',
    response TEXT,
    responded_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para reviews
CREATE INDEX IF NOT EXISTS idx_reviews_active ON reviews(is_active);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);
CREATE INDEX IF NOT EXISTS idx_reviews_featured ON reviews(is_featured);
CREATE INDEX IF NOT EXISTS idx_reviews_product ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_service ON reviews(service_id);
CREATE INDEX IF NOT EXISTS idx_reviews_source ON reviews(source);

-- Trigger para updated_at
DROP TRIGGER IF EXISTS update_reviews_updated_at ON reviews;
CREATE TRIGGER update_reviews_updated_at
    BEFORE UPDATE ON reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================

-- Habilitar RLS
ALTER TABLE catalogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- =============================================
-- POLÍTICAS: Lectura pública
-- =============================================

-- Catalogs: lectura pública para activos
DROP POLICY IF EXISTS "Active catalogs are viewable by everyone" ON catalogs;
CREATE POLICY "Active catalogs are viewable by everyone" ON catalogs
    FOR SELECT USING (is_active = true);

-- Reviews: lectura pública para activas
DROP POLICY IF EXISTS "Active reviews are viewable by everyone" ON reviews;
CREATE POLICY "Active reviews are viewable by everyone" ON reviews
    FOR SELECT USING (is_active = true);

-- =============================================
-- POLÍTICAS: Escritura solo para admins
-- =============================================

-- Catalogs: CRUD para admins
DROP POLICY IF EXISTS "Admins can manage catalogs" ON catalogs;
CREATE POLICY "Admins can manage catalogs" ON catalogs
    FOR ALL USING (is_admin());

-- Reviews: CRUD para admins
DROP POLICY IF EXISTS "Admins can manage reviews" ON reviews;
CREATE POLICY "Admins can manage reviews" ON reviews
    FOR ALL USING (is_admin());

-- =============================================
-- FUNCIÓN: Incrementar contador de descargas
-- =============================================
CREATE OR REPLACE FUNCTION increment_catalog_downloads(catalog_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE catalogs
    SET downloads = downloads + 1
    WHERE id = catalog_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Permitir que cualquiera pueda llamar a esta función
GRANT EXECUTE ON FUNCTION increment_catalog_downloads(UUID) TO anon, authenticated;

-- =============================================
-- DATOS INICIALES DE EJEMPLO
-- =============================================

-- Insertar catálogos de ejemplo
INSERT INTO catalogs (title, description, season, year, cover_image, page_count, is_new, is_active, downloads)
VALUES
    ('Catálogo Escolar 2025', 'Lista completa de útiles escolares, mochilas, loncheras y más.', 'Regreso a Clases', '2025', 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=300&fit=crop', 24, true, true, 156),
    ('Catálogo de Servicios', 'Todos nuestros servicios: impresiones, sublimación, trámites y más.', 'Todo el año', '2025', 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&h=300&fit=crop', 12, false, true, 89),
    ('Ofertas de Temporada', 'Promociones especiales y descuentos del mes.', 'Enero 2025', '2025', 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400&h=300&fit=crop', 8, false, true, 45)
ON CONFLICT DO NOTHING;

-- Insertar reseñas de ejemplo
INSERT INTO reviews (customer_name, rating, comment, is_featured, is_verified, is_active, source)
VALUES
    ('María García', 5, '¡Excelente atención! Encontré todo lo que necesitaba para el regreso a clases de mis hijos. Los precios muy accesibles y el personal muy amable.', true, true, true, 'google'),
    ('Carlos Rodríguez', 5, 'El servicio de impresiones es el mejor de la zona. Rápido, económico y de buena calidad. 100% recomendado.', true, true, true, 'google'),
    ('Ana López', 4, 'Buena variedad de productos. Me gusta que tienen artículos de oficina que no encuentro en otros lugares.', false, true, true, 'website'),
    ('Pedro Martínez', 5, 'Llevo años comprando aquí. La atención siempre es excelente y los precios muy competitivos.', true, true, true, 'google'),
    ('Laura Sánchez', 5, 'Me encanta el servicio de sublimación. Hicieron mis tazas personalizadas y quedaron perfectas. ¡Volveré!', false, true, true, 'website')
ON CONFLICT DO NOTHING;

-- =============================================
-- MENSAJE DE ÉXITO
-- =============================================
DO $$
BEGIN
    RAISE NOTICE '✅ Tabla "catalogs" creada exitosamente';
    RAISE NOTICE '✅ Tabla "reviews" creada exitosamente';
    RAISE NOTICE '✅ Row Level Security habilitado';
    RAISE NOTICE '✅ Políticas de seguridad configuradas';
    RAISE NOTICE '✅ Datos de ejemplo insertados';
    RAISE NOTICE '';
    RAISE NOTICE '📌 Recuerda: Para subir PDFs, usa Cloudinary o cualquier servicio de hosting';
    RAISE NOTICE '📌 y pega la URL en el campo "file_url" del catálogo.';
END $$;
