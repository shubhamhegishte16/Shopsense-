import { useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ScanLine, Brain, BarChart3, ShieldAlert, Dna } from 'lucide-react'
import { useScrollProgress } from '../../hooks/useScrollProgress'
import FrameSequence from './FrameSequence'

// ─── Chapter definitions ──────────────────────────────────────────────────────
const CHAPTERS = [
  {
    key: 'c1',
    num: '01',
    tag: 'CAPTURE',
    title: 'Upload Any Receipt',
    desc: 'Snap a photo of any receipt — grocery, pharmacy, restaurant. Our OCR engine extracts every item, price, and discount instantly. No manual entry.',
    tags: ['Zepto', 'Blinkit', 'Amazon', 'Local Stores', 'Restaurants'],
    Icon: ScanLine,
    lo: 0.28, hi: 0.44,
  },
  {
    key: 'c2',
    num: '02',
    tag: 'EXTRACT',
    title: 'AI Reads Everything',
    desc: 'Gemini AI structures raw OCR text into clean data — product name, quantity, unit price, discount, and category — automatically.',
    tags: ['Product Name', 'Unit Price', 'Discounts', 'Category'],
    Icon: Brain,
    lo: 0.44, hi: 0.60,
  },
  {
    key: 'c3',
    num: '03',
    tag: 'ANALYZE',
    title: 'Deep Shopping Analytics',
    desc: 'Monthly, weekly, and category-wise spending charts reveal patterns you never noticed. Know exactly where every rupee goes.',
    tags: ['Groceries', 'Electronics', 'Personal Care', 'Food'],
    Icon: BarChart3,
    lo: 0.60, hi: 0.74,
  },
  {
    key: 'c4',
    num: '04',
    tag: 'DETECT',
    title: 'Price Intelligence',
    desc: 'Detect hidden price hikes, shrinkflation, and fake discounts. Get real-time alerts if a product you bought is recalled.',
    tags: ['Shrinkflation', 'Price Hikes', 'Fake Discounts', 'Recalls'],
    Icon: ShieldAlert,
    lo: 0.74, hi: 0.87,
  },
  {
    key: 'c5',
    num: '05',
    tag: 'PROFILE',
    title: 'Your Shopping DNA',
    desc: 'AI builds your unique buyer persona across every purchase — healthy shopper, budget master, brand loyal — and optimises your next list.',
    tags: ['Healthy Shopper', 'Budget Master', 'Brand Loyal', 'Trendsetter'],
    Icon: Dna,
    lo: 0.87, hi: 1.01,
  },
]

// ─── Stats row ────────────────────────────────────────────────────────────────
const STATS = [
  { val: '2M+',   label: 'Receipts Processed' },
  { val: '15%',   label: 'Avg. Monthly Savings' },
  { val: '500k',  label: 'Active Users' },
  { val: '99.9%', label: 'OCR Accuracy' },
]

// ─── Progress dots ────────────────────────────────────────────────────────────
function ProgressDots({ activeIdx }) {
  return (
    <div style={{
      position: 'absolute',
      bottom: 36,
      left: '50%',
      transform: 'translateX(-50%)',
      display: 'flex',
      gap: 8,
      zIndex: 20,
    }}>
      {CHAPTERS.map((_, i) => (
        <div
          key={i}
          style={{
            width: activeIdx === i ? 24 : 8,
            height: 8,
            borderRadius: 4,
            background: activeIdx === i ? 'var(--clr-secondary)' : 'rgba(192,200,196,0.3)',
            transition: 'all 0.35s ease',
          }}
        />
      ))}
    </div>
  )
}

