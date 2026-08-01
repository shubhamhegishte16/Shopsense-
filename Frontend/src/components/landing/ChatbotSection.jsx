import { MessageSquare, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import ScrollTextReveal from '../originkit/ui/scroll-text-reveal'

export default function ChatbotSection() {
  return (
    <section id="chatbot" style={{ padding: '120px 0', background: 'var(--clr-bg)', overflow: 'hidden' }}>
      <motion.div 
        className="section-container"
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
      >
        <div style={{
          background: 'var(--clr-light-bg)',
          borderRadius: 32,
          padding: '80px 64px',
          display: 'flex',
          alignItems: 'center',
          gap: 64,
          flexWrap: 'wrap'
        }}>
          <div style={{ flex: '1 1 400px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <div style={{ padding: 8, background: 'var(--clr-primary)', borderRadius: 12 }}>
                <Sparkles size={20} color="#fff" />
              </div>
              <span className="label" style={{ color: 'var(--clr-primary)' }}>AI SHOPPING ASSISTANT</span>
            </div>
            
            <ScrollTextReveal
              text="Just ask your data."
              tag="h2"
              color="var(--clr-primary)"
              font={{
                fontSize: "clamp(32px, 4vw, 52px)",
                fontWeight: "800",
                lineHeight: "1.15",
                textAlign: "left",
              }}
              style={{ marginBottom: 24 }}
            />
            <p className="body-md" style={{ color: 'var(--clr-mid)', marginBottom: 32 }}>
              Don't want to dig through charts? Just ask our natural language chatbot. It knows your entire shopping history across all stores.
            </p>
            <button className="btn-primary" style={{ background: 'var(--clr-primary)', color: '#fff' }}>
              Try Demo <MessageSquare size={16} />
            </button>
          </div>

          <div style={{ flex: '1 1 340px' }}>
            <div style={{
              background: '#fff',
              borderRadius: 24,
              padding: 24,
              boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
              display: 'flex',
              flexDirection: 'column',
              gap: 16
            }}>
              <div style={{
                alignSelf: 'flex-end',
                background: 'var(--clr-light-bg)',
                padding: '12px 16px',
                borderRadius: '16px 16px 4px 16px',
                color: 'var(--clr-primary)',
                fontSize: 14,
                fontWeight: 500
              }}>
                How much did I spend on snacks last month?
              </div>
              <div style={{
                alignSelf: 'flex-start',
                background: 'var(--clr-primary)',
                padding: '16px',
                borderRadius: '16px 16px 16px 4px',
                color: '#fff',
                fontSize: 14,
                lineHeight: 1.5,
                maxWidth: '85%'
              }}>
                You spent <strong>₹3,450</strong> on snacks in July. This is 15% higher than June. Most of it was at Zepto (₹2,100). Want tips to reduce this?
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
