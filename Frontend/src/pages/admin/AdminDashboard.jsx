import { useEffect, useState } from 'react';
import {
  Bell,
  Boxes,
  Calendar,
  CheckCircle2,
  ChevronDown,
  FileText,
  LineChart,
  MessageCircle,
  ShieldAlert,
  Sparkles,
  Users,
  Wand2,
  XCircle,
  UserPlus,
  Receipt,
  PackagePlus,
  Info,
} from 'lucide-react';
import AdminLayout from '../../components/Admin/AdminLayout';
import { AdminButton, AdminStatCard, StatusBadge } from '../../components/Admin/AdminUI';

const API_BASE = '/api/admin';

function getAuthHeaders() {
  const token = localStorage.getItem('shopsense_token');
  return { Authorization: `Bearer ${token}` };
}

// ─── Panels ──────────────────────────────────────────────────────────────────
function Panel({ title, action, children, className = '' }) {
  return (
    <section className={`admin-panel ${className}`}>
      <div className="admin-panel-header">
        <h2>{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

// ─── User Growth Line + Bar Chart ─────────────────────────────────────────────
function UserGrowthChart({ data }) {
  if (!data || data.length === 0) {
    return <div className="admin-line-chart" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>No data yet</div>;
  }

  const maxCount = Math.max(...data.map((d) => d.count), 1);

  // Build SVG polyline points scaled to 190px height, 520px wide
  const svgWidth = 520;
  const svgHeight = 190;
  const padY = 15;
  const usableH = svgHeight - padY * 2;
  const step = svgWidth / (data.length - 1 || 1);

  const points = data
    .map((d, i) => {
      const x = i * step;
      const y = padY + usableH - (d.count / maxCount) * usableH;
      return `${x},${y}`;
    })
    .join(' ');

  const barHeights = data.map((d) => Math.round((d.count / maxCount) * 100));
  const dayLabels = data.map((d) =>
    new Date(d.date).toLocaleDateString('en-IN', { weekday: 'short' })
  );

  return (
    <div className="admin-line-chart">
      <div className="admin-chart-grid" />
      <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} preserveAspectRatio="none" aria-hidden="true">
        {data.length > 1 && <polyline points={points} />}
      </svg>
      <div className="admin-chart-bars">
        {barHeights.map((height, index) => (
          <span key={index} style={{ height: `${Math.max(height, 4)}%` }} title={`${dayLabels[index]}: ${data[index].count} users`} />
        ))}
      </div>
      <div className="admin-chart-labels" style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: 11, color: '#999' }}>
        {dayLabels.map((label, i) => <span key={i}>{label}</span>)}
      </div>
    </div>
  );
}

// ─── Receipt Donut ─────────────────────────────────────────────────────────────
function ReceiptDonut({ donut }) {
  if (!donut) return null;
  const { processed, pending, failed } = donut;
  return (
    <div className="admin-donut-wrap">
      <div className="admin-donut" />
      <div className="admin-donut-legend">
        <span><i className="dot green" />Successful <strong>{processed.count.toLocaleString('en-IN')} ({processed.pct}%)</strong></span>
        <span><i className="dot amber" />Pending <strong>{pending.count.toLocaleString('en-IN')} ({pending.pct}%)</strong></span>
        <span><i className="dot red" />Failed <strong>{failed.count.toLocaleString('en-IN')} ({failed.pct}%)</strong></span>
      </div>
    </div>
  );
}

