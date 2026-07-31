import { useState } from 'react'
import { Plus, Minus } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const FAQS = [
  {
    q: 'How do I upload a receipt?',
    a: 'You can take a photo with your phone, upload an image from your gallery, or forward email receipts (like from Zepto or Amazon) directly to your unique ShopSense email address.'
  },
  {
    q: 'What stores are supported?',
    a: 'All of them! Our AI doesn\'t rely on specific store integrations. It reads the raw text from any receipt, whether it\'s from a global supermarket chain or your local kirana store.'
  },
  {
    q: 'Is my financial data secure?',
    a: 'Absolutely. We use enterprise-grade encryption. Your receipts are processed securely, and we never sell your personal shopping data to third-party advertisers.'
  },
  {
    q: 'Can it detect fake discounts?',
    a: 'Yes. Since ShopSense tracks the historical price you paid for items over time, it will alert you if a "discounted" item is actually more expensive than what you paid last month.'
  },
]

export default function FAQSection() {
  const [open, setOpen] = useState(0)

  return (
    <section style={{ padding: '120px 0', background: 'var(--clr-light-bg)' }}>
      <div className="section-container" style={{ maxWidth: 800 }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <h2 className="heading-lg" style={{ color: 'var(--clr-bg)' }}>Frequently Asked Questions</h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {FAQS.map((faq, i) => {
            const isOpen = open === i
            return (
              <div
                key={i}
                style={{
                  background: '#fff',
                  borderRadius: 16,
                  border: '1px solid rgba(0,0,0,0.05)',
                  overflow: 'hidden',
                  cursor: 'pointer'
                }}
                onClick={() => setOpen(isOpen ? -1 : i)}
              >
                <div style={{
                  padding: '24px 32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                  <span style={{ fontSize: 17, fontWeight: 600, color: 'var(--clr-bg)' }}>
                    {faq.q}
                  </span>
                  <div style={{
                    width: 32, height: 32,
                    borderRadius: '50%',
                    background: isOpen ? 'var(--clr-bg)' : 'rgba(0,0,0,0.04)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.2s'
                  }}>
                    {isOpen ? <Minus size={16} color="#fff" /> : <Plus size={16} color="var(--clr-bg)" />}
                  </div>
                </div>
                
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      style={{ overflow: 'hidden' }}
                    >
                      <div style={{ padding: '0 32px 24px', color: 'var(--clr-mid)', fontSize: 15, lineHeight: 1.6 }}>
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
