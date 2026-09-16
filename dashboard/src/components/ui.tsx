/** Shared HADES brand UI primitives — use on every view */

import type { ReactNode } from 'react'

export function PageShell({
  eyebrow,
  title,
  children,
  footer,
}: {
  eyebrow: string
  title: string
  children: ReactNode
  footer?: ReactNode
}) {
  return (
    <div className="h-full w-full overflow-auto bg-hades-bg">
      <div className="p-5 sm:p-6 pb-16 max-w-[1400px] w-full mx-auto">
        <div className="mb-6">
          <div className="hades-section-label mb-1.5">{eyebrow}</div>
          <h1 className="hades-display text-3xl sm:text-4xl text-white leading-none">
            {title}
          </h1>
        </div>
        {children}
        {footer && (
          <div className="mt-8 text-[10px] text-hades-muted border-t border-hades-border pt-4 max-w-3xl font-sans">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}

export function SectionCard({
  title,
  children,
  className = '',
}: {
  title?: string
  children: ReactNode
  className?: string
}) {
  return (
    <section className={`hades-card overflow-hidden ${className}`}>
      {title && (
        <div className="hades-card-header px-4 py-2">
          <h2 className="hades-ui text-xs text-white/90">{title}</h2>
        </div>
      )}
      {children}
    </section>
  )
}

export function Chip({
  active,
  onClick,
  children,
  danger,
}: {
  active?: boolean
  onClick?: () => void
  children: ReactNode
  danger?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-2.5 py-1 rounded text-[11px] font-ui tracking-wide uppercase transition border ${
        active
          ? danger
            ? 'border-hades-red bg-hades-red/15 text-red-200 shadow-hades-glow'
            : 'border-hades-purple bg-hades-purple text-white shadow-hades-purple'
          : 'border-hades-border bg-hades-elevated/50 text-hades-muted hover:border-hades-silver-dim hover:text-white'
      }`}
    >
      {children}
    </button>
  )
}
