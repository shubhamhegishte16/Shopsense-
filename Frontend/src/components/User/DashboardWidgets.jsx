import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Sparkles, ArrowRight, ShieldAlert, ArrowUpRight, Upload, 
  ArrowDown, ArrowUp, Link as LinkIcon, Globe
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export function HeroCard({ data }) {
  const { totalSaved = 846, betterDeals = 6, increases = 2, recallAlert = 1 } = data || {};
  return (
    <div style={{
      background: 'linear-gradient(110deg, #154539 0%, #0F3028 100%)',
      borderRadius: 24,
      padding: 40,
      color: '#FFFFFF',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: '0 24px 40px rgba(21,69,57,0.15)',
      marginBottom: 32
    }}>
      {/* Decorative Glow */}
      <div style={{
        position: 'absolute',
        top: -100,
        right: -50,
        width: 300,
        height: 300,
        background: 'radial-gradient(circle, rgba(16,185,129,0.15) 0%, rgba(0,0,0,0) 70%)',
        borderRadius: '50%'
      }} />

      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.1)', padding: '6px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600, marginBottom: 20, border: '1px solid rgba(255,255,255,0.05)' }}>
        <Sparkles size={14} /> AI Insight
      </div>

      <div style={{ fontSize: 40, fontWeight: 800, marginBottom: 8, letterSpacing: '-1px' }}>
        You saved <span style={{ color: '#10B981' }}>₹{totalSaved}</span>
      </div>
      <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.7)', marginBottom: 40 }}>
        this month with smarter choices.
      </div>

      <div style={{ display: 'flex', gap: 16, marginBottom: 40 }}>
        <StatBadge icon={Sparkles} label="TOTAL SAVED" value={`₹${totalSaved}`} color="#10B981" />
        <StatBadge icon={TagIcon} label="BETTER DEALS" value={betterDeals} color="#3B82F6" />
        <StatBadge icon={ArrowUpRight} label="INCREASES" value={increases} color="#F59E0B" />
        <StatBadge icon={ShieldAlert} label="RECALL ALERT" value={recallAlert} color="#8B5CF6" />
      </div>

      <Link to="/insights" style={{
        background: '#FFFFFF',
        color: '#0F172A',
        border: 'none',
        borderRadius: 999,
        padding: '14px 28px',
        fontSize: 14,
        fontWeight: 700,
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        cursor: 'pointer',
        boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
        textDecoration: 'none'
      }}>
        View AI Report <ArrowRight size={16} />
      </Link>
    </div>
  );
}

