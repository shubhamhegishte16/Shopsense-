import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles, ArrowRight, ShieldAlert, ArrowUpRight, Upload,
  ArrowDown, ArrowUp, Link as LinkIcon, Globe, Bell, Settings,
  ChevronDown, Search, X
} from 'lucide-react';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import useWindowWidth, { isMobile } from '../../hooks/useWindowWidth';

// ─── TopNav (embedded here to stay self-contained) ─────────────────────────
export function DashboardTopNav({ titleNode }) {
  const navigate = useNavigate();
  const width = useWindowWidth();
  const mobile = isMobile(width);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: mobile ? '14px 16px' : '32px 40px 24px',
      background: '#FBF6EE', position: 'sticky', top: 0, zIndex: 10,
      borderBottom: mobile ? '1px solid rgba(21,69,57,0.06)' : 'none',
      width: '100%', boxSizing: 'border-box'
    }}>
      {mobile ? (
        <>
          {searchOpen ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', background: '#FFF', border: '1px solid #E2E8F0', borderRadius: 12, padding: '9px 12px', flex: 1 }}>
                <Search size={16} color="#94A3B8" />
                <input type="text" placeholder="Search..." autoFocus
                  style={{ border: 'none', outline: 'none', background: 'transparent', marginLeft: 8, width: '100%', fontSize: 14, color: '#0F172A', fontFamily: "'Inter', sans-serif" }}
                />
              </div>
              <button onClick={() => setSearchOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
                <X size={20} color="#64748B" />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flex: 1 }}>
              <span style={{ fontSize: 17, fontWeight: 800, color: '#0F172A', letterSpacing: '-0.3px' }}>ShopSense</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <button onClick={() => setSearchOpen(true)} style={iconBtn}>
                  <Search size={17} color="#334155" />
                </button>
                <button onClick={() => navigate('/notifications')} style={{ ...iconBtn, position: 'relative' }}>
                  <Bell size={17} color="#334155" />
                  <div style={{ position: 'absolute', top: 9, right: 11, width: 7, height: 7, background: '#10B981', borderRadius: '50%', border: '2px solid #FFF' }} />
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
          {/* Top Row: Title + Icons */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: titleNode ? 24 : 0, width: '100%' }}>
            <div>{titleNode}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <button onClick={() => navigate('/notifications')} style={{ ...iconBtn44, position: 'relative' }}>
                <Bell size={20} color="#334155" />
                <div style={{ position: 'absolute', top: 10, right: 12, width: 8, height: 8, background: '#10B981', borderRadius: '50%', border: '2px solid #FFF' }} />
              </button>
              <button onClick={() => navigate('/settings')} style={iconBtn44}>
                <Settings size={20} color="#334155" />
              </button>
            </div>
          </div>
          {/* Search Row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 16, padding: '10px 16px', width: '100%', maxWidth: 480, boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
              <Search size={20} color="#94A3B8" />
              <input type="text" placeholder="Search for products, brands or insights..."
                style={{ border: 'none', outline: 'none', background: 'transparent', marginLeft: 12, width: '100%', fontSize: 14, color: '#0F172A', fontFamily: "'Inter', sans-serif" }}
              />
              <div style={{ background: '#F1F5F9', padding: '4px 8px', borderRadius: 6, fontSize: 12, fontWeight: 600, color: '#64748B', letterSpacing: 1 }}>⌘ K</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const iconBtn = {
  width: 38, height: 38, borderRadius: '50%', border: '1px solid #E2E8F0',
  background: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
};
const iconBtn44 = {
  width: 44, height: 44, borderRadius: '50%', border: '1px solid #E2E8F0',
  background: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
};

// ─── Hero Card ─────────────────────────────────────────────────────────────
export function HeroCard({ data }) {
  const { totalSaved = 0, betterDeals = 0, increases = 0, recallAlert = 0 } = data || {};
  const width = useWindowWidth();
  const mobile = isMobile(width);

  return (
    <div style={{
      background: 'linear-gradient(110deg, #154539 0%, #0F3028 100%)',
      borderRadius: 24, padding: mobile ? 20 : 40, color: '#FFFFFF',
      position: 'relative', overflow: 'hidden',
      boxShadow: '0 24px 40px rgba(21,69,57,0.15)', marginBottom: 32
    }}>
      <div style={{ position: 'absolute', top: -100, right: -50, width: 300, height: 300, background: 'radial-gradient(circle, rgba(16,185,129,0.15) 0%, rgba(0,0,0,0) 70%)', borderRadius: '50%' }} />
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.1)', padding: '6px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600, marginBottom: 20, border: '1px solid rgba(255,255,255,0.05)' }}>
        <Sparkles size={14} /> AI Insight
      </div>
      <div style={{ fontSize: mobile ? 28 : 40, fontWeight: 800, marginBottom: 8, letterSpacing: '-1px' }}>
        You saved <span style={{ color: '#10B981' }}>₹{totalSaved.toLocaleString('en-IN')}</span>
      </div>
      <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.7)', marginBottom: mobile ? 20 : 40 }}>
        this month with smarter choices.
      </div>
      <div style={{ display: 'flex', flexDirection: mobile ? 'column' : 'row', gap: 16, marginBottom: mobile ? 20 : 40 }}>
        <StatBadge icon={Sparkles}      label="TOTAL SAVED"  value={`₹${totalSaved.toLocaleString('en-IN')}`} color="#10B981" />
        <StatBadge icon={TagIcon}       label="BETTER DEALS" value={betterDeals}  color="#3B82F6" />
        <StatBadge icon={ArrowUpRight}  label="INCREASES"    value={increases}    color="#F59E0B" />
        <StatBadge icon={ShieldAlert}   label="RECALL ALERT" value={recallAlert}  color="#8B5CF6" />
      </div>
      <Link to="/insights" style={{
        background: '#FFFFFF', color: '#0F172A', border: 'none', borderRadius: 999,
        padding: '14px 28px', fontSize: 14, fontWeight: 700,
        display: 'inline-flex', alignItems: 'center', gap: 8, cursor: 'pointer',
        boxShadow: '0 8px 16px rgba(0,0,0,0.1)', textDecoration: 'none'
      }}>
        View AI Report <ArrowRight size={16} />
      </Link>
    </div>
  );
}

function StatBadge({ icon: Icon, label, value, color }) {
  return (
    <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12, minWidth: 0, flex: 1 }}>
      <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon size={18} color={color} />
      </div>
      <div>
        <div style={{ fontSize: 18, fontWeight: 700 }}>{value}</div>
        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', fontWeight: 600, letterSpacing: 0.5 }}>{label}</div>
      </div>
    </div>
  );
}

function TagIcon(props) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
      <line x1="7" y1="7" x2="7.01" y2="7" />
    </svg>
  );
}

// ─── Shopping DNA Card ─────────────────────────────────────────────────────
export function ShoppingDNACard({ data }) {
  const { score = 50, persona = 'Casual Shopper', pointsChange = 0 } = data || {};
  const width = useWindowWidth();
  const mobile = isMobile(width);
  const positive = pointsChange >= 0;

  return (
    <div style={cardStyle}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
        <div style={iconWrapperStyle('#E0F2FE', '#0EA5E9')}><LinkIcon size={16} color="#0EA5E9" /></div>
        <h4 style={cardTitleStyle}>Shopping DNA</h4>
      </div>
      <div style={{ fontSize: mobile ? 38 : 48, fontWeight: 800, color: '#0F172A', letterSpacing: '-2px', display: 'flex', alignItems: 'baseline', gap: 4 }}>
        {score} <span style={{ fontSize: 16, fontWeight: 600, color: '#94A3B8', letterSpacing: 0 }}>/ 100</span>
      </div>
      <div style={{ fontSize: 14, fontWeight: 600, color: '#334155', marginTop: 8 }}>{persona}</div>
      <div style={{ fontSize: 12, color: positive ? '#10B981' : '#EF4444', display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
        {positive ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
        {Math.abs(pointsChange)} pts <span style={{ color: '#94A3B8' }}>vs last month</span>
      </div>
      <div style={{ height: 60, marginTop: 24, position: 'relative' }}>
        <svg width="100%" height="100%" viewBox="0 0 200 60" preserveAspectRatio="none">
          <path d="M0 60 Q 50 20 100 40 T 200 10" fill="none" stroke="#10B981" strokeWidth="3" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  );
}

// ─── AI Savings Card ────────────────────────────────────────────────────────
export function AISavingsCard({ data }) {
  const { potentialSavings = 0 } = data || {};
  return (
    <div style={cardStyle}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
        <div style={iconWrapperStyle('#D1FAE5', '#10B981')}><Globe size={16} color="#10B981" /></div>
        <h4 style={cardTitleStyle}>AI Savings</h4>
      </div>
      <div style={{ fontSize: 36, fontWeight: 800, color: '#0F172A', letterSpacing: '-1px' }}>
        ₹{potentialSavings.toLocaleString('en-IN')}
      </div>
      <div style={{ fontSize: 12, color: '#64748B', lineHeight: 1.6, marginTop: 8, marginBottom: 24 }}>
        Estimated potential savings<br />based on your spending this month.
      </div>
      <Link to="/optimizer" style={{
        background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 999,
        padding: '10px 16px', fontSize: 13, fontWeight: 600,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        gap: 6, width: '100%', boxSizing: 'border-box', cursor: 'pointer',
        color: '#154539', textDecoration: 'none'
      }}>
        Optimize Now <ArrowRight size={14} />
      </Link>
    </div>
  );
}

// ─── Smart Receipt Card ─────────────────────────────────────────────────────
export function SmartReceiptCard() {
  return (
    <div style={{ ...cardStyle, borderStyle: 'dashed', borderWidth: 2, background: '#FAFCFC' }}>
      <div style={{ textAlign: 'center', marginBottom: 16 }}>
        <h4 style={{ ...cardTitleStyle, margin: '0 0 16px 0' }}>Smart Receipt</h4>
        <div style={{ width: 48, height: 48, background: '#F1F5F9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
          <ReceiptTextIcon size={24} color="#94A3B8" />
        </div>
        <p style={{ fontSize: 13, color: '#64748B', margin: 0, padding: '0 16px' }}>Drop your receipt here or click to upload</p>
      </div>
      <Link to="/receipts" style={{
        background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 999,
        padding: '10px 16px', fontSize: 13, fontWeight: 600,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        gap: 6, width: '100%', boxSizing: 'border-box', cursor: 'pointer',
        color: '#154539', textDecoration: 'none'
      }}>
        <Upload size={14} /> Upload Receipt
      </Link>
    </div>
  );
}

function ReceiptTextIcon({ size = 24, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z" />
      <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
      <path d="M12 17V7" />
    </svg>
  );
}

// ─── Price Radar Card ───────────────────────────────────────────────────────
export function PriceRadarCard({ data }) {
  const items = data || [];
  return (
    <div style={cardStyle}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
        <div style={iconWrapperStyle('#D1FAE5', '#10B981')}><TargetIcon size={16} color="#10B981" /></div>
        <h4 style={cardTitleStyle}>Price Radar</h4>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 24 }}>
        {items.length === 0 ? (
          <div style={{ fontSize: 13, color: '#94A3B8', textAlign: 'center', padding: '10px 0', lineHeight: 1.6 }}>
            Price changes will appear here<br />as you scan more receipts.
          </div>
        ) : (
          items.map((item, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 13, color: '#334155', fontWeight: 500 }}>{item.name}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: item.up ? '#EF4444' : '#10B981', fontSize: 13, fontWeight: 700 }}>
                {item.up ? <ArrowUp size={14} /> : <ArrowDown size={14} />} {item.price}
              </div>
            </div>
          ))
        )}
      </div>
      <Link to="/compare" style={{ fontSize: 12, color: '#10B981', textDecoration: 'none', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
        View All <ArrowRight size={12} />
      </Link>
    </div>
  );
}

function TargetIcon(props) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
    </svg>
  );
}

// ─── Recent Activity Card ───────────────────────────────────────────────────
export function RecentActivityCard({ data }) {
  const activities = data || [];
  return (
    <div style={cardStyle}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h4 style={cardTitleStyle}>Recent Activity</h4>
        <Link to="/receipts" style={{ fontSize: 12, color: '#10B981', textDecoration: 'none', fontWeight: 600 }}>View All</Link>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {activities.length === 0 ? (
          <div style={{ fontSize: 13, color: '#94A3B8', textAlign: 'center', padding: '20px 0' }}>
            No recent activity.<br />Upload a receipt to get started.
          </div>
        ) : (
          activities.map((act, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: act.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF', fontSize: 10, fontWeight: 800, textAlign: 'center', lineHeight: 1.1, flexShrink: 0 }}>
                {act.name.slice(0, 2).toUpperCase()}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A', marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{act.name}</div>
                <div style={{ fontSize: 12, color: '#94A3B8' }}>{act.time}</div>
              </div>
              <div style={{ background: '#D1FAE5', color: '#10B981', padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
                {act.saved}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ─── Spending Chart Card ────────────────────────────────────────────────────
export function SpendingChartCard({ data }) {
  const [period, setPeriod] = useState('thisMonth');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const thisMonthData  = data?.thisMonth      || [];
  const lastMonthData  = data?.lastMonth      || [];
  const thisMonthTotal = data?.thisMonthTotal ?? 0;
  const lastMonthTotal = data?.lastMonthTotal ?? 0;

  const chartData    = period === 'thisMonth' ? thisMonthData : lastMonthData;
  const displayTotal = period === 'thisMonth' ? thisMonthTotal : lastMonthTotal;

  // % change vs opposite period
  const pctChange = lastMonthTotal > 0
    ? Math.round(((thisMonthTotal - lastMonthTotal) / lastMonthTotal) * 100)
    : null;

  const periodLabel = period === 'thisMonth' ? 'This Month' : 'Last Month';

  return (
    <div style={cardStyle}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h4 style={{ ...cardTitleStyle, marginBottom: 8 }}>Your Spending</h4>
          <div style={{ fontSize: 28, fontWeight: 800, color: '#0F172A', letterSpacing: '-1px' }}>
            ₹{displayTotal.toLocaleString('en-IN')}
          </div>
          {pctChange !== null && (
            <div style={{ fontSize: 12, color: pctChange <= 0 ? '#10B981' : '#EF4444', display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
              {pctChange <= 0 ? <ArrowDown size={14} /> : <ArrowUp size={14} />}
              {Math.abs(pctChange)}% <span style={{ color: '#94A3B8' }}>vs last month</span>
            </div>
          )}
        </div>

        {/* Period toggle dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setDropdownOpen(o => !o)}
            style={{ display: 'flex', alignItems: 'center', gap: 6, border: '1px solid #E2E8F0', background: '#FFF', padding: '6px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600, color: '#64748B', cursor: 'pointer' }}
          >
            {periodLabel} <ChevronDown size={14} color="#94A3B8" />
          </button>
          {dropdownOpen && (
            <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: 6, background: '#FFF', border: '1px solid #E2E8F0', borderRadius: 12, padding: 6, boxShadow: '0 4px 12px rgba(0,0,0,0.08)', width: 130, zIndex: 20 }}>
              {['thisMonth', 'lastMonth'].map(opt => (
                <div
                  key={opt}
                  onClick={() => { setPeriod(opt); setDropdownOpen(false); }}
                  style={{ padding: '8px 12px', fontSize: 13, color: '#334155', cursor: 'pointer', borderRadius: 8, background: period === opt ? '#F8FAFC' : 'transparent', fontWeight: period === opt ? 600 : 400 }}
                >
                  {opt === 'thisMonth' ? 'This Month' : 'Last Month'}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div style={{ height: 120, width: '100%' }}>
        {chartData.length === 0 ? (
          <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, color: '#94A3B8' }}>
            No spending data for this period
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#10B981" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Tooltip
                contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                itemStyle={{ color: '#10B981', fontWeight: 700 }}
                formatter={v => [`₹${v.toLocaleString('en-IN')}`, 'Spent']}
              />
              <Area type="monotone" dataKey="value" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94A3B8' }} dy={10} />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

// ─── Pantry Essentials Card ─────────────────────────────────────────────────
export function PantryEssentialsCard({ data }) {
  const items = data || [];
  return (
    <div style={cardStyle}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h4 style={cardTitleStyle}>Pantry Essentials</h4>
        <Link to="/pantry" style={{ fontSize: 12, color: '#10B981', textDecoration: 'none', fontWeight: 600 }}>View All</Link>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {items.length === 0 ? (
          <div style={{ fontSize: 13, color: '#94A3B8', textAlign: 'center', padding: '20px 0' }}>No items expiring soon</div>
        ) : (
          items.map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>{item.icon}</div>
                <span style={{ fontSize: 14, color: '#0F172A', fontWeight: 600 }}>{item.name}</span>
              </div>
              <div style={{ background: item.bg, color: item.color, padding: '4px 10px', borderRadius: 20, fontSize: 10, fontWeight: 800, letterSpacing: 0.5 }}>{item.left}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ─── Shared Styles ──────────────────────────────────────────────────────────
const cardStyle = {
  background: '#FFFFFF', border: '1px solid #F1F5F9',
  borderRadius: 24, padding: 24, boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
};
const cardTitleStyle = { margin: 0, fontSize: 15, fontWeight: 700, color: '#0F172A' };
const iconWrapperStyle = (bg) => ({
  width: 28, height: 28, borderRadius: 8, background: bg,
  display: 'flex', alignItems: 'center', justifyContent: 'center'
});
