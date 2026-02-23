"use client"

import { MapPin, Phone, Mail, Clock, MessageCircle, ArrowRight, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CONTACT, BUSINESS_INFO, BUSINESS_HOURS, getWhatsAppUrl, getPhoneUrl, getEmailUrl } from '@/lib/constants';

/**
 * Calcula si la librería está abierta ahora mismo según el horario de atención.
 * Usa la hora local del navegador (usuarios son locales en Lima, UTC-5).
 */
function getOpenStatus(): { isOpen: boolean; label: string } {
  const now = new Date()
  const day = now.getDay() // 0=Dom, 1=Lun...6=Sáb
  const minutes = now.getHours() * 60 + now.getMinutes()

  const toMinutes = (hhmm: string) => {
    const [h, m] = hhmm.split(':').map(Number)
    return h * 60 + m
  }

  if (day >= 1 && day <= 5) {
    // Lunes a Viernes
    const opens = toMinutes(BUSINESS_HOURS.weekdays.opens)
    const closes = toMinutes(BUSINESS_HOURS.weekdays.closes)
    if (minutes >= opens && minutes < closes) {
      return { isOpen: true, label: 'Abierto ahora · Respondemos al instante' }
    }
    if (minutes < opens) {
      return { isOpen: false, label: `Abrimos hoy a las ${BUSINESS_HOURS.weekdays.opens.replace('0', '')} AM` }
    }
    return { isOpen: false, label: 'Cerrado · Abrimos mañana a las 7:00 AM' }
  }

  if (day === 6) {
    // Sábado
    const opens = toMinutes(BUSINESS_HOURS.saturday.opens)
    const closes = toMinutes(BUSINESS_HOURS.saturday.closes)
    if (minutes >= opens && minutes < closes) {
      return { isOpen: true, label: 'Abierto ahora · Respondemos al instante' }
    }
    if (minutes < opens) {
      return { isOpen: false, label: `Abrimos hoy a las ${BUSINESS_HOURS.saturday.opens.replace('0', '')} AM` }
    }
    return { isOpen: false, label: 'Cerrado · Abrimos el domingo a las 10:00 AM' }
  }

  // Domingo (day === 0)
  const opens = toMinutes(BUSINESS_HOURS.sunday.opens)
  const closes = toMinutes(BUSINESS_HOURS.sunday.closes)
  if (minutes >= opens && minutes < closes) {
    return { isOpen: true, label: 'Abierto ahora · Respondemos al instante' }
  }
  if (minutes < opens) {
    return { isOpen: false, label: `Abrimos hoy a las ${BUSINESS_HOURS.sunday.opens.replace('0', '')} AM` }
  }
  return { isOpen: false, label: 'Cerrado · Abrimos el lunes a las 7:00 AM' }
}

