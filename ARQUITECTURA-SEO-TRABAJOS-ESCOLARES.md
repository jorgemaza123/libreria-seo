# Arquitectura SEO de trabajos escolares

Fecha de auditoría: 15 de octubre de 2026

## Objetivo

Convertir búsquedas informativas, comerciales y locales sobre trabajos escolares en solicitudes de cotización por WhatsApp, sin páginas doorway, contenido duplicado ni URLs creadas solo para variar una palabra clave.

Flujo objetivo: búsqueda -> respuesta útil -> servicio relacionado -> cotización estructurada -> WhatsApp.

## Auditoría técnica

- Framework: Next.js 16 App Router, React 19, TypeScript, Tailwind, Supabase y Cloudinary.
- Medición: Google Tag Manager y Meta Pixel admitidos mediante variables de entorno; eventos propios de conversión disponibles en `/api/conversion-events`.
- SEO existente: metadata, canonical, sitemap, robots, LocalBusiness, Product y BreadcrumbList.
- Contenido existente: Home, listas escolares, productos, servicios y 16 landings de necesidades frecuentes.
- Hallazgos corregidos: FAQ schema global sin FAQ visible, títulos con marca duplicada, productos sin canonical, URLs compartidas dependientes de una variable antigua, servicios públicos forzados como dinámicos y bloqueo de recursos `/_next/` en robots.
- Search Console: la propiedad no se administra desde el repositorio. Se admite `GOOGLE_SITE_VERIFICATION`; cobertura, consultas y páginas posicionadas deben validarse en la cuenta real.

## Investigación Perú

- El Día del Logro se entiende como presentación pública de aprendizajes y suele materializarse con maquetas, organizadores, experimentos y trabajos escritos.
- “Día del Logro” y “Semana del Logro” comparten intención principal; se resuelven con una sola URL canónica.
- La feria escolar de ciencia se relaciona en Perú con “Eureka” y con proyectos de indagación, soluciones tecnológicas e indagación social.
- “Lapbook”, “papelote”, “tríptico”, “panel”, “maqueta escolar”, “por encargo” y “a pedido” aparecen en el vocabulario educativo o comercial peruano.
- Las páginas locales de maquetas agrupan de forma natural ciencias/anatomía, geografía, historia/culturas, ambiente y estructuras.

Fuentes de referencia:

- MINEDU, fascículo sobre gestión de los aprendizajes: https://www.minedu.gob.pe/n/xtras/fasciculo_general_gestion_de_aprendizajes.pdf
- Andina, exposición de logros de aprendizaje: https://andina.pe/agencia/noticia-colegios-exhibiran-durante-fiestas-patrias-logros-alcanzados-primer-semestre-420773.aspx
- MINEDU, proyectos ganadores de Eureka: https://repositorio.minedu.gob.pe/handle/20.500.12799/10547
- Gobierno del Perú, Feria Escolar Nacional Eureka: https://www.gob.pe/institucion/ugelyauli/campa%C3%B1as/66954-feria-escolar-nacional-de-ciencia-y-tecnologia-eureka
- INUDI Perú, lapbook como recurso didáctico: https://editorial.inudi.edu.pe/editorialinudi/es/catalog/book/62

## URLs propietarias publicadas

| Cluster | URL propietaria | Intención principal |
| --- | --- | --- |
| Trabajos escolares | `/trabajos-escolares` | Comercial / navegación de hub |
| Día y Semana del Logro | `/dia-del-logro` | Comercial estacional / informativa |
| Maquetas escolares en Lima | `/maquetas-escolares-lima` | Local / comercial |
| Proyectos y feria de ciencias | `/proyectos-de-ciencia` | Comercial / informativa |
| Exposiciones, paneles y material visual | `/material-para-exposiciones` | Comercial |
| Lapbooks | `/lapbooks-escolares` | Comercial / informativa |
| Trípticos | `/tripticos-escolares` | Comercial / informativa |

Estas páginas tienen title, description, H1, canonical, Open Graph, breadcrumbs visibles y estructurados, respuesta directa, contenido único, FAQ visible, enlaces internos y cotizador progresivo.

## Mapa de intención

