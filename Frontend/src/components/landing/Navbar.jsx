import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart, Zap, BarChart2, LogIn } from 'lucide-react'
import { Link } from 'react-router-dom'

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
      <Link
        to="/"
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
          flexShrink: 0
        }}>
          <ShoppingCart size={18} color="#fff" strokeWidth={1.75} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{
            fontSize: 17,
            fontWeight: 800,
            color: 'var(--clr-primary, #154539)',
            letterSpacing: '-0.5px',
            lineHeight: 1.1,
          }}>ShopSense AI</span>
        </div>
      </Link>

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
        <Link to="/login" className="btn-outline" style={{ padding: '9px 20px', fontSize: 14 }}>
          Login
        </Link>
        <Link
          to="/signup"
          className="btn-primary"
          style={{ padding: '9px 20px', fontSize: 14 }}
        >
          Get Started
        </Link>
      </div>
    </motion.nav>
  )
}
