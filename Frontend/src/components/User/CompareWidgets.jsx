import { useState } from 'react';
import { Plus, X, Star, ChevronDown, ArrowUpRight, RotateCw } from 'lucide-react';
import { AreaChart, Area, XAxis, ResponsiveContainer, Tooltip } from 'recharts';

const products = [
  {
    name: 'Saffola Gold',
    desc: 'Refined Oil 1L',
    price: '₹199',
    store: 'BigBasket',
    storeBg: '#16A34A',
    storeInitial: 'bb',
    rating: 4.6,
    reviews: '12K',
    mrp: '₹210',
    discount: '5%',
    delivery: '20 mins',
    unitPrice: '₹0.20',
    value: 'Good',
    valueBg: '#D1FAE5',
    valueColor: '#065F46',
    img: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=200&h=150&q=80'
  },
  {
    name: 'Fortune Sunlite',
    desc: 'Refined Oil 1L',
    price: '₹185',
    store: 'Blinkit',
    storeBg: '#EAB308',
    storeInitial: 'B',
    rating: 4.5,
    reviews: '9K',
    mrp: '₹190',
    discount: '3%',
    delivery: '10 mins',
    unitPrice: '₹0.19',
    value: 'Better',
    valueBg: '#D1FAE5',
    valueColor: '#065F46',
    img: 'https://images.unsplash.com/photo-1585664811087-47f65abbad64?auto=format&fit=crop&w=200&h=150&q=80'
  },
  {
    name: 'Nature Fresh',
    desc: 'Refined Oil 1L',
    price: '₹192',
    store: 'Zepto',
    storeBg: '#8B5CF6',
    storeInitial: 'Z',
    rating: 4.4,
    reviews: '8K',
    mrp: '₹199',
    discount: '4%',
    delivery: '15 mins',
    unitPrice: '₹0.19',
    value: 'Better',
    valueBg: '#D1FAE5',
    valueColor: '#065F46',
    img: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=200&h=150&q=80'
  },
  {
    name: 'Dhara Refined',
    desc: 'Oil 1L',
    price: '₹176',
    store: 'Amazon Fresh',
    storeBg: '#F97316',
    storeInitial: 'a',
    rating: 4.3,
    reviews: '7K',
    mrp: '₹185',
    discount: '5%',
    delivery: '30 mins',
    unitPrice: '₹0.18',
    value: 'Best Value',
    valueBg: '#154539',
    valueColor: '#FFFFFF',
    img: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&w=200&h=150&q=80',
    isBest: true
  }
];

const trendData = [
  { date: '28 May', price: 208 },
  { date: '4 Jun', price: 205 },
  { date: '11 Jun', price: 202 },
  { date: '18 Jun', price: 198 },
  { date: '25 Jun', price: 199 },
];

// ─── Product Card ───────────────────────────────────────────────────────────────
function ProductCard({ product, onRemove }) {
  return (
    <div style={{
      background: '#FFFFFF',
      border: '1px solid #E2E8F0',
      borderRadius: 16,
      overflow: 'hidden',
      position: 'relative',
      minWidth: 0,
    }}>
      <button
        onClick={onRemove}
        style={{ position: 'absolute', top: 10, right: 10, width: 24, height: 24, borderRadius: '50%', background: 'rgba(0,0,0,0.3)', border: 'none', color: '#FFF', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2 }}
      >
        <X size={13} />
      </button>
      <div style={{ height: 130, overflow: 'hidden' }}>
        <img src={product.img} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
      <div style={{ padding: '14px 14px 16px' }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A', marginBottom: 2 }}>{product.name}</div>
        <div style={{ fontSize: 12, color: '#94A3B8', marginBottom: 10 }}>{product.desc}</div>
        <div style={{ fontSize: 18, fontWeight: 800, color: '#0F172A', marginBottom: 12 }}>{product.price}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 22, height: 22, borderRadius: 5, background: product.storeBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 800, color: '#FFF', flexShrink: 0 }}>
            {product.storeInitial}
          </div>
          <span style={{ fontSize: 12, fontWeight: 600, color: '#334155' }}>{product.store}</span>
        </div>
      </div>
    </div>
  );
}

// ─── Add Product Card ───────────────────────────────────────────────────────────
function AddProductCard() {
  return (
    <div style={{
      background: '#FAFCFC',
      border: '2px dashed #CBD5E1',
      borderRadius: 16,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
      cursor: 'pointer',
      minHeight: 240,
      transition: 'border-color 0.2s ease',
    }}
    onMouseEnter={e => e.currentTarget.style.borderColor = '#10B981'}
    onMouseLeave={e => e.currentTarget.style.borderColor = '#CBD5E1'}
    >
      <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#154539', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 16px rgba(21,69,57,0.2)' }}>
        <Plus size={22} color="#FFFFFF" />
      </div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A' }}>Add Product</div>
        <div style={{ fontSize: 12, color: '#94A3B8' }}>to compare</div>
      </div>
    </div>
  );
}

