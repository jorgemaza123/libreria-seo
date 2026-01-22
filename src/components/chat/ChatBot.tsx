"use client"

import { useState, useRef, useEffect } from 'react';
import { X, Send, MessagesSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { mockFAQs } from '@/lib/mock-data';
import { useWhatsApp } from '@/hooks/use-whatsapp';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

const quickOptions = [
  { id: '1', label: '📦 Productos', message: 'Hola, quiero consultar sobre productos disponibles' },
  { id: '2', label: '🖨️ Servicios', message: 'Hola, me interesa cotizar sus servicios' },
  { id: '3', label: '👕 Sublimación', message: 'Hola, quiero información sobre sublimación' },
];

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content:
        '¡Hola! 👋 Bienvenido.\n\nPuedo orientarte aquí o derivarte a WhatsApp para una atención inmediata.',
      timestamp: new Date(),
    },
  ]);

  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { getWhatsAppUrl } = useWhatsApp();

  const activeFAQs = mockFAQs
    .filter((f) => f.isActive)
    .sort((a, b) => a.order - b.order);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const openWhatsApp = (message: string) => {
    window.open(getWhatsAppUrl(message), '_blank');
  };

  const handleQuickOption = (option: typeof quickOptions[0]) => {
    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), type: 'user', content: option.label, timestamp: new Date() },
    ]);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          type: 'bot',
          content:
            'Perfecto 👍 Para ayudarte mejor, continuemos por WhatsApp con un asesor.',
          timestamp: new Date(),
        },
      ]);
      openWhatsApp(option.message);
    }, 600);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage = inputValue.trim();
    setInputValue('');

    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), type: 'user', content: userMessage, timestamp: new Date() },
    ]);

    const matchingFAQ = activeFAQs.find((faq) =>
      userMessage.toLowerCase().includes(faq.question.toLowerCase())
    );

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          type: 'bot',
          content: matchingFAQ
            ? `${matchingFAQ.answer}\n\n¿Continuamos por WhatsApp?`
            : 'Para una respuesta más precisa, conversemos directamente por WhatsApp 😊',
          timestamp: new Date(),
        },
      ]);
    }, 500);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-24 md:bottom-6 right-6 z-50 w-14 h-14 rounded-full
        bg-whatsapp text-white shadow-lg transition-all duration-300
        flex items-center justify-center ${
          isOpen ? 'scale-0' : 'scale-100'
        }`}
        aria-label="Abrir chat"
      >
        <MessagesSquare className="w-6 h-6" />
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full" />
      </button>

      {/* Chat Window */}
      <div
        className={`fixed bottom-24 md:bottom-6 right-6 z-50 w-[340px] max-w-[90vw]
        transition-all duration-300 origin-bottom-right ${
          isOpen
            ? 'opacity-100 scale-100 translate-y-0'
            : 'opacity-0 scale-95 translate-y-4 pointer-events-none'
        }`}
      >
        <div className="bg-card rounded-2xl shadow-2xl border border-border overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-whatsapp text-white">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                <MessagesSquare className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold leading-tight">Atención inmediata</p>
                <span className="text-xs opacity-90">Vía WhatsApp</span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-full hover:bg-white/20 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="h-60 overflow-y-auto px-4 py-3 space-y-3 bg-muted/30">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[80%] text-sm px-3 py-2 rounded-xl leading-relaxed ${
                    msg.type === 'user'
                      ? 'bg-primary text-primary-foreground rounded-br-md'
                      : 'bg-card border border-border'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Options */}
          <div className="px-4 py-3 border-t border-border bg-card">
            <div className="flex flex-wrap gap-2">
              {quickOptions.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => handleQuickOption(opt)}
                  className="text-xs px-3 py-1.5 rounded-full
                  border border-border bg-muted text-foreground
                  transition-colors hover:bg-whatsapp/10"
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-3 border-t border-border bg-muted/40">
            <div className="flex gap-2">
              <input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Escribe tu mensaje..."
                className="flex-1 h-9 px-3 rounded-full border border-input text-sm
                focus:outline-none focus:ring-2 focus:ring-whatsapp"
              />
              <Button
                type="submit"
                size="icon"
                disabled={!inputValue.trim()}
                className="h-9 w-9 rounded-full bg-whatsapp text-white"
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
