import { ShoppingCart } from 'lucide-react'

export default function Footer() {
  return (
    <footer style={{ background: '#0D1410', paddingTop: 80, paddingBottom: 40, borderTop: '1px solid rgba(192,200,196,0.1)' }}>
      <div className="section-container">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 64, marginBottom: 80 }}>
          
          <div style={{ flex: '2 1 300px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <div style={{
                width: 32, height: 32,
                background: 'var(--clr-primary)',
                borderRadius: 8,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <ShoppingCart size={16} color="#fff" />
              </div>
              <span style={{ fontWeight: 700, fontSize: 18, color: '#fff', letterSpacing: '-0.3px' }}>
                ShopSense <span style={{ color: 'var(--clr-muted)', fontWeight: 400 }}>AI</span>
              </span>
            </div>
            <p className="body-md" style={{ maxWidth: 300, fontSize: 14 }}>
              The first personal shopping intelligence platform. Turning your receipts into actionable financial insights.
            </p>
          </div>

          <div style={{ flex: '1 1 150px' }}>
            <h4 style={{ color: '#fff', fontWeight: 600, marginBottom: 20 }}>Product</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12, padding: 0 }}>
              {['Features', 'Analytics', 'AI Chatbot', 'Pricing'].map(link => (
                <li key={link}><a href="#" style={{ color: 'var(--clr-muted)', textDecoration: 'none', fontSize: 14 }}>{link}</a></li>
              ))}
            </ul>
          </div>

          <div style={{ flex: '1 1 150px' }}>
            <h4 style={{ color: '#fff', fontWeight: 600, marginBottom: 20 }}>Company</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12, padding: 0 }}>
              {['About', 'Blog', 'Careers', 'Contact'].map(link => (
                <li key={link}><a href="#" style={{ color: 'var(--clr-muted)', textDecoration: 'none', fontSize: 14 }}>{link}</a></li>
              ))}
            </ul>
          </div>

          <div style={{ flex: '1 1 150px' }}>
            <h4 style={{ color: '#fff', fontWeight: 600, marginBottom: 20 }}>Legal</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12, padding: 0 }}>
              {['Privacy Policy', 'Terms of Service', 'Security'].map(link => (
                <li key={link}><a href="#" style={{ color: 'var(--clr-muted)', textDecoration: 'none', fontSize: 14 }}>{link}</a></li>
              ))}
            </ul>
          </div>
        </div>

        <div style={{
          borderTop: '1px solid rgba(192,200,196,0.1)',
          paddingTop: 32,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16
        }}>
          <p style={{ color: 'var(--clr-muted)', fontSize: 13 }}>
            © {new Date().getFullYear()} ShopSense AI. All rights reserved.
          </p>
          <div style={{ display: 'flex', gap: 16 }}>
            <a href="#" style={{ color: 'var(--clr-muted)', textDecoration: 'none', fontSize: 13 }}>Twitter</a>
            <a href="#" style={{ color: 'var(--clr-muted)', textDecoration: 'none', fontSize: 13 }}>LinkedIn</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
