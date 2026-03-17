"use client"

import { ArrowRight, Clock, Mail, MapPin, MessageCircle, Navigation, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  BUSINESS_HOURS,
  BUSINESS_INFO,
  CONTACT,
  getEmailUrl,
  getPhoneUrl,
  getWhatsAppUrl,
} from '@/lib/constants'

function getOpenStatus(): { isOpen: boolean; label: string } {
  const now = new Date()
  const day = now.getDay()
  const minutes = now.getHours() * 60 + now.getMinutes()

  const toMinutes = (hhmm: string) => {
    const [h, m] = hhmm.split(':').map(Number)
    return h * 60 + m
  }

  if (day >= 1 && day <= 5) {
    const opens = toMinutes(BUSINESS_HOURS.weekdays.opens)
    const closes = toMinutes(BUSINESS_HOURS.weekdays.closes)
    if (minutes >= opens && minutes < closes) {
      return { isOpen: true, label: 'Abierto ahora. Respondemos rapido.' }
    }
    if (minutes < opens) {
      return { isOpen: false, label: `Abrimos hoy a las ${BUSINESS_HOURS.weekdays.opens}` }
    }
    return { isOpen: false, label: `Cerrado. Abrimos mañana a las ${BUSINESS_HOURS.weekdays.opens}` }
  }

  if (day === 6) {
    const opens = toMinutes(BUSINESS_HOURS.saturday.opens)
    const closes = toMinutes(BUSINESS_HOURS.saturday.closes)
    if (minutes >= opens && minutes < closes) {
      return { isOpen: true, label: 'Abierto ahora. Respondemos rapido.' }
    }
    if (minutes < opens) {
      return { isOpen: false, label: `Abrimos hoy a las ${BUSINESS_HOURS.saturday.opens}` }
    }
    return { isOpen: false, label: `Cerrado. Abrimos mañana a las ${BUSINESS_HOURS.sunday.opens}` }
  }

  const opens = toMinutes(BUSINESS_HOURS.sunday.opens)
  const closes = toMinutes(BUSINESS_HOURS.sunday.closes)
  if (minutes >= opens && minutes < closes) {
    return { isOpen: true, label: 'Abierto ahora. Respondemos rapido.' }
  }
  if (minutes < opens) {
    return { isOpen: false, label: `Abrimos hoy a las ${BUSINESS_HOURS.sunday.opens}` }
  }
  return { isOpen: false, label: `Cerrado. Abrimos el lunes a las ${BUSINESS_HOURS.weekdays.opens}` }
}