function StatBadge({ icon: Icon, label, value, color }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.05)',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: 16,
      padding: '12px 16px',
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      minWidth: 140
    }}>
      <div style={{ width: 36, height: 36, borderRadius: '50%', background: `rgba(255,255,255,0.1)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
      <line x1="7" y1="7" x2="7.01" y2="7"></line>
    </svg>
  );
}

export function ShoppingDNACard({ data }) {
  const { score = 87, persona = 'Budget Conscious', pointsChange = 6 } = data || {};
  return (
    <div style={cardStyle}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
        <div style={iconWrapperStyle('#E0F2FE', '#0EA5E9')}><LinkIcon size={16} color="#0EA5E9" /></div>
        <h4 style={cardTitleStyle}>Shopping DNA</h4>
      </div>
      
      <div style={{ fontSize: 48, fontWeight: 800, color: '#0F172A', letterSpacing: '-2px', display: 'flex', alignItems: 'baseline', gap: 4 }}>
        {score} <span style={{ fontSize: 16, fontWeight: 600, color: '#94A3B8', letterSpacing: 0 }}>/ 100</span>
      </div>
      <div style={{ fontSize: 14, fontWeight: 600, color: '#334155', marginTop: 8 }}>{persona}</div>
      <div style={{ fontSize: 12, color: '#10B981', display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
        <ArrowUp size={14} /> {pointsChange} pts <span style={{ color: '#94A3B8' }}>this month</span>
      </div>

      <div style={{ height: 60, marginTop: 24, position: 'relative' }}>
        <svg width="100%" height="100%" viewBox="0 0 200 60" preserveAspectRatio="none">
          <path d="M0 60 Q 50 20 100 40 T 200 10" fill="none" stroke="#10B981" strokeWidth="3" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  );
}

export function AISavingsCard({ data }) {
  const { potentialSavings = 1482 } = data || {};
  return (
    <div style={cardStyle}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
        <div style={iconWrapperStyle('#D1FAE5', '#10B981')}><Globe size={16} color="#10B981" /></div>
        <h4 style={cardTitleStyle}>AI Savings</h4>
      </div>
      
      <div style={{ fontSize: 36, fontWeight: 800, color: '#0F172A', letterSpacing: '-1px' }}>
        ₹{potentialSavings}
      </div>
      <div style={{ fontSize: 12, color: '#64748B', lineHeight: 1.4, marginTop: 8, marginBottom: 24 }}>
        Potential savings<br/>this month
      </div>

      <button style={{
        background: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: 999,
        padding: '10px 16px',
        fontSize: 13,
        fontWeight: 600,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        width: '100%',
        cursor: 'pointer'
      }}>
        Optimize Now <ArrowRight size={14} />
      </button>
    </div>
  );
}

export function SmartReceiptCard() {
  return (
    <div style={{ ...cardStyle, borderStyle: 'dashed', borderWidth: 2, background: '#FAFCFC' }}>
      <div style={{ textAlign: 'center', marginBottom: 16 }}>
        <h4 style={{ ...cardTitleStyle, margin: '0 0 16px 0' }}>Smart Receipt</h4>
        <div style={{ width: 48, height: 48, background: '#F1F5F9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
          <ReceiptText size={24} color="#94A3B8" />
        </div>
        <p style={{ fontSize: 13, color: '#64748B', margin: 0, padding: '0 16px' }}>Drop your receipt here or click to upload</p>
      </div>
      <Link to="/receipts" style={{
        background: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: 999,
        padding: '10px 16px',
        fontSize: 13,
        fontWeight: 600,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        width: '100%', // ensure it behaves well if wrapped
        boxSizing: 'border-box',
        cursor: 'pointer',
        color: '#154539',
        textDecoration: 'none'
      }}>
        <Upload size={14} /> Upload Receipt
      </Link>
    </div>
  );
}

function ReceiptText(props) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z"></path>
      <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"></path>
      <path d="M12 17V7"></path>
    </svg>
  );
}

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
          <div style={{ fontSize: 13, color: '#94A3B8', textAlign: 'center', padding: '10px 0' }}>No recent price changes</div>
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

      <a href="#" style={{ fontSize: 12, color: '#10B981', textDecoration: 'none', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
        View All <ArrowRight size={12} />
      </a>
    </div>
  );
}

function TargetIcon(props) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10"></circle>
      <circle cx="12" cy="12" r="6"></circle>
      <circle cx="12" cy="12" r="2"></circle>
    </svg>
  );
}

export function RecentActivityCard({ data }) {
  const activities = data || [];

  return (
    <div style={cardStyle}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h4 style={cardTitleStyle}>Recent Activity</h4>
        <a href="#" style={{ fontSize: 12, color: '#10B981', textDecoration: 'none', fontWeight: 600 }}>View All</a>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {activities.length === 0 ? (
          <div style={{ fontSize: 13, color: '#94A3B8', textAlign: 'center', padding: '20px 0' }}>No recent activity</div>
        ) : (
          activities.map((act, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: act.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF', fontSize: 10, fontWeight: 800, textAlign: 'center', lineHeight: 1.1 }}>
                {act.name.split(' ')[0]}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A', marginBottom: 2 }}>{act.name}</div>
                <div style={{ fontSize: 12, color: '#94A3B8' }}>{act.time}</div>
              </div>
              <div style={{ background: '#D1FAE5', color: '#10B981', padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 700 }}>
                {act.saved}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export function SpendingChartCard({ data }) {
  const chartData = data || [];

  return (
    <div style={cardStyle}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h4 style={{...cardTitleStyle, marginBottom: 8}}>Your Spending</h4>
          <div style={{ fontSize: 28, fontWeight: 800, color: '#0F172A', letterSpacing: '-1px' }}>₹{chartData.length > 0 ? chartData[chartData.length-1].value : 0}</div>
          <div style={{ fontSize: 12, color: '#10B981', display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
            <ArrowUp size={14} /> 8% <span style={{ color: '#94A3B8' }}>vs last month</span>
          </div>
        </div>
        <div style={{ border: '1px solid #E2E8F0', padding: '6px 12px', borderRadius: 20, fontSize: 12, color: '#64748B', fontWeight: 600 }}>
          This Month ▾
        </div>
      </div>
      
      <div style={{ height: 120, width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <Tooltip 
              contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              itemStyle={{ color: '#10B981', fontWeight: 700 }}
            />
            <Area type="monotone" dataKey="value" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94A3B8' }} dy={10} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function PantryEssentialsCard({ data }) {
  const items = data || [];

  return (
    <div style={cardStyle}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h4 style={cardTitleStyle}>Pantry Essentials</h4>
        <a href="#" style={{ fontSize: 12, color: '#10B981', textDecoration: 'none', fontWeight: 600 }}>View All</a>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {items.length === 0 ? (
          <div style={{ fontSize: 13, color: '#94A3B8', textAlign: 'center', padding: '20px 0' }}>No items expiring soon</div>
        ) : (
          items.map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
                  {item.icon}
                </div>
                <span style={{ fontSize: 14, color: '#0F172A', fontWeight: 600 }}>{item.name}</span>
              </div>
              <div style={{ background: item.bg, color: item.color, padding: '4px 10px', borderRadius: 20, fontSize: 10, fontWeight: 800, letterSpacing: 0.5 }}>
                {item.left}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const cardStyle = {
  background: '#FFFFFF',
  border: '1px solid #F1F5F9',
  borderRadius: 24,
  padding: 24,
  boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
};

const cardTitleStyle = {
  margin: 0,
  fontSize: 15,
  fontWeight: 700,
  color: '#0F172A'
};

const iconWrapperStyle = (bg, color) => ({
  width: 28,
  height: 28,
  borderRadius: 8,
  background: bg,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
});
