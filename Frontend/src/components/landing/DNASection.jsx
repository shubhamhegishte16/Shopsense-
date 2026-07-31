export default function DNASection() {
  return (
    <section style={{ padding: '120px 0', background: 'var(--clr-primary)' }}>
      <div className="section-container" style={{ textAlign: 'center' }}>
        <div className="label" style={{ color: 'var(--clr-light-bg)', marginBottom: 16 }}>SHOPPING DNA</div>
        <h2 className="heading-lg" style={{ color: '#fff', marginBottom: 24 }}>
          Discover your true buyer persona.
        </h2>
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
      </div>
    </section>
  )
}
