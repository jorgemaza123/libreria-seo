"use client"

import Link from 'next/link';
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, MessageCircle, ArrowRight } from 'lucide-react';
import { mockNavItems, mockCategories } from '@/lib/mock-data';
import { useSiteContent } from '@/contexts/SiteContentContext';
import { BUSINESS_INFO } from '@/lib/constants'; // Solo para coordenadas del mapa

export function Footer() {
  const { effectiveContent } = useSiteContent();
  const { contact, social, footer } = effectiveContent;

  const visibleNavItems = mockNavItems
    .filter((item) => item.isVisible)
    .sort((a, b) => a.order - b.order);

  // Helpers para URLs dinámicas
  const getWhatsAppUrl = (message?: string) => {
    const phone = contact.whatsapp.replace(/\D/g, ''); // Solo números
    const baseUrl = `https://wa.me/${phone}`;
    return message ? `${baseUrl}?text=${encodeURIComponent(message)}` : baseUrl;
  };

  const getPhoneUrl = () => `tel:${contact.phone.replace(/\D/g, '')}`;
  const getEmailUrl = () => `mailto:${contact.email}`;

  // Formatear horarios para mostrar
  const formatHours = (opens: string, closes: string) => {
    return `${opens} - ${closes}`;
  };

  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand & Description */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-heading font-bold text-xl">
                LC
              </div>
              <span className="font-heading font-bold text-xl">
                Librería H & J
              </span>
            </div>
            <p className="text-secondary-foreground/80 text-sm leading-relaxed">
              {footer.description || 'Tu librería de confianza con años de experiencia. Útiles escolares, papelería, impresiones, servicios TI y mucho más.'}
            </p>
            {footer.showSocialLinks && (
              <div className="flex gap-4 pt-2">
                {social.facebook && (
                  <a
                    href={social.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-secondary-foreground/10 hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-colors"
                  >
                    <Facebook className="w-5 h-5" />
                  </a>
                )}
                {social.instagram && (
                  <a
                    href={social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-secondary-foreground/10 hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-colors"
                  >
                    <Instagram className="w-5 h-5" />
                  </a>
                )}
                <a
                  href={getWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-secondary-foreground/10 hover:bg-whatsapp hover:text-whatsapp-foreground flex items-center justify-center transition-colors"
                >
                  <MessageCircle className="w-5 h-5" />
                </a>
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading font-bold text-lg mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              {visibleNavItems.map((item) => (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    className="text-secondary-foreground/70 hover:text-primary transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-heading font-bold text-lg mb-4">Categorías</h3>
            <ul className="space-y-2">
              {mockCategories.slice(0, 6).map((category) => (
                <li key={category.id}>
                  <Link
                    href={`/?category=${category.slug}#productos`}
                    className="text-secondary-foreground/70 hover:text-primary transition-colors flex items-center gap-2"
                  >
                    <span>{category.icon}</span> {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-heading font-bold text-lg mb-4">Contacto</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-secondary-foreground/70 text-sm">
                  {contact.address}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                <a
                  href={getPhoneUrl()}
                  className="text-secondary-foreground/70 hover:text-primary text-sm"
                >
                  {contact.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                <a
                  href={getEmailUrl()}
                  className="text-secondary-foreground/70 hover:text-primary text-sm"
                >
                  {contact.email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div className="text-secondary-foreground/70 text-sm">
                  <p>Lun-Vie: {formatHours(contact.businessHours.weekdays.opens, contact.businessHours.weekdays.closes)}</p>
                  <p>Sábado: {formatHours(contact.businessHours.saturday.opens, contact.businessHours.saturday.closes)}</p>
                  <p>Domingo: {formatHours(contact.businessHours.sunday.opens, contact.businessHours.sunday.closes)}</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Mini Location Map */}
        <div className="mt-8 bg-secondary-foreground/5 rounded-xl overflow-hidden border border-secondary-foreground/10">
          <div className="flex flex-col md:flex-row">
            <div className="flex-1 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-secondary-foreground">Ubícanos</p>
                  <p className="text-xs text-secondary-foreground/70">{contact.address}</p>
                </div>
              </div>
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${BUSINESS_INFO.coordinates.lat},${BUSINESS_INFO.coordinates.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
              >
                Abrir GPS <ArrowRight className="w-3 h-3" />
              </a>
            </div>
            <div className="w-full md:w-64 h-32 bg-muted">
              <iframe
                src={`https://maps.google.com/maps?q=${BUSINESS_INFO.coordinates.lat},${BUSINESS_INFO.coordinates.lng}&z=16&output=embed`}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Ubicación de Librería H & J"
                className="grayscale-[30%] hover:grayscale-0 transition-all duration-300"
              />
            </div>
          </div>
        </div>

        {/* Guarantee Badge */}
        <div className="mt-8 mb-8">
          <div className="flex flex-wrap items-center justify-center gap-6 p-6 bg-secondary-foreground/5 rounded-2xl border border-secondary-foreground/10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                <span className="text-2xl">✓</span>
              </div>
              <div>
                <p className="font-bold text-secondary-foreground">Garantía de Productos Originales</p>
                <p className="text-sm text-secondary-foreground/70">No vendemos imitaciones</p>
              </div>
            </div>
            <div className="hidden md:block h-10 w-px bg-secondary-foreground/20" />
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center">
                <span className="text-2xl">🛡️</span>
              </div>
              <div>
                <p className="font-bold text-secondary-foreground">Compra Segura</p>
                <p className="text-sm text-secondary-foreground/70">Yape, Plin, Efectivo</p>
              </div>
            </div>
            <div className="hidden md:block h-10 w-px bg-secondary-foreground/20" />
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-whatsapp/20 rounded-full flex items-center justify-center">
                <span className="text-2xl">🚚</span>
              </div>
              <div>
                <p className="font-bold text-secondary-foreground">Delivery en VMT</p>
                <p className="text-sm text-secondary-foreground/70">Entrega el mismo día</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-secondary-foreground/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-secondary-foreground/60 text-sm">
            {footer.copyrightText || `© ${new Date().getFullYear()} Librería H & J. Librería multi-servicios.`}
          </p>
          <div className="flex gap-6 text-sm text-secondary-foreground/60">
            <a href="#" className="hover:text-primary transition-colors">
            </a>
            <a href="#" className="hover:text-primary transition-colors">
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
