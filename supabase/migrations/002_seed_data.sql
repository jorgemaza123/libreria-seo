-- =============================================
-- LIBRERÍA CENTRAL - DATOS INICIALES (SEED)
-- Ejecutar después de 001_create_tables.sql
-- =============================================

-- =============================================
-- CATEGORÍAS
-- =============================================
INSERT INTO categories (name, slug, description, icon, "order", is_active) VALUES
('Útiles Escolares', 'utiles-escolares', 'Todo lo que necesitas para el colegio', 'Pencil', 1, true),
('Papelería', 'papeleria', 'Papeles, cartulinas, folders y más', 'FileText', 2, true),
('Arte y Manualidades', 'arte-manualidades', 'Materiales para crear y expresarte', 'Palette', 3, true),
('Tecnología', 'tecnologia', 'Accesorios y equipos tecnológicos', 'Laptop', 4, true),
('Oficina', 'oficina', 'Suministros para tu oficina', 'Briefcase', 5, true),
('Mochilas y Loncheras', 'mochilas-loncheras', 'Mochilas, loncheras y accesorios', 'Backpack', 6, true)
ON CONFLICT (slug) DO NOTHING;

-- =============================================
-- PRODUCTOS
-- =============================================
INSERT INTO products (name, slug, description, price, sale_price, sku, category_id, stock, image, is_active, is_featured)
SELECT
    'Cuaderno Universitario Premium',
    'cuaderno-universitario-premium',
    'Cuaderno universitario de 100 hojas, papel bond de alta calidad, tapa dura con diseños modernos. Ideal para estudiantes universitarios y profesionales.',
    15.90,
    12.90,
    'CUA-UNI-001',
    c.id,
    150,
    '/images/products/cuaderno.jpg',
    true,
    true
FROM categories c WHERE c.slug = 'utiles-escolares'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, price, sale_price, sku, category_id, stock, image, is_active, is_featured)
SELECT
    'Set de Colores Profesionales x36',
    'set-colores-profesionales',
    'Set de 36 colores profesionales con pigmentos de alta calidad. Incluye estuche metálico y sacapuntas. Perfectos para artistas y estudiantes de arte.',
    45.00,
    38.50,
    'COL-PRO-036',
    c.id,
    80,
    '/images/products/colores.jpg',
    true,
    true
FROM categories c WHERE c.slug = 'arte-manualidades'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, price, sale_price, sku, category_id, stock, image, is_active, is_featured)
SELECT
    'Mochila Escolar Premium',
    'mochila-escolar-premium',
    'Mochila ergonómica con compartimentos para laptop, bolsillos organizadores y material resistente al agua. Disponible en varios colores.',
    89.90,
    75.00,
    'MOC-ESC-001',
    c.id,
    45,
    '/images/products/mochila.jpg',
    true,
    true
FROM categories c WHERE c.slug = 'mochilas-loncheras'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, price, sale_price, sku, category_id, stock, image, is_active, is_featured)
SELECT
    'Papel Bond A4 x500',
    'papel-bond-a4-500',
    'Resma de papel bond A4, 500 hojas, 75g/m². Ideal para impresiones y copias. Blancura excepcional.',
    28.00,
    NULL,
    'PAP-A4-500',
    c.id,
    200,
    '/images/products/papel.jpg',
    true,
    false
FROM categories c WHERE c.slug = 'papeleria'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, price, sale_price, sku, category_id, stock, image, is_active, is_featured)
SELECT
    'Calculadora Científica FX-82',
    'calculadora-cientifica-fx82',
    'Calculadora científica con 240 funciones. Pantalla de 2 líneas, ideal para estudiantes de ingeniería y ciencias.',
    65.00,
    55.00,
    'CAL-CIE-082',
    c.id,
    60,
    '/images/products/calculadora.jpg',
    true,
    true
FROM categories c WHERE c.slug = 'tecnologia'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, price, sale_price, sku, category_id, stock, image, is_active, is_featured)
SELECT
    'Set de Lapiceros Gel x12',
    'set-lapiceros-gel-12',
    'Set de 12 lapiceros de gel en colores variados. Tinta de secado rápido y flujo suave.',
    18.00,
    15.00,
    'LAP-GEL-012',
    c.id,
    120,
    '/images/products/lapiceros.jpg',
    true,
    false
FROM categories c WHERE c.slug = 'utiles-escolares'
ON CONFLICT (slug) DO NOTHING;

-- =============================================
-- SERVICIOS
-- =============================================
INSERT INTO services (name, slug, description, short_description, icon, price, "order", is_active) VALUES
('Impresiones y Copias', 'Impresiones y Copias', 'Servicio de impresiones a color, B/N, copias, anillados, escaneos.', 'Impresiones a color y B/N desde S/0.10', 'Printer', 'Desde S/0.10', 1, true),
('Sublimación', 'Sublimación', 'Polos, tazas, gorras, llaveros personalizados.', 'Totalmente personalizado', 'Copy', 'Desde S/0.05', 2, true),
('Diseño Gráfico', 'Diseño Gráfico', 'Logos, banners, tarjetas, invitaciones.', 'Todo profesional para tus documentos', 'BookOpen', 'Desde S/3.00', 3, true),
('Trámites Online', 'Trámites Online', 'SUNAT, ATU, RENIEC, AFP, brevetes y más.', 'Trámites Online para proteger documentos', 'Shield', 'Desde S/2.00', 4, true),
('Soporte Técnico', 'soporte-tecnico', 'Reparación de computadoras, laptops, formateo, instalación de programas y más.', 'Reparación y mantenimiento de PCs', 'Wrench', 'Consultar', 5, true),
('Monografias - trabajos escolares', 'Todo tipo de trabajos escolares de primaria y secundaria', 'PenTool', 'Consultar', 6, true)
ON CONFLICT (slug) DO NOTHING;

