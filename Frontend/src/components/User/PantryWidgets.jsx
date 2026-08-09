import { useState } from 'react';
import { Search, Plus, Filter, ChevronDown, MoreVertical, ChevronLeft, ChevronRight, Calendar, Clock, ShoppingCart } from 'lucide-react';

// ─── Stat Cards ─────────────────────────────────────────────────────────────────
export function PantryStats() {
  const stats = [
    { label: 'Total Items', value: '58', sub: 'Items in pantry', valueColor: '#0F172A' },
    { label: 'Expiring Soon', value: '7', sub: 'Within 7 days', valueColor: '#F97316' },
    { label: 'Low Stock', value: '12', sub: 'Need to restock', valueColor: '#EF4444' },
    { label: 'Out of Stock', value: '5', sub: 'Items', valueColor: '#8B5CF6' },
    { label: 'Total Value', value: '₹2,846', sub: 'Estimated value', valueColor: '#10B981', wide: true },
  ];

  return (
    <div style={{ display: 'flex', gap: 16, marginBottom: 32 }}>
      {stats.map((s, i) => (
        <div key={i} style={{
          background: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: 16,
          padding: '20px 24px',
          flex: s.wide ? 1.2 : 1,
          boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
        }}>
          <div style={{ fontSize: 12, color: '#94A3B8', fontWeight: 500, marginBottom: 6 }}>{s.label}</div>
          <div style={{ fontSize: s.wide ? 26 : 28, fontWeight: 800, color: s.valueColor, lineHeight: 1.1, marginBottom: 4 }}>{s.value}</div>
          <div style={{ fontSize: 12, color: '#94A3B8' }}>{s.sub}</div>
        </div>
      ))}
    </div>
  );
}

// ─── Category Tabs ───────────────────────────────────────────────────────────────
export function CategoryTabs({ active, setActive }) {
  const tabs = ['All Items', 'Grains & Pulses', 'Snacks & Beverages', 'Dairy & Eggs', 'Spices & Oils'];
  return (
    <div style={{ display: 'flex', gap: 8, marginBottom: 24, overflowX: 'auto', paddingBottom: 4 }}>
      {tabs.map(tab => (
        <button key={tab} onClick={() => setActive(tab)} style={{
          padding: '10px 20px',
          borderRadius: 999,
          border: 'none',
          background: active === tab ? '#154539' : 'transparent',
          color: active === tab ? '#FFFFFF' : '#64748B',
          fontWeight: active === tab ? 700 : 500,
          fontSize: 14,
          cursor: 'pointer',
          whiteSpace: 'nowrap',
          transition: 'all 0.2s ease'
        }}>
          {tab}
        </button>
      ))}
    </div>
  );
}

// ─── Search & Controls ───────────────────────────────────────────────────────────
export function PantryControls() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 12, padding: '10px 16px', flex: 1, maxWidth: 280 }}>
        <Search size={16} color="#94A3B8" />
        <input type="text" placeholder="Search items..." style={{ border: 'none', outline: 'none', background: 'transparent', marginLeft: 10, fontSize: 14, color: '#0F172A', fontFamily: "'Inter', sans-serif", width: '100%' }} />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#64748B', fontWeight: 600 }}>
        Sort by:
      </div>
      <div style={{ display: 'flex', alignItems: 'center', background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 12, padding: '10px 14px', gap: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600, color: '#334155' }}>
        Expiry Date <ChevronDown size={14} color="#94A3B8" />
      </div>

      <button style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 12, padding: '10px 16px', fontSize: 13, fontWeight: 600, color: '#334155', cursor: 'pointer' }}>
        <Filter size={15} /> Filter
      </button>

      <button style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#154539', border: 'none', borderRadius: 12, padding: '10px 20px', fontSize: 13, fontWeight: 700, color: '#FFFFFF', cursor: 'pointer', marginLeft: 'auto', boxShadow: '0 4px 12px rgba(21,69,57,0.2)' }}>
        <Plus size={16} /> Add Item
      </button>
    </div>
  );
}

// ─── Item Card ───────────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const styles = {
    'In Stock': { bg: '#D1FAE5', color: '#065F46' },
    'Low Stock': { bg: '#FEF3C7', color: '#B45309' },
    'Expiring Soon': { bg: '#FEF3C7', color: '#B45309' },
    'Out of Stock': { bg: '#FEE2E2', color: '#991B1B' },
  };
  const s = styles[status] || { bg: '#F1F5F9', color: '#64748B' };
  return (
    <span style={{ background: s.bg, color: s.color, fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 6 }}>
      {status}
    </span>
  );
}

