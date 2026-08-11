import { Star, ArrowUpRight, RotateCw, ExternalLink } from 'lucide-react';
import { AreaChart, Area, XAxis, ResponsiveContainer, Tooltip } from 'recharts';

const defaultTrendData = [
  { date: '28 May', price: 208 },
  { date: '4 Jun', price: 205 },
  { date: '11 Jun', price: 202 },
  { date: '18 Jun', price: 198 },
  { date: '25 Jun', price: 199 },
];

export function CompareHero({ product }) {
  if (!product) return null;

  return (
    <div style={{
      background: '#FFFFFF',
      border: '1px solid #E2E8F0',
      borderRadius: 20,
      padding: 24,
      display: 'flex',
      gap: 24,
      alignItems: 'center',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
    }}>
      <div style={{ width: 120, height: 120, borderRadius: 16, overflow: 'hidden', background: '#F8FAFC', flexShrink: 0 }}>
        <img src={product.img} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
      <div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#10B981', background: '#D1FAE5', padding: '4px 10px', borderRadius: 999, textTransform: 'uppercase' }}>
            {product.category}
          </span>
          {product.brand && (
            <span style={{ fontSize: 11, fontWeight: 700, color: '#64748B', background: '#F1F5F9', padding: '4px 10px', borderRadius: 999, textTransform: 'uppercase' }}>
              {product.brand}
            </span>
          )}
        </div>
        <h2 style={{ fontSize: 24, fontWeight: 800, color: '#0F172A', margin: '0 0 8px 0', letterSpacing: '-0.5px' }}>
          {product.name}
        </h2>
        <p style={{ fontSize: 14, color: '#64748B', margin: 0 }}>{product.desc}</p>
      </div>
    </div>
  );
}

