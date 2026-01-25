"use client"

import { useState, useRef, useEffect, useCallback } from 'react'
import {
  MessageCircle,
  X,
  Send,
  ExternalLink,
  Sparkles,
  ShoppingBag,
  Printer,
  HelpCircle,
  Clock,
  ChevronRight,
} from 'lucide-react'
import { useWhatsApp } from '@/hooks/use-whatsapp'

type MessageType = 'bot' | 'user' | 'typing' | 'action'

interface Message {
  id: string
  type: MessageType
  content: string
  timestamp: Date
  action?: {
    label: string
    whatsappMessage: string
  }
}

interface QuickOption {
  id: string
  icon: React.ReactNode
  label: string
  shortLabel: string
  whatsappMessage: string
  description: string
}

const QUICK_OPTIONS: QuickOption[] = [
  {
    id: 'productos',
    icon: <ShoppingBag className="w-5 h-5" />,
    label: 'Ver Productos',
    shortLabel: 'Productos',
    whatsappMessage: 'Hola, quiero consultar sobre productos disponibles y precios.',
    description: 'Catálogo y precios',
  },
  {
    id: 'servicios',
    icon: <Printer className="w-5 h-5" />,
    label: 'Servicios de Impresión',
    shortLabel: 'Impresión',
    whatsappMessage: 'Hola, me interesa cotizar servicios de impresión y copias.',
    description: 'Copias, impresiones, planos',
  },
  {
    id: 'sublimacion',
    icon: <Sparkles className="w-5 h-5" />,
    label: 'Sublimación',
    shortLabel: 'Sublimación',
    whatsappMessage: 'Hola, quiero información sobre sublimación personalizada.',
    description: 'Personalización textil',
  },
  {
    id: 'ayuda',
    icon: <HelpCircle className="w-5 h-5" />,
    label: 'Otra Consulta',
    shortLabel: 'Ayuda',
    whatsappMessage: 'Hola, tengo una consulta.',
    description: 'Hablar con un asesor',
  },
]

const WELCOME_MESSAGE = `¡Hola! Soy tu asistente virtual.

¿En qué puedo ayudarte hoy? Selecciona una opción o escribe tu consulta y te conectaré con un asesor por WhatsApp.`

