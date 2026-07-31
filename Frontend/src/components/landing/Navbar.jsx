import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart, Zap, BarChart2, LogIn } from 'lucide-react'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0,
        zIndex: 1000,
        height: 'var(--nav-height)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 40px',
        transition: 'background 0.3s ease, border-color 0.3s ease',
        background: scrolled
          ? 'rgba(255, 255, 255, 0.90)'
          : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled
          ? '1px solid var(--clr-border)'
          : '1px solid transparent',
      }}
    >
      {/* Logo */}
      <a
        href="/"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          textDecoration: 'none',
          marginRight: 'auto',
        }}
      >
        <div style={{
          width: 34, height: 34,
          background: 'var(--clr-primary)',
          borderRadius: 8,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid rgba(192,200,196,0.25)',
        }}>
          <ShoppingCart size={18} color="#fff" strokeWidth={1.75} />
        </div>
        <span style={{ fontWeight: 700, fontSize: 17, color: 'var(--clr-text)', letterSpacing: '-0.3px' }}>
          ShopSense <span style={{ color: 'var(--clr-muted)', fontWeight: 400 }}>AI</span>
        </span>
      </a>

      {/* Nav links — desktop */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 32 }} className="hidden md:flex">
        {[
          { label: 'Features', href: '#features' },
          { label: 'AI Assist', href: '#chatbot' },
          { label: 'Analytics', href: '#analytics' },
          { label: 'Pricing', href: '#pricing' },
        ].map(({ label, href }) => (
          <a
            key={label}
            href={href}
            style={{
              fontSize: 14,
              fontWeight: 500,
              color: 'var(--clr-muted)',
              textDecoration: 'none',
              transition: 'color 0.2s',
            }}
            onMouseEnter={e => (e.target.style.color = 'var(--clr-text)')}
            onMouseLeave={e => (e.target.style.color = 'var(--clr-muted)')}
          >
            {label}
          </a>
        ))}
      </div>

      {/* CTAs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginLeft: 40 }}>
        <a href="/login" className="btn-outline" style={{ padding: '9px 20px', fontSize: 14 }}>
          Login
        </a>
        <motion.a
          href="/signup"
          className="btn-primary"
          style={{ padding: '9px 20px', fontSize: 14 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          Get Started
        </motion.a>
      </div>
    </motion.nav>
  )
}
