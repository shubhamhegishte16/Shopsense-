import { useState, useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { ShoppingBag, Mail, Lock, User, Eye, EyeOff, ArrowRight, CheckCircle2, Zap, AlertCircle } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import ParticleText from '../components/originkit/ui/particle-text'
import MagneticButton from '../components/originkit/ui/magnetic-button'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export default function Signup() {
  const navigate = useNavigate()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [agreed, setAgreed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // 3D Perspective Tilt Card logic for the left side Mobile Showcase
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (password !== confirmPassword) {
      setError('Passwords do not match!')
      return
    }
    if (!agreed) {
      setError('Please agree to the Terms of Service and Privacy Policy.')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.')
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch(`${API_URL}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, password }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.message || 'Something went wrong. Please try again.')
        return
      }

      // Store token
      localStorage.setItem('shopsense_token', data.token)
      localStorage.setItem('shopsense_user', JSON.stringify(data.user))

      setSuccess('Account created successfully! Redirecting...')
      setTimeout(() => navigate('/'), 1500)
    } catch (err) {
      setError('Network error. Please check your connection and try again.')
    } finally {
      setIsLoading(false)
    }
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

        {/* ── LEFT COLUMN: Branding, Features & 3D Mobile Showcase ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
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
              flexShrink: 0
            }}>
              <ShoppingBag size={22} color="#ffffff" />
            </div>
            <div>
              <div style={{ width: 220, height: 32, display: 'flex', alignItems: 'center' }}>
                <ParticleText 
                  text="ShopSense AI"
                  colors={["#154539", "#10B981", "#0F172A"]}
                  fontSize={26}
                  particleSize={8}
                  particleCount={45}
                  minWidth={220}
                  minHeight={32}
                  transition={{ type: "tween", duration: 0, ease: "linear" }}
                />
              </div>
              <div style={{ fontSize: 13, color: 'var(--clr-mid, #6B7280)', fontWeight: 500 }}>
                Smarter Shopping. Better Decisions.
              </div>
            </div>
          </Link>

          {/* Header & Subtitle */}
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
              <Zap size={12} color="#154539" fill="#154539" />
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--clr-primary, #154539)' }}>
                AI-POWERED SHOPPING INTELLIGENCE
              </span>
            </div>

            <h1 style={{
              fontSize: 'clamp(32px, 3.8vw, 44px)',
              fontWeight: 800,
              color: '#0F172A',
              letterSpacing: '-1.2px',
              lineHeight: 1.15,
              marginBottom: 12,
            }}>
              Create your account<br />
              <span style={{ color: 'var(--clr-primary, #154539)' }}>Start shopping smarter.</span>
            </h1>
            <p style={{ fontSize: 15, color: '#64748B', lineHeight: 1.5, maxWidth: 460 }}>
              Join ShopSense AI and unlock the power of receipt intelligence, AI insights, and smart shopping tools.
            </p>
          </div>



          {/* 3D Interactive Tilt Mobile Phone Preview */}
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
              padding: 20,
              border: '1px solid rgba(21,69,57,0.1)',
              boxShadow: '0 20px 50px rgba(21,69,57,0.08)',
              position: 'relative',
              overflow: 'hidden',
              cursor: 'grab',
              maxWidth: 460,
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
              padding: '16px',
            }}>
              <motion.img
                src="/mobile-3d.png"
                alt="ShopEase Mobile 3D Preview"
                style={{
                  width: '100%',
                  maxHeight: 240,
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 16px 24px rgba(0,0,0,0.12))',
                }}
                animate={{ y: [0, -6, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              />
            </div>
          </motion.div>

          {/* Bottom Trust Banner */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            background: 'rgba(21,69,57,0.06)',
            padding: '12px 18px',
            borderRadius: 16,
            border: '1px solid rgba(21,69,57,0.1)',
            maxWidth: 460,
          }}>
            <CheckCircle2 size={20} color="var(--clr-primary, #154539)" style={{ flexShrink: 0 }} />
            <span style={{ fontSize: 13, color: '#334155', fontWeight: 500, lineHeight: 1.4 }}>
              Thousands of smart shoppers trust ShopSense AI to make better buying decisions every day.
            </span>
          </div>
        </div>

        {/* ── RIGHT COLUMN: Signup Form Card ── */}
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
          <div style={{ marginBottom: 28 }}>
            <h2 style={{
              fontSize: 28,
              fontWeight: 800,
              color: '#0F172A',
              letterSpacing: '-0.5px',
              marginBottom: 8,
            }}>
              Create your account
            </h2>
            <p style={{ fontSize: 15, color: '#64748B' }}>
              Sign up to get started with ShopSense AI
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Full Name Input */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 14, fontWeight: 600, color: '#334155' }}>
                Full Name
              </label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <User size={18} color="#94A3B8" style={{ position: 'absolute', left: 16 }} />
                <input
                  type="text"
                  required
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '13px 16px 13px 46px',
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

            {/* Email Address Input */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 14, fontWeight: 600, color: '#334155' }}>
                Email Address
              </label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Mail size={18} color="#94A3B8" style={{ position: 'absolute', left: 16 }} />
                <input
                  type="email"
                  required
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '13px 16px 13px 46px',
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 14, fontWeight: 600, color: '#334155' }}>
                Password
              </label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Lock size={18} color="#94A3B8" style={{ position: 'absolute', left: 16 }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '13px 46px 13px 46px',
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
              <div style={{ fontSize: 12, color: '#10B981', display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                <span>✔</span> At least 8 characters with a number & special character
              </div>
            </div>

            {/* Confirm Password Input */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 14, fontWeight: 600, color: '#334155' }}>
                Confirm Password
              </label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Lock size={18} color="#94A3B8" style={{ position: 'absolute', left: 16 }} />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '13px 46px 13px 46px',
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
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Terms checkbox */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 4 }}>
              <input
                type="checkbox"
                id="terms"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                style={{ width: 16, height: 16, accentColor: 'var(--clr-primary, #154539)', cursor: 'pointer' }}
              />
              <label htmlFor="terms" style={{ fontSize: 13, color: '#64748B', cursor: 'pointer' }}>
                I agree to the{' '}
                <a href="#" style={{ color: 'var(--clr-primary, #154539)', fontWeight: 600, textDecoration: 'underline' }}>
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" style={{ color: 'var(--clr-primary, #154539)', fontWeight: 600, textDecoration: 'underline' }}>
                  Privacy Policy
                </a>
              </label>
            </div>

            {/* Error / Success Banner */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '12px 16px',
                  borderRadius: 12,
                  background: 'rgba(239,68,68,0.08)',
                  border: '1px solid rgba(239,68,68,0.25)',
                  color: '#DC2626',
                  fontSize: 14,
                }}
              >
                <AlertCircle size={16} style={{ flexShrink: 0 }} />
                {error}
              </motion.div>
            )}
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '12px 16px',
                  borderRadius: 12,
                  background: 'rgba(16,185,129,0.08)',
                  border: '1px solid rgba(16,185,129,0.25)',
                  color: '#059669',
                  fontSize: 14,
                }}
              >
                <CheckCircle2 size={16} style={{ flexShrink: 0 }} />
                {success}
              </motion.div>
            )}

            <div style={{ marginTop: 12 }}>
              <MagneticButton label={isLoading ? 'Creating Account...' : 'Create Account'} type="submit" disabled={isLoading}>
                <ArrowRight size={18} />
              </MagneticButton>
            </div>
          </form>

          {/* Footer link */}
          <div style={{ textAlign: 'center', marginTop: 28, fontSize: 14, color: '#64748B' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ fontWeight: 700, color: 'var(--clr-primary, #154539)', textDecoration: 'none' }}>
              Log in
            </Link>
          </div>
        </motion.div>

      </div>
    </div>
  )
}

