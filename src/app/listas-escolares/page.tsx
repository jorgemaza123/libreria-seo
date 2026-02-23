import { Metadata } from 'next'
import { SchoolListLanding } from './SchoolListLanding'

export const metadata: Metadata = {
  title: 'Listas Escolares en Villa María del Triunfo | Librería CHROMA',
  description:
    'Envía tu lista escolar por WhatsApp y la armamos en el día. Packs Económico, Medio y Premium con delivery en VMT. Frente al Colegio Estela Maris, Villa María del Triunfo.',
  alternates: {
    canonical: 'https://www.libreriachroma.com/listas-escolares',
  },
  openGraph: {
    title: 'Listas Escolares en Villa María del Triunfo | Librería CHROMA',
    description:
      'Envía tu lista escolar por WhatsApp. Packs Económico, Medio y Premium. Delivery gratis desde S/200 en VMT.',
    type: 'website',
    locale: 'es_PE',
    url: 'https://www.libreriachroma.com/listas-escolares',
  },
  keywords: [
    'lista escolar Villa María del Triunfo',
    'útiles escolares VMT',
    'pack escolar Lima',
    'regreso a clases Villa María del Triunfo',
    'librería VMT',
    'listas escolares WhatsApp',
    'útiles escolares baratos Lima',
    'forrado de cuadernos',
  ],
}

export default function ListasEscolaresPage() {
  return <SchoolListLanding />
}
