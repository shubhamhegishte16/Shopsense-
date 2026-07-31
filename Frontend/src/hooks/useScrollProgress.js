import { useState, useEffect, useRef } from 'react'

/**
 * Tracks scroll progress through a ref'd container element.
 * Returns a value from 0 (top) to 1 (bottom of scrollable range).
 */
export function useScrollProgress(sectionRef) {
  const [progress, setProgress] = useState(0)
  const rafRef = useRef(null)

  useEffect(() => {
    const onScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(() => {
        const el = sectionRef.current
        if (!el) return
        // How far we've scrolled into the section
        const scrolled = window.scrollY - el.offsetTop
        // Total scrollable range = element height - one viewport
        const scrollable = el.scrollHeight - window.innerHeight
        if (scrollable <= 0) { setProgress(0); return }
        const p = Math.max(0, Math.min(1, scrolled / scrollable))
        setProgress(p)
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll() // seed on mount
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [sectionRef])

  return progress
}
