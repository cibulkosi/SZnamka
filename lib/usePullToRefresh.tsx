/**
 * usePullToRefresh — touch-based pull-to-refresh hook.
 * Funguje v PWA i v Capacitor native bez extra knihovny.
 *
 * Použití:
 *   const { pullState } = usePullToRefresh(scrollRef, async () => {
 *     await reloadData()
 *   })
 *
 *   {pullState.pulling && <PullIndicator distance={pullState.distance} />}
 *
 * Triggers při pull > 80px, scrollTop = 0.
 * Respektuje prefers-reduced-motion (deaktivuje pulse).
 */

import { useEffect, useRef, useState, RefObject } from 'react'

export type PullState = {
  pulling: boolean
  distance: number      // pixels od top
  triggered: boolean    // crossed threshold
}

const THRESHOLD = 80
const MAX_PULL = 140

export function usePullToRefresh(
  containerRef: RefObject<HTMLElement | null>,
  onRefresh: () => Promise<void> | void,
) {
  const [pullState, setPullState] = useState<PullState>({ pulling: false, distance: 0, triggered: false })
  const startY = useRef<number | null>(null)
  const refreshing = useRef(false)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    function onTouchStart(e: TouchEvent) {
      if (!el || refreshing.current) return
      if (el.scrollTop > 0) return
      startY.current = e.touches[0].clientY
    }

    function onTouchMove(e: TouchEvent) {
      if (!el || startY.current === null || refreshing.current) return
      const dy = e.touches[0].clientY - startY.current
      if (dy < 0) {
        // Scroll up — abort pull
        startY.current = null
        setPullState({ pulling: false, distance: 0, triggered: false })
        return
      }
      // Rubber band: log scaling
      const distance = Math.min(MAX_PULL, dy * 0.6)
      setPullState({
        pulling: true,
        distance,
        triggered: distance >= THRESHOLD,
      })
      if (distance > 20) e.preventDefault() // prevent default scroll
    }

    async function onTouchEnd() {
      if (!el || startY.current === null) return
      const wasTriggered = pullState.triggered
      startY.current = null
      if (wasTriggered && !refreshing.current) {
        refreshing.current = true
        try {
          await onRefresh()
        } finally {
          refreshing.current = false
          setPullState({ pulling: false, distance: 0, triggered: false })
        }
      } else {
        setPullState({ pulling: false, distance: 0, triggered: false })
      }
    }

    el.addEventListener('touchstart', onTouchStart, { passive: true })
    el.addEventListener('touchmove', onTouchMove, { passive: false })
    el.addEventListener('touchend', onTouchEnd)
    el.addEventListener('touchcancel', onTouchEnd)

    return () => {
      el.removeEventListener('touchstart', onTouchStart)
      el.removeEventListener('touchmove', onTouchMove)
      el.removeEventListener('touchend', onTouchEnd)
      el.removeEventListener('touchcancel', onTouchEnd)
    }
  }, [containerRef, onRefresh, pullState.triggered])

  return { pullState, isRefreshing: refreshing.current }
}

/**
 * PullIndicator — Saturn icon, který rotuje podle pull distance.
 */
export function PullIndicator({ distance, triggered }: { distance: number; triggered: boolean }) {
  const opacity = Math.min(1, distance / 60)
  const rotation = (distance / 80) * 360
  return (
    <div
      className="flex justify-center items-center pointer-events-none transition-opacity"
      style={{
        height: `${distance}px`,
        opacity,
      }}
    >
      <div
        className="w-10 h-10"
        style={{
          transform: `rotate(${rotation}deg)`,
          transition: triggered ? 'transform 200ms ease-out' : 'none',
        }}
      >
        <svg viewBox="0 0 100 100" fill="none" aria-hidden="true">
          <circle cx="50" cy="50" r="22" fill="#ec4899" />
          <g transform="rotate(-18 50 50)">
            <ellipse cx="50" cy="50" rx="38" ry="8" fill="none" stroke="#f9a8d4" strokeWidth="3" />
          </g>
        </svg>
      </div>
    </div>
  )
}
