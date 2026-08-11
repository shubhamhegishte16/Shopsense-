import { ArrowRight, ArrowUp, ArrowDown, ShoppingCart, RefreshCw } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

// ─── Hero Savings Card ──────────────────────────────────────────────────────────
export function OptimizerHero({ data }) {
  const totalSavings = data?.totalSavings ?? 1284;
  const score = data?.shoppingScore ?? 94;
  const scoreDiff = data?.scoreDiff ?? '8% vs last month';
  const budgetUsedPct = data?.budget?.usedPct ?? 78;

  return (
    <div style={{
      background: 'linear-gradient(110deg, #154539 0%, #0F3028 100%)',
      borderRadius: 24,
      padding: '36px 40px',
      marginBottom: 24,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'stretch',
      gap: 32,
      position: 'relative',
      overflow: 'hidden',
      boxShadow: '0 24px 40px rgba(21,69,57,0.15)'
    }}>
      {/* Decorative glow */}
      <div style={{ position: 'absolute', top: -80, left: -40, width: 250, height: 250, background: 'radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 70%)', borderRadius: '50%' }} />

      {/* Left: Savings Info */}
      <div style={{ flex: 1 }}>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.65)', marginBottom: 8 }}>AI found potential savings of</p>
        <div style={{ fontSize: 52, fontWeight: 900, color: '#FFFFFF', letterSpacing: '-2px', marginBottom: 8 }}>₹{totalSavings.toLocaleString()}</div>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.65)', marginBottom: 32 }}>this month by optimizing your shopping.</p>
        <button style={{
          background: 'rgba(255,255,255,0.12)',
          color: '#FFFFFF',
          border: '1px solid rgba(255,255,255,0.25)',
          borderRadius: 12,
          padding: '14px 24px',
          fontSize: 14,
          fontWeight: 600,
          display: 'inline-flex',
          alignItems: 'center',
          gap: 10,
          cursor: 'pointer',
          backdropFilter: 'blur(4px)'
        }}>
          <OptimizeIcon size={18} color="#10B981" />
          Optimize My Shopping
        </button>
      </div>

      {/* Right: Score + Budget */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, minWidth: 220 }}>
        {/* Shopping Score */}
        <div style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: '20px 24px' }}>
          <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', fontWeight: 700, letterSpacing: 1, margin: '0 0 12px 0' }}>SHOPPING SCORE</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ position: 'relative', width: 72, height: 72 }}>
              <svg width="72" height="72" viewBox="0 0 72 72">
                <circle cx="36" cy="36" r="30" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="6" />
                <circle cx="36" cy="36" r="30" fill="none" stroke="#10B981" strokeWidth="6"
                  strokeDasharray={`${2 * Math.PI * 30 * (score / 100)} ${2 * Math.PI * 30 * (1 - score / 100)}`}
                  strokeLinecap="round"
                  transform="rotate(-90 36 36)" />
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 16, fontWeight: 800, color: '#FFFFFF' }}>{score}%</span>
                <span style={{ fontSize: 8, color: '#10B981', fontWeight: 700 }}>
                  {score >= 90 ? 'Excellent' : score >= 75 ? 'Good' : 'Fair'}
                </span>
              </div>
            </div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', gap: 4 }}>
              <ArrowUp size={12} color="#10B981" /> {scoreDiff}
            </div>
          </div>
        </div>

        {/* Budget Status */}
        <div style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: '20px 24px' }}>
          <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', fontWeight: 700, letterSpacing: 1, margin: '0 0 12px 0' }}>BUDGET STATUS</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(16,185,129,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CreditCardIcon size={16} color="#10B981" />
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#FFFFFF' }}>
                {budgetUsedPct > 100 ? 'Over Budget' : budgetUsedPct > 85 ? 'Critical' : 'On Track'}
              </div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>
                {budgetUsedPct > 100 ? 'Reduce spending!' : "You're doing great!"}
              </div>
            </div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 999, height: 6, overflow: 'hidden' }}>
            <div style={{ width: `${Math.min(100, budgetUsedPct)}%`, height: '100%', background: budgetUsedPct > 100 ? '#EF4444' : '#10B981', borderRadius: 999 }} />
          </div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 6 }}>{budgetUsedPct}% used</div>
        </div>
      </div>
    </div>
  );
}

