import { Upload, ChevronDown, MoreVertical } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

export function ReceiptsHeader() {
  return (
    <div style={{ marginBottom: 24 }}>
      <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
        My Receipts 
        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#E8F5E9', width: 24, height: 24, borderRadius: 6 }}>
          <ReceiptIcon size={14} color="#154539" />
        </span>
      </h1>
      <p style={{ fontSize: 14, color: '#64748B', margin: 0 }}>All your uploaded receipts in one place</p>
    </div>
  );
}

export function UploadZone() {
  return (
    <div style={{
      border: '1px solid #E2E8F0',
      borderRadius: 16,
      background: '#FFFFFF',
      padding: '24px 32px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 32,
      boxShadow: '0 2px 10px rgba(0,0,0,0.02)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
        <div style={{
          width: 64,
          height: 64,
          borderRadius: 16,
          background: '#E8F5E9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <ReceiptIcon size={28} color="#154539" />
        </div>
        <div>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0F172A', margin: '0 0 4px 0' }}>Drag & drop your receipt here</h3>
          <p style={{ fontSize: 14, color: '#94A3B8', margin: '0 0 12px 0' }}>or click to upload</p>
          <div style={{ display: 'flex', gap: 8 }}>
            <span style={fileTagStyle}>JPG</span>
            <span style={fileTagStyle}>PNG</span>
            <span style={fileTagStyle}>PDF</span>
            <span style={{ fontSize: 12, color: '#94A3B8', marginLeft: 8 }}>Max size 10MB</span>
          </div>
        </div>
      </div>
      <button style={{
        background: '#154539',
        color: '#FFFFFF',
        border: 'none',
        borderRadius: 12,
        padding: '12px 24px',
        fontSize: 14,
        fontWeight: 600,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        cursor: 'pointer'
      }}>
        <Upload size={18} /> Upload Receipt
      </button>
    </div>
  );
}

const fileTagStyle = {
  background: '#F1F5F9',
  color: '#64748B',
  fontSize: 11,
  fontWeight: 700,
  padding: '4px 8px',
  borderRadius: 4
};

export function CategoryFilters() {
  const filters = [
    { name: 'All Receipts', count: 25, active: true },
    { name: 'Groceries', count: 15 },
    { name: 'Pharmacy', count: 4 },
    { name: 'Electronics', count: 3 },
    { name: 'Fashion', count: 3 },
    { name: 'Others', count: 0 }
  ];

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
      <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 4 }}>
        {filters.map((f, i) => (
          <button key={i} style={{
            background: f.active ? '#154539' : '#FFFFFF',
            border: f.active ? '1px solid #154539' : '1px solid #E2E8F0',
            color: f.active ? '#FFFFFF' : '#334155',
            borderRadius: 999,
            padding: '8px 16px',
            fontSize: 13,
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            cursor: 'pointer',
            whiteSpace: 'nowrap'
          }}>
            {f.name}
            <span style={{
              background: f.active ? 'rgba(255,255,255,0.2)' : '#F1F5F9',
              color: f.active ? '#FFFFFF' : '#64748B',
              padding: '2px 8px',
              borderRadius: 10,
              fontSize: 11
            }}>{f.count}</span>
          </button>
        ))}
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#64748B', fontWeight: 500 }}>
        Sort by
        <button style={{
          background: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: 12,
          padding: '8px 16px',
          fontSize: 13,
          fontWeight: 600,
          color: '#334155',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          cursor: 'pointer'
        }}>
          Newest <ChevronDown size={14} />
        </button>
      </div>
    </div>
  );
}

export function ReceiptGrid() {
  const receipts = [
    { store: 'D-Mart Ready', date: '29 May 2024 • 7:45 PM', amount: '₹1,245', category: 'Groceries', items: 18, color: '#10B981', initial: 'D' },
    { store: 'Blinkit', date: '28 May 2024 • 6:30 PM', amount: '₹842', category: 'Groceries', items: 12, color: '#F59E0B', initial: 'B' },
    { store: 'Apollo Pharmacy', date: '27 May 2024 • 4:15 PM', amount: '₹562', category: 'Pharmacy', items: 7, color: '#8B5CF6', initial: 'A' },
    { store: 'Amazon Fresh', date: '26 May 2024 • 8:10 PM', amount: '₹1,320', category: 'Groceries', items: 24, color: '#334155', initial: 'a' },
    { store: 'Reliance Smart', date: '25 May 2024 • 5:40 PM', amount: '₹2,156', category: 'Groceries', items: 31, color: '#EF4444', initial: 'R' },
    { store: 'Zepto', date: '24 May 2024 • 9:20 PM', amount: '₹689', category: 'Groceries', items: 10, color: '#3B82F6', initial: 'Z' },
    { store: 'Vishal Mega Mart', date: '23 May 2024 • 3:25 PM', amount: '₹1,089', category: 'Others', items: 15, color: '#EC4899', initial: 'V' },
    { store: 'MedPlus', date: '22 May 2024 • 11:05 AM', amount: '₹378', category: 'Pharmacy', items: 6, color: '#EF4444', initial: '+' },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
      {receipts.map((r, i) => (
        <div key={i} style={{
          background: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: 16,
          padding: 16,
          boxShadow: '0 2px 10px rgba(0,0,0,0.02)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
            <div style={{ display: 'flex', gap: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: `${r.color}15`, color: r.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 14 }}>
                {r.initial}
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A' }}>{r.store}</div>
                <div style={{ fontSize: 11, color: '#94A3B8' }}>{r.date}</div>
              </div>
            </div>
            <MoreVertical size={16} color="#94A3B8" style={{ cursor: 'pointer' }} />
          </div>
          
          <div style={{ fontSize: 20, fontWeight: 800, color: '#0F172A', textAlign: 'right', marginBottom: 16 }}>
            {r.amount}
          </div>

          <div style={{ 
            height: 120, 
            background: '#F8FAFC', 
            borderRadius: 8, 
            marginBottom: 16,
            backgroundImage: `url("https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=300&h=200")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            border: '1px solid #F1F5F9'
          }} />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ 
              background: r.category === 'Groceries' ? '#E8F5E9' : r.category === 'Pharmacy' ? '#F3E8FF' : '#F1F5F9',
              color: r.category === 'Groceries' ? '#154539' : r.category === 'Pharmacy' ? '#7E22CE' : '#475569',
              padding: '4px 8px', borderRadius: 4, fontSize: 11, fontWeight: 700 
            }}>
              {r.category}
            </span>
            <span style={{ fontSize: 11, color: '#94A3B8', fontWeight: 500 }}>{r.items} items</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export function ReceiptSummaryPanel() {
  return (
    <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 16, padding: 24, marginBottom: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0F172A', margin: 0 }}>Receipt Summary</h3>
        <span style={{ fontSize: 12, color: '#64748B', background: '#F8FAFC', padding: '4px 8px', borderRadius: 6 }}>This Month</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <SummaryRow icon={<ReceiptIcon size={16} color="#10B981" />} iconBg="#D1FAE5" title="Total Receipts" value="25" trend="+12%" up={true} />
        <SummaryRow icon={<ShoppingBagIcon size={16} color="#8B5CF6" />} iconBg="#F3E8FF" title="Total Spent" value="₹7,842" trend="-8%" up={true} />
        <SummaryRow icon={<ShieldIcon size={16} color="#F59E0B" />} iconBg="#FEF3C7" title="Average per Receipt" value="₹314" trend="-4%" up={false} />
      </div>
    </div>
  );
}

function SummaryRow({ icon, iconBg, title, value, trend, up }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 40, height: 40, borderRadius: '50%', background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {icon}
        </div>
        <div>
          <div style={{ fontSize: 12, color: '#94A3B8', fontWeight: 500 }}>{title}</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: '#0F172A' }}>{value}</div>
        </div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: up ? '#10B981' : '#EF4444' }}>
          {up ? '▲' : '▼'} {trend.replace(/[+-]/, '')}
        </div>
        <div style={{ fontSize: 10, color: '#E2E8F0', marginTop: 2 }}>vs last month</div>
      </div>
    </div>
  );
}

export function TopCategoriesPanel() {
  const data = [
    { name: 'Groceries', value: 5320, color: '#10B981', percent: '68%' },
    { name: 'Pharmacy', value: 1098, color: '#F59E0B', percent: '14%' },
    { name: 'Electronics', value: 784, color: '#3B82F6', percent: '10%' },
    { name: 'Others', value: 640, color: '#8B5CF6', percent: '8%' },
  ];

  return (
    <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 16, padding: 24, marginBottom: 24 }}>
      <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0F172A', margin: '0 0 24px 0' }}>Top Spending Categories</h3>
      
      <div style={{ height: 160, position: 'relative', marginBottom: 32 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius={55}
              outerRadius={75}
              paddingAngle={2}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ fontSize: 16, fontWeight: 800, color: '#0F172A' }}>₹7,842</div>
          <div style={{ fontSize: 10, color: '#94A3B8', fontWeight: 600 }}>TOTAL</div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {data.map((d, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 13 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#334155', fontWeight: 500 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: d.color }} />
              {d.name}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <span style={{ color: '#94A3B8', width: 28, textAlign: 'right' }}>{d.percent}</span>
              <span style={{ fontWeight: 700, color: '#0F172A', width: 48, textAlign: 'right' }}>₹{d.value.toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AIInsightPanel() {
  return (
    <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 16, padding: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#154539', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <SparklesIcon size={12} color="#FFFFFF" />
        </div>
        <h4 style={{ fontSize: 14, fontWeight: 700, color: '#0F172A', margin: 0 }}>AI Insight</h4>
      </div>
      
      <p style={{ fontSize: 13, color: '#334155', lineHeight: 1.5, margin: '0 0 16px 0' }}>
        You spent 18% more on groceries this month.
      </p>

      <button style={{
        background: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: 8,
        padding: '8px 12px',
        fontSize: 12,
        fontWeight: 600,
        color: '#154539',
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        cursor: 'pointer'
      }}>
        View Insights →
      </button>
    </div>
  );
}

// Icons
function ReceiptIcon(props) {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z"></path><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"></path><path d="M12 17V7"></path></svg>;
}
function ShoppingBagIcon(props) {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path><path d="M3 6h18"></path><path d="M16 10a4 4 0 0 1-8 0"></path></svg>;
}
function ShieldIcon(props) {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="m9 12 2 2 4-4"></path></svg>;
}
function SparklesIcon(props) {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path><path d="M5 3v4"></path><path d="M19 17v4"></path><path d="M3 5h4"></path><path d="M17 19h4"></path></svg>;
}
