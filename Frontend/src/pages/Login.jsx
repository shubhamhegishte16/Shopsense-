import { useState, useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { ShoppingBag, Mail, Lock, Eye, EyeOff, ArrowRight, ScanLine, Zap, ShieldCheck, BarChart3, Star } from 'lucide-react'
import { Link } from 'react-router-dom'
import MagneticButton from '../components/originkit/ui/magnetic-button'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  // 3D Perspective Tilt Card logic for the left side image preview
  const cardRef = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 })
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 })

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["12deg", "-12deg"])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-12deg", "12deg"])

  const handleMouseMove = (e) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top
    const xPct = mouseX / width - 0.5
    const yPct = mouseY / height - 0.5
    x.set(xPct)
    y.set(yPct)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    alert(`Logging in with ${email}...`)
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#FAFCFC',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 24px',
      fontFamily: "'Inter', sans-serif",
    }}>
      <div style={{
        width: '100%',
        maxWidth: 1240,
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
        gap: 64,
        alignItems: 'center',
      }}>

        {/* ── LEFT COLUMN: Branding & 3D Cart Showcase ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          {/* Logo & Tagline */}
          <Link to="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: 'var(--clr-primary, #154539)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 20px rgba(21,69,57,0.2)',
            }}>
              <ShoppingBag size={22} color="#ffffff" />
            </div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--clr-primary, #154539)', letterSpacing: '-0.5px' }}>
                ShopSense <span style={{ color: '#10B981', fontWeight: 600 }}>AI</span>
              </div>
              <div style={{ fontSize: 13, color: 'var(--clr-mid, #6B7280)', fontWeight: 500 }}>
                Smarter Shopping. Better Decisions.
              </div>
            </div>
          </Link>

          {/* Header text group */}
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 14px',
              background: 'rgba(21,69,57,0.08)',
              border: '1px solid rgba(21,69,57,0.15)',
              borderRadius: 999,
              marginBottom: 16,
            }}>
              <Star size={12} color="#154539" fill="#154539" />
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--clr-primary, #154539)' }}>
                AI-Powered Shopping Intelligence
              </span>
            </div>

            <h1 style={{
              fontSize: 'clamp(36px, 4vw, 48px)',
              fontWeight: 800,
              color: '#0F172A',
              letterSpacing: '-1.2px',
              lineHeight: 1.1,
              marginBottom: 12,
            }}>
              Welcome Back!
            </h1>
            <p style={{ fontSize: 16, color: '#64748B', lineHeight: 1.5, maxWidth: 440 }}>
              Login to continue your smart shopping journey with ShopSense AI.
            </p>
          </div>

          {/* 3D Interactive Tilt Preview Card */}
          <motion.div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
              rotateX,
              rotateY,
              transformStyle: "preserve-3d",
              perspective: 1000,
              background: '#FFFFFF',
              borderRadius: 28,
              padding: 24,
              border: '1px solid rgba(21,69,57,0.1)',
              boxShadow: '0 20px 50px rgba(21,69,57,0.08)',
              position: 'relative',
              overflow: 'hidden',
              cursor: 'grab',
            }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <div style={{
              width: '100%',
              borderRadius: 20,
              background: 'linear-gradient(135deg, #F4F7F6 0%, #EAEFEF 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px',
              position: 'relative',
            }}>
              <motion.img
                src="/cart-3d.png"
                alt="3D Shopping Cart with TV Box & Groceries"
                style={{
                  width: '100%',
                  maxHeight: 280,
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 16px 24px rgba(0,0,0,0.12))',
                }}
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              />
            </div>
          </motion.div>

          {/* 4 Feature Highlights Row */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 16,
            paddingTop: 8,
          }}>
            {[
              { icon: ScanLine, title: 'OCR Powered', desc: 'Extract data instantly' },
              { icon: Zap, title: 'AI Driven', desc: 'Smart insights for you' },
              { icon: ShieldCheck, title: 'Secure & Private', desc: 'Your data is safe with us' },
              { icon: BarChart3, title: 'Smart Analytics', desc: 'Track. Analyze. Save more.' },
            ].map((item, idx) => (
              <div key={idx} style={{ textAlign: 'center' }}>
                <div style={{
                  width: 38,
                  height: 38,
                  borderRadius: 10,
                  background: 'rgba(21,69,57,0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 8px',
                }}>
                  <item.icon size={18} color="var(--clr-primary, #154539)" />
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', marginBottom: 2 }}>{item.title}</div>
                <div style={{ fontSize: 11, color: '#94A3B8', lineHeight: 1.3 }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT COLUMN: Authentication Card ── */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            background: '#FFFFFF',
            borderRadius: 32,
            padding: '48px 44px',
            boxShadow: '0 24px 60px rgba(0, 0, 0, 0.06)',
            border: '1px solid rgba(21, 69, 57, 0.08)',
          }}
        >
          <div style={{ marginBottom: 32 }}>
            <h2 style={{
              fontSize: 28,
              fontWeight: 800,
              color: '#0F172A',
              letterSpacing: '-0.5px',
              marginBottom: 8,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}>
              Welcome back 👋
            </h2>
            <p style={{ fontSize: 15, color: '#64748B' }}>
              Please login to your account
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {/* Email Input */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label style={{ fontSize: 14, fontWeight: 600, color: '#334155' }}>
                Email address
              </label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Mail size={18} color="#94A3B8" style={{ position: 'absolute', left: 16 }} />
                <input
                  type="email"
                  required
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '14px 16px 14px 46px',
                    borderRadius: 14,
                    border: '1px solid #E2E8F0',
                    background: '#F8FAFC',
                    fontSize: 15,
                    color: '#0F172A',
                    outline: 'none',
                    transition: 'all 0.2s ease',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--clr-primary, #154539)'
                    e.target.style.background = '#FFFFFF'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#E2E8F0'
                    e.target.style.background = '#F8FAFC'
                  }}
                />
              </div>
            </div>

            {/* Password Input */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label style={{ fontSize: 14, fontWeight: 600, color: '#334155' }}>
                Password
              </label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Lock size={18} color="#94A3B8" style={{ position: 'absolute', left: 16 }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '14px 46px 14px 46px',
                    borderRadius: 14,
                    border: '1px solid #E2E8F0',
                    background: '#F8FAFC',
                    fontSize: 15,
                    color: '#0F172A',
                    outline: 'none',
                    transition: 'all 0.2s ease',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--clr-primary, #154539)'
                    e.target.style.background = '#FFFFFF'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#E2E8F0'
                    e.target.style.background = '#F8FAFC'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: 16,
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#94A3B8',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Forgot password link */}
            <div style={{ textAlign: 'right', marginTop: -8 }}>
              <a href="#" style={{ fontSize: 14, fontWeight: 600, color: 'var(--clr-primary, #154539)', textDecoration: 'none' }}>
                Forgot Password?
              </a>
            </div>

            {/* Originkit Magnetic Button */}
            <div style={{ marginTop: 8 }}>
              <MagneticButton label="Log In">
                <ArrowRight size={18} />
              </MagneticButton>
            </div>
          </form>

          {/* Footer link */}
          <div style={{ textAlign: 'center', marginTop: 32, fontSize: 14, color: '#64748B' }}>
            Don't have an account?{' '}
            <Link to="/signup" style={{ fontWeight: 700, color: 'var(--clr-primary, #154539)', textDecoration: 'none' }}>
              Sign up
            </Link>
          </div>
        </motion.div>

      </div>
    </div>
  )
}