// ─── Chapter panel ────────────────────────────────────────────────────────────
function ChapterPanel({ chapter }) {
  const { num, tag, title, desc, tags, Icon } = chapter
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45 }}
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        pointerEvents: 'none',
        zIndex: 10,
      }}
    >
      {/* Left panel */}
      <motion.div
        initial={{ x: -60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -60, opacity: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: 'absolute',
          left: '5%',
          top: '50%',
          transform: 'translateY(-50%)',
          maxWidth: 320,
        }}
      >
        <div style={{
          background: 'rgba(21,69,57,0.22)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(192,200,196,0.2)',
          borderRadius: 20,
          padding: '32px 36px',
        }}>
          <div className="label" style={{ marginBottom: 12 }}>{num} / {tag}</div>
          <h2 style={{
            fontSize: 'clamp(26px, 2.8vw, 38px)',
            fontWeight: 800,
            letterSpacing: '-0.8px',
            lineHeight: 1.15,
            color: '#fff',
            marginBottom: 20,
          }}>{title}</h2>
          {/* Accent line */}
          <div style={{
            width: 48,
            height: 3,
            background: 'var(--clr-secondary)',
            borderRadius: 2,
            marginBottom: 0,
          }} />
        </div>
      </motion.div>

      {/* Right panel */}
      <motion.div
        initial={{ x: 60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 60, opacity: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
        style={{
          position: 'absolute',
          right: '5%',
          top: '50%',
          transform: 'translateY(-50%)',
          maxWidth: 300,
        }}
      >
        <div style={{
          background: 'rgba(26,28,27,0.75)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(192,200,196,0.15)',
          borderRadius: 20,
          padding: '28px 32px',
        }}>
          <div style={{
            width: 42, height: 42,
            background: 'var(--clr-primary)',
            borderRadius: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 16,
            border: '1px solid rgba(192,200,196,0.2)',
          }}>
            <Icon size={20} color="#C0C8C4" strokeWidth={1.5} />
          </div>
          <p style={{
            fontSize: 14,
            lineHeight: 1.65,
            color: 'var(--clr-muted)',
            marginBottom: 20,
          }}>{desc}</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
            {tags.map(t => (
              <span key={t} style={{
                fontSize: 11,
                fontWeight: 500,
                padding: '4px 10px',
                borderRadius: 999,
                background: 'rgba(47,93,80,0.3)',
                border: '1px solid rgba(192,200,196,0.2)',
                color: 'var(--clr-muted)',
              }}>{t}</span>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── Final CTA overlay (at end of scroll) ────────────────────────────────────
function FinalCTA() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 40 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 15,
        pointerEvents: 'none',
        textAlign: 'center',
        padding: '0 24px',
      }}
    >
      <div style={{
        background: 'rgba(26,28,27,0.85)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        border: '1px solid rgba(192,200,196,0.2)',
        borderRadius: 28,
        padding: '52px 64px',
        maxWidth: 560,
      }}>
        <div className="label" style={{ marginBottom: 20, justifyContent: 'center', display: 'flex' }}>
          One Platform. Every Purchase.
        </div>
        <h2 style={{
          fontSize: 'clamp(32px, 4vw, 52px)',
          fontWeight: 800,
          letterSpacing: '-1.2px',
          lineHeight: 1.1,
          color: '#fff',
          marginBottom: 16,
        }}>
          Pure Shopping <br />
          <span className="green-text-gradient">Intelligence.</span>
        </h2>
        <p style={{ fontSize: 15, color: 'var(--clr-muted)', lineHeight: 1.65, marginBottom: 32 }}>
          Start uploading receipts and unlock AI insights about your spending in minutes.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', pointerEvents: 'all' }}>
          <a href="/signup" className="btn-primary">
            Get Started Free <ArrowRight size={16} />
          </a>
          <a href="#features" className="btn-outline">
            Explore Features
          </a>
        </div>
      </div>
    </motion.div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function ScrollHeroSection() {
  const containerRef = useRef()
  const progress     = useScrollProgress(containerRef)

  // Derive states from progress
  const heroOpacity = Math.max(0, 1 - progress / 0.16)
  const activeChapterIdx = (() => {
    for (let i = 0; i < CHAPTERS.length; i++) {
      const { lo, hi } = CHAPTERS[i]
      if (progress >= lo && progress < hi) return i
    }
    return null
  })()
  const showFinalCTA = progress >= 0.93

  return (
    /* Outer container — creates the scrollable distance */
    <div
      ref={containerRef}
      style={{ height: '750vh', position: 'relative' }}
    >
      {/* Sticky inner — what the user actually sees */}
      <div style={{
        position: 'sticky',
        top: 0,
        height: '100vh',
        overflow: 'hidden',
        background: 'var(--clr-bg)',
      }}>

        {/* Frame Sequence Canvas (behind everything) */}
        <FrameSequence scrollProgress={progress} />

        {/* Left-side gradient for text legibility during hero */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 1,
          background: 'linear-gradient(to right, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.7) 42%, transparent 65%)',
          opacity: heroOpacity,
          pointerEvents: 'none',
        }} />

        {/* ── HERO OVERLAY ── */}
        <motion.div
          style={{
            position: 'absolute',
            top: 0, left: 0,
            height: '100%',
            width: '50%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '0 0 0 7%',
            zIndex: 5,
            opacity: heroOpacity,
            pointerEvents: heroOpacity < 0.1 ? 'none' : 'all',
          }}
        >
          {/* Label */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '6px 14px',
            background: 'rgba(21,69,57,0.4)',
            border: '1px solid rgba(192,200,196,0.25)',
            borderRadius: 999,
            marginBottom: 28,
            width: 'fit-content',
          }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#2F5D50' }} />
            <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--clr-muted)' }}>
              AI-Powered Shopping Intelligence
            </span>
          </div>

          {/* Headline */}
          <h1 className="heading-xl" style={{ marginBottom: 20, maxWidth: 480 }}>
            Shop Smarter with AI.
            <br />
            <span className="green-text-gradient">Every Receipt</span>
            <br />
            Tells a Story.
          </h1>

          {/* Subtext */}
          <p className="body-lg" style={{ maxWidth: 400, marginBottom: 36 }}>
            Upload receipts from any store. Our AI extracts, analyzes,
            and transforms your shopping data into actionable insights.
          </p>

          {/* CTAs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 52 }}>
            <motion.a
              href="/signup"
              className="btn-primary"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              Generate AI Insights <ArrowRight size={16} />
            </motion.a>
            <a href="#how-it-works" className="btn-outline">
              How It Works
            </a>
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', gap: 36 }}>
            {STATS.map(({ val, label }) => (
              <div key={label}>
                <div style={{
                  fontSize: 'clamp(20px, 2vw, 26px)',
                  fontWeight: 800,
                  color: 'var(--clr-text)',
                  letterSpacing: '-0.5px',
                  lineHeight: 1,
                  marginBottom: 4,
                }}>
                  {val}
                </div>
                <div style={{ fontSize: 12, color: 'var(--clr-muted)', fontWeight: 500 }}>
                  {label}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── CHAPTER PANELS ── */}
        <AnimatePresence mode="wait">
          {!showFinalCTA && activeChapterIdx !== null && (
            <ChapterPanel
              key={CHAPTERS[activeChapterIdx].key}
              chapter={CHAPTERS[activeChapterIdx]}
            />
          )}
        </AnimatePresence>

        {/* ── FINAL CTA ── */}
        <AnimatePresence>
          {showFinalCTA && <FinalCTA key="final" />}
        </AnimatePresence>

        {/* ── Chapter progress dots ── */}
        {activeChapterIdx !== null && !showFinalCTA && (
          <ProgressDots activeIdx={activeChapterIdx} />
        )}

        {/* ── Scroll hint (only when in hero) ── */}
        <motion.div
          style={{
            position: 'absolute',
            bottom: 32,
            right: 40,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 6,
            opacity: heroOpacity * 0.7,
            zIndex: 10,
            pointerEvents: 'none',
          }}
        >
          <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--clr-muted)', letterSpacing: '1.5px' }}>
            SCROLL
          </div>
          <div style={{
            width: 1,
            height: 40,
            background: 'linear-gradient(to bottom, var(--clr-muted), transparent)',
          }} />
        </motion.div>
      </div>
    </div>
  )
}
