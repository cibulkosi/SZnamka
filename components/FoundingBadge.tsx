// components/FoundingBadge.tsx
// Reusable founding member badge — used in /profile, /discover, /matches.
// Style: Hinge + The Pattern editorial — cream bg, pink ✦ rotated 45° (anti-Gemini),
// Georgia serif label.

import React from 'react'

interface Props {
  /** TRUE if user is is_founding_member (from profiles table) */
  isFoundingMember: boolean
  /** TRUE if user wants the badge visible publicly (founding_badge_visible) */
  visible: boolean
  /** Optional — compact variant for cards / matches list */
  compact?: boolean
}

export default function FoundingBadge({ isFoundingMember, visible, compact = false }: Props) {
  if (!isFoundingMember || !visible) return null

  const Saturn = () => (
    <svg
      aria-hidden
      width="22"
      height="16"
      viewBox="-50 -38 100 76"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'inline-block', verticalAlign: 'middle' }}
    >
      <g transform="rotate(-18)">
        <ellipse cx="0" cy="0" rx="40" ry="7" fill="none" stroke="#f9a8d4" strokeWidth="3.5"/>
      </g>
      <circle cx="0" cy="0" r="18" fill="#ec4899"/>
      <g transform="rotate(-18)">
        <path d="M -40 0 A 40 7 0 0 0 40 0" fill="none" stroke="#f9a8d4" strokeWidth="3.5"/>
      </g>
    </svg>
  )

  if (compact) {
    return (
      <span
        className="inline-flex items-center gap-1 text-xs"
        style={{
          background: '#FAF6F0',
          color: '#ec4899',
          padding: '2px 8px',
          borderRadius: '9999px',
          fontFamily: 'Georgia, serif',
          letterSpacing: '0.02em',
        }}
        title="Zakládající člen — jeden z prvních 1 000 na Cosmatch"
      >
        <Saturn />
        <span>Zakládající</span>
      </span>
    )
  }

  return (
    <div
      className="inline-flex items-center gap-2"
      style={{
        background: '#FAF6F0',
        color: '#ec4899',
        padding: '6px 14px',
        borderRadius: '9999px',
        border: '1px solid rgba(236, 72, 153, 0.2)',
        fontFamily: 'Georgia, serif',
        fontSize: '13px',
        letterSpacing: '0.02em',
      }}
      title="Zakládající člen — jeden z prvních 1 000 na Cosmatch"
    >
      <span style={{ fontSize: '15px' }}>
        <Saturn />
      </span>
      <span>Zakládající člen</span>
    </div>
  )
}