// ─── Comparison Table ───────────────────────────────────────────────────────────
function ComparisonTable() {
  const rows = [
    { label: 'Price', key: 'price', best: '₹176' },
    { label: 'Store', key: 'store', isStore: true },
    { label: 'Unit Price', sublabel: '(per ml)', key: 'unitPrice', best: '₹0.18' },
    { label: 'MRP', key: 'mrp' },
    { label: 'Discount', key: 'discount', best: '5%' },
    { label: 'Delivery Time', key: 'delivery', best: '10 mins' },
    { label: 'Rating', key: 'rating', isRating: true },
    { label: 'Overall Value', key: 'value', isValue: true },
  ];

  const rowStyle = { display: 'grid', gridTemplateColumns: '160px repeat(4, 1fr)', borderBottom: '1px solid #F1F5F9' };
  const cellStyle = { padding: '16px 20px', fontSize: 13, color: '#334155', display: 'flex', alignItems: 'center' };
  const labelStyle = { ...cellStyle, color: '#94A3B8', fontWeight: 600, fontSize: 12, flexDirection: 'column', alignItems: 'flex-start', gap: 2 };

  function Stars({ count }) {
    return (
      <div style={{ display: 'flex', gap: 2, alignItems: 'center' }}>
        {[1,2,3,4,5].map(i => (
          <Star key={i} size={12} fill={i <= Math.floor(count) ? '#FBBF24' : 'none'} color="#FBBF24" />
        ))}
      </div>
    );
  }

  return (
    <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 20, overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ ...rowStyle, background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
        <div style={{ ...cellStyle, fontWeight: 700, color: '#0F172A', fontSize: 12, flexDirection: 'column', alignItems: 'flex-start', gap: 2 }}>
          <span>PRODUCT</span><span>DETAILS</span>
        </div>
        {products.map((p, i) => (
          <div key={i} style={{ ...cellStyle, gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 8, overflow: 'hidden', flexShrink: 0 }}>
              <img src={p.img} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 800, color: '#0F172A', letterSpacing: 0.3 }}>{p.name.toUpperCase()}</div>
              <div style={{ fontSize: 10, color: '#94A3B8' }}>{p.desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Rows */}
      {rows.map((row, ri) => (
        <div key={ri} style={rowStyle}>
          <div style={labelStyle}>
            <span>{row.label}</span>
            {row.sublabel && <span style={{ color: '#CBD5E1', fontWeight: 400 }}>{row.sublabel}</span>}
          </div>
          {products.map((p, pi) => {
            const val = p[row.key];
            const isBest = row.best && val === row.best;

            if (row.isStore) return (
              <div key={pi} style={{ ...cellStyle, gap: 8 }}>
                <div style={{ width: 22, height: 22, borderRadius: 5, background: p.storeBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 800, color: '#FFF' }}>{p.storeInitial}</div>
                <span style={{ fontWeight: 600 }}>{p.store}</span>
              </div>
            );

            if (row.isRating) return (
              <div key={pi} style={{ ...cellStyle, flexDirection: 'column', alignItems: 'flex-start', gap: 4 }}>
                <Stars count={p.rating} />
                <span style={{ fontSize: 11, color: '#94A3B8' }}>{p.rating} ({p.reviews})</span>
              </div>
            );

            if (row.isValue) return (
              <div key={pi} style={cellStyle}>
                <span style={{ background: p.valueBg, color: p.valueColor, padding: '5px 14px', borderRadius: 999, fontSize: 12, fontWeight: 700 }}>
                  {p.value}
                </span>
              </div>
            );

            return (
              <div key={pi} style={{ ...cellStyle, fontWeight: isBest ? 800 : 500, color: isBest ? '#10B981' : '#334155' }}>
                {val}
              </div>
            );
          })}
        </div>
      ))}

      {/* Footer */}
      <div style={{ padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#FAFCFC' }}>
        <div style={{ fontSize: 12, color: '#94A3B8', display: 'flex', alignItems: 'center', gap: 6 }}>
          <InfoIcon size={14} /> Based on price, unit value, delivery time, ratings and offers
        </div>
        <div style={{ fontSize: 12, color: '#94A3B8', display: 'flex', alignItems: 'center', gap: 6 }}>
          Prices updated 2 hours ago <RotateCw size={12} />
        </div>
      </div>
    </div>
  );
}

// ─── Right Panel: You Can Save ──────────────────────────────────────────────────
export function YouCanSavePanel() {
  return (
    <div style={{ background: '#FFFFFF', border: '1px solid #F1F5F9', borderRadius: 20, padding: 24, marginBottom: 20 }}>
      <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', margin: '0 0 16px 0' }}>You Can Save</h3>
      <div style={{ background: '#F0FDF4', border: '1px solid #D1FAE5', borderRadius: 14, padding: 20, display: 'flex', gap: 16, alignItems: 'flex-start' }}>
        <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#D1FAE5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, position: 'relative' }}>
          <BellIcon size={20} color="#10B981" />
          <div style={{ position: 'absolute', top: 2, right: 2, width: 10, height: 10, background: '#10B981', borderRadius: '50%', border: '2px solid #F0FDF4' }} />
        </div>
        <div>
          <p style={{ fontSize: 12, color: '#64748B', margin: '0 0 6px 0' }}>Buy Dhara Refined Oil from Amazon Fresh and save</p>
          <div style={{ fontSize: 22, fontWeight: 900, color: '#0F172A' }}>₹23 <span style={{ fontSize: 14, fontWeight: 600, color: '#10B981' }}>(11%)</span></div>
          <p style={{ fontSize: 11, color: '#94A3B8', margin: '8px 0 0 0' }}>Compared to Saffola Gold on BigBasket</p>
        </div>
      </div>
    </div>
  );
}

// ─── Right Panel: Price Trend ───────────────────────────────────────────────────
export function PriceTrendPanel() {
  return (
    <div style={{ background: '#FFFFFF', border: '1px solid #F1F5F9', borderRadius: 20, padding: 24, marginBottom: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', margin: 0 }}>Price Trend</h3>
        <span style={{ fontSize: 11, color: '#64748B', background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '4px 10px', borderRadius: 6 }}>Last 30 Days ▾</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
        <div style={{ width: 40, height: 40, borderRadius: 8, background: '#154539', overflow: 'hidden', flexShrink: 0 }}>
          <img src="https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=80&h=80&q=80" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A' }}>Saffola Gold 1L</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 18, fontWeight: 800, color: '#0F172A' }}>₹199</span>
            <span style={{ fontSize: 12, color: '#10B981', fontWeight: 600 }}>↓ ₹6 (2.9%)</span>
          </div>
        </div>
      </div>

      <div style={{ height: 100 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={trendData}>
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
    { name: 'India Gate Basmati Rice 1kg', sub: 'Compare 4 stores', save: 'Save up to ₹35', img: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=80&h=80&q=80' },
    { name: 'Amul Butter 100g', sub: 'Compare 3 stores', save: 'Save up to ₹10', img: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=80&h=80&q=80' },
    { name: 'Ariel Matic 1kg', sub: 'Compare 4 stores', save: 'Save up to ₹46', img: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?auto=format&fit=crop&w=80&h=80&q=80' },
  ];

  return (
    <div style={{ background: '#FFFFFF', border: '1px solid #F1F5F9', borderRadius: 20, padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', margin: 0 }}>Smart Picks for You</h3>
        <a href="#" style={{ fontSize: 12, color: '#10B981', fontWeight: 600, textDecoration: 'none' }}>View All</a>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 20 }}>
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

      <button style={{ width: '100%', padding: '10px 0', background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 10, fontSize: 13, fontWeight: 600, color: '#154539', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
        Compare More Products →
      </button>
    </div>
  );
}

// ─── Main Compare Content ───────────────────────────────────────────────────────
export function CompareContent() {
  const [activeTab, setActiveTab] = useState('Products');
  const tabs = [
    { label: 'Products', icon: '🛍️' },
    { label: 'Stores', icon: '🏪' },
    { label: 'Categories', icon: '📋' },
    { label: 'My Comparisons', icon: '👤' },
  ];

  return (
    <div>
      {/* Tabs */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 32 }}>
        {tabs.map(tab => (
          <button key={tab.label} onClick={() => setActiveTab(tab.label)} style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '10px 20px', borderRadius: 12,
            background: activeTab === tab.label ? '#F0FDF4' : '#FFFFFF',
            border: activeTab === tab.label ? '1.5px solid #10B981' : '1px solid #E2E8F0',
            color: activeTab === tab.label ? '#154539' : '#64748B',
            fontWeight: activeTab === tab.label ? 700 : 500,
            fontSize: 14, cursor: 'pointer'
          }}>
            <span>{tab.icon}</span> {tab.label}
          </button>
        ))}
      </div>

      {/* Product Cards Grid */}
      <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0F172A', margin: '0 0 16px 0' }}>Compare Products</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16, marginBottom: 32 }}>
        {products.map((p, i) => <ProductCard key={i} product={p} onRemove={() => {}} />)}
        <AddProductCard />
      </div>

      {/* Comparison Results */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0F172A', margin: 0 }}>Comparison Results</h3>
        <a href="#" style={{ fontSize: 13, color: '#10B981', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
          View Detailed Analysis <ArrowUpRight size={14} />
        </a>
      </div>
      <ComparisonTable />
    </div>
  );
}

// Inline icons
function InfoIcon(props) {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>;
}
function BellIcon(props) {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>;
}
