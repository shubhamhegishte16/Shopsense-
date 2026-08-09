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

// ─── Data ─────────────────────────────────────────────────────────────────────

const spendingTrendData = [
  { label: '1 May', thisMonth: 0, lastMonth: 0 },
  { label: '6 May', thisMonth: 1800, lastMonth: 1400 },
  { label: '11 May', thisMonth: 5200, lastMonth: 3900 },
  { label: '16 May', thisMonth: 7600, lastMonth: 6100 },
  { label: '22 May', thisMonth: 10200, lastMonth: 8500 },
  { label: '31 May', thisMonth: 12846, lastMonth: 11400 },
];

const categoryData = [
  { name: 'Groceries', value: 5246, pct: 40.8, color: '#154539' },
  { name: 'Daily Needs', value: 2843, pct: 22.1, color: '#10B981' },
  { name: 'Snacks & Bev.', value: 1624, pct: 12.6, color: '#F59E0B' },
  { name: 'Household', value: 1315, pct: 10.2, color: '#3B82F6' },
  { name: 'Personal Care', value: 1018, pct: 7.9, color: '#8B5CF6' },
  { name: 'Others', value: 800, pct: 6.2, color: '#E2E8F0' },
];

const monthlyData = [
  { month: 'JAN', thisYear: 9200, lastYear: 8400 },
  { month: 'FEB', thisYear: 10100, lastYear: 9200 },
  { month: 'MAR', thisYear: 11400, lastYear: 10500 },
  { month: 'APR', thisYear: 11480, lastYear: 10900 },
  { month: 'MAY', thisYear: 12846, lastYear: 11800 },
];

const aiInsights = [
  { icon: TrendingUp, color: '#10B981', bg: '#D1FAE5', title: 'You are spending more on Groceries', sub: '₹986 more than last month.' },
  { icon: Tag, color: '#F59E0B', bg: '#FEF3C7', title: 'You saved ₹432 more this month!', sub: 'Great job on smart shopping.' },
  { icon: Clock, color: '#8B5CF6', bg: '#EDE9FE', title: 'Most of your orders are placed on Sundays.', sub: 'Try spreading your orders for better offers.' },
  { icon: Percent, color: '#3B82F6', bg: '#DBEAFE', title: 'You get more discounts on Blinkit orders.', sub: 'Average savings ₹116 per order.' },
];

const topCategories = [
  { name: 'Groceries', icon: Package, color: '#154539', bg: '#F0FDF4', value: '₹5,246', change: '+16%', up: true },
  { name: 'Daily Needs', icon: Zap, color: '#3B82F6', bg: '#EFF6FF', value: '₹2,843', change: '+10%', up: true },
  { name: 'Snacks & Bev.', icon: ShoppingBag, color: '#F59E0B', bg: '#FEF3C7', value: '₹1,624', change: '+51%', up: true },
  { name: 'Household', icon: Star, color: '#8B5CF6', bg: '#EDE9FE', value: '₹1,315', change: '+13%', up: true },
];

const summaryPoints = [
  'Your top category is Groceries (40.8%).',
  'You placed 26 orders with an average order value of ₹494.',
  'You saved ₹1,284 using smart choices.',
  "Keep it up! You're making smarter shopping decisions.",
];

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
};

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
};

// ─── Exports ──────────────────────────────────────────────────────────────────

export function InsightsHeader() {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.5px' }}>Insights</h1>
        <Sparkles size={20} color="#F59E0B" />
      </div>
      <p style={{ fontSize: 14, color: '#64748B', margin: 0 }}>
        Understand your shopping behavior and spending patterns.
      </p>
    </div>
  );
}

