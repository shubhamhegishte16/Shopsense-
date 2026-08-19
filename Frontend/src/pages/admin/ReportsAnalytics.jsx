import { useEffect, useState } from 'react';
import {
  BarChart3, Calendar, ChevronDown, Download, Eye, Filter,
  IndianRupee, MoreVertical, Package, ReceiptText, ShieldAlert,
  TrendingUp, TrendingDown, Users,
} from 'lucide-react';
import AdminLayout from '../../components/Admin/AdminLayout';
import { AdminButton, AdminStatCard, TablePagination } from '../../components/Admin/AdminUI';

const API_BASE = '/api/admin';

function getAuthHeaders() {
  const token = localStorage.getItem('shopsense_token');
  return { Authorization: `Bearer ${token}` };
}

// ─── Line Chart (Receipts Over Time) ─────────────────────────────────────────
function LineChart({ chartData }) {
  if (!chartData || chartData.length === 0) {
    return <div className="reports-chart reports-line-chart" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999', height: 200 }}>No receipt data yet</div>;
  }

  const svgW = 640, svgH = 290;
  const padX = 40, padY = 30;
  const usableW = svgW - padX * 2;
  const usableH = svgH - padY * 2;
  const maxVal = Math.max(...chartData.map((d) => d.value), 1);
  const step = usableW / (chartData.length - 1 || 1);

  const pts = chartData.map((d, i) => {
    const x = padX + i * step;
    const y = padY + usableH - (d.value / maxVal) * usableH;
    return [x, y];
  });

  const polyline = pts.map(([x, y]) => `${x},${y}`).join(' ');
  const fillPath = `M${pts[0][0]},${pts[0][1]} ${pts.map(([x, y]) => `L${x},${y}`).join(' ')} L${pts[pts.length - 1][0]},${svgH - padY} L${pts[0][0]},${svgH - padY} Z`;

  const gridLines = [padY, padY + usableH * 0.25, padY + usableH * 0.5, padY + usableH * 0.75, svgH - padY];
  const labels = chartData.map((d) => new Date(d.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }));

  return (
    <div className="reports-chart reports-line-chart">
      <svg viewBox={`0 0 ${svgW} ${svgH}`} preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id="reportsLineFill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#2F6B56" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#2F6B56" stopOpacity="0.04" />
          </linearGradient>
        </defs>
        {gridLines.map((y) => <line key={y} x1={padX} x2={svgW - padX} y1={y} y2={y} stroke="#e5e7eb" strokeWidth="1" />)}
        <path d={fillPath} fill="url(#reportsLineFill)" />
        <polyline points={polyline} fill="none" stroke="#2F6B56" strokeWidth="2.5" />
        {pts.map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r="6" fill="#2F6B56" stroke="#fff" strokeWidth="2">
            <title>{`${labels[i]}: ${chartData[i].value} receipts`}</title>
          </circle>
        ))}
      </svg>
      <div className="reports-axis">
        {labels.map((label, i) => <span key={i}>{label}</span>)}
      </div>
    </div>
  );
}

