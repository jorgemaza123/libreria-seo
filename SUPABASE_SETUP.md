# Configuración de Supabase para Librería Central

## Pasos para configurar la base de datos

### 1. Acceder al SQL Editor de Supabase

1. Inicia sesión en [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecciona tu proyecto
3. En el menú lateral, ve a **SQL Editor**

### 2. Ejecutar los scripts en orden

Debes ejecutar los scripts SQL en el siguiente orden:

#### Script 1: Crear tablas base (ya existente)
```
supabase/migrations/001_create_tables.sql
```
Este script crea las tablas principales: categories, products, services, promotions, etc.

#### Script 2: Datos iniciales (ya existente)
```
supabase/migrations/002_seed_data.sql
```
Este script inserta datos de ejemplo.

#### Script 3: Crear admin (ya existente)
```
supabase/migrations/003_create_admin.sql
```
Este script configura el usuario administrador.

#### Script 4: Catálogos y Reseñas (NUEVO)
```
supabase/migrations/004_create_catalogs_reviews.sql
```
Este script crea las tablas `catalogs` y `reviews` con:
- Estructura de datos completa
- Row Level Security (RLS) habilitado
- Políticas de seguridad (lectura pública, escritura solo admin)
- Datos de ejemplo

### 3. Verificar que las tablas se crearon

En el SQL Editor, ejecuta:
```sql
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
```

Deberías ver las tablas:
- admin_users
- **catalogs** (nueva)
- categories
- faqs
- product_images
- products
- promotions
- **reviews** (nueva)
- seasonal_themes
- services
- site_settings

### 4. Configurar variables de entorno

En tu archivo `.env.local`, asegúrate de tener:

```env
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
```

---

## Estructura de las nuevas tablas

### Tabla: catalogs

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | Identificador único |
| title | VARCHAR(255) | Título del catálogo |
| description | TEXT | Descripción |
| season | VARCHAR(100) | Temporada (ej: "Regreso a Clases") |
| year | VARCHAR(10) | Año |
| file_url | TEXT | URL del archivo PDF |
| cover_image | TEXT | URL de la imagen de portada |
| page_count | INTEGER | Número de páginas |
| is_new | BOOLEAN | Marcar como nuevo |
| is_active | BOOLEAN | Visible públicamente |
| downloads | INTEGER | Contador de descargas |

### Tabla: reviews

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | Identificador único |
| customer_name | VARCHAR(255) | Nombre del cliente |
| customer_email | VARCHAR(255) | Email (opcional) |
| avatar_url | TEXT | URL del avatar |
| rating | INTEGER | Calificación (1-5) |
| comment | TEXT | Comentario |
| product_id | UUID | Producto relacionado (opcional) |
| service_id | UUID | Servicio relacionado (opcional) |
| is_featured | BOOLEAN | Mostrar destacado |
| is_verified | BOOLEAN | Verificado |
| is_active | BOOLEAN | Visible públicamente |
| source | VARCHAR(50) | Fuente (google, website, etc) |
| response | TEXT | Respuesta del negocio |

---

## API Endpoints disponibles

### Catálogos

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | /api/catalogs | Obtener catálogos activos |
| POST | /api/catalogs | Crear catálogo (requiere auth) |
| PUT | /api/catalogs | Actualizar catálogo (requiere auth) |
| DELETE | /api/catalogs?id=xxx | Eliminar catálogo (requiere auth) |

### Reseñas

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | /api/reviews | Obtener reseñas activas |
| GET | /api/reviews?featured=true | Solo reseñas destacadas |
| GET | /api/reviews?all=true | Todas (para admin) |
| POST | /api/reviews | Crear reseña (requiere auth) |
| PUT | /api/reviews | Actualizar reseña (requiere auth) |
| DELETE | /api/reviews?id=xxx | Eliminar reseña (requiere auth) |

---

## Subir PDFs para catálogos

Para los archivos PDF de los catálogos, tienes varias opciones:

### Opción 1: Cloudinary (Recomendado)
1. Sube el PDF a Cloudinary
2. Copia la URL del archivo
3. Pégala en el campo "URL del PDF" en el admin

### Opción 2: Google Drive
1. Sube el PDF a Google Drive
2. Compártelo como "Cualquier persona con el enlace"
3. Copia el enlace de descarga directa
4. Pégalo en el campo "URL del PDF"

### Opción 3: Supabase Storage
1. Ve a Storage en Supabase
2. Crea un bucket llamado "catalogs"
3. Sube tus PDFs
4. Copia la URL pública

---

## Solución de problemas

### Error 404 en rutas admin
- Verifica que has ejecutado todos los scripts SQL
- Verifica las variables de entorno
- Reinicia el servidor de desarrollo: `npm run dev`

### Error 500 al guardar
- Verifica que el usuario admin está autenticado
- Verifica las políticas RLS en Supabase
- Revisa los logs en Supabase Dashboard > Logs

### Los cambios no se reflejan
- La aplicación usa mock data como fallback
- Verifica que Supabase está configurado correctamente
- Revisa la consola del navegador para errores

---

## Funcionalidad de búsqueda

La búsqueda del Navbar está conectada con la sección de productos:
1. Escribe en el campo de búsqueda del Navbar
2. La página hace scroll automático a la sección de productos
3. Los productos se filtran en tiempo real

El estado de búsqueda se comparte mediante `SearchContext`.
