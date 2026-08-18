import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp, TrendingDown, ShoppingBag, Package, Star,
  ChevronRight, ArrowUpRight, ArrowDownRight, Zap, Tag,
  Clock, Percent, ChevronDown, Download, Calendar,
  CheckCircle2, Sparkles, BarChart2, PieChart
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, PieChart as RechartsPie, Pie
} from 'recharts';
import useWindowWidth, { isMobile } from '../../hooks/useWindowWidth';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function MiniTrendLine({ color, up }) {
  const points = up
    ? 'M0,18 C10,15 20,8 30,10 C40,12 50,5 60,2'
    : 'M0,2 C10,5 20,12 30,8 C40,4 50,14 60,18';
  return (
    <svg width="60" height="20" viewBox="0 0 60 20" fill="none">
      <path d={points} stroke={color} strokeWidth="2" strokeLinecap="round" fill="none" />
    </svg>
  );
}

const AreaTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: '#0F172A', borderRadius: 10, padding: '10px 14px', fontSize: 12, color: '#FFF', boxShadow: '0 8px 24px rgba(0,0,0,0.2)' }}>
        <div style={{ color: '#94A3B8', marginBottom: 4 }}>{label}</div>
        <div style={{ color: '#10B981', fontWeight: 700 }}>This: ₹{payload[0]?.value?.toLocaleString()}</div>
        <div style={{ color: '#94A3B8', fontWeight: 600 }}>Last: ₹{payload[1]?.value?.toLocaleString()}</div>
      </div>
    );
  }
  return null;
}

const BarTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: '#0F172A', borderRadius: 10, padding: '10px 14px', fontSize: 12, color: '#FFF' }}>
        <div style={{ color: '#94A3B8', marginBottom: 4 }}>{label}</div>
        <div style={{ color: '#10B981', fontWeight: 700 }}>This: ₹{payload[0]?.value?.toLocaleString()}</div>
        <div style={{ color: '#94A3B8', fontWeight: 600 }}>Last: ₹{payload[1]?.value?.toLocaleString()}</div>
      </div>
    );
  }
  return null;
}

// Map string icon names from API to Lucide components
const IconMap = {
  ShoppingBag,
  Package,
  BarChart2,
  Tag,
  Star,
  TrendingUp,
  Clock,
  Percent,
  Zap,
};

const getIcon = (iconName, DefaultIcon = Star) => {
  return IconMap[iconName] || DefaultIcon;
};

// ─── Exports ──────────────────────────────────────────────────────────────────

