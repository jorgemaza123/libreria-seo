"use client"

import { useEffect, useState } from 'react'
import { ArrowUp, ChevronRight, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useWhatsApp } from '@/hooks/use-whatsapp'
import { useChatContext } from '@/contexts/ChatContext'

const SALES_PROMPTS = [
  'Envianos tu tarea ahora',
  'Cotiza impresiones en minutos',
  'Quieres regalar algo personalizado?',
  'Mandanos tu lista escolar',
  'Te ayudamos con maquetas y tramites',
  'Pide tu taza, polo o sticker hoy',
] as const

function WhatsAppGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

export function StickyContactBar() {
  const [isVisible, setIsVisible] = useState(false)
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [isDeepScroll, setIsDeepScroll] = useState(false)
  const [promptIdx, setPromptIdx] = useState(0)
  const [promptVisible, setPromptVisible] = useState(true)
  const { getPhoneUrl } = useWhatsApp()
  const { openChat, isOpen: isChatOpen } = useChatContext()

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 400)
      setShowScrollTop(window.scrollY > 1000)
      const scrollable = document.documentElement.scrollHeight - window.innerHeight

      if (scrollable > 0) {
        setIsDeepScroll(window.scrollY / scrollable >= 0.8)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    let swap: number | null = null

    const intervalId = window.setInterval(() => {
      setPromptVisible(false)
      swap = window.setTimeout(() => {
        setPromptIdx((current) => (current + 1) % SALES_PROMPTS.length)
        setPromptVisible(true)
      }, 220)
    }, 3600)

    return () => {
      window.clearInterval(intervalId)
      if (swap !== null) {
        window.clearTimeout(swap)
      }
    }
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <>
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-background/94 shadow-lg transition-transform duration-300 backdrop-blur-xl lg:hidden ${
          isVisible && !isChatOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="relative px-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3">
          <div
            className={`pointer-events-none absolute bottom-full right-3 mb-2 max-w-[238px] transition-all duration-300 ${
              isVisible && !isChatOpen ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
            }`}
            aria-hidden="true"
          >
            <div className="sticky-wa-bubble relative overflow-hidden rounded-2xl border border-emerald-400/20 bg-[#0b1711]/88 px-3 py-2.5 text-[11px] font-semibold text-emerald-50 shadow-[0_18px_40px_rgba(0,0,0,0.24)] backdrop-blur-xl">
              <span className="absolute inset-0 bg-[linear-gradient(135deg,rgba(45,212,122,0.18)_0%,rgba(45,212,122,0.02)_52%,rgba(255,255,255,0.06)_100%)]" />
              <span className="relative flex items-center gap-2">
                <span className="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-300 shadow-[0_0_12px_rgba(74,222,128,0.85)] animate-pulse" />
                <span
                  className={`block transition-all duration-300 ${
                    promptVisible ? 'translate-y-0 opacity-100' : 'translate-y-1 opacity-0'
                  }`}
                >
                  {SALES_PROMPTS[promptIdx]}
                </span>
              </span>
            </div>
          </div>

          <div className="flex items-end gap-2">
            <Button
              variant="secondary"
              className="h-14 flex-1 border border-white/12 bg-card text-foreground shadow-sm transition-all touch-manipulation active:scale-[0.98]"
              asChild
            >
              <a href={getPhoneUrl()}>
                <Phone className="mr-2 h-5 w-5" />
                Llamar
              </a>
            </Button>

            <button
              type="button"
              onClick={openChat}
              aria-label="Abrir cotizacion por WhatsApp"
              className="group sticky-wa-button relative flex h-14 flex-[1.22] items-center gap-3 overflow-hidden rounded-2xl border border-white/10 bg-[linear-gradient(135deg,#34e27a_0%,#25D366_56%,#18b45b_100%)] px-3.5 text-left text-slate-950 shadow-[0_16px_34px_rgba(37,211,102,0.30)] transition-all duration-300 active:scale-[0.985]"
            >
              <span className="absolute inset-0 bg-[linear-gradient(120deg,transparent_0%,rgba(255,255,255,0.10)_34%,rgba(255,255,255,0.40)_50%,rgba(255,255,255,0.10)_66%,transparent_100%)] animate-[sticky-wa-sheen_3.4s_ease-in-out_infinite]" />
              <span className="absolute inset-x-5 bottom-0 h-4 rounded-full bg-black/12 blur-xl" />
              <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-950/12 ring-1 ring-white/20 backdrop-blur-sm transition-transform duration-300 group-active:scale-95">
                <WhatsAppGlyph className="h-5 w-5" />
              </span>
              <span className="relative min-w-0 flex-1 leading-none">
                <span className="block text-[13px] font-extrabold uppercase tracking-[0.03em]">
                  {isDeepScroll ? 'Pedir hoy' : 'Cotizar ahora'}
                </span>
                <span
                  className={`mt-1 block truncate text-[11px] font-semibold text-slate-950/72 transition-all duration-300 ${
                    promptVisible ? 'translate-y-0 opacity-100' : 'translate-y-1 opacity-60'
                  }`}
                >
                  {SALES_PROMPTS[promptIdx]}
                </span>
              </span>
              <ChevronRight className="relative h-4 w-4 shrink-0 transition-transform duration-300 group-active:translate-x-0.5" />
            </button>
          </div>
        </div>
      </div>

      <button
        onClick={scrollToTop}
        className={`fixed bottom-[88px] left-4 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-background/90 shadow-lg transition-all duration-300 touch-manipulation lg:bottom-8 lg:left-auto lg:right-8 lg:h-12 lg:w-12 ${
          !showScrollTop || isChatOpen ? 'max-lg:pointer-events-none max-lg:translate-y-4 max-lg:opacity-0' : ''
        } ${showScrollTop ? 'lg:translate-y-0 lg:opacity-100' : 'pointer-events-none translate-y-4 opacity-0'}`}
        aria-label="Volver arriba"
      >
        <ArrowUp className="h-5 w-5 text-muted-foreground" />
      </button>

      <style jsx global>{`
        @keyframes sticky-wa-sheen {
          0%,
          16% {
            transform: translateX(-140%);
          }
          34%,
          100% {
            transform: translateX(140%);
          }
        }

        @keyframes sticky-wa-float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-3px);
          }
        }

        .sticky-wa-button {
          animation: sticky-wa-float 2.6s ease-in-out infinite;
        }

        .sticky-wa-bubble {
          animation: sticky-wa-float 3.2s ease-in-out infinite;
        }
      `}</style>
    </>
  )
}
