import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'Librería CHROMA - Villa María del Triunfo, Lima'

export const size = { width: 1200, height: 630 }

export const contentType = 'image/png'

/**
 * OG Image dinámica generada en Edge.
 * Se aplica automáticamente a todas las páginas que no especifican su propia og:image.
 * Next.js inyecta el meta og:image automáticamente.
 */
export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '64px',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        {/* Círculos decorativos de fondo */}
        <div
          style={{
            position: 'absolute',
            top: '-80px',
            left: '-80px',
            width: '360px',
            height: '360px',
            borderRadius: '50%',
            background: 'rgba(139, 92, 246, 0.15)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-60px',
            right: '-60px',
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background: 'rgba(99, 102, 241, 0.15)',
          }}
        />

        {/* Logo / Brand */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '32px',
          }}
        >
          <div
            style={{
              background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
              borderRadius: '20px',
              padding: '16px 32px',
              fontSize: '52px',
              fontWeight: 900,
              color: 'white',
              letterSpacing: '-1px',
            }}
          >
            CHROMA
          </div>
        </div>

        {/* Tagline principal */}
        <div
          style={{
            fontSize: '40px',
            fontWeight: 700,
            color: 'white',
            textAlign: 'center',
            marginBottom: '16px',
            lineHeight: '1.2',
            maxWidth: '900px',
          }}
        >
          Tu Librería de Confianza
        </div>

        {/* Ubicación */}
        <div
          style={{
            fontSize: '26px',
            color: 'rgba(196, 181, 253, 1)',
            textAlign: 'center',
            marginBottom: '40px',
          }}
        >
          Villa María del Triunfo · Lima, Perú
        </div>

        {/* Servicios pills */}
        <div
          style={{
            display: 'flex',
            gap: '16px',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          {[
            '📚 Útiles Escolares',
            '🖨️ Impresiones',
            '💻 Soporte Técnico',
            '🎁 Sublimación',
          ].map((item) => (
            <div
              key={item}
              style={{
                background: 'rgba(255, 255, 255, 0.12)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '100px',
                padding: '10px 24px',
                fontSize: '20px',
                color: 'white',
              }}
            >
              {item}
            </div>
          ))}
        </div>

        {/* URL en el footer */}
        <div
          style={{
            position: 'absolute',
            bottom: '32px',
            fontSize: '20px',
            color: 'rgba(165, 180, 252, 0.8)',
          }}
        >
          www.libreriachroma.com
        </div>
      </div>
    ),
    { ...size }
  )
}
