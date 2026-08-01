import { Zap, ScanLine, Clock, Target } from 'lucide-react'
import { motion } from 'framer-motion'
import ScrollTextReveal from '../originkit/ui/scroll-text-reveal'

const FEATURES = [
  {
    title: 'Zero Data Entry',
    desc: 'Our OCR engine extracts items, prices, and taxes in seconds. Just take a picture.',
    icon: ScanLine,
  },
  {
    title: 'Instant Categorization',
    desc: 'AI automatically tags everything. Know exactly how much you spend on food vs. personal care.',
    icon: Zap,
  },
  {
    title: 'Price Tracking over Time',
    desc: 'See if your favorite milk brand got more expensive over the last 6 months.',
    icon: Clock,
  },
  {
    title: 'Personalized Goals',
    desc: 'Set smart budgets and let AI guide your future purchases based on your unique habits.',
    icon: Target,
  },
]

export default function FeaturesSection() {
  return (
    <section id="features" style={{ padding: '120px 0', background: 'var(--clr-light-bg)', overflow: 'hidden' }}>
      <motion.div 
        className="section-container"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
      >
        <div style={{ textAlign: 'center', marginBottom: 72, maxWidth: 640, margin: '0 auto 72px' }}>
          <ScrollTextReveal
            text="Everything you need to shop smarter."
            tag="h2"
            color="var(--clr-primary)"
            font={{
              fontSize: "clamp(32px, 4vw, 52px)",
              fontWeight: "800",
              lineHeight: "1.15",
              textAlign: "center",
            }}
            style={{ marginBottom: 20 }}
          />
          <p className="body-md" style={{ color: 'var(--clr-mid)' }}>
            We combine best-in-class OCR with deep learning to turn your crumpled paper receipts and email invoices into a powerful financial database.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 24,
        }}>
          {FEATURES.map((feat, i) => (
            <div
              key={i}
              style={{
                background: '#fff',
                padding: '40px 32px',
                borderRadius: 24,
                border: '1px solid rgba(0,0,0,0.05)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
              }}
            >
              <div style={{
                width: 48, height: 48,
                borderRadius: 12,
                background: 'rgba(21,69,57,0.06)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 24,
              }}>
                <feat.icon size={24} color="var(--clr-primary)" strokeWidth={1.5} />
              </div>
              <h3 style={{ fontSize: 19, fontWeight: 700, color: 'var(--clr-primary)', marginBottom: 12 }}>
                {feat.title}
              </h3>
              <p style={{ fontSize: 14.5, lineHeight: 1.6, color: 'var(--clr-mid)' }}>
                {feat.desc}
              </p>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