// ─── Donut (Product Categories) ──────────────────────────────────────────────
function DonutPanel({ categoryDonut, totalProducts }) {
  if (!categoryDonut || categoryDonut.length === 0) {
    return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999', height: 200 }}>No category data yet</div>;
  }
  return (
    <div className="reports-donut-layout">
      <div className="reports-donut">
        <strong>{totalProducts?.toLocaleString('en-IN') || 0}</strong>
        <span>Products</span>
      </div>
      <div className="reports-legend">
        {categoryDonut.map(({ name, count, pct, color }) => (
          <div key={name}>
            <i style={{ background: color }} />
            <span>{name}</span>
            <strong>{count.toLocaleString('en-IN')}</strong>
            <small>{pct}%</small>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Bar Mini ─────────────────────────────────────────────────────────────────
function BarMini({ chartData, danger = false }) {
  if (!chartData || chartData.length === 0) {
    return <div className={`reports-bars ${danger ? 'is-danger' : ''}`} style={{ height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999', fontSize: 12 }}>No data</div>;
  }
  const max = Math.max(...chartData.map((d) => d.value), 1);
  return (
    <div className={`reports-bars ${danger ? 'is-danger' : ''}`}>
      {chartData.map(({ date, value }, i) => (
        <span key={i} style={{ height: `${Math.max((value / max) * 100, 4)}%` }} title={`${new Date(date).toLocaleDateString('en-IN', { weekday: 'short' })}: ${value}`} />
      ))}
    </div>
  );
}

// ─── Small Panel Wrapper ──────────────────────────────────────────────────────
function SmallPanel({ title, action, children }) {
  return (
    <section className="admin-panel reports-small-panel">
      <div className="admin-panel-header"><h2>{title}</h2>{action}</div>
      {children}
    </section>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ReportsAnalytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${API_BASE}/reports-analytics`, { headers: getAuthHeaders() });
        const json = await res.json();
        if (json.success) {
          setData(json.data);
        } else {
          setError(json.message || 'Failed to load analytics');
        }
      } catch (err) {
        setError('Could not connect to the server.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <AdminLayout title="Reports & Analytics" subtitle="Loading analytics data…">
        <div style={{ padding: 40, textAlign: 'center', color: '#999' }}>Loading reports data…</div>
      </AdminLayout>
    );
  }

  if (error || !data) {
    return (
      <AdminLayout title="Reports & Analytics" subtitle="View detailed analytics.">
        <div style={{ padding: 40, textAlign: 'center', color: '#dc2626' }}>{error || 'Failed to load data.'}</div>
      </AdminLayout>
    );
  }

  const { stats, receiptsChart, userGrowthChart, recallsChart, categoryDonut, topUsers, reportsSummary } = data;

  const statCards = [
    [Users, 'Total Users', stats.totalUsers.toLocaleString('en-IN'), stats.userTrend, 'green'],
    [ReceiptText, 'Receipts Scanned', stats.totalReceipts.toLocaleString('en-IN'), stats.receiptTrend, 'blue'],
    [Package, 'Products Identified', stats.totalProducts.toLocaleString('en-IN'), '', 'purple'],
    [ShieldAlert, 'Food Recall Alerts', stats.totalRecalls.toLocaleString('en-IN'), stats.recallTrend, 'orange'],
    [IndianRupee, 'Amount Analyzed', stats.totalAmount, '', 'teal'],
  ];

  // Key insights derived from trends
  const insights = [
    `Receipts scanned ${stats.receiptTrend?.startsWith('+') ? 'increased' : 'decreased'} by ${stats.receiptTrend} compared to last week.`,
    `Food recall alerts ${stats.recallTrend?.startsWith('+') ? 'increased' : stats.recallTrend === '0%' ? 'unchanged' : 'decreased'} by ${stats.recallTrend} compared to last week.`,
    `New user signups ${stats.userTrend?.startsWith('+') ? 'increased' : 'decreased'} by ${stats.userTrend} compared to last week.`,
    `Total of ${stats.totalAmount} in transactions analyzed across all receipts.`,
  ];

  return (
    <AdminLayout
      title="Reports & Analytics"
      subtitle="View detailed reports and analytics about platform performance and usage."
      actions={<><AdminButton icon={Calendar}>Last 7 Days <ChevronDown size={16} /></AdminButton><AdminButton icon={Filter}>Filter</AdminButton><AdminButton icon={Download} variant="primary">Export Report</AdminButton></>}
    >
      {/* ── Stat Cards ──────────────────────────────────────────────────────── */}
      <div className="admin-stat-grid reports-stat-grid">
        {statCards.map(([icon, label, value, trend, tone]) => (
          <AdminStatCard key={label} icon={icon} label={label} value={value} trend={trend} tone={tone} />
        ))}
      </div>

      <div className="admin-tabs reports-tabs">
        <button className="is-active">Overview</button>
        <button>User Analytics</button>
        <button>Receipt Analytics</button>
        <button>Product Analytics</button>
        <button>Food Recall Analytics</button>
      </div>

      <div className="reports-grid">
        {/* ── Receipts Over Time ──────────────────────────────────────────── */}
        <section className="admin-panel reports-chart-panel">
          <div className="admin-panel-header"><h2>Receipts Scanned Over Time</h2><AdminButton>Daily <ChevronDown size={16} /></AdminButton></div>
          <LineChart chartData={receiptsChart} />
        </section>

        {/* ── Product Categories Donut ────────────────────────────────────── */}
        <section className="admin-panel reports-chart-panel">
          <div className="admin-panel-header"><h2>Top Product Categories</h2></div>
          <DonutPanel categoryDonut={categoryDonut} totalProducts={stats.totalProducts} />
        </section>

        {/* ── Key Insights ────────────────────────────────────────────────── */}
        <aside className="reports-insights">
          <h2>Key Insights</h2>
          {insights.map((item, i) => (
            <p key={i}>
              {item.includes('decreased') ? <TrendingDown size={18} /> : <TrendingUp size={18} />}
              {item}
            </p>
          ))}
        </aside>

        {/* ── User Growth ─────────────────────────────────────────────────── */}
        <SmallPanel title="User Growth" action={<AdminButton>This Week <ChevronDown size={16} /></AdminButton>}>
          <BarMini chartData={userGrowthChart} />
        </SmallPanel>

        {/* ── Top Active Users ────────────────────────────────────────────── */}
        <SmallPanel title="Top Active Users" action={<AdminButton>This Week <ChevronDown size={16} /></AdminButton>}>
          <div className="reports-user-list">
            {topUsers.length === 0 ? (
              <p style={{ color: '#999', padding: '8px 0' }}>No user data yet.</p>
            ) : (
              topUsers.map(({ name, receiptCount, initials }) => (
                <div key={name}>
                  <span>{initials}</span>
                  <strong>{name}</strong>
                  <b>{receiptCount} receipts</b>
                </div>
              ))
            )}
          </div>
        </SmallPanel>

        {/* ── Recall Alerts Trend ─────────────────────────────────────────── */}
        <SmallPanel title="Recall Alerts Trend" action={<AdminButton>This Week <ChevronDown size={16} /></AdminButton>}>
          <BarMini chartData={recallsChart} danger />
        </SmallPanel>
      </div>

      {/* ── Reports Summary Table ──────────────────────────────────────────── */}
      <section className="admin-table-card reports-table-card">
        <div className="admin-table-title"><h2>Reports Summary</h2></div>
        <div className="admin-table-wrap">
          <table className="admin-table reports-table">
            <thead>
              <tr>
                <th>Report Name</th><th>Category</th><th>Period</th><th>Generated On</th><th>Generated By</th><th>Trend</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reportsSummary.map(({ name, category, period, generatedOn, generatedBy, stats: s }) => (
                <tr key={name}>
                  <td><strong>{name}</strong></td>
                  <td>{category}</td>
                  <td>{period}</td>
                  <td>{generatedOn}</td>
                  <td>{generatedBy}</td>
                  <td>
                    <span style={{ color: s.trend?.startsWith('+') ? '#16a34a' : s.trend === '0%' ? '#6b7280' : '#dc2626', fontWeight: 600 }}>
                      {s.trend?.startsWith('+') ? <TrendingUp size={13} style={{ verticalAlign: 'middle', marginRight: 4 }} /> : null}
                      {s.trend}
                    </span>
                  </td>
                  <td>
                    <div className="admin-row-actions">
                      <button type="button"><Eye size={16} /></button>
                      <button type="button"><Download size={16} /></button>
                      <button type="button"><MoreVertical size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <TablePagination totalLabel={`Showing 1 to ${reportsSummary.length} of ${reportsSummary.length} reports`} lastPage="1" />
      </section>
    </AdminLayout>
  );
}
