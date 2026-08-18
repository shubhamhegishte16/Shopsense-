import { useState, useRef, useEffect, useCallback } from 'react';
import { Upload, ChevronDown, MoreVertical, Loader2, Check, AlertCircle, RefreshCw, Trash2 } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import useWindowWidth, { isMobile } from '../../hooks/useWindowWidth';

const API_BASE = 'http://localhost:5000/api';

function getAuthHeaders() {
  const token = localStorage.getItem('shopsense_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export function ReceiptsHeader() {
  const width = useWindowWidth();
  const mobile = isMobile(width);
  return (
    <div style={{ marginBottom: mobile ? 14 : 24, maxWidth: '100%' }}>
      <h1 style={{ fontSize: mobile ? 21 : 24, fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4, flexWrap: 'wrap' }}>
        My Receipts 
        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#E8F5E9', width: 24, height: 24, borderRadius: 6 }}>
          <ReceiptIcon size={14} color="#154539" />
        </span>
      </h1>
      <p style={{ fontSize: 14, color: '#64748B', margin: 0 }}>All your uploaded receipts in one place</p>
    </div>
  );
}

export function UploadZone({ onUploadSuccess }) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const fileInputRef = useRef(null);

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadSuccess(false);
    setErrorMsg(null);

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetch(`${API_BASE}/receipts/upload`, {
        method: 'POST',
        headers: getAuthHeaders(),   // ← JWT token attached
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || data.message || `Upload failed (${res.status})`);
      }

      console.log('Receipt Processed:', data);
      setUploadSuccess(true);
      if (onUploadSuccess) onUploadSuccess(); // signal parent to refresh grid
      setTimeout(() => setUploadSuccess(false), 3000);
    } catch (error) {
      console.error('Upload error:', error);
      setErrorMsg(error.message);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{
        border: '1px solid #E2E8F0',
        borderRadius: 16,
        background: '#FFFFFF',
        padding: '24px 32px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        justifyContent: 'space-between',
        boxShadow: '0 2px 10px rgba(0,0,0,0.02)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
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
            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0F172A', margin: '0 0 4px 0' }}>Upload your receipt here</h3>
           
            <div style={{ display: 'flex', gap: 8 }}>
              <span style={fileTagStyle}>JPG</span>
              <span style={fileTagStyle}>PNG</span>
              <span style={fileTagStyle}>PDF</span>
              <span style={{ fontSize: 12, color: '#94A3B8', marginLeft: 8 }}>Max size 10MB</span>
            </div>
          </div>
        </div>

        <input
          type="file"
          accept="image/*,application/pdf"
          ref={fileInputRef}
          onChange={handleUpload}
          style={{ display: 'none' }}
        />

        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          style={{
            background: uploadSuccess ? '#10B981' : '#154539',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: 12,
            padding: '12px 24px',
            fontSize: 14,
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            cursor: isUploading ? 'not-allowed' : 'pointer',
            opacity: isUploading ? 0.7 : 1,
            transition: 'background 0.3s',
            alignSelf: 'flex-end',
            marginTop: 16,
            maxWidth: '100%'
          }}
        >
          {isUploading ? (
            <><Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> Processing...</>
          ) : uploadSuccess ? (
            <><Check size={18} /> Processed!</>
          ) : (
            <><Upload size={18} /> Upload Receipt</>
          )}
        </button>
      </div>

      {/* Error banner — shows real API error message */}
      {errorMsg && (
        <div style={{
          marginTop: 12,
          background: '#FEF2F2',
          border: '1px solid #FECACA',
          borderRadius: 10,
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: 10
        }}>
          <AlertCircle size={16} color="#DC2626" style={{ flexShrink: 0, marginTop: 2 }} />
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#DC2626', marginBottom: 2 }}>Upload Failed</div>
            <div style={{ fontSize: 12, color: '#991B1B' }}>{errorMsg}</div>
          </div>
          <button
            onClick={() => setErrorMsg(null)}
            style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: '#DC2626', fontSize: 16, lineHeight: 1 }}
          >×</button>
        </div>
      )}
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

export function CategoryFilters({ receipts = [] }) {
  const categoryCounts = receipts.reduce((acc, r) => {
    const primaryCategory = r.items?.[0]?.category || 'Other';
    acc[primaryCategory] = (acc[primaryCategory] || 0) + 1;
    return acc;
  }, {});

  const filters = [
    { name: 'All Receipts', count: receipts.length, active: true },
    { name: 'Groceries', count: categoryCounts['Groceries'] || 0 },
    { name: 'Pharmacy', count: categoryCounts['Pharmacy'] || 0 },
    { name: 'Electronics', count: categoryCounts['Electronics'] || 0 },
    { name: 'Fashion', count: categoryCounts['Clothing'] || 0 },
    { name: 'Others', count: categoryCounts['Other'] || 0 }
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
    </div>
  );
}

