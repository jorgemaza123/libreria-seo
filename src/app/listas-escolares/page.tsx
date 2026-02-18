import { Metadata } from 'next'
import { SchoolListLanding } from './SchoolListLanding'

export const metadata: Metadata = {
  title: 'Listas Escolares | Librería CHROMA - Envía tu lista y recibe todo listo',
  description:
    'Envía tu lista escolar por WhatsApp y nosotros la armamos por ti. Opciones Económico, Medio y Premium. Envío gratis desde S/200. Librería CHROMA, Villa María del Triunfo.',
  openGraph: {
    title: 'Listas Escolares | Librería CHROMA',
    description:
      'Envía tu lista escolar por WhatsApp. Ahorra tiempo y dinero con nuestras opciones Económico, Medio y Premium.',
    type: 'website',
    locale: 'es_PE',
  },
  keywords: [
    'lista escolar',
    'útiles escolares',
    'regreso a clases',
    'lima',
    'villa maria del triunfo',
    'librería',
    'pack escolar',
    'forrado de cuadernos',
  ],
}

export default function ListasEscolaresPage() {
  return <SchoolListLanding />
}
