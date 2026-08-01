import { motion } from 'framer-motion'
import ScrollTextReveal from '../originkit/ui/scroll-text-reveal'

export default function DNASection() {
  return (
    <section style={{ padding: '120px 0', background: 'var(--clr-primary)', overflow: 'hidden' }}>
      <motion.div 
        className="section-container" style={{ textAlign: 'center' }}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
      >
        <div className="label" style={{ color: 'var(--clr-light-bg)', marginBottom: 16 }}>SHOPPING DNA</div>
        <ScrollTextReveal
          text="Discover your true buyer persona."
          tag="h2"
          color="#fff"
          font={{
            fontSize: "clamp(32px, 4vw, 52px)",
            fontWeight: "800",
            lineHeight: "1.15",
            textAlign: "center",
          }}
          style={{ marginBottom: 24 }}
        />
        <p className="body-md" style={{ color: 'rgba(255,255,255,0.8)', maxWidth: 600, margin: '0 auto 64px' }}>
          Based on the nutritional value, price points, and brands you buy, ShopSense AI builds a comprehensive profile of what kind of shopper you are.
        </p>

        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 24,
          flexWrap: 'wrap'
        }}>
          {[
            { title: 'The Health Nut', color: '#84CC16', desc: '72% of purchases are organic or fresh produce.' },
            { title: 'The Bargain Hunter', color: '#3B82F6', desc: 'Saves an average of 18% using discounts and bulk buying.' },
            { title: 'The Brand Loyalist', color: '#8B5CF6', desc: 'Consistently buys the same 14 premium brands.' }
          ].map((persona, i) => (
            <div key={i} style={{
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 20,
              padding: '32px',
              textAlign: 'left',
              flex: '1 1 280px',
              maxWidth: 340,
            }}>
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: persona.color, marginBottom: 20 }} />
              <h3 style={{ color: '#fff', fontSize: 18, fontWeight: 700, marginBottom: 12 }}>{persona.title}</h3>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, lineHeight: 1.6 }}>{persona.desc}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