const CATEGORY_COLORS = {
  Groceries: { bg: '#E8F5E9', text: '#154539' },
  Pharmacy: { bg: '#F3E8FF', text: '#7E22CE' },
  Electronics: { bg: '#EFF6FF', text: '#1D4ED8' },
  Household: { bg: '#FEF3C7', text: '#92400E' },
  'Personal Care': { bg: '#FDF2F8', text: '#9D174D' },
  Clothing: { bg: '#FFF7ED', text: '#C2410C' },
  Other: { bg: '#F1F5F9', text: '#475569' },
};

function storeInitial(name) {
  return (name || '?').charAt(0).toUpperCase();
}

function storeColor(name) {
  const colors = ['#10B981', '#F59E0B', '#8B5CF6', '#3B82F6', '#EF4444', '#EC4899', '#334155', '#F97316'];
  let hash = 0;
  for (let i = 0; i < (name || '').length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

function formatDate(dateStr) {
  try {
    return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch { return dateStr; }
}

export function useReceipts(refreshTrigger) {
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  const fetchReceipts = useCallback(async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const res = await fetch(`${API_BASE}/receipts`, { headers: getAuthHeaders() });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch receipts');
      setReceipts(data.receipts || []);
    } catch (err) {
      setFetchError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchReceipts(); }, [fetchReceipts, refreshTrigger]);

  return { receipts, loading, fetchError, fetchReceipts };
}

export function ReceiptGrid({ receipts, loading, fetchError, fetchReceipts }) {
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this receipt and all its extracted items?")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`${API_BASE}/receipts/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      if (!res.ok) throw new Error('Failed to delete receipt');
      fetchReceipts();
    } catch (err) {
      alert(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
        {[...Array(4)].map((_, i) => (
          <div key={i} style={{ background: '#F8FAFC', borderRadius: 16, height: 220, animation: 'pulse 1.5s ease-in-out infinite' }} />
        ))}
      </div>
    );
  }

  if (fetchError) {
    return (
      <div style={{ textAlign: 'center', padding: '48px 24px', background: '#FEF2F2', borderRadius: 16, border: '1px solid #FECACA' }}>
        <AlertCircle size={32} color="#DC2626" style={{ marginBottom: 12 }} />
        <div style={{ fontSize: 14, color: '#991B1B', marginBottom: 16 }}>{fetchError}</div>
        <button onClick={fetchReceipts} style={{ background: '#154539', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 20px', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <RefreshCw size={14} /> Retry
        </button>
      </div>
    );
  }

  if (receipts.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '64px 24px', background: '#F8FAFC', borderRadius: 16, border: '2px dashed #E2E8F0' }}>
        <ReceiptIcon size={40} color="#CBD5E1" />
        <div style={{ fontSize: 16, fontWeight: 700, color: '#94A3B8', marginTop: 16, marginBottom: 8 }}>No receipts yet</div>
        <div style={{ fontSize: 13, color: '#CBD5E1' }}>Upload your first receipt to get started</div>
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
      {receipts.map((r, i) => {
        const color = storeColor(r.storeName);
        const initial = storeInitial(r.storeName);
        const primaryCategory = r.items?.[0]?.category || 'Other';
        const catStyle = CATEGORY_COLORS[primaryCategory] || CATEGORY_COLORS['Other'];
        return (
          <div key={r._id || i} style={{
            background: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: 16,
            padding: 16,
            boxShadow: '0 2px 10px rgba(0,0,0,0.02)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div style={{ display: 'flex', gap: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: `${color}20`, color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 14 }}>
                  {initial}
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A' }}>{r.storeName || 'Unknown Store'}</div>
                  <div style={{ fontSize: 11, color: '#94A3B8' }}>{formatDate(r.date)}</div>
                </div>
              </div>
              {deletingId === r._id ? (
                <Loader2 size={16} color="#94A3B8" style={{ animation: 'spin 1s linear infinite' }} />
              ) : (
                <Trash2 size={16} color="#EF4444" style={{ cursor: 'pointer' }} onClick={() => handleDelete(r._id)} title="Delete Receipt" />
              )}
            </div>

            <div style={{ fontSize: 20, fontWeight: 800, color: '#0F172A', textAlign: 'right', marginBottom: 16 }}>
              ₹{(r.totalAmount || 0).toLocaleString('en-IN')}
            </div>

            <div style={{
              height: 120,
              background: '#F8FAFC',
              borderRadius: 8,
              marginBottom: 16,
              backgroundImage: r.imageUrl ? `url("${r.imageUrl}")` : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              border: '1px solid #F1F5F9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {!r.imageUrl && <ReceiptIcon size={28} color="#CBD5E1" />}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ background: catStyle.bg, color: catStyle.text, padding: '4px 8px', borderRadius: 4, fontSize: 11, fontWeight: 700 }}>
                {primaryCategory}
              </span>
              <span style={{ fontSize: 11, color: '#94A3B8', fontWeight: 500 }}>{(r.items || []).length} items</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function ReceiptSummaryPanel({ receipts = [] }) {
  const totalReceipts = receipts.length;
  const totalSpent = receipts.reduce((sum, r) => sum + (r.totalAmount || 0), 0);
  const avgReceipt = totalReceipts > 0 ? Math.round(totalSpent / totalReceipts) : 0;

  return (
    <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 16, padding: 24, marginBottom: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0F172A', margin: 0 }}>Receipt Summary</h3>
        <span style={{ fontSize: 12, color: '#64748B', background: '#F8FAFC', padding: '4px 8px', borderRadius: 6 }}>All Time</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <SummaryRow icon={<ReceiptIcon size={16} color="#10B981" />} iconBg="#D1FAE5" title="Total Receipts" value={totalReceipts} trend="+0%" up={true} />
        <SummaryRow icon={<ShoppingBagIcon size={16} color="#8B5CF6" />} iconBg="#F3E8FF" title="Total Spent" value={`₹${totalSpent.toLocaleString('en-IN')}`} trend="0%" up={true} />
        <SummaryRow icon={<ShieldIcon size={16} color="#F59E0B" />} iconBg="#FEF3C7" title="Average per Receipt" value={`₹${avgReceipt.toLocaleString('en-IN')}`} trend="0%" up={true} />
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

export function TopCategoriesPanel({ receipts = [] }) {
  if (receipts.length === 0) {
    return (
      <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 16, padding: 24, marginBottom: 24 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0F172A', margin: '0 0 24px 0' }}>Top Spending Categories</h3>
        <div style={{ textAlign: 'center', padding: '24px 0', color: '#94A3B8', fontSize: 14 }}>No data yet</div>
      </div>
    );
  }

  const categoryTotals = receipts.reduce((acc, r) => {
    const primaryCategory = r.items?.[0]?.category || 'Other';
    acc[primaryCategory] = (acc[primaryCategory] || 0) + (r.totalAmount || 0);
    return acc;
  }, {});

  const totalSpent = Object.values(categoryTotals).reduce((sum, val) => sum + val, 0);

  const PIE_COLORS = {
    Groceries: '#10B981', Pharmacy: '#F59E0B', Electronics: '#3B82F6', 
    Household: '#92400E', 'Personal Care': '#9D174D', Clothing: '#C2410C', Other: '#8B5CF6'
  };

  const data = Object.entries(categoryTotals)
    .map(([name, value]) => ({
      name,
      value,
      color: PIE_COLORS[name] || PIE_COLORS['Other'],
      percent: totalSpent > 0 ? `${Math.round((value / totalSpent) * 100)}%` : '0%',
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 4);

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
          <div style={{ fontSize: 16, fontWeight: 800, color: '#0F172A' }}>₹{totalSpent.toLocaleString('en-IN')}</div>
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
              <span style={{ fontWeight: 700, color: '#0F172A', width: 48, textAlign: 'right' }}>₹{d.value.toLocaleString('en-IN')}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AIInsightPanel({ receipts = [] }) {
  return (
    <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 16, padding: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#154539', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <SparklesIcon size={12} color="#FFFFFF" />
        </div>
        <h4 style={{ fontSize: 14, fontWeight: 700, color: '#0F172A', margin: 0 }}>AI Insight</h4>
      </div>
      
      <p style={{ fontSize: 13, color: '#334155', lineHeight: 1.5, margin: '0 0 16px 0' }}>
        {receipts.length === 0 ? "Upload receipts to get AI insights." : "You spent most of your money on Groceries this month. (Mock Insight)"}
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