const TYPING_DELAY = 600
const RESPONSE_MESSAGES = [
  'Entendido. Te conecto ahora mismo con un asesor para atenderte mejor.',
  'Perfecto. Un asesor te ayudará por WhatsApp en segundos.',
  'Listo. Te redirijo a WhatsApp para una atención personalizada.',
]

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const { getWhatsAppUrl } = useWhatsApp()

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: 'welcome',
          type: 'bot',
          content: WELCOME_MESSAGE,
          timestamp: new Date(),
        },
      ])
    }
  }, [isOpen, messages.length])

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping, scrollToBottom])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300)
    }
  }, [isOpen])

  const openWhatsApp = useCallback(
    (message: string) => {
      const url = getWhatsAppUrl(message)
      window.open(url, '_blank', 'noopener,noreferrer')
    },
    [getWhatsAppUrl]
  )

  const getRandomResponse = () => {
    return RESPONSE_MESSAGES[Math.floor(Math.random() * RESPONSE_MESSAGES.length)]
  }

  const addBotResponse = useCallback(
    (whatsappMessage: string, autoOpen = true) => {
      setIsTyping(true)

      setTimeout(() => {
        setIsTyping(false)
        setMessages((prev) => [
          ...prev,
          {
            id: `bot-${Date.now()}`,
            type: 'bot',
            content: getRandomResponse(),
            timestamp: new Date(),
            action: {
              label: 'Continuar en WhatsApp',
              whatsappMessage,
            },
          },
        ])

        if (autoOpen) {
          setTimeout(() => openWhatsApp(whatsappMessage), 400)
        }
      }, TYPING_DELAY)
    },
    [openWhatsApp]
  )

  const handleQuickOption = useCallback(
    (option: QuickOption) => {
      setHasInteracted(true)

      setMessages((prev) => [
        ...prev,
        {
          id: `user-${Date.now()}`,
          type: 'user',
          content: option.label,
          timestamp: new Date(),
        },
      ])

      addBotResponse(option.whatsappMessage, true)
    },
    [addBotResponse]
  )

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      const text = inputValue.trim()
      if (!text) return

      setHasInteracted(true)
      setInputValue('')

      setMessages((prev) => [
        ...prev,
        {
          id: `user-${Date.now()}`,
          type: 'user',
          content: text,
          timestamp: new Date(),
        },
      ])

      const whatsappMessage = `Hola, mi consulta es: ${text}`
      addBotResponse(whatsappMessage, true)
    },
    [inputValue, addBotResponse]
  )

  const handleActionClick = useCallback(
    (action: Message['action']) => {
      if (action) {
        openWhatsApp(action.whatsappMessage)
      }
    },
    [openWhatsApp]
  )

  const toggleChat = useCallback(() => {
    setIsOpen((prev) => !prev)
  }, [])

  return (
    <>
      <button
        onClick={toggleChat}
        className={`
          fixed z-50 items-center justify-center
          rounded-full shadow-2xl
          transition-all duration-300 ease-out
          bg-gradient-to-br from-green-500 to-green-600
          hover:from-green-600 hover:to-green-700
          active:scale-95
          focus:outline-none focus:ring-4 focus:ring-green-500/30
          ${isOpen ? 'scale-0 opacity-0 hidden' : 'scale-100 opacity-100'}
          hidden lg:flex
          bottom-6 right-6
          w-[68px] h-[68px]
        `}
        aria-label="Abrir asistente de ventas"
        aria-expanded={isOpen}
      >
        <MessageCircle className="w-8 h-8 text-white" />

        <span className="absolute -top-0.5 -right-0.5 flex h-5 w-5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-5 w-5 bg-red-500 items-center justify-center">
            <span className="text-[10px] font-bold text-white">1</span>
          </span>
        </span>
      </button>

      <div
        className={`
          fixed z-50 flex-col
          bg-white dark:bg-zinc-900
          rounded-3xl
          shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]
          border border-zinc-200 dark:border-zinc-800
          overflow-hidden
          transition-all duration-300 ease-out origin-bottom-right
          ${isOpen
            ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto lg:flex'
            : 'opacity-0 scale-95 translate-y-4 pointer-events-none'
          }
          hidden
          bottom-6 right-6
          w-[400px] h-[520px]
        `}
        role="dialog"
        aria-modal="true"
        aria-label="Asistente de ventas"
      >
        <header className="flex items-center justify-between px-4 py-3 md:px-5 md:py-4 bg-gradient-to-r from-green-500 to-green-600 text-white flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-11 h-11 md:w-12 md:h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <MessageCircle className="w-6 h-6 md:w-7 md:h-7" />
              </div>
              <span className="absolute bottom-0 right-0 block h-3.5 w-3.5 rounded-full bg-emerald-400 ring-2 ring-white">
                <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-75" />
              </span>
            </div>
            <div>
              <h2 className="font-bold text-lg md:text-xl leading-tight">
                Asistente de Ventas
              </h2>
              <div className="flex items-center gap-1.5 text-green-100">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-300" />
                </span>
                <span className="text-sm font-medium">En línea ahora</span>
              </div>
            </div>
          </div>

          <button
            onClick={toggleChat}
            className="w-11 h-11 md:w-12 md:h-12 rounded-full hover:bg-white/20 active:bg-white/30 transition-colors flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-white/50"
            aria-label="Cerrar chat"
          >
            <X className="w-6 h-6 md:w-7 md:h-7" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-4 py-4 md:px-5 space-y-4 bg-zinc-50 dark:bg-zinc-950">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`
                  max-w-[85%] rounded-2xl px-4 py-3
                  text-[15px] md:text-base leading-relaxed
                  ${msg.type === 'user'
                    ? 'bg-green-500 text-white rounded-br-md'
                    : 'bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700 rounded-bl-md shadow-sm'
                  }
                `}
              >
                <p className="whitespace-pre-line">{msg.content}</p>

                {msg.action && (
                  <button
                    onClick={() => handleActionClick(msg.action)}
                    className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-green-500 hover:bg-green-600 active:bg-green-700 text-white font-semibold text-[15px] transition-colors focus:outline-none focus:ring-2 focus:ring-green-500/50"
                    aria-label="Continuar conversación en WhatsApp"
                  >
                    <ExternalLink className="w-4 h-4" />
                    {msg.action.label}
                  </button>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-2.5 h-2.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-2.5 h-2.5 bg-zinc-400 rounded-full animate-bounce" />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {!hasInteracted && (
          <div className="px-4 py-3 md:px-5 md:py-4 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex-shrink-0">
            <p className="text-xs md:text-sm text-zinc-500 dark:text-zinc-400 mb-3 font-medium">
              Selecciona una opción rápida:
            </p>
            <div className="grid grid-cols-2 gap-2">
              {QUICK_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleQuickOption(option)}
                  className="flex items-center gap-2.5 px-3 py-3 md:py-3.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 hover:bg-green-50 dark:hover:bg-green-900/20 hover:border-green-300 dark:hover:border-green-700 transition-all text-left group focus:outline-none focus:ring-2 focus:ring-green-500/50"
                  aria-label={`${option.label}: ${option.description}`}
                >
                  <span className="flex-shrink-0 w-9 h-9 md:w-10 md:h-10 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center group-hover:bg-green-200 dark:group-hover:bg-green-900/50 transition-colors">
                    {option.icon}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-sm md:text-[15px] text-zinc-800 dark:text-zinc-100 truncate">
                      {option.shortLabel}
                    </p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
                      {option.description}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:text-green-500 flex-shrink-0 transition-colors" />
                </button>
              ))}
            </div>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="px-4 py-3 md:px-5 md:py-4 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex-shrink-0"
        >
          <div className="flex items-center gap-2 md:gap-3">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Escribe tu consulta..."
              disabled={isTyping}
              className="flex-1 h-12 md:h-14 px-4 md:px-5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 text-[15px] md:text-base focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              aria-label="Escribe tu consulta"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isTyping}
              className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-green-500 hover:bg-green-600 active:bg-green-700 disabled:bg-zinc-300 dark:disabled:bg-zinc-700 disabled:cursor-not-allowed text-white flex items-center justify-center transition-all focus:outline-none focus:ring-2 focus:ring-green-500/50"
              aria-label="Enviar mensaje"
            >
              <Send className="w-5 h-5 md:w-6 md:h-6" />
            </button>
          </div>

          <div className="flex items-center justify-center gap-1.5 mt-3 text-xs text-zinc-400 dark:text-zinc-500">
            <Clock className="w-3.5 h-3.5" />
            <span>Respuesta inmediata por WhatsApp</span>
          </div>
        </form>
      </div>

    </>
  )
}
