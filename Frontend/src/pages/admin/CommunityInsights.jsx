import { Calendar, CheckCircle2, Clock3, Download, Eye, Filter, Flag, Hourglass, MessageCircle, MoreVertical } from 'lucide-react';
import AdminLayout from '../../components/Admin/AdminLayout';
import { AdminButton, AdminStatCard, StatusBadge, TablePagination } from '../../components/Admin/AdminUI';
import { communityReports } from './adminData';

const stats = [
  [MessageCircle, 'Total Reports', '1,248', '+12.6%', 'neutral'],
  [Clock3, 'Open Reports', '427', '+8.3%', 'orange'],
  [Hourglass, 'In Progress', '362', '-4.1%', 'blue'],
  [CheckCircle2, 'Resolved', '459', '+18.7%', 'green'],
  [Flag, 'High Priority', '87', '+7.4%', 'red'],
];

const categories = [
  ['Incorrect Product Info', '312', '25.0%', '#4D7C4A'],
  ['Receipt Scanning Issue', '248', '19.9%', '#F59E0B'],
  ['Incorrect Price', '213', '17.1%', '#3B82F6'],
  ['App Bug / Glitch', '156', '12.5%', '#A855F7'],
  ['AI Recommendation Issue', '128', '10.3%', '#06B6D4'],
  ['Missing Product', '97', '7.8%', '#EC4899'],
  ['Other', '94', '7.4%', '#9CA3AF'],
];

function categoryTone(category) {
  if (category.includes('Scanning')) return 'blue';
  if (category.includes('Price')) return 'orange';
  if (category.includes('Bug')) return 'purple';
  if (category.includes('AI')) return 'teal';
  return 'green';
}

function priorityTone(priority) {
  if (priority === 'High') return 'red';
  if (priority === 'Medium') return 'amber';
  return 'green';
}

function ReportsDonut() {
  return (
    <div className="community-donut-wrap">
      <div className="community-donut">
        <span><strong>1,248</strong><small>Total</small></span>
      </div>
      <div className="community-category-list">
        {categories.map(([name, count, pct, color]) => (
          <div key={name}>
            <i style={{ background: color }} />
            <span>{name}</span>
            <strong>{count}</strong>
            <small>{pct}</small>
          </div>
        ))}
      </div>
    </div>
  );
}

function ReportsTrend() {
  return (
    <div className="community-trend-chart">
      <svg viewBox="0 0 780 360" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id="communityFill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#22C55E" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#22C55E" stopOpacity="0.06" />
          </linearGradient>
        </defs>
        <path d="M0 270 C90 230 120 190 180 170 C260 130 300 120 360 115 C450 145 450 230 540 220 C610 210 610 135 660 105 C705 78 740 110 780 145 L780 360 L0 360 Z" />
        <polyline points="0,270 180,170 360,115 540,220 660,105 780,145" />
        {[['0', '270'], ['180', '170'], ['360', '115'], ['540', '220'], ['660', '105'], ['780', '145']].map(([cx, cy]) => <circle key={cx} cx={cx} cy={cy} r="5" />)}
      </svg>
      <div className="community-trend-labels"><span>Aug 8</span><span>Aug 9</span><span>Aug 10</span><span>Aug 11</span><span>Aug 12</span><span>Aug 13</span><span>Aug 14</span></div>
    </div>
  );
}

export default function CommunityInsights() {
  return (
    <AdminLayout
      title="Community Insights"
      subtitle="Understand user feedback, issues and trends to improve the platform."
      actions={(
        <>
          <AdminButton icon={Calendar}>Aug 8 - Aug 14, 2026</AdminButton>
          <AdminButton icon={Filter}>Filter</AdminButton>
          <AdminButton icon={Download}>Export</AdminButton>
        </>
      )}
    >
      <div className="admin-stat-grid community-stat-grid">
        {stats.map(([icon, label, value, trend, tone]) => (
          <AdminStatCard key={label} icon={icon} label={label} value={value} trend={trend} tone={tone} />
        ))}
      </div>

      <div className="community-grid">
        <section className="admin-panel community-category-panel">
          <div className="admin-panel-header"><h2>Reports by Category</h2><button className="admin-panel-menu" type="button">...</button></div>
          <ReportsDonut />
        </section>
        <section className="admin-panel community-trend-panel">
          <div className="admin-panel-header"><h2>Reports Trend</h2><button className="admin-panel-menu" type="button">...</button></div>
          <ReportsTrend />
        </section>
      </div>

      <section className="admin-table-card">
        <div className="admin-tabs admin-table-tabs">
          <button className="is-active">All Reports</button><button>Open</button><button>In Progress</button><button>Resolved</button><button>Closed</button>
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table community-table">
            <thead>
              <tr><th>ID</th><th>Issue</th><th>Category</th><th>User</th><th>Priority</th><th>Status</th><th>Reported On</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {communityReports.map(([id, issue, category, user, priority, status, date, time]) => (
                <tr key={id}>
                  <td><strong>{id}</strong></td>
                  <td>{issue}</td>
                  <td><StatusBadge tone={categoryTone(category)}>{category}</StatusBadge></td>
                  <td>{user}</td>
                  <td><StatusBadge tone={priorityTone(priority)}>{priority}</StatusBadge></td>
                  <td><StatusBadge tone={status === 'Open' ? 'orange' : 'blue'}>{status}</StatusBadge></td>
                  <td>{date}<small>{time}</small></td>
                  <td><div className="admin-row-actions"><button><Eye size={16} /></button><button><MessageCircle size={16} /></button><button><MoreVertical size={16} /></button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <TablePagination totalLabel="Showing 1 to 7 of 1,248 reports" lastPage="179" />
      </section>
    </AdminLayout>
  );
}