export function InsightsActionBar() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 12, marginBottom: 28 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, border: '1px solid #E2E8F0', borderRadius: 10, padding: '8px 14px', fontSize: 13, fontWeight: 600, color: '#334155', background: '#FFFFFF', cursor: 'pointer' }}>
        <Calendar size={14} color="#64748B" />
        01 May – 31 May 2025
        <ChevronDown size={13} color="#94A3B8" />
      </div>
      <button style={{ display: 'flex', alignItems: 'center', gap: 8, border: '1px solid #E2E8F0', borderRadius: 10, padding: '8px 16px', fontSize: 13, fontWeight: 600, color: '#334155', background: '#FFFFFF', cursor: 'pointer' }}>
        <Download size={14} color="#64748B" />
        Export Report
      </button>
    </div>
  );
}

export function InsightStatCards() {
  const stats = [
    { label: 'TOTAL SPENT', value: '₹12,846', change: '+12% vs Apr', up: true, icon: ShoppingBag, color: '#154539' },
    { label: 'TOTAL ORDERS', value: '26', change: '+18% vs Apr', up: true, icon: Package, color: '#3B82F6' },
    { label: 'AVG. ORDER VALUE', value: '₹494', change: '-4% vs Apr', up: false, icon: BarChart2, color: '#8B5CF6' },
    { label: 'TOTAL SAVINGS', value: '₹1,284', change: '+22% vs Apr', up: true, icon: Tag, color: '#10B981' },
    { label: 'SHOPPING SCORE', value: '94/100', change: '↑ 8 pts vs Apr', up: true, icon: Star, color: '#F59E0B' },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16, marginBottom: 28 }}>
      {stats.map((s, i) => (
        <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
          style={{ background: '#FFFFFF', borderRadius: 16, padding: '20px 20px 16px', border: '1px solid #F1F5F9', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: '#94A3B8', letterSpacing: 1 }}>{s.label}</span>
            <s.icon size={16} color={s.color} />
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, color: '#0F172A', letterSpacing: '-0.5px', marginBottom: 8 }}>{s.value}</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: s.up ? '#10B981' : '#EF4444' }}>{s.change}</span>
            <MiniTrendLine color={s.color} up={s.up} />
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export function SpendingTrendPanel() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
      style={{ background: '#FFFFFF', borderRadius: 20, padding: '24px 28px', border: '1px solid #F1F5F9', boxShadow: '0 2px 12px rgba(0,0,0,0.04)', marginBottom: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: '#0F172A' }}>Spending Trend</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
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
        <AreaChart data={spendingTrendData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
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

export function SpendingByCategoryPanel() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
      style={{ background: '#FFFFFF', borderRadius: 20, padding: '24px 28px', border: '1px solid #F1F5F9', boxShadow: '0 2px 12px rgba(0,0,0,0.04)', marginBottom: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: '#0F172A' }}>Spending by Category</div>
        <button style={{ display: 'flex', alignItems: 'center', gap: 4, border: '1px solid #E2E8F0', borderRadius: 8, padding: '4px 10px', fontSize: 12, fontWeight: 600, color: '#334155', background: '#FFF', cursor: 'pointer' }}>
          This Month <ChevronDown size={12} />
        </button>
      </div>
      <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
        <div style={{ position: 'relative', width: 180, height: 180, flexShrink: 0 }}>
          <RechartsPie width={180} height={180}>
            <Pie data={categoryData} cx={85} cy={85} innerRadius={55} outerRadius={82} dataKey="value" startAngle={90} endAngle={-270} strokeWidth={0}>
              {categoryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </RechartsPie>
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', textAlign: 'center', pointerEvents: 'none' }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#0F172A' }}>₹12,846</div>
            <div style={{ fontSize: 10, color: '#94A3B8', fontWeight: 600 }}>TOTAL SPENT</div>
          </div>
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {categoryData.map((cat, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: cat.color, flexShrink: 0 }} />
                <span style={{ fontSize: 13, color: '#334155', fontWeight: 500 }}>{cat.name}</span>
              </div>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <span style={{ fontSize: 13, color: '#0F172A', fontWeight: 600 }}>₹{cat.value.toLocaleString()}</span>
                <span style={{ fontSize: 11, color: '#94A3B8' }}>({cat.pct}%)</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export function TopCategoriesPanel() {
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
        {topCategories.map((cat, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: cat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <cat.icon size={17} color={cat.color} />
              </div>
              <span style={{ fontSize: 14, fontWeight: 600, color: '#0F172A' }}>{cat.name}</span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A' }}>{cat.value}</div>
              <div style={{ fontSize: 11, color: cat.up ? '#10B981' : '#EF4444', fontWeight: 600 }}>{cat.change}</div>
            </div>
          </div>
        ))}
      </div>
      <button style={{ width: '100%', marginTop: 20, padding: '10px 0', background: 'transparent', border: '1px solid #E2E8F0', borderRadius: 10, fontSize: 13, fontWeight: 600, color: '#334155', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
        View All Categories <ArrowUpRight size={14} />
      </button>
    </motion.div>
  );
}

export function MonthlyComparisonPanel() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
      style={{ background: '#FFFFFF', borderRadius: 20, padding: '24px 28px', border: '1px solid #F1F5F9', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: '#0F172A' }}>Monthly Comparison</div>
        <button style={{ display: 'flex', alignItems: 'center', gap: 4, border: '1px solid #E2E8F0', borderRadius: 8, padding: '4px 10px', fontSize: 12, fontWeight: 600, color: '#334155', background: '#FFF', cursor: 'pointer' }}>
          This Month <ChevronDown size={12} />
        </button>
      </div>
      <div style={{ display: 'inline-flex', flexDirection: 'column', background: '#F0FDF4', borderRadius: 12, padding: '10px 16px', marginBottom: 20, border: '1px solid #D1FAE5' }}>
        <span style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>May 2025</span>
        <span style={{ fontSize: 20, fontWeight: 800, color: '#0F172A' }}>₹12,846</span>
        <span style={{ fontSize: 12, color: '#10B981', fontWeight: 700 }}>↑ 12% vs Apr</span>
      </div>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={monthlyData} barSize={16} barGap={4}>
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

export function InsightsForYouPanel() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
      style={{ background: '#FFFFFF', borderRadius: 20, padding: '24px 28px', border: '1px solid #F1F5F9', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
      <div style={{ fontSize: 16, fontWeight: 700, color: '#0F172A', marginBottom: 20 }}>Insights for You</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {aiInsights.map((ins, i) => (
          <div key={i}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderRadius: 14, border: '1px solid #F1F5F9', cursor: 'pointer', transition: 'background 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.background = '#F8FAFC'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: ins.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <ins.icon size={18} color={ins.color} />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', marginBottom: 2 }}>{ins.title}</div>
                <div style={{ fontSize: 12, color: '#94A3B8' }}>{ins.sub}</div>
              </div>
            </div>
            <ChevronRight size={16} color="#CBD5E1" />
          </div>
        ))}
      </div>
      <button style={{ width: '100%', marginTop: 20, padding: '10px 0', background: 'transparent', border: '1px solid #E2E8F0', borderRadius: 10, fontSize: 13, fontWeight: 600, color: '#334155', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
        View All Insights <ArrowUpRight size={14} />
      </button>
    </motion.div>
  );
}

export function SmartSummaryPanel() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
      style={{ background: '#FFFFFF', borderRadius: 20, padding: '24px 28px', border: '1px solid #F1F5F9', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <Sparkles size={18} color="#10B981" />
        <div style={{ fontSize: 16, fontWeight: 700, color: '#0F172A' }}>Smart Summary</div>
      </div>
      <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.6, marginBottom: 16 }}>
        You spent <strong>₹12,846</strong> this month. That&apos;s{' '}
        <span style={{ color: '#10B981', fontWeight: 700 }}>12% more</span> than last month.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {summaryPoints.map((pt, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
            <CheckCircle2 size={15} color="#10B981" style={{ marginTop: 2, flexShrink: 0 }} />
            <span style={{ fontSize: 13, color: '#475569', lineHeight: 1.5 }}>{pt}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