// ─── Activity Icon ────────────────────────────────────────────────────────────
const activityIconMap = {
  user: { Icon: UserPlus, tone: 'green' },
  receipt: { Icon: Receipt, tone: 'blue' },
  product: { Icon: PackagePlus, tone: 'purple' },
  recall: { Icon: ShieldAlert, tone: 'red' },
  system: { Icon: Info, tone: 'neutral' },
};

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins} min${mins > 1 ? 's' : ''} ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hr${hrs > 1 ? 's' : ''} ago`;
  return `${Math.floor(hrs / 24)} day(s) ago`;
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${API_BASE}/dashboard-stats`, { headers: getAuthHeaders() });
        const json = await res.json();
        if (json.success) {
          setData(json.data);
        } else {
          setError(json.message || 'Failed to load dashboard');
        }
      } catch (err) {
        setError('Could not connect to the server.');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <AdminLayout title="Dashboard" subtitle="Loading dashboard data…">
        <div style={{ padding: 40, textAlign: 'center', color: '#999' }}>Loading statistics…</div>
      </AdminLayout>
    );
  }

  if (error || !data) {
    return (
      <AdminLayout title="Dashboard" subtitle="Overview of your platform activity.">
        <div style={{ padding: 40, textAlign: 'center', color: '#dc2626' }}>{error || 'Failed to load dashboard data.'}</div>
      </AdminLayout>
    );
  }

  const { stats, userGrowth, receiptDonut, topCategories, recentIssues, recentActivity, systemStatus } = data;

  const statCards = [
    [Users, 'Total Users', stats.totalUsers.toLocaleString('en-IN'), '', 'green'],
    [Users, 'New Users (7d)', stats.newUsers.toLocaleString('en-IN'), '', 'blue'],
    [FileText, 'Total Receipts', stats.totalReceipts.toLocaleString('en-IN'), '', 'purple'],
    [CheckCircle2, 'Processed Receipts', stats.processedReceipts.toLocaleString('en-IN'), '', 'green'],
    [XCircle, 'Failed Receipts', stats.failedReceipts.toLocaleString('en-IN'), '', 'red'],
    [Boxes, 'Total Products', stats.totalProducts.toLocaleString('en-IN'), '', 'amber'],
    [ShieldAlert, 'Active Recalls', stats.activeRecalls.toLocaleString('en-IN'), '', 'orange'],
    [MessageCircle, 'Open Community Issues', stats.openIssues.toLocaleString('en-IN'), '', 'blue'],
    [Wand2, 'AI Requests', stats.aiRequests.toLocaleString('en-IN'), '', 'amber'],
    [LineChart, 'AI Success Rate', `${stats.aiSuccessRate}%`, '', 'teal'],
  ];

  const priorityTone = (p) => (p === 'High' ? 'red' : p === 'Medium' ? 'orange' : 'green');
  const statusTone = (s) => (s === 'Open' ? 'amber' : s === 'In Progress' ? 'blue' : 'green');
  const systemTone = (s) => (s === 'Connected' || s === 'Operational' ? 'green' : s === 'Idle' ? 'amber' : 'red');

  return (
    <AdminLayout
      title="Dashboard"
      subtitle="Overview of your platform activity and key statistics."
      actions={(
        <>
          <AdminButton icon={Calendar}>Last 7 Days <ChevronDown size={16} /></AdminButton>
          <button className="admin-icon-btn has-dot" type="button" aria-label="Notifications"><Bell size={20} /></button>
        </>
      )}
    >
      {/* ── Stat Cards ─────────────────────────────────────────────────────── */}
      <div className="admin-stat-grid dashboard-stat-grid">
        {statCards.map(([icon, label, value, trend, tone]) => (
          <AdminStatCard key={label} icon={icon} label={label} value={value} trend={trend} tone={tone} />
        ))}
      </div>

      <div className="admin-dashboard-grid">
        {/* ── User Growth Chart ──────────────────────────────────────────── */}
        <Panel title="User Growth (Last 7 Days)" action={<AdminButton>Last 7 Days <ChevronDown size={16} /></AdminButton>}>
          <UserGrowthChart data={userGrowth} />
        </Panel>

        {/* ── Receipt Processing Donut ───────────────────────────────────── */}
        <Panel title="Receipt Processing Summary">
          <ReceiptDonut donut={receiptDonut} />
        </Panel>

        {/* ── Top Categories ─────────────────────────────────────────────── */}
        <Panel title="Most Purchased Categories" action={<AdminButton>Top 5 <ChevronDown size={16} /></AdminButton>}>
          <div className="admin-category-list">
            {topCategories.length === 0 ? (
              <p style={{ color: '#999', padding: '12px 0' }}>No pantry data yet. Scan a receipt to get started.</p>
            ) : (
              topCategories.map(({ name, count, pct }, i) => {
                const tones = ['blue', 'orange', 'green', 'teal', 'purple'];
                return (
                  <div key={name}>
                    <span className={`admin-mini-icon tone-${tones[i % tones.length]}`}><Sparkles size={15} /></span>
                    <span>{name}</span>
                    <strong>{count.toLocaleString('en-IN')}</strong>
                    <small>{pct}%</small>
                  </div>
                );
              })
            )}
          </div>
        </Panel>

        {/* ── Recent Community Issues ────────────────────────────────────── */}
        <Panel title="Recent Community Issues" action={<AdminButton>View All</AdminButton>}>
          <div className="admin-mini-table">
            <div className="admin-mini-table-head">
              <span>Issue ID</span><span>Issue</span><span>User</span><span>Priority</span><span>Status</span>
            </div>
            {recentIssues.length === 0 ? (
              <p style={{ color: '#999', padding: '12px 0' }}>No open issues.</p>
            ) : (
              recentIssues.map(({ id, description, userName, priority, status }) => (
                <div key={id}>
                  <span>{id}</span>
                  <strong>{description}</strong>
                  <span>{userName}</span>
                  <StatusBadge tone={priorityTone(priority)}>{priority}</StatusBadge>
                  <StatusBadge tone={statusTone(status)}>{status}</StatusBadge>
                </div>
              ))
            )}
          </div>
        </Panel>

        {/* ── Recent Activity ────────────────────────────────────────────── */}
        <Panel title="Recent Activity" action={<AdminButton>View All</AdminButton>}>
          <div className="admin-timeline">
            {recentActivity.length === 0 ? (
              <p style={{ color: '#999' }}>No recent activity recorded yet.</p>
            ) : (
              recentActivity.map(({ id, title, message, icon, createdAt }) => {
                const { Icon, tone } = activityIconMap[icon] || activityIconMap.system;
                return (
                  <div key={id}>
                    <span className={`tone-${tone}`}><Icon size={15} /></span>
                    <p>
                      {title}
                      <strong style={{ display: 'block', fontSize: 12, color: '#6b7280' }}>{message}</strong>
                      <small>{timeAgo(createdAt)}</small>
                    </p>
                  </div>
                );
              })
            )}
          </div>
        </Panel>

        {/* ── System Status ──────────────────────────────────────────────── */}
        <Panel title="System Status">
          <div className="admin-system-list">
            {systemStatus.map(({ name, status }) => (
              <div key={name}>
                <span>{name}</span>
                <StatusBadge tone={systemTone(status)}>{status}</StatusBadge>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <footer className="admin-footer">2026 ShopSense AI. All rights reserved.</footer>
    </AdminLayout>
  );
}
