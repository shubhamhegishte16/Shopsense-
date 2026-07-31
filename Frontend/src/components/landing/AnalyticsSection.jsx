export default function AnalyticsSection() {
  return (
    <section id="analytics" style={{ padding: '120px 0', background: 'var(--clr-bg)' }}>
      <div className="section-container" style={{
        display: 'flex',
        alignItems: 'center',
        gap: 64,
        flexWrap: 'wrap'
      }}>
        <div style={{ flex: '1 1 400px' }}>
          <div className="label" style={{ marginBottom: 16 }}>DEEP ANALYTICS</div>
          <h2 className="heading-lg" style={{ marginBottom: 24 }}>
            Stop guessing.<br />
            <span style={{ color: 'var(--clr-muted)' }}>Start knowing.</span>
          </h2>
          <p className="body-md" style={{ marginBottom: 40, maxWidth: 440 }}>
            Every time you upload a receipt, our engine categorizes every item. 
            View beautiful charts of your monthly spend, identify categories where you're overpaying, and track your grocery inflation rate personally.
          </p>
          
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              'Compare spending across platforms (Zepto vs Amazon)',
              'Automatic category breakdowns',
              'Track historical prices of specific items',
            ].map((item, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <div style={{ marginTop: 4, width: 6, height: 6, borderRadius: '50%', background: 'var(--clr-secondary)' }} />
                <span style={{ fontSize: 15, color: '#fff', fontWeight: 500 }}>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Abstract Chart Graphic */}
        <div style={{ flex: '1 1 500px', display: 'flex', justifyContent: 'center' }}>
           <div style={{
             width: '100%',
             maxWidth: 520,
             aspectRatio: '4/3',
             background: 'rgba(21,69,57,0.15)',
             border: '1px solid var(--clr-border)',
             borderRadius: 24,
             padding: 40,
             position: 'relative',
             overflow: 'hidden'
           }}>
             {/* Mock chart bars */}
             <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '100%', gap: 12 }}>
               {[40, 70, 45, 90, 60, 100, 80].map((h, i) => (
                 <div key={i} style={{
                   flex: 1,
                   height: `${h}%`,
                   background: i === 5 ? 'var(--clr-primary)' : 'rgba(192,200,196,0.2)',
                   borderRadius: '6px 6px 0 0',
                   transition: 'height 1s ease',
                 }} />
               ))}
             </div>
           </div>
        </div>
      </div>
    </section>
  )
}
