"use client"

import { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { mockSiteContent } from '@/lib/mock-data';
import { CONTACT, BUSINESS_INFO, BUSINESS_HOURS, getWhatsAppUrl, getPhoneUrl, getEmailUrl } from '@/lib/constants';
import { toast } from 'sonner';

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission - will integrate with backend
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast.success('¡Mensaje enviado!', {
      description: 'Nos pondremos en contacto contigo pronto.',
    });

    setFormData({ name: '', email: '', phone: '', message: '' });
    setIsSubmitting(false);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <section id="contacto" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12 space-y-4">
          <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">
            Estamos Aquí Para Ti
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold">
            {mockSiteContent.contactTitle}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {mockSiteContent.contactSubtitle}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Contact Form */}
          <div className="bg-card rounded-2xl p-6 md:p-8 shadow-sm card-elevated animate-fade-up">
            <h3 className="text-xl font-heading font-bold mb-6">
              Envíanos un Mensaje
            </h3>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium mb-2"
                  >
                    Nombre completo
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full h-12 px-4 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                    placeholder="Tu nombre"
                  />
                </div>
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium mb-2"
                  >
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full h-12 px-4 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                    placeholder="55 1234 5678"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium mb-2"
                >
                  Correo electrónico
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full h-12 px-4 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  placeholder="tu@email.com"
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium mb-2"
                >
                  Mensaje
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-none"
                  placeholder="¿En qué podemos ayudarte?"
                />
              </div>
              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  'Enviando...'
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Enviar Mensaje
                  </>
                )}
              </Button>
            </form>
          </div>

          {/* Contact Info & Map */}
          <div className="space-y-6 animate-fade-up" style={{ animationDelay: '0.2s' }}>
            {/* Quick Contact */}
            <div className="bg-card rounded-2xl p-6 md:p-8 shadow-sm card-elevated">
              <h3 className="text-xl font-heading font-bold mb-6">
                Información de Contacto
              </h3>
              <ul className="space-y-5">
                <li className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Dirección</p>
                    <p className="text-muted-foreground text-sm">
                      {BUSINESS_INFO.address.street}
                      <br />
                      {BUSINESS_INFO.address.city}, {BUSINESS_INFO.address.state},{' '}
                      {BUSINESS_INFO.address.postalCode}
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Teléfono</p>
                    <a
                      href={getPhoneUrl()}
                      className="text-muted-foreground text-sm hover:text-primary transition-colors"
                    >
                      {CONTACT.phone}
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Email</p>
                    <a
                      href={getEmailUrl()}
                      className="text-muted-foreground text-sm hover:text-primary transition-colors"
                    >
                      {CONTACT.email}
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Horario</p>
                    <div className="text-muted-foreground text-sm space-y-1">
                      <p>{BUSINESS_HOURS.weekdays.label}: {BUSINESS_HOURS.weekdays.hours}</p>
                      <p>{BUSINESS_HOURS.saturday.label}: {BUSINESS_HOURS.saturday.hours}</p>
                      <p>{BUSINESS_HOURS.sunday.label}: {BUSINESS_HOURS.sunday.hours}</p>
                    </div>
                  </div>
                </li>
              </ul>
            </div>

            {/* WhatsApp CTA */}
            <Button className="w-full bg-whatsapp hover:bg-whatsapp/90 text-whatsapp-foreground border-none" size="xl" asChild>
              <a
                href={getWhatsAppUrl('Hola, me gustaría obtener información sobre sus productos y servicios.')}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="w-6 h-6 mr-2" />
                Escríbenos por WhatsApp
              </a>
            </Button>

            {/* Map Placeholder */}
            <div className="aspect-video rounded-2xl overflow-hidden bg-muted card-elevated">
              <iframe
                src={`https://maps.google.com/maps?q=${BUSINESS_INFO.coordinates.lat},${BUSINESS_INFO.coordinates.lng}&z=15&output=embed`}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Ubicación de Librería Central"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}