export function ContactSection() {
  const openStatus = getOpenStatus()

  return (
    <section
      id="contacto"
      className="relative py-12 md:py-20 lg:py-24 overflow-hidden bg-muted/30"
      aria-labelledby="contact-title"
    >
      {/* Background Decorative Elements */}
      <div className="absolute top-1/4 left-0 w-72 h-72 lg:w-96 lg:h-96 bg-primary/5 rounded-full blur-3xl -z-10" aria-hidden="true" />
      <div className="absolute bottom-0 right-0 w-72 h-72 lg:w-96 lg:h-96 bg-blue-500/5 rounded-full blur-3xl -z-10" aria-hidden="true" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Header */}
        <header className="text-center mb-10 lg:mb-16 space-y-3">
          <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold">
            Estamos Aquí Para Ti
          </span>
          <h2
            id="contact-title"
            className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-heading font-bold"
          >
            ¿Necesitas Ayuda?
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            Contáctanos por el medio que prefieras. Respondemos rápido.
          </p>
        </header>

        <div className="grid lg:grid-cols-2 gap-6 lg:gap-10 items-start">

          {/* ===== COLUMNA IZQUIERDA: Contacto Rápido ===== */}
          <div className="space-y-6">

            {/* Tarjeta Principal de Contacto */}
            <div className="bg-card rounded-2xl lg:rounded-3xl p-6 sm:p-8 shadow-lg border border-border/50">
              <h3 className="text-xl sm:text-2xl font-bold mb-6 text-center lg:text-left">
                Contáctanos Ahora
              </h3>

              {/* Botones de Contacto - Grandes y Accesibles */}
              <div className="space-y-4">
                {/* WhatsApp - Botón Principal */}
                <Button
                  asChild
                  size="lg"
                  className="w-full min-h-[60px] text-lg font-bold bg-green-600 hover:bg-green-700 shadow-lg"
                >
                  <a
                    href={getWhatsAppUrl("Hola! Quiero información")}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Enviar mensaje por WhatsApp"
                  >
                    <MessageCircle className="w-6 h-6 mr-3" />
                    Escríbenos por WhatsApp
                  </a>
                </Button>

                {/* Llamar */}
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="w-full min-h-[56px] text-lg font-bold"
                >
                  <a
                    href={getPhoneUrl()}
                    aria-label={`Llamar al ${CONTACT.phone}`}
                  >
                    <Phone className="w-5 h-5 mr-3" />
                    Llamar: {CONTACT.phone}
                  </a>
                </Button>

                {/* Email */}
                <Button
                  asChild
                  variant="ghost"
                  size="lg"
                  className="w-full min-h-[52px] text-base"
                >
                  <a
                    href={getEmailUrl()}
                    aria-label={`Enviar correo a ${CONTACT.email}`}
                  >
                    <Mail className="w-5 h-5 mr-3" />
                    {CONTACT.email}
                  </a>
                </Button>
              </div>
            </div>

            {/* Horarios de Atención */}
            <div className="bg-card rounded-2xl p-6 shadow-md border border-border/50">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-lg font-bold">Horario de Atención</h3>
              </div>

              <div className="space-y-3">
                {/* Lunes a Viernes */}
                <div className="flex justify-between items-center py-2 border-b border-border/50">
                  <span className="font-medium">Lunes a Viernes</span>
                  <span className="text-primary font-bold">{BUSINESS_HOURS.weekdays.hours}</span>
                </div>
                {/* Sábados */}
                <div className="flex justify-between items-center py-2 border-b border-border/50">
                  <span className="font-medium">Sábados</span>
                  <span className="text-primary font-bold">{BUSINESS_HOURS.saturday.hours}</span>
                </div>
                {/* Domingos */}
                <div className="flex justify-between items-center py-2">
                  <span className="font-medium">Domingos</span>
                  <span className="text-muted-foreground font-medium">{BUSINESS_HOURS.sunday.hours}</span>
                </div>
              </div>

              {/* Indicador de estado dinámico según horario real */}
              <div className="mt-4 pt-4 border-t border-border/50">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${openStatus.isOpen ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
                  <span className={`text-sm font-medium ${openStatus.isOpen ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'}`}>
                    {openStatus.label}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ===== COLUMNA DERECHA: Mapa y Dirección ===== */}
          <div className="space-y-6">

            {/* Dirección */}
            <div className="bg-card rounded-2xl p-6 shadow-md border border-border/50">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold mb-1">Nuestra Ubicación</h3>
                  <p className="text-muted-foreground mb-3">
                    {BUSINESS_INFO.address.street}<br />
                    {BUSINESS_INFO.address.district}, {BUSINESS_INFO.address.city}
                  </p>
                  <p className="text-sm text-primary font-medium">
                    📍 Frente al Colegio Estela Maris
                  </p>
                </div>
              </div>

              {/* Botón Cómo Llegar */}
              <Button
                asChild
                variant="outline"
                className="w-full mt-4 min-h-[48px] font-bold"
              >
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${BUSINESS_INFO.coordinates.lat},${BUSINESS_INFO.coordinates.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Abrir navegación GPS a nuestra ubicación"
                >
                  <Navigation className="w-5 h-5 mr-2" />
                  Cómo Llegar (GPS)
                  <ArrowRight className="w-4 h-4 ml-2" />
                </a>
              </Button>
            </div>

            {/* Mapa */}
            <div className="bg-card rounded-2xl lg:rounded-3xl overflow-hidden shadow-lg border border-border/50">
              <div className="p-4 bg-muted/50 border-b border-border/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" aria-hidden="true" />
                  <span className="text-sm font-bold">Ubicación en el Mapa</span>
                </div>
              </div>

              <div className="relative w-full h-[280px] sm:h-[320px] lg:h-[350px] bg-muted">
                <iframe
                  src={`https://maps.google.com/maps?q=${BUSINESS_INFO.coordinates.lat},${BUSINESS_INFO.coordinates.lng}&z=16&output=embed`}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Mapa de ubicación de Librería CHROMA"
                  className="grayscale-[10%] hover:grayscale-0 transition-all duration-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ===== BANNER INFERIOR - CTA Final ===== */}
        <div className="mt-10 lg:mt-16 bg-gradient-to-r from-primary to-primary/80 rounded-2xl lg:rounded-3xl p-6 sm:p-8 lg:p-10 text-center text-primary-foreground shadow-xl">
          <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-3">
            ¿Tienes una lista escolar?
          </h3>
          <p className="text-base sm:text-lg opacity-90 mb-6 max-w-2xl mx-auto">
            Envíanos una foto de tu lista por WhatsApp y te la cotizamos gratis en minutos.
          </p>
          <Button
            asChild
            size="lg"
            variant="secondary"
            className="min-h-[56px] px-8 text-lg font-bold shadow-lg hover:scale-105 transition-transform"
          >
            <a
              href={getWhatsAppUrl("Hola! Quiero enviar mi lista escolar para cotizar")}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Enviar Lista por WhatsApp
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