function ProgressBar({ pct }) {
  const color = pct <= 15 ? '#EF4444' : pct <= 30 ? '#F97316' : '#10B981';
  return (
    <div>
      <div style={{ background: '#F1F5F9', borderRadius: 999, height: 6, overflow: 'hidden', marginBottom: 4 }}>
        <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 999 }} />
      </div>
      <div style={{ fontSize: 11, fontWeight: 700, color, textAlign: 'right' }}>{pct}% Left</div>
    </div>
  );
}

function PantryItemCard({ item }) {
  return (
    <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 16, padding: 20, position: 'relative', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
      <button style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
        <MoreVertical size={16} color="#94A3B8" />
      </button>

      <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
        <div style={{ width: 64, height: 64, borderRadius: 12, background: '#F8FAFC', border: '1px solid #E2E8F0', overflow: 'hidden', flexShrink: 0 }}>
          <img src={item.img} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.target.style.display='none'; }} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', paddingRight: 20 }}>{item.name}</div>
          <div style={{ fontSize: 12, color: '#94A3B8', marginBottom: 10 }}>{item.qty}</div>
          <StatusBadge status={item.status} />
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#64748B', marginBottom: 14 }}>
        <Calendar size={13} color="#94A3B8" />
        {item.exp ? `Exp: ${item.exp}` : '- - - - - -'}
      </div>

      <ProgressBar pct={item.pct} />
    </div>
  );
}