export function ContactSection() {
  const openStatus = getOpenStatus()

  return (
    <section id="contacto" className="relative overflow-hidden border-t border-white/5 bg-background py-14 md:py-20 lg:py-24" aria-labelledby="contact-title">
      <div className="absolute left-0 top-1/4 h-72 w-72 rounded-full bg-primary/5 blur-3xl lg:h-96 lg:w-96" aria-hidden="true" />
      <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-sky-500/5 blur-3xl lg:h-96 lg:w-96" aria-hidden="true" />

      <div className="container relative z-10 mx-auto px-4 sm:px-6">
        <header className="mb-10 space-y-3 text-center lg:mb-14">
          <span className="section-kicker">Contacto rapido</span>
          <h2 id="contact-title" className="text-3xl font-heading font-extrabold text-white sm:text-4xl xl:text-5xl">
            Habla con nosotros sin complicarte.
          </h2>
          <p className="mx-auto max-w-2xl text-base text-muted-foreground sm:text-lg">
            Resolvemos consultas de utiles, impresiones, maquetas, tramites y estampados.
            Elige el medio mas facil para ti.
          </p>
        </header>

        <div className="grid items-start gap-6 lg:grid-cols-[1.1fr,0.9fr] lg:gap-8">
          <div className="space-y-6">
            <div className="surface-panel p-6 sm:p-8">
              <h3 className="mb-5 text-xl font-bold text-white sm:text-2xl">Elige como contactarnos</h3>

              <div className="space-y-3">
                <Button
                  asChild
                  size="lg"
                  className="min-h-[60px] w-full bg-[#25D366] text-lg font-bold text-slate-950 shadow-lg hover:bg-[#20BA5C]"
                >
                  <a href={getWhatsAppUrl('Hola, quiero informacion sobre utiles, impresiones o tramites')} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="mr-3 h-6 w-6" />
                    Escribenos por WhatsApp
                  </a>
                </Button>

                <Button asChild variant="outline" size="lg" className="min-h-[56px] w-full text-lg font-bold">
                  <a href={getPhoneUrl()} aria-label={`Llamar al ${CONTACT.phone}`}>
                    <Phone className="mr-3 h-5 w-5" />
                    Llamar: {CONTACT.phone}
                  </a>
                </Button>

                <Button asChild variant="ghost" size="lg" className="min-h-[52px] w-full justify-start text-base">
                  <a href={getEmailUrl()} aria-label={`Enviar correo a ${CONTACT.email}`}>
                    <Mail className="mr-3 h-5 w-5" />
                    {CONTACT.email}
                  </a>
                </Button>
              </div>
            </div>

            <div className="surface-card p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-white">Horario de atencion</h3>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-border/50 py-2">
                  <span className="font-medium text-slate-100">Lunes a viernes</span>
                  <span className="font-bold text-primary">{BUSINESS_HOURS.weekdays.hours}</span>
                </div>
                <div className="flex items-center justify-between border-b border-border/50 py-2">
                  <span className="font-medium text-slate-100">Sabados</span>
                  <span className="font-bold text-primary">{BUSINESS_HOURS.saturday.hours}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="font-medium text-slate-100">Domingos</span>
                  <span className="font-medium text-muted-foreground">{BUSINESS_HOURS.sunday.hours}</span>
                </div>
              </div>

              <div className="mt-4 border-t border-border/50 pt-4">
                <div className="flex items-center gap-2">
                  <div className={`h-3 w-3 rounded-full ${openStatus.isOpen ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
                  <span className={`text-sm font-medium ${openStatus.isOpen ? 'text-green-400' : 'text-muted-foreground'}`}>
                    {openStatus.label}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="surface-card p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="mb-1 text-lg font-bold text-white">Nuestra ubicacion</h3>
                  <p className="mb-3 text-muted-foreground">
                    {BUSINESS_INFO.address.street}
                    <br />
                    {BUSINESS_INFO.address.district}, {BUSINESS_INFO.address.city}
                  </p>
                  <p className="text-sm font-medium text-primary">Frente al Colegio Estela Maris</p>
                </div>
              </div>

              <Button asChild variant="outline" className="mt-4 min-h-[48px] w-full font-bold">
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${BUSINESS_INFO.coordinates.lat},${BUSINESS_INFO.coordinates.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Abrir navegacion GPS a nuestra ubicacion"
                >
                  <Navigation className="mr-2 h-5 w-5" />
                  Como llegar
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>

            <div className="surface-card overflow-hidden">
              <div className="flex items-center justify-between border-b border-border/50 bg-white/5 p-4">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" aria-hidden="true" />
                  <span className="text-sm font-bold">Ubicacion en el mapa</span>
                </div>
              </div>

              <div className="relative h-[280px] w-full bg-muted sm:h-[320px] lg:h-[360px]">
                <iframe
                  src={`https://maps.google.com/maps?q=${BUSINESS_INFO.coordinates.lat},${BUSINESS_INFO.coordinates.lng}&z=16&output=embed`}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Mapa de ubicacion de Libreria CHROMA"
                  className="transition-all duration-500 hover:grayscale-0 grayscale-[10%]"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 rounded-2xl bg-gradient-to-r from-primary to-primary/80 p-6 text-center text-primary-foreground shadow-xl lg:mt-14 lg:rounded-3xl lg:p-10">
          <h3 className="mb-3 text-xl font-bold sm:text-2xl lg:text-3xl">
            ¿Quieres cotizar ahora mismo?
          </h3>
          <p className="mx-auto mb-6 max-w-2xl text-base opacity-90 sm:text-lg">
            Envianos tu lista, tu archivo PDF o tu consulta por WhatsApp y te respondemos en minutos.
          </p>
          <Button asChild size="lg" variant="secondary" className="min-h-[56px] px-8 text-lg font-bold shadow-lg transition-transform hover:scale-105">
            <a href={getWhatsAppUrl('Hola, quiero cotizar utiles, impresiones o tramites')} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="mr-2 h-5 w-5" />
              Cotizar por WhatsApp
            </a>
          </Button>
        </div>
      </div>
    </section>
  )
}
