'use client'

/**
 * Cosmatch BottomSheet — slide-up panel ze spoda, draggable.
 * Lightweight (~100 LOC), žádné deps.
 *
 *   <BottomSheet open={open} onClose={() => setOpen(false)} title="Filtr">
 *     {content}
 *   </BottomSheet>
 *
 * iOS-style: rounded top, grip handle, swipe-down to close.
 */

import { useEffect, useRef, useState } from 'react'

export function BottomSheet({
  open,
  onClose,
  title,
  children,
  maxHeight = '85vh',
}: {
  open: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  maxHeight?: string
}) {
  const sheetRef = useRef<HTMLDivElement>(null)
  const [dragY, setDragY] = useState(0)
  const startY = useRef<number | null>(null)

  useEffect(() => {
    if (!open) return
    // Lock body scroll when open
    const original = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = original }
  }, [open])

  // Close on Escape
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  function onTouchStart(e: React.TouchEvent) {
    startY.current = e.touches[0].clientY
  }
  function onTouchMove(e: React.TouchEvent) {
    if (startY.current === null) return
    const dy = e.touches[0].clientY - startY.current
    if (dy < 0) return // resist upward drag
    setDragY(Math.min(400, dy))
  }
  function onTouchEnd() {
    if (dragY > 100) {
      onClose()
    }
    setDragY(0)
    startY.current = null
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        style={{ opacity: 1 - dragY / 400 }}
        onClick={onClose}
      />

      {/* Sheet */}
      <div
        ref={sheetRef}
        className="absolute inset-x-0 bottom-0 bg-[#FAF6F0] rounded-t-3xl shadow-2xl flex flex-col"
        style={{
          maxHeight,
          transform: `translateY(${dragY}px)`,
          transition: startY.current === null ? 'transform 280ms cubic-bezier(0.16, 1, 0.3, 1)' : 'none',
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}
      >
        {/* Grip handle (draggable) */}
        <div
          className="pt-2.5 pb-3 flex justify-center cursor-grab active:cursor-grabbing"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <div className="w-9 h-1 bg-gray-300 rounded-full" />
        </div>

        {/* Title */}
        {title && (
          <div className="px-6 pb-3">
            <h3 className="serif-display text-2xl text-gray-900 font-medium leading-tight">{title}</h3>
          </div>
        )}

        {/* Content (scrollable) */}
        <div className="overflow-y-auto px-6 pb-8 flex-1">
          {children}
        </div>
      </div>
    </div>
  )
}
