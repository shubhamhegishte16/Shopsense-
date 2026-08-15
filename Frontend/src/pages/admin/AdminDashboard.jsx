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
} from 'lucide-react';
import AdminLayout from '../../components/Admin/AdminLayout';
import { AdminButton, AdminStatCard, StatusBadge } from '../../components/Admin/AdminUI';

const stats = [
  [Users, 'Total Users', '12,846', '+12.5%', 'green'],
  [Users, 'New Users', '1,243', '+12.8%', 'blue'],
  [FileText, 'Total Receipts', '45,231', '+8.7%', 'purple'],
  [CheckCircle2, 'Processed Receipts', '43,562', '+9.4%', 'green'],
  [XCircle, 'Failed Receipts', '1,669', '-5.3%', 'red'],
  [Boxes, 'Total Products', '8,523', '+3.6%', 'amber'],
  [ShieldAlert, 'Active Recalls', '24', '-11.1%', 'orange'],
  [MessageCircle, 'Open Community Issues', '37', '-8.3%', 'blue'],
  [Wand2, 'AI Requests', '78,634', '+14.6%', 'amber'],
  [LineChart, 'AI Success Rate', '96.2%', '+1.8%', 'teal'],
];

const categories = [
  ['Dairy & Eggs', '12,532', '27.7%', 'blue'],
  ['Snacks & Beverages', '9,842', '21.7%', 'orange'],
  ['Fruits & Vegetables', '7,651', '16.9%', 'green'],
  ['Household Essentials', '6,108', '13.5%', 'teal'],
  ['Personal Care', '4,231', '9.3%', 'purple'],
];

const issues = [
  ['#CI-1256', 'Incorrect price shown...', 'Incorrect Price', 'High', 'Open'],
  ['#CI-1255', 'Receipt scanning not...', 'Scanning Issue', 'Medium', 'Open'],
  ['#CI-1254', 'Wrong product detec...', 'AI Extraction', 'High', 'In Progress'],
  ['#CI-1253', 'Expired item alert...', 'Alert Issue', 'Medium', 'Open'],
];

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

function UserGrowthChart() {
  const bars = [48, 62, 54, 74, 69, 88, 78];
  return (
    <div className="admin-line-chart">
      <div className="admin-chart-grid" />
      <svg viewBox="0 0 520 190" preserveAspectRatio="none" aria-hidden="true">
        <polyline points="0,140 86,112 172,124 260,75 346,90 432,38 520,58" />
      </svg>
      <div className="admin-chart-bars">
        {bars.map((height, index) => <span key={index} style={{ height: `${height}%` }} />)}
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <AdminLayout
      title="Dashboard"
      subtitle="Overview of your platform activity and key statistics."
      actions={(
        <>
          <AdminButton icon={Calendar}>Aug 8 - Aug 14, 2026 <ChevronDown size={16} /></AdminButton>
          <button className="admin-icon-btn has-dot" type="button" aria-label="Notifications"><Bell size={20} /></button>
        </>
      )}
    >
      <div className="admin-stat-grid dashboard-stat-grid">
        {stats.map(([icon, label, value, trend, tone]) => (
          <AdminStatCard key={label} icon={icon} label={label} value={value} trend={trend} tone={tone} />
        ))}
      </div>

      <div className="admin-dashboard-grid">
        <Panel title="User Growth" action={<AdminButton>Last 7 Days <ChevronDown size={16} /></AdminButton>}>
          <UserGrowthChart />
        </Panel>

        <Panel title="Receipt Processing Summary">
          <div className="admin-donut-wrap">
            <div className="admin-donut" />
            <div className="admin-donut-legend">
              <span><i className="dot green" />Successful <strong>43,562 (96.3%)</strong></span>
              <span><i className="dot amber" />Pending <strong>525 (1.2%)</strong></span>
              <span><i className="dot red" />Failed <strong>1,669 (2.5%)</strong></span>
            </div>
          </div>
        </Panel>

        <Panel title="Most Purchased Categories" action={<AdminButton>Top 5 <ChevronDown size={16} /></AdminButton>}>
          <div className="admin-category-list">
            {categories.map(([name, total, pct, tone]) => (
              <div key={name}>
                <span className={`admin-mini-icon tone-${tone}`}><Sparkles size={15} /></span>
                <span>{name}</span>
                <strong>{total}</strong>
                <small>{pct}</small>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Recent Community Issues" action={<AdminButton>View All</AdminButton>}>
          <div className="admin-mini-table">
            <div className="admin-mini-table-head"><span>Issue ID</span><span>Issue</span><span>Category</span><span>Priority</span><span>Status</span></div>
            {issues.map(([id, issue, category, priority, status]) => (
              <div key={id}>
                <span>{id}</span>
                <strong>{issue}</strong>
                <span>{category}</span>
                <StatusBadge tone={priority === 'High' ? 'red' : 'orange'}>{priority}</StatusBadge>
                <StatusBadge tone={status === 'Open' ? 'amber' : 'blue'}>{status}</StatusBadge>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Recent Activity" action={<AdminButton>View All</AdminButton>}>
          <div className="admin-timeline">
            <div><span className="tone-green"><Users size={15} /></span><p>New user registered:<strong>Priya Deshmukh</strong><small>2 mins ago</small></p></div>
            <div><span className="tone-blue"><FileText size={15} /></span><p>Receipt processed successfully<small>12 mins ago</small></p></div>
            <div><span className="tone-purple"><Boxes size={15} /></span><p>New product added:<strong>Tata Sampann</strong><small>28 mins ago</small></p></div>
          </div>
        </Panel>

        <Panel title="System Status">
          <div className="admin-system-list">
            {['MongoDB', 'AI Service (Gemini)', 'Receipt Processing', 'Cloudinary (Storage)', 'Email Service'].map((service) => (
              <div key={service}><span>{service}</span><StatusBadge tone="green">Connected</StatusBadge></div>
            ))}
          </div>
        </Panel>
      </div>
      <footer className="admin-footer">2026 ShopSense AI. All rights reserved.</footer>
    </AdminLayout>
  );
}
