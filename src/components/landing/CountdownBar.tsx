"use client"

import { useEffect, useState } from 'react'
import { Clock, X } from 'lucide-react'

interface TimeLeft {
  days: number
  hours: number
  minutes: number
}

interface CountdownBarProps {
  /** Target date in ISO format, e.g. "2026-03-15T23:59:59" */
  targetDate: string
  /** Main urgency text */
  text?: string
  /** Secondary text */
  subtext?: string
}

function getTimeLeft(target: string): TimeLeft | null {
  const diff = new Date(target).getTime() - Date.now()
  if (diff <= 0) return null
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
  }
}

export function CountdownBar({
  targetDate,
  text = 'Campaña Escolar hasta 15 de marzo',
  subtext = 'Envío GRATIS en compras mayores a S/200',
}: CountdownBarProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null)
  const [dismissed, setDismissed] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setTimeLeft(getTimeLeft(targetDate))
    const interval = setInterval(() => {
      const tl = getTimeLeft(targetDate)
      if (!tl) {
        clearInterval(interval)
        setTimeLeft(null)
        return
      }
      setTimeLeft(tl)
    }, 60_000) // Update every minute
    return () => clearInterval(interval)
  }, [targetDate])

  if (!mounted || !timeLeft || dismissed) return null

  return (
    <div className="relative z-50 bg-red-900 text-white overflow-hidden">
      {/* Pulse overlay */}
      <div className="absolute inset-0 bg-red-700/30 animate-pulse pointer-events-none" />

      <div className="container mx-auto px-4 py-2.5 relative">
        <div className="flex items-center justify-center gap-3 sm:gap-6 text-center flex-wrap">
          {/* Urgency text */}
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 flex-shrink-0 animate-pulse" />
            <span className="text-xs sm:text-sm font-bold">{text}</span>
          </div>

          {/* Countdown */}
          <div className="flex items-center gap-1.5">
            <CountdownUnit value={timeLeft.days} label="días" />
            <span className="text-red-300 font-bold text-xs">:</span>
            <CountdownUnit value={timeLeft.hours} label="hrs" />
            <span className="text-red-300 font-bold text-xs">:</span>
            <CountdownUnit value={timeLeft.minutes} label="min" />
          </div>

          {/* Subtext */}
          <span className="hidden sm:inline text-xs text-red-200 font-medium">
            {subtext}
          </span>
        </div>

        {/* Dismiss */}
        <button
          onClick={() => setDismissed(true)}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full hover:bg-white/10 transition-colors"
          aria-label="Cerrar"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center bg-black/30 rounded-md px-2 py-1 min-w-[40px]">
      <span className="text-sm sm:text-base font-extrabold tabular-nums leading-none">
        {String(value).padStart(2, '0')}
      </span>
      <span className="text-[9px] uppercase tracking-wider text-red-300 leading-none mt-0.5">
        {label}
      </span>
    </div>
  )
}
