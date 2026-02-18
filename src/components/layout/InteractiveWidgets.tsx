"use client"

import dynamic from 'next/dynamic'

const ChatBot = dynamic(() => import('@/components/chat/ChatBot').then(mod => ({ default: mod.ChatBot })), {
  ssr: false,
})
const FloatingCart = dynamic(() => import('@/components/cart/FloatingCart').then(mod => ({ default: mod.FloatingCart })), {
  ssr: false,
})
const StickyContactBar = dynamic(() => import('@/components/layout/StickyContactBar').then(mod => ({ default: mod.StickyContactBar })), {
  ssr: false,
})

export function InteractiveWidgets() {
  return (
    <>
      <ChatBot />
      <FloatingCart />
      <StickyContactBar />
    </>
  )
}