// ─── Item Grid ───────────────────────────────────────────────────────────────────
export function PantryGrid() {
  const items = [
    { name: 'Aashirvaad Atta', qty: '5 kg', status: 'In Stock', exp: '24 Aug 2025', pct: 70, img: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=120&h=120&q=80' },
    { name: 'India Gate Basmati Rice', qty: '1 kg', status: 'In Stock', exp: '12 Oct 2025', pct: 85, img: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=120&h=120&q=80' },
    { name: 'Fortune Sunlite Oil', qty: '1 L', status: 'Low Stock', exp: '05 Aug 2025', pct: 20, img: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=120&h=120&q=80' },
    { name: 'Mother Dairy Milk', qty: '1 L', status: 'Expiring Soon', exp: '29 May 2025', pct: 10, img: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=120&h=120&q=80' },
    { name: 'Maggi 2-Min Noodles', qty: '280 g', status: 'Out of Stock', exp: null, pct: 0, img: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=120&h=120&q=80' },
  ];

  return (
    <div>
      <div style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', marginBottom: 16 }}>All Items (58)</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
        {items.map((item, i) => <PantryItemCard key={i} item={item} />)}
      </div>
      <Pagination />
    </div>
  );
}

// ─── Pagination ──────────────────────────────────────────────────────────────────
function Pagination() {
  const [page, setPage] = useState(1);
  const pages = [1, 2, 3, '...', 6];
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8 }}>
      <button onClick={() => setPage(p => Math.max(1, p-1))} style={pgBtn(false)}><ChevronLeft size={16} /></button>
      {pages.map((p, i) => (
        <button key={i} onClick={() => typeof p === 'number' && setPage(p)} style={pgBtn(p === page)}>
          {p}
        </button>
      ))}
      <button onClick={() => setPage(p => Math.min(6, p+1))} style={pgBtn(false)}><ChevronRight size={16} /></button>
    </div>
  );
}
const pgBtn = (active) => ({
  width: 36, height: 36, borderRadius: '50%', border: 'none',
  background: active ? '#154539' : '#FFFFFF',
  color: active ? '#FFFFFF' : '#64748B',
  fontWeight: active ? 700 : 500, fontSize: 14,
  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
  boxShadow: active ? '0 4px 10px rgba(21,69,57,0.2)' : 'none',
});

// ─── Right: Expiry Calendar ──────────────────────────────────────────────────────
export function ExpiryCalendarPanel() {
  const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  const dates = [
    { d: 26, dot: '#10B981' }, { d: 27, dot: '#10B981' }, { d: 28, dot: '#EF4444' },
    { d: 29, dot: null, active: true }, { d: 30, dot: '#10B981' }, { d: 31, dot: null }, { d: 1, dot: null, dim: true }
  ];

  return (
    <div style={{ background: '#FFFFFF', border: '1px solid #F1F5F9', borderRadius: 20, padding: 24, marginBottom: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', margin: 0 }}>Expiry Calendar</h3>
        <a href="#" style={{ fontSize: 12, color: '#10B981', fontWeight: 600, textDecoration: 'none' }}>View Calendar →</a>
      </div>

      <div style={{ fontSize: 14, fontWeight: 600, color: '#0F172A', marginBottom: 12 }}>May</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 8 }}>
        {days.map(d => <div key={d} style={{ fontSize: 10, color: '#94A3B8', fontWeight: 600, textAlign: 'center' }}>{d}</div>)}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 16 }}>
        {dates.map((item, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              background: item.active ? '#154539' : 'transparent',
              color: item.active ? '#FFFFFF' : item.dim ? '#CBD5E1' : '#0F172A',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 13, fontWeight: item.active ? 700 : 500
            }}>{item.d}</div>
            {item.dot && <div style={{ width: 5, height: 5, borderRadius: '50%', background: item.dot }} />}
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#64748B' }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#F97316' }} /> Expiring Soon (1–3 days)
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#64748B' }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#EAB308' }} /> Expiring (4–7 days)
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#64748B' }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#EF4444' }} /> Expired
        </div>
      </div>
    </div>
  );
}

// ─── Right: Smart Alerts ─────────────────────────────────────────────────────────
export function SmartAlertsPanel() {
  return (
    <div style={{ background: '#FFFFFF', border: '1px solid #F1F5F9', borderRadius: 20, padding: 24, marginBottom: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', margin: 0 }}>Smart Alerts</h3>
        <a href="#" style={{ fontSize: 12, color: '#10B981', fontWeight: 600, textDecoration: 'none' }}>View All →</a>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
          <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Clock size={18} color="#D97706" />
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#0F172A', marginBottom: 4 }}>7 items are expiring soon.</div>
            <a href="#" style={{ fontSize: 12, color: '#10B981', fontWeight: 600, textDecoration: 'none' }}>Check now →</a>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
          <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <CartIcon size={18} color="#DC2626" />
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#0F172A', marginBottom: 4 }}>You are low on 12 items.</div>
            <a href="#" style={{ fontSize: 12, color: '#10B981', fontWeight: 600, textDecoration: 'none' }}>Restock now →</a>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Right: Pantry Insights ──────────────────────────────────────────────────────
export function PantryInsightsPanel() {
  return (
    <div style={{ background: '#FFFFFF', border: '1px solid #F1F5F9', borderRadius: 20, padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', margin: 0 }}>Pantry Insights</h3>
        <span style={{ fontSize: 11, color: '#64748B', background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '4px 8px', borderRadius: 6 }}>This Month</span>
      </div>

      <div style={{ display: 'flex', gap: 24, marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#F0FDF4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Plus size={16} color="#10B981" />
          </div>
          <div>
            <div style={{ fontSize: 11, color: '#94A3B8', fontWeight: 600 }}>ITEMS ADDED</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#0F172A' }}>12</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#F0FDF4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <BagIcon size={16} color="#10B981" />
          </div>
          <div>
            <div style={{ fontSize: 11, color: '#94A3B8', fontWeight: 600 }}>ITEMS USED</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#0F172A' }}>18</div>
          </div>
        </div>
      </div>

      {/* Wastage Saved Card */}
      <div style={{ background: '#F0FDF4', borderRadius: 14, padding: '16px 20px', marginBottom: 20 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: '#065F46', marginBottom: 6 }}>Wastage Saved</div>
        <div style={{ fontSize: 24, fontWeight: 900, color: '#154539' }}>₹356</div>
        <div style={{ fontSize: 12, color: '#64748B', marginTop: 4 }}>By tracking on time!</div>
        {/* Mini sparkline */}
        <svg width="100%" height="32" viewBox="0 0 160 32" style={{ marginTop: 8 }}>
          <path d="M0 28 Q 40 20 80 24 T 160 8" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </div>

      {/* Need Something */}
      <div style={{ background: 'linear-gradient(135deg, #154539 0%, #0F3028 100%)', borderRadius: 16, padding: '20px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', right: 0, bottom: 0, opacity: 0.15, fontSize: 64 }}>🧺</div>
        <div style={{ fontSize: 16, fontWeight: 800, color: '#FFFFFF', marginBottom: 8 }}>Need something?</div>
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', margin: '0 0 16px 0', lineHeight: 1.5 }}>
          Add items to your shopping list from pantry in one click.
        </p>
        <button style={{ background: '#FFFFFF', border: 'none', borderRadius: 10, padding: '10px 16px', fontSize: 12, fontWeight: 700, color: '#154539', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
          Go to Shopping List →
        </button>
      </div>
    </div>
  );
}

// Inline icons
function CartIcon(props) {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>;
}
function BagIcon(props) {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>;
}
