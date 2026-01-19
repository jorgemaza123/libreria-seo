"use client"

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { mockFAQs } from '@/lib/mock-data';
import { CONTACT, getWhatsAppUrl } from '@/lib/constants';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

const quickOptions = [
  { id: '1', label: '📦 Consultar productos', message: 'Hola, quiero consultar sobre productos disponibles' },
  { id: '2', label: '🖨️ Cotizar servicios', message: 'Hola, me interesa cotizar sus servicios' },
  { id: '3', label: '👕 Sublimación', message: 'Hola, quiero información sobre sublimación en polos y tazas' },
  { id: '4', label: '💻 Soporte técnico', message: 'Hola, necesito soporte técnico para mi computadora' },
  { id: '5', label: '📄 Trámites online', message: 'Hola, necesito ayuda con trámites de SUNAT/RENIEC' },
];

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: '¡Hola! 👋 Bienvenido a nuestra tienda. ¿En qué podemos ayudarte hoy?\n\nSelecciona una opción o escríbenos directamente por WhatsApp para una atención más rápida.',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeFAQs = mockFAQs.filter((f) => f.isActive).sort((a, b) => a.order - b.order);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const openWhatsApp = (message: string) => {
    window.open(getWhatsAppUrl(message), '_blank');
  };

  const handleQuickOption = (option: typeof quickOptions[0]) => {
    // Add user message
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        type: 'user',
        content: option.label,
        timestamp: new Date(),
      },
    ]);

    // Add bot response directing to WhatsApp
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          type: 'bot',
          content: '¡Perfecto! Para brindarte una atención personalizada y rápida, te invitamos a contactarnos por WhatsApp. Un asesor te atenderá de inmediato. 📱',
          timestamp: new Date(),
        },
      ]);
    }, 300);

    // Open WhatsApp after a small delay
    setTimeout(() => {
      openWhatsApp(option.message);
    }, 1500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage = inputValue.trim();

    // Add user message
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        type: 'user',
        content: userMessage,
        timestamp: new Date(),
      },
    ]);
    setInputValue('');

    // Find matching FAQ
    const matchingFAQ = activeFAQs.find((faq) =>
      faq.question.toLowerCase().includes(userMessage.toLowerCase()) ||
      userMessage.toLowerCase().includes(faq.question.toLowerCase().split(' ')[0])
    );

    setTimeout(() => {
      if (matchingFAQ) {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            type: 'bot',
            content: `${matchingFAQ.answer}\n\n¿Necesitas más información? ¡Contáctanos por WhatsApp! 📱`,
            timestamp: new Date(),
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            type: 'bot',
            content: 'Gracias por tu mensaje. Para darte una respuesta más completa y personalizada, te invitamos a contactarnos directamente por WhatsApp. ¡Te responderemos al instante! 📱',
            timestamp: new Date(),
          },
        ]);
      }
    }, 600);
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-24 md:bottom-6 right-6 z-50 w-14 h-14 bg-whatsapp text-whatsapp-foreground rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all flex items-center justify-center ${
          isOpen ? 'scale-0' : 'scale-100'
        }`}
        aria-label="Abrir chat"
      >
        <MessageCircle className="w-6 h-6" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-destructive rounded-full animate-pulse" />
      </button>

      {/* Chat Window */}
      <div
        className={`fixed bottom-24 md:bottom-6 right-6 z-50 w-[360px] max-w-[calc(100vw-2rem)] transition-all duration-300 origin-bottom-right ${
          isOpen
            ? 'opacity-100 translate-y-0 scale-100'
            : 'opacity-0 translate-y-4 scale-95 pointer-events-none'
        }`}
      >
        <div className="bg-card rounded-2xl shadow-2xl overflow-hidden border border-border">
          {/* Header */}
          <div className="bg-whatsapp text-whatsapp-foreground p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold">Atención al Cliente</h3>
                <p className="text-xs opacity-90">Respuesta rápida por WhatsApp</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="h-64 overflow-y-auto p-4 space-y-3 bg-muted/30">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.type === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-2xl text-sm whitespace-pre-line ${
                    message.type === 'user'
                      ? 'bg-primary text-primary-foreground rounded-br-md'
                      : 'bg-card text-foreground rounded-bl-md shadow-sm'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Options */}
          <div className="px-4 py-3 border-t border-border bg-card">
            <p className="text-xs text-muted-foreground mb-2">Opciones rápidas:</p>
            <div className="flex flex-wrap gap-2">
              {quickOptions.slice(0, 3).map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleQuickOption(option)}
                  className="text-xs px-3 py-1.5 bg-muted hover:bg-whatsapp/10 hover:text-whatsapp rounded-full transition-colors border border-border"
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* WhatsApp CTA */}
          <div className="px-4 py-3 border-t border-border bg-card">
            <Button
              className="w-full bg-whatsapp hover:bg-whatsapp/90 text-whatsapp-foreground"
              onClick={() => openWhatsApp('Hola, tengo una consulta sobre sus productos y servicios')}
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Chatear por WhatsApp
            </Button>
          </div>

          {/* Input */}
          <form
            onSubmit={handleSubmit}
            className="p-3 border-t border-border bg-muted/30"
          >
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Escribe tu consulta..."
                className="flex-1 h-9 px-3 rounded-full border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-whatsapp transition-all"
              />
              <Button
                type="submit"
                size="icon"
                className="rounded-full bg-whatsapp hover:bg-whatsapp/90 h-9 w-9 text-whatsapp-foreground"
                disabled={!inputValue.trim()}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}