export function StoreComparisonTable({ comparisons = [] }) {
  if (comparisons.length === 0) {
    return (
      <div style={{ padding: 40, textAlign: 'center', background: '#FFFFFF', borderRadius: 20, border: '1px solid #E2E8F0' }}>
        <p style={{ color: '#64748B' }}>No store data available for this product.</p>
      </div>
    );
  }

  return (
    <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 20, overflow: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid #E2E8F0' }}>
        <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0F172A', margin: 0 }}>Available Across Stores</h3>
        <div style={{ fontSize: 12, color: '#64748B', display: 'flex', alignItems: 'center', gap: 6 }}>
          Live Data <RotateCw size={12} />
        </div>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
            <th style={{ padding: '16px 24px', fontSize: 12, fontWeight: 700, color: '#64748B' }}>STORE</th>
            <th style={{ padding: '16px 24px', fontSize: 12, fontWeight: 700, color: '#64748B' }}>PRICE</th>
            <th style={{ padding: '16px 24px', fontSize: 12, fontWeight: 700, color: '#64748B' }}>MRP & DISCOUNT</th>
            <th style={{ padding: '16px 24px', fontSize: 12, fontWeight: 700, color: '#64748B' }}>DELIVERY</th>
            <th style={{ padding: '16px 24px', fontSize: 12, fontWeight: 700, color: '#64748B' }}>RATING</th>
            <th style={{ padding: '16px 24px', fontSize: 12, fontWeight: 700, color: '#64748B' }}>ACTION</th>
          </tr>
        </thead>
        <tbody>
          {comparisons.map((store, idx) => (
            <tr key={idx} style={{ 
              borderBottom: idx < comparisons.length - 1 ? '1px solid #F1F5F9' : 'none',
              background: store.isBest ? '#F0FDF4' : 'transparent',
              transition: 'background 0.2s'
            }}>
              <td style={{ padding: '20px 24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 6, background: store.storeBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, color: '#FFF' }}>
                    {store.storeInitial}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, color: '#0F172A', fontSize: 14 }}>{store.store}</div>
                    {store.isBest && <div style={{ fontSize: 11, fontWeight: 700, color: '#10B981' }}>Best Price</div>}
                  </div>
                </div>
              </td>
              <td style={{ padding: '20px 24px' }}>
                <div style={{ fontSize: 18, fontWeight: 800, color: store.isBest ? '#10B981' : '#0F172A' }}>
                  {store.price}
                </div>
              </td>
              <td style={{ padding: '20px 24px' }}>
                <div style={{ fontSize: 13, color: '#94A3B8', textDecoration: 'line-through' }}>{store.mrp}</div>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#EF4444' }}>{store.discount} Off</div>
              </td>
              <td style={{ padding: '20px 24px' }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#334155' }}>{store.delivery}</div>
              </td>
              <td style={{ padding: '20px 24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Star size={14} fill="#FBBF24" color="#FBBF24" />
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#334155' }}>{store.rating}</span>
                </div>
              </td>
              <td style={{ padding: '20px 24px' }}>
                <a href={store.link} target="_blank" rel="noreferrer" style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  background: store.isBest ? '#10B981' : '#F1F5F9',
                  color: store.isBest ? '#FFFFFF' : '#334155',
                  padding: '8px 16px', borderRadius: 8,
                  fontSize: 13, fontWeight: 700, textDecoration: 'none',
                  transition: 'opacity 0.2s'
                }}>
                  View <ExternalLink size={14} />
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Right Panel: You Can Save ──────────────────────────────────────────────────
export function YouCanSavePanel({ product }) {
  if (!product || !product.comparisons || product.comparisons.length < 2) return null;

  const comparisons = [...product.comparisons].sort((a, b) => a.rawPrice - b.rawPrice);
  const best = comparisons[0];
  const worst = comparisons[comparisons.length - 1];
  const saveAmount = worst.rawPrice - best.rawPrice;
  const savePct = Math.round((saveAmount / worst.rawPrice) * 100);

  if (saveAmount <= 0) return null;

  return (
    <div style={{ background: '#FFFFFF', border: '1px solid #F1F5F9', borderRadius: 20, padding: 24, marginBottom: 20 }}>
      <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', margin: '0 0 16px 0' }}>You Can Save</h3>
      <div style={{ background: '#F0FDF4', border: '1px solid #D1FAE5', borderRadius: 14, padding: 20, display: 'flex', gap: 16, alignItems: 'flex-start' }}>
        <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#D1FAE5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <BellIcon size={20} color="#10B981" />
        </div>
        <div>
          <p style={{ fontSize: 12, color: '#64748B', margin: '0 0 6px 0' }}>Buy from {best.store} and save</p>
          <div style={{ fontSize: 22, fontWeight: 900, color: '#0F172A' }}>₹{saveAmount.toLocaleString()} <span style={{ fontSize: 14, fontWeight: 600, color: '#10B981' }}>({savePct}%)</span></div>
          <p style={{ fontSize: 11, color: '#94A3B8', margin: '8px 0 0 0' }}>Compared to {worst.store}</p>
        </div>
      </div>
    </div>
  );
}

// ─── Right Panel: Price Trend (Placeholder) ───────────────────────────────────────────────────
export function PriceTrendPanel({ product }) {
  if (!product) return null;

  const bestPrice = product.comparisons?.[0]?.price || 'N/A';
  
  return (
    <div style={{ background: '#FFFFFF', border: '1px solid #F1F5F9', borderRadius: 20, padding: 24, marginBottom: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', margin: 0 }}>Price Trend</h3>
        <span style={{ fontSize: 11, color: '#64748B', background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '4px 10px', borderRadius: 6 }}>Last 30 Days ▾</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
        <div style={{ width: 40, height: 40, borderRadius: 8, background: '#154539', overflow: 'hidden', flexShrink: 0 }}>
          <img src={product.img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 160 }}>
            {product.name}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 18, fontWeight: 800, color: '#0F172A' }}>{bestPrice}</span>
          </div>
        </div>
      </div>

      <div style={{ height: 100 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={defaultTrendData}>
            <defs>
              <linearGradient id="priceTrend" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10B981" stopOpacity={0.15} />
                <stop offset="100%" stopColor="#10B981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area type="monotone" dataKey="price" stroke="#10B981" strokeWidth={2.5} fill="url(#priceTrend)" dot={false} />
            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#94A3B8' }} />
            <Tooltip contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', fontSize: 12 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ─── Right Panel: Smart Picks ───────────────────────────────────────────────────
export function SmartPicksPanel() {
  const picks = [
    { name: 'India Gate Basmati Rice 1kg', sub: 'Compare 5 stores', save: 'Save up to ₹35', img: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=80&h=80&q=80' },
    { name: 'Ariel Matic 1kg', sub: 'Compare 4 stores', save: 'Save up to ₹46', img: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?auto=format&fit=crop&w=80&h=80&q=80' },
  ];

  return (
    <div style={{ background: '#FFFFFF', border: '1px solid #F1F5F9', borderRadius: 20, padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', margin: 0 }}>Smart Picks for You</h3>
        <a href="#" style={{ fontSize: 12, color: '#10B981', fontWeight: 600, textDecoration: 'none' }}>View All</a>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {picks.map((p, i) => (
          <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <div style={{ width: 40, height: 40, borderRadius: 8, background: '#154539', overflow: 'hidden', flexShrink: 0 }}>
              <img src={p.img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</div>
              <div style={{ fontSize: 11, color: '#94A3B8' }}>{p.sub}</div>
            </div>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#10B981', flexShrink: 0 }}>{p.save}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function BellIcon(props) {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>;
}
