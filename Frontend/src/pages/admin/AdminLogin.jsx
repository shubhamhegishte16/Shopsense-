import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import MagneticButton from '../../components/originkit/ui/magnetic-button'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export default function AdminLogin() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    // Check hardcoded email right here, to double ensure
    if (email !== 'admin@shopsense.com') {
      setError('Only admin@shopsense.com is allowed for this panel.')
      setIsLoading(false)
      return
    }

    try {
      const res = await fetch(`${API_URL}/api/auth/admin-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.message || 'Invalid admin credentials.')
        return
      }

      // Store token
      localStorage.setItem('shopsense_token', data.token)
      localStorage.setItem('shopsense_user', JSON.stringify(data.user))

      navigate('/admin')
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
        maxWidth: 500,
      }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            background: '#FFFFFF',
            borderRadius: 32,
            padding: '48px 44px',
            boxShadow: '0 24px 60px rgba(0, 0, 0, 0.06)',
            border: '1px solid rgba(21, 69, 57, 0.08)',
          }}
        >
          <div style={{ marginBottom: 32, textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 64, height: 64, borderRadius: 16, background: 'rgba(21,69,57,0.08)', marginBottom: 24 }}>
                <ShieldCheck size={32} color="var(--clr-primary, #154539)" />
            </div>
            <h2 style={{
              fontSize: 28,
              fontWeight: 800,
              color: '#0F172A',
              letterSpacing: '-0.5px',
              marginBottom: 8,
            }}>
              Admin Panel
            </h2>
            <p style={{ fontSize: 15, color: '#64748B' }}>
              Restricted access. Please login with admin credentials.
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {/* Email Input */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label style={{ fontSize: 14, fontWeight: 600, color: '#334155' }}>
                Admin Email
              </label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Mail size={18} color="#94A3B8" style={{ position: 'absolute', left: 16 }} />
                <input
                  type="email"
                  required
                  placeholder="admin@shopsense.com"
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
                  placeholder="Enter admin password"
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

            {/* Error Banner */}
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
                  marginBottom: 8,
                }}
              >
                <AlertCircle size={16} style={{ flexShrink: 0 }} />
                {error}
              </motion.div>
            )}

            <div style={{ marginTop: 8 }}>
              <MagneticButton label={isLoading ? 'Logging in...' : 'Login to Admin'} type="submit" disabled={isLoading}>
                <ArrowRight size={18} />
              </MagneticButton>
            </div>
          </form>

          {/* Footer link */}
          <div style={{ textAlign: 'center', marginTop: 32, fontSize: 14, color: '#64748B' }}>
            <Link to="/login" style={{ fontWeight: 700, color: 'var(--clr-primary, #154539)', textDecoration: 'none' }}>
              Back to User Login
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