// ─── Insight Cards ──────────────────────────────────────────────────────────────
export function InsightCards({ cards = [] }) {
  const getIconConfig = (type) => {
    switch (type) {
      case 'duplicate':
        return { icon: <DuplicateIcon size={22} color="#10B981" />, iconBg: '#D1FAE5' };
      case 'pricedrop':
        return { icon: <TagIcon size={22} color="#8B5CF6" />, iconBg: '#EDE9FE' };
      case 'bulk':
        return { icon: <ShoppingCart size={22} color="#3B82F6" />, iconBg: '#DBEAFE' };
      case 'impulse':
        return { icon: <WasteIcon size={22} color="#EF4444" />, iconBg: '#FEE2E2' };
      default:
        return { icon: <ShoppingCart size={22} color="#10B981" />, iconBg: '#D1FAE5' };
    }
  };

  const localCards = cards.length > 0 ? cards : [
    {
      type: 'duplicate',
      title: 'Duplicate Detector',
      body: 'You bought Toothpaste 5 days ago. Do you really need another one?',
      linkText: 'View Item',
    },
    {
      type: 'pricedrop',
      title: 'Price Drop Alert',
      body: 'Cooking Oil prices likely to drop in 10 days. Wait and save up to ₹45',
      linkText: 'View Forecast',
    },
    {
      type: 'bulk',
      title: 'Bulk Buying Suggestion',
      body: 'Buy 5kg Rice instead of 1kg every week. Estimated yearly savings ₹642',
      linkText: 'View Forecast',
    },
    {
      type: 'impulse',
      title: 'Wasted Money',
      body: 'Impulse spending ₹1,254 mostly on snacks after 8 PM.',
      linkText: 'See Breakdown',
    },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 32 }}>
      {localCards.map((card, i) => {
        const config = getIconConfig(card.type);
        return (
          <div key={i} style={{ background: '#FFFFFF', border: '1px solid #F1F5F9', borderRadius: 20, padding: '20px 20px 16px', boxShadow: '0 2px 12px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: config.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {config.icon}
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A', paddingTop: 8 }}>{card.title}</div>
            </div>
            <p style={{ fontSize: 13, color: '#64748B', lineHeight: 1.5, margin: '0 0 16px 0' }}>{card.body}</p>
            <a href="#" style={{ fontSize: 13, color: '#154539', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
              {card.linkText} →
            </a>
          </div>
        );
      })}
    </div>
  );
}

// ─── Bottom: Recommendations + Reorder ─────────────────────────────────────────
export function BottomSection({ recommendations = [], reorders = [] }) {
  const localRecs = recommendations.length > 0 ? recommendations : [
    { name: "Switch to 'Fortune Sunlite Oil' instead of 'Saffola Gold'", sub: 'Similar quality, 4.8 ★ rating', unit: 'per unit', save: '₹48' },
    { name: 'Mother Dairy Butter is cheaper on Amazon Fresh.', sub: 'Same quality', unit: 'per unit', save: '₹9' },
    { name: 'Remove duplicate shampoo from your list.', sub: 'You have enough stock', unit: 'this month', save: '₹120' },
  ];

  const localReorders = reorders.length > 0 ? reorders : [
    { name: 'Milk (Amul)', sub: 'Every 8 days', next: 'Next in 2 days', date: '24 May' },
    { name: 'Sunflower Oil', sub: 'Every 30 days', next: 'Next in 12 days', date: '1 Jun' },
    { name: 'Washing Powder', sub: 'Every 28 days', next: 'Next in 8 days', date: '30 May' },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
      {/* Recommendations */}
      <div style={{ background: '#FFFFFF', border: '1px solid #F1F5F9', borderRadius: 20, padding: 28, boxShadow: '0 2px 12px rgba(0,0,0,0.02)' }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0F172A', margin: '0 0 24px 0' }}>Top Recommendations for You</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {localRecs.map((r, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 48, height: 48, borderRadius: 10, background: '#F8FAFC', border: '1px solid #E2E8F0', overflow: 'hidden', flexShrink: 0 }}>
                <img src={`https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=48&h=48&sig=${i}`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => e.target.style.display = 'none'} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#0F172A', marginBottom: 3 }}>{r.name}</div>
                <div style={{ fontSize: 12, color: '#94A3B8' }}>{r.sub}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: '#10B981' }}>Save {r.save}</div>
                <div style={{ fontSize: 11, color: '#94A3B8' }}>{r.unit}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reorder Insights */}
      <div style={{ background: '#FFFFFF', border: '1px solid #F1F5F9', borderRadius: 20, padding: 28, boxShadow: '0 2px 12px rgba(0,0,0,0.02)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0F172A', margin: 0 }}>Subscription & Reorder Insights</h3>
          <a href="#" style={{ fontSize: 12, color: '#10B981', fontWeight: 600, textDecoration: 'none' }}>View All</a>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {localReorders.map((r, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 48, height: 48, borderRadius: 10, background: '#F8FAFC', border: '1px solid #E2E8F0', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>
                {r.name.toLowerCase().includes('milk') ? '🥛' : r.name.toLowerCase().includes('oil') ? '🌻' : '🧺'}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#0F172A', marginBottom: 3 }}>{r.name}</div>
                <div style={{ fontSize: 12, color: '#94A3B8' }}>{r.sub}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#10B981', marginBottom: 3 }}>{r.next}</div>
                <div style={{ fontSize: 11, color: '#94A3B8' }}>{r.date}</div>
              </div>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#F0FDF4', border: '1px solid #D1FAE5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <RefreshCw size={14} color="#10B981" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Right Panel: Savings Breakdown ────────────────────────────────────────────
export function SavingsBreakdownPanel({ categoryData = [], totalSavings = 1284 }) {
  const defaultData = [
    { name: 'Groceries', value: 620, color: '#10B981', percent: '48%' },
    { name: 'Daily Needs', value: 354, color: '#F59E0B', percent: '28%' },
    { name: 'Electronics', value: 310, color: '#8B5CF6', percent: '24%' },
  ];

  const data = categoryData.length > 0 ? categoryData : defaultData;

  return (
    <div style={{ background: '#FFFFFF', border: '1px solid #F1F5F9', borderRadius: 20, padding: 24, marginBottom: 20, boxShadow: '0 2px 12px rgba(0,0,0,0.02)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', margin: 0 }}>Savings Breakdown</h3>
        <span style={{ fontSize: 11, color: '#64748B', background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '4px 8px', borderRadius: 6 }}>This Month ▾</span>
      </div>

      <div style={{ height: 170, position: 'relative', marginBottom: 20 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} innerRadius={58} outerRadius={80} paddingAngle={3} dataKey="value" stroke="none">
              {data.map((entry, i) => <Cell key={i} fill={entry.color} />)}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: '#0F172A' }}>₹{totalSavings.toLocaleString()}</div>
          <div style={{ fontSize: 10, color: '#94A3B8', fontWeight: 600 }}>Total Savings</div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {data.map((d, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 13 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: d.color }} />
              <span style={{ color: '#334155', fontWeight: 500 }}>{d.name}</span>
            </div>
            <div style={{ display: 'flex', gap: 16 }}>
              <span style={{ color: '#94A3B8', width: 45, textAlign: 'right' }}>{d.percent}</span>
              <span style={{ fontWeight: 700, color: '#0F172A' }}>₹{d.value}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Right Panel: Store Optimizer ──────────────────────────────────────────────
export function StoreOptimizerPanel({ stores = [] }) {
  const defaultStores = [
    { name: 'Blinkit', price: '₹2,180', tag: 'Cheapest', tagColor: '#10B981', tagBg: '#D1FAE5' },
    { name: 'Zepto', price: '₹2,410', tag: '+₹230', tagColor: '#EF4444', tagBg: '#FEE2E2' },
    { name: 'Instamart', price: '₹2,365', tag: '+₹185', tagColor: '#EF4444', tagBg: '#FEE2E2' },
  ];

  const localStores = stores.length > 0 ? stores : defaultStores;

  return (
    <div style={{ background: '#FFFFFF', border: '1px solid #F1F5F9', borderRadius: 20, padding: 24, marginBottom: 20, boxShadow: '0 2px 12px rgba(0,0,0,0.02)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', margin: 0 }}>Store Optimizer</h3>
        <span style={{ fontSize: 11, color: '#64748B', background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '4px 8px', borderRadius: 6 }}>This Week ▾</span>
      </div>
      <p style={{ fontSize: 12, color: '#94A3B8', margin: '0 0 20px 0' }}>Based on your recent grocery items</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {localStores.map((s, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: '#F8FAFC', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>
              {s.name.includes('Blinkit') ? '🟡' : s.name.includes('Zepto') ? '🔵' : '🟠'}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#0F172A' }}>{s.name}</div>
            </div>
            <div style={{ fontSize: 14, fontWeight: 800, color: '#0F172A' }}>{s.price}</div>
            <div style={{ background: s.tagBg, color: s.tagColor, fontSize: 11, fontWeight: 700, padding: '4px 8px', borderRadius: 6 }}>
              {s.tag}
            </div>
          </div>
        ))}
      </div>

      <a href="#" style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, color: '#10B981', fontWeight: 600, textDecoration: 'none', marginTop: 20 }}>
        Compare All Stores →
      </a>
    </div>
  );
}

// ─── Right Panel: AI Budget Planner ────────────────────────────────────────────
export function BudgetPlannerPanel({ budgetData }) {
  const budget = budgetData?.limit ?? 8000;
  const spent = budgetData?.spent ?? 6240;
  const remaining = budgetData?.remaining ?? (budget - spent);
  const pct = budgetData?.usedPct ?? Math.round((spent / budget) * 100);

  return (
    <div style={{ background: '#FFFFFF', border: '1px solid #F1F5F9', borderRadius: 20, padding: 24, boxShadow: '0 2px 12px rgba(0,0,0,0.02)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', margin: 0 }}>AI Budget Planner</h3>
        <span style={{ fontSize: 11, color: '#64748B', background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '4px 8px', borderRadius: 6 }}>This Month ▾</span>
      </div>
      <p style={{ fontSize: 12, color: '#94A3B8', margin: '0 0 16px 0' }}>Monthly Grocery Budget</p>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ fontSize: 28, fontWeight: 800, color: '#0F172A' }}>₹{budget.toLocaleString()}</div>
        <a href="#" style={{ fontSize: 12, color: '#10B981', fontWeight: 600, textDecoration: 'none' }}>Edit Budget</a>
      </div>

      <div style={{ background: '#F1F5F9', borderRadius: 999, height: 8, overflow: 'hidden', marginBottom: 16 }}>
        <div style={{ width: `${Math.min(100, pct)}%`, height: '100%', background: pct > 100 ? 'linear-gradient(90deg, #EF4444, #DC2626)' : 'linear-gradient(90deg, #10B981, #059669)', borderRadius: 999 }} />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 8 }}>
        <div>
          <div style={{ color: '#94A3B8', marginBottom: 2 }}>Spent</div>
          <div style={{ fontWeight: 700, color: '#0F172A' }}>₹{spent.toLocaleString()}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ color: '#94A3B8', marginBottom: 2 }}>Remaining</div>
          <div style={{ fontWeight: 700, color: pct > 100 ? '#EF4444' : '#10B981' }}>₹{remaining.toLocaleString()}</div>
        </div>
      </div>
      <div style={{ fontSize: 11, color: '#94A3B8' }}>{pct}% Used</div>
    </div>
  );
}

// ─── SVG Icons ─────────────────────────────────────────────────────────────────
function OptimizeIcon(props) {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>;
}
function DuplicateIcon(props) {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/><path d="M9 12h6"/><path d="M9 16h6"/></svg>;
}
function TagIcon(props) {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>;
}
function WasteIcon(props) {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>;
}
function CreditCardIcon(props) {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>;
}
