import Link from 'next/link';
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, MessageCircle } from 'lucide-react';
import { mockNavItems, mockCategories } from '@/lib/mock-data';
import { CONTACT, BUSINESS_INFO, BUSINESS_HOURS, SOCIAL_MEDIA, getWhatsAppUrl, getPhoneUrl, getEmailUrl } from '@/lib/constants';

export function Footer() {
  const visibleNavItems = mockNavItems
    .filter((item) => item.isVisible)
    .sort((a, b) => a.order - b.order);

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
              Tu librería de confianza con más de 20 años de experiencia.
              Útiles escolares, papelería, impresiones, servicios TI y mucho más.
            </p>
            <div className="flex gap-4 pt-2">
              {SOCIAL_MEDIA.facebook && (
                <a
                  href={SOCIAL_MEDIA.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-secondary-foreground/10 hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-colors"
                >
                  <Facebook className="w-5 h-5" />
                </a>
              )}
              {SOCIAL_MEDIA.instagram && (
                <a
                  href={SOCIAL_MEDIA.instagram}
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
                    href={`/#productos?category=${category.slug}`}
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
                  {BUSINESS_INFO.address.street}
                  <br />
                  {BUSINESS_INFO.address.city}, {BUSINESS_INFO.address.state}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                <a
                  href={getPhoneUrl()}
                  className="text-secondary-foreground/70 hover:text-primary text-sm"
                >
                  {CONTACT.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                <a
                  href={getEmailUrl()}
                  className="text-secondary-foreground/70 hover:text-primary text-sm"
                >
                  {CONTACT.email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div className="text-secondary-foreground/70 text-sm">
                  <p>{BUSINESS_HOURS.weekdays.label}: {BUSINESS_HOURS.weekdays.hours}</p>
                  <p>{BUSINESS_HOURS.saturday.label}: {BUSINESS_HOURS.saturday.hours}</p>
                  <p>{BUSINESS_HOURS.sunday.label}: {BUSINESS_HOURS.sunday.hours}</p>
                </div>
              </li>
            </ul>
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
            © {new Date().getFullYear()} Librería H & J. Todos los derechos reservados.
          </p>
          <div className="flex gap-6 text-sm text-secondary-foreground/60">
            <a href="#" className="hover:text-primary transition-colors">
              Aviso de Privacidad
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Términos y Condiciones
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}