-- =============================================
-- FAQs
-- =============================================
INSERT INTO faqs (question, answer, category, "order", is_active) VALUES
('¿Cuál es el horario de atención?', 'Atendemos de Lunes a Viernes de 8:00 AM a 8:00 PM, Sábados de 9:00 AM a 6:00 PM, y Domingos de 10:00 AM a 2:00 PM.', 'general', 1, true),
('¿Hacen delivery?', 'Sí, realizamos delivery en San Juan de Lurigancho y distritos aledaños. El costo varía según la distancia. Consulta por WhatsApp para más detalles.', 'envios', 2, true),
('¿Aceptan tarjetas de crédito/débito?', 'Sí, aceptamos todas las tarjetas Visa, Mastercard, American Express y también Yape y Plin.', 'pagos', 3, true),
('¿Tienen lista escolar?', 'Sí, trabajamos con las listas escolares de los principales colegios de la zona. Trae tu lista y te ayudamos a completarla con los mejores precios.', 'productos', 4, true),
('¿Hacen impresiones a color?', 'Sí, ofrecemos impresiones a color de alta calidad en diferentes tamaños: A4, A3, Carta y Oficio.', 'servicios', 5, true),
('¿Cuánto demora el servicio de anillado?', 'El servicio de anillado es inmediato para trabajos pequeños (menos de 100 hojas). Para trabajos más grandes, el tiempo es de 15-30 minutos.', 'servicios', 6, true),
('¿Reparan laptops?', 'Sí, nuestro servicio técnico incluye reparación de laptops y PCs: formateo, instalación de programas, limpieza, cambio de disco duro, memoria RAM, etc.', 'servicios', 7, true),
('¿Tienen descuentos por cantidad?', 'Sí, ofrecemos descuentos especiales para compras al por mayor. Consulta nuestros precios corporativos.', 'precios', 8, true)
ON CONFLICT DO NOTHING;

-- =============================================
-- CONFIGURACIÓN DEL SITIO
-- =============================================
INSERT INTO site_settings (key, value) VALUES
('contact_info', '{
    "whatsapp": "51932371532",
    "phone": "+51 932 371 532",
    "email": "jorgemazaromero@hotmail.com",
    "address": {
        "street": "Av. Principal #123",
        "district": "San Juan de Lurigancho",
        "city": "Lima",
        "country": "Perú"
    }
}'::jsonb),
('business_hours', '{
    "weekdays": {"label": "Lunes a Viernes", "hours": "8:00 AM - 8:00 PM"},
    "saturday": {"label": "Sábados", "hours": "9:00 AM - 6:00 PM"},
    "sunday": {"label": "Domingos", "hours": "10:00 AM - 2:00 PM"}
}'::jsonb),
('social_media', '{
    "facebook": "https://facebook.com/libreriacentral",
    "instagram": "https://instagram.com/libreriacentral",
    "tiktok": "https://tiktok.com/@libreriacentral"
}'::jsonb)
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- =============================================
-- TEMAS ESTACIONALES (ejemplos)
-- =============================================
INSERT INTO seasonal_themes (name, slug, primary_color, secondary_color, accent_color, start_date, end_date, is_active) VALUES
('San Valentín', 'san-valentin', '350 89% 60%', '330 81% 60%', '340 82% 52%', '2025-02-01', '2025-02-28', false),
('Día de la Madre', 'dia-madre', '330 81% 60%', '280 87% 65%', '320 70% 50%', '2025-05-01', '2025-05-15', false),
('Fiestas Patrias', 'fiestas-patrias', '0 84% 60%', '0 0% 100%', '0 84% 40%', '2025-07-15', '2025-07-31', false),
('Navidad', 'navidad', '0 84% 60%', '120 73% 35%', '45 93% 58%', '2025-12-01', '2025-12-31', false),
('Campaña Escolar', 'campana-escolar', '220 90% 56%', '142 72% 50%', '45 93% 58%', '2025-01-15', '2025-03-15', false)
ON CONFLICT (slug) DO NOTHING;

-- =============================================
-- MENSAJE DE ÉXITO
-- =============================================
DO $$
BEGIN
    RAISE NOTICE '✅ Datos iniciales insertados exitosamente';
    RAISE NOTICE '';
    RAISE NOTICE 'Categorías: 6';
    RAISE NOTICE 'Productos: 6';
    RAISE NOTICE 'Servicios: 6';
    RAISE NOTICE 'FAQs: 8';
    RAISE NOTICE 'Configuraciones: 3';
    RAISE NOTICE 'Temas: 5';
    RAISE NOTICE '';
    RAISE NOTICE 'Próximo paso: Crear el usuario administrador';
END $$;