export function InsightsHeader() {
  const width = useWindowWidth();
  const mobile = isMobile(width);
  return (
    <div style={{ marginBottom: mobile ? 12 : 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
        <h1 style={{ fontSize: mobile ? 22 : 26, fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.5px' }}>Insights</h1>
        <Sparkles size={20} color="#F59E0B" />
      </div>
      <p style={{ fontSize: 14, color: '#64748B', margin: 0 }}>
        Understand your shopping behavior and spending patterns.
      </p>
    </div>
  );
}

export function InsightsActionBar({ period, setPeriod }) {
  const width = useWindowWidth();
  const mobile = isMobile(width);
  return (
    <div style={{ display: 'flex', flexDirection: mobile ? 'column' : 'row', alignItems: mobile ? 'stretch' : 'center', justifyContent: 'flex-end', gap: 12, marginBottom: 28, width: mobile ? '100%' : 'auto' }}>
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 8, border: '1px solid #E2E8F0', borderRadius: 10, padding: '8px 14px', fontSize: 13, fontWeight: 600, color: '#334155', background: '#FFFFFF', cursor: 'pointer' }}>
        <Calendar size={14} color="#64748B" />
        <select 
          value={period || 'this_month'} 
          onChange={e => setPeriod && setPeriod(e.target.value)}
          style={{ position: 'absolute', opacity: 0, width: '100%', height: '100%', left: 0, top: 0, cursor: 'pointer' }}
        >
          <option value="this_month">This Month</option>
          <option value="last_month">Last Month</option>
          <option value="all_time">All Time</option>
        </select>
        <span>{period === 'all_time' ? 'All Time' : period === 'last_month' ? 'Last Month' : 'This Month'}</span>
        <ChevronDown size={13} color="#94A3B8" />
      </div>
      <button style={{ display: 'flex', alignItems: 'center', gap: 8, border: '1px solid #E2E8F0', borderRadius: 10, padding: '8px 16px', fontSize: 13, fontWeight: 600, color: '#334155', background: '#FFFFFF', cursor: 'pointer' }}>
        <Download size={14} color="#64748B" />
        Export Report
      </button>
    </div>
  );
}

export function InsightStatCards({ stats = [] }) {
  const width = useWindowWidth();
  const mobile = isMobile(width);
  if (!stats.length) return null;
  return (
    <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : 'repeat(5, 1fr)', gap: 16, marginBottom: 28 }}>
      {stats.map((s, i) => {
        // Find icon based on label just for mapping the dynamically sent data
        let CardIcon = Star;
        if(s.label.includes('SPENT')) CardIcon = ShoppingBag;
        else if(s.label.includes('ORDERS')) CardIcon = Package;
        else if(s.label.includes('AVG')) CardIcon = BarChart2;
        else if(s.label.includes('SAVINGS')) CardIcon = Tag;

        return (
          <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            style={{ background: '#FFFFFF', borderRadius: 16, padding: '20px 20px 16px', border: '1px solid #F1F5F9', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: '#94A3B8', letterSpacing: 1 }}>{s.label}</span>
              <CardIcon size={16} color={s.color} />
            </div>
            <div style={{ fontSize: 22, fontWeight: 800, color: '#0F172A', letterSpacing: '-0.5px', marginBottom: 8 }}>{s.value}</div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: s.up ? '#10B981' : '#EF4444' }}>{s.change}</span>
              <MiniTrendLine color={s.color} up={s.up} />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

export function SpendingTrendPanel({ data = [] }) {
  const width = useWindowWidth();
  const mobile = isMobile(width);
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
      style={{ background: '#FFFFFF', borderRadius: 20, padding: '24px 28px', border: '1px solid #F1F5F9', boxShadow: '0 2px 12px rgba(0,0,0,0.04)', marginBottom: 24 }}>
      <div style={{ display: 'flex', flexDirection: mobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: mobile ? 'stretch' : 'center', marginBottom: 8, gap: mobile ? 12 : 0 }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: '#0F172A' }}>Spending Trend</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 11, color: '#64748B', fontWeight: 600 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><span style={{ display: 'inline-block', width: 16, height: 2, background: '#154539', borderRadius: 2 }} /> THIS MONTH</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><span style={{ display: 'inline-block', width: 16, height: 2, background: '#CBD5E1', borderRadius: 2 }} /> LAST MONTH</span>
          </div>
          <button style={{ display: 'flex', alignItems: 'center', gap: 4, border: '1px solid #E2E8F0', borderRadius: 8, padding: '4px 10px', fontSize: 12, fontWeight: 600, color: '#334155', background: '#FFF', cursor: 'pointer' }}>
            This Month <ChevronDown size={12} />
          </button>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="gradGreen" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#154539" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#154539" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gradGray" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#CBD5E1" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#CBD5E1" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
          <Tooltip content={<AreaTooltip />} />
          <Area type="monotone" dataKey="thisMonth" stroke="#154539" strokeWidth={2.5} fill="url(#gradGreen)" dot={false} />
          <Area type="monotone" dataKey="lastMonth" stroke="#CBD5E1" strokeWidth={2} fill="url(#gradGray)" dot={false} strokeDasharray="5 5" />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
}

export function SpendingByCategoryPanel({ data = [], totalSpent = 0 }) {
  const width = useWindowWidth();
  const mobile = isMobile(width);
  if (!data.length) return null;
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
      style={{ background: '#FFFFFF', borderRadius: 20, padding: '24px 28px', border: '1px solid #F1F5F9', boxShadow: '0 2px 12px rgba(0,0,0,0.04)', marginBottom: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: '#0F172A' }}>Spending by Category</div>
        <button style={{ display: 'flex', alignItems: 'center', gap: 4, border: '1px solid #E2E8F0', borderRadius: 8, padding: '4px 10px', fontSize: 12, fontWeight: 600, color: '#334155', background: '#FFF', cursor: 'pointer' }}>
          This Month <ChevronDown size={12} />
        </button>
      </div>
      <div style={{ display: 'flex', flexDirection: mobile ? 'column' : 'row', gap: 24, alignItems: mobile ? 'stretch' : 'center' }}>
        <div style={{ position: 'relative', width: mobile ? '100%' : 180, height: mobile ? 220 : 180, flexShrink: 0 }}>
          <RechartsPie width={180} height={180}>
            <Pie data={data} cx={85} cy={85} innerRadius={55} outerRadius={82} dataKey="value" startAngle={90} endAngle={-270} strokeWidth={0}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </RechartsPie>
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', textAlign: 'center', pointerEvents: 'none' }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#0F172A' }}>₹{Math.round(totalSpent).toLocaleString()}</div>
            <div style={{ fontSize: 10, color: '#94A3B8', fontWeight: 600 }}>TOTAL SPENT</div>
          </div>
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {data.map((cat, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: cat.color, flexShrink: 0 }} />
                <span style={{ fontSize: 13, color: '#334155', fontWeight: 500 }}>{cat.name}</span>
              </div>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <span style={{ fontSize: 13, color: '#0F172A', fontWeight: 600 }}>₹{Math.round(cat.value).toLocaleString()}</span>
                <span style={{ fontSize: 11, color: '#94A3B8' }}>({cat.pct}%)</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export function TopCategoriesPanel({ data = [] }) {
  if (!data.length) return null;
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
      style={{ background: '#FFFFFF', borderRadius: 20, padding: '24px 28px', border: '1px solid #F1F5F9', boxShadow: '0 2px 12px rgba(0,0,0,0.04)', marginBottom: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: '#0F172A' }}>Top Categories</div>
        <button style={{ display: 'flex', alignItems: 'center', gap: 4, border: '1px solid #E2E8F0', borderRadius: 8, padding: '4px 10px', fontSize: 12, fontWeight: 600, color: '#334155', background: '#FFF', cursor: 'pointer' }}>
          This Month <ChevronDown size={12} />
        </button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {data.map((cat, i) => {
          const CatIcon = Package; // default for categories
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: cat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CatIcon size={17} color={cat.color} />
                </div>
                <span style={{ fontSize: 14, fontWeight: 600, color: '#0F172A' }}>{cat.name}</span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A' }}>{cat.value}</div>
                <div style={{ fontSize: 11, color: cat.up ? '#10B981' : '#EF4444', fontWeight: 600 }}>{cat.change}</div>
              </div>
            </div>
          );
        })}
      </div>
      <button style={{ width: '100%', marginTop: 20, padding: '10px 0', background: 'transparent', border: '1px solid #E2E8F0', borderRadius: 10, fontSize: 13, fontWeight: 600, color: '#334155', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
        View All Categories <ArrowUpRight size={14} />
      </button>
    </motion.div>
  );
}

export function MonthlyComparisonPanel({ data = [], thisMonthTotal = 0, lastMonthTotal = 0 }) {
  const width = useWindowWidth();
  const mobile = isMobile(width);
  if (!data.length) return null;
  const pctChange = lastMonthTotal ? Math.round(((thisMonthTotal - lastMonthTotal) / lastMonthTotal) * 100) : 0;
  
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
      style={{ background: '#FFFFFF', borderRadius: 20, padding: '24px 28px', border: '1px solid #F1F5F9', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
      <div style={{ display: 'flex', flexDirection: mobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: mobile ? 'stretch' : 'center', marginBottom: 16, gap: mobile ? 12 : 0 }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: '#0F172A' }}>Monthly Comparison</div>
        <button style={{ display: 'flex', alignItems: 'center', gap: 4, border: '1px solid #E2E8F0', borderRadius: 8, padding: '4px 10px', fontSize: 12, fontWeight: 600, color: '#334155', background: '#FFF', cursor: 'pointer' }}>
          This Month <ChevronDown size={12} />
        </button>
      </div>
      <div style={{ display: 'inline-flex', flexDirection: 'column', background: '#F0FDF4', borderRadius: 12, padding: '10px 16px', marginBottom: 20, border: '1px solid #D1FAE5' }}>
        <span style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>Current Month</span>
        <span style={{ fontSize: 20, fontWeight: 800, color: '#0F172A' }}>₹{Math.round(thisMonthTotal).toLocaleString()}</span>
        <span style={{ fontSize: 12, color: pctChange >= 0 ? '#10B981' : '#EF4444', fontWeight: 700 }}>
          {pctChange >= 0 ? '↑' : '↓'} {Math.abs(pctChange)}% vs Last Mo
        </span>
      </div>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={data} barSize={16} barGap={4}>
          <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} width={36} />
          <Tooltip content={<BarTooltip />} cursor={{ fill: '#F8FAFC' }} />
          <Bar dataKey="thisYear" fill="#154539" radius={[5, 5, 0, 0]} />
          <Bar dataKey="lastYear" fill="#E2E8F0" radius={[5, 5, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
      <div style={{ display: 'flex', gap: 20, marginTop: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#64748B', fontWeight: 600 }}>
          <div style={{ width: 10, height: 10, borderRadius: 2, background: '#154539' }} /> THIS YEAR
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#64748B', fontWeight: 600 }}>
          <div style={{ width: 10, height: 10, borderRadius: 2, background: '#E2E8F0' }} /> LAST YEAR
        </div>
      </div>
    </motion.div>
  );
}

export function InsightsForYouPanel({ data = [] }) {
  const width = useWindowWidth();
  const mobile = isMobile(width);
  if (!data.length) return null;
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
      style={{ background: '#FFFFFF', borderRadius: 20, padding: '24px 28px', border: '1px solid #F1F5F9', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
      <div style={{ fontSize: 16, fontWeight: 700, color: '#0F172A', marginBottom: 20 }}>Insights for You</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {data.map((ins, i) => {
          const InsIcon = getIcon(ins.iconName, Zap);
          return (
            <div key={i}
              style={{ display: 'flex', alignItems: mobile ? 'flex-start' : 'center', justifyContent: 'space-between', padding: '14px 16px', borderRadius: 14, border: '1px solid #F1F5F9', cursor: 'pointer', transition: 'background 0.2s', gap: 12 }}
              onMouseEnter={e => e.currentTarget.style.background = '#F8FAFC'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: ins.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <InsIcon size={18} color={ins.color} />
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', marginBottom: 2 }}>{ins.title}</div>
                  <div style={{ fontSize: 12, color: '#94A3B8' }}>{ins.sub}</div>
                </div>
              </div>
              <ChevronRight size={16} color="#CBD5E1" />
            </div>
          );
        })}
      </div>
      <button style={{ width: '100%', marginTop: 20, padding: '10px 0', background: 'transparent', border: '1px solid #E2E8F0', borderRadius: 10, fontSize: 13, fontWeight: 600, color: '#334155', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
        View All Insights <ArrowUpRight size={14} />
      </button>
    </motion.div>
  );
}

export function SmartSummaryPanel({ points = [], totalSpent = 0, lastMonthTotal = 0 }) {
  if (!points.length) return null;
  const pctChange = lastMonthTotal ? Math.round(((totalSpent - lastMonthTotal) / lastMonthTotal) * 100) : 0;
  
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
      style={{ background: '#FFFFFF', borderRadius: 20, padding: '24px 28px', border: '1px solid #F1F5F9', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <Sparkles size={18} color="#10B981" />
        <div style={{ fontSize: 16, fontWeight: 700, color: '#0F172A' }}>Smart Summary</div>
      </div>
      <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.6, marginBottom: 16 }}>
        You spent <strong>₹{Math.round(totalSpent).toLocaleString()}</strong> this month. That&apos;s{' '}
        <span style={{ color: pctChange >= 0 ? '#EF4444' : '#10B981', fontWeight: 700 }}>{Math.abs(pctChange)}% {pctChange >= 0 ? 'more' : 'less'}</span> than last month.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {points.map((pt, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
            <CheckCircle2 size={15} color="#10B981" style={{ marginTop: 2, flexShrink: 0 }} />
            <span style={{ fontSize: 13, color: '#475569', lineHeight: 1.5 }}>{pt}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