| Familia buscada | URL dominante o tratamiento |
| --- | --- |
| trabajos, tareas y material escolar elaborado | `/trabajos-escolares` |
| maquetas, dioramas, prototipos y maquetas por tema | `/maquetas-escolares-lima` |
| lapbook y cuaderno de proyecto desplegable | `/lapbooks-escolares` |
| tríptico y díptico | `/tripticos-escolares`; díptico se cubre como variante hasta probar demanda propia |
| mural, papelote, cartel, afiche, panel y stand | `/material-para-exposiciones` |
| infografía, línea de tiempo, mapa mental y mapa conceptual | `/material-para-exposiciones` |
| álbum, informe, presentaciones y portadas | `/trabajos-escolares` |
| proyecto, experimento, feria y Eureka | `/proyectos-de-ciencia` |
| Día/Semana del Logro y presentación de aprendizajes | `/dia-del-logro` |
| impresiones, fichas, recortables y rótulos | landing de impresión existente y contexto desde los hubs |
| stickers escolares | oferta existente de personalizados; no se crea otra URL hasta validar intención |
| inicial, primaria y secundaria | bloques internos; no URLs automáticas por grado |
| Ciencia y Tecnología, Personal Social, Comunicación y áreas afines | navegación contextual; no duplicación por curso |
| distritos de Lima y “cerca de mí” | LocalBusiness, NAP y cobertura real; no páginas doorway por distrito |

## Priorización

### Tier 1 publicado

Los siete pilares anteriores. Son páginas completas y enlazadas desde Home, campaña, hubs, breadcrumbs y sitemap.

### Tier 2 por validar

- Guías de maquetas con suficiente evidencia y material real: sistema digestivo, célula, sistema solar, costa-sierra-selva, culturas peruanas y reciclaje.
- Guías útiles: cómo hacer un lapbook, partes de un tríptico, cómo preparar una exposición y cómo presentar un experimento.
- Cierre escolar: solo cuando se confirme la oferta de paneles, recuerdos, impresiones o ceremonia.
- Galerías temáticas: solo con fotografías propias suficientes, caption y contexto.

### Tier 3 futuro

- Long-tail de temas específicos con demanda demostrada en Search Console.
- Promoción, graduación y recuerdos escolares si forman parte real de la oferta.
- Páginas locales únicamente si existe sede, entrega, evidencia o servicio diferencial verificable.

## Reglas editoriales

- Una intención principal tiene una URL propietaria.
- Singular, plural y variaciones léxicas no generan páginas separadas.
- Una guía responde primero; el servicio aparece después como opción.
- Una landing comercial responde qué se hace, qué información se necesita, disponibilidad, coordinación y CTA sin texto de relleno.
- No se publican precios, cobertura, urgencias, stock, reseñas ni tiempos que no estén confirmados.
- No se crean páginas por distrito sustituyendo nombres.
- Las URLs estacionales no se borran: se actualizan y se retira su promoción de Home.

## Campañas

La configuración central está en `src/data/campaigns.ts`.

Cada campaña define slug, nombre, estado, rango de fechas, copy, CTA y enlaces relacionados. `active` publica la sección solo dentro del rango; `scheduled` y `paused` no aparecen. Día del Logro está activo y cierre escolar queda reservado, no publicado como landing vacía.

## Conversión

El cotizador de dos pasos pide primero tipo, tema y fecha. Después acepta nivel, curso, grado, distrito, tamaño, cantidad, referencia y observaciones. El mensaje de WhatsApp conserva los datos y la página de origen, de modo que el cliente no tenga que reescribirlos.

## Google Images

- Usar fotos reales, no variantes casi idénticas.
- Nombre descriptivo en minúsculas y con guiones.
- `alt` describe lo visible y su tema, sin listas de keywords.
- Añadir caption y texto cercano que expliquen curso, formato o finalidad.
- Mantener dimensiones, `srcset`, AVIF/WebP y lazy loading fuera del primer viewport.
- Crear páginas de ejemplos solo cuando cada conjunto tenga contexto y valor propio.

## Google Business Profile

- Categoría principal: elegir la actividad que represente el negocio real; no cambiarla sin revisar el perfil actual.
- Servicios sugeridos: maquetas escolares, trabajos escolares, impresión de documentos, material para exposiciones, lapbooks y trípticos, solo si están disponibles.
- Mantener nombre, dirección y teléfono idénticos en web y perfil.
- Subir fotografías reales por tipo de trabajo y enlazar la publicación estacional a su landing, no siempre a Home.
- Solicitar reseñas honestas después de la entrega sin ofrecer incentivos ni sugerir el texto.
- Publicar campañas de Día del Logro y feria escolar con fecha y disponibilidad reales.

## Medición y siguiente expansión

1. Enviar `/sitemap.xml` en Search Console y solicitar indexación de los siete pilares.
2. Revisar semanalmente impresiones, consultas, CTR, páginas descubiertas y conversiones a WhatsApp.
3. Esperar datos antes de abrir URLs Tier 2; priorizar consultas con impresiones y posición aproximada entre 8 y 30.
4. Crear una guía solo si puede incluir explicación útil, ejemplos propios, materiales, errores y enlace comercial pertinente.
5. Validar Core Web Vitals con datos de campo después del despliegue; Lighthouse local no sustituye CrUX.
