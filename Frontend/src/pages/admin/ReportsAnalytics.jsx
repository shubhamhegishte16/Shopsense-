import { BarChart3, Calendar, ChevronDown, Download, Eye, Filter, IndianRupee, MoreVertical, Package, ReceiptText, ShieldAlert, TrendingUp, Users } from 'lucide-react';
import AdminLayout from '../../components/Admin/AdminLayout';
import { AdminButton, AdminStatCard, TablePagination } from '../../components/Admin/AdminUI';

const stats = [
  [Users, 'Total Users', '12,532', '+12.6%', 'green'],
  [ReceiptText, 'Receipts Scanned', '24,851', '+18.4%', 'blue'],
  [Package, 'Products Identified', '18,763', '+9.7%', 'purple'],
  [ShieldAlert, 'Food Recall Alerts', '86', '+6.3%', 'orange'],
  [IndianRupee, 'Amount Analyzed', 'Rs 4.28 Cr', '+14.2%', 'teal'],
];

const topUsers = [['Rohan Verma', 48], ['Sneha Iyer', 42], ['Priya Deshmukh', 35], ['Amit Sharma', 31], ['Meera Shah', 29]];
const reports = [
  ['User Activity Report', 'User Analytics', 'Aug 8 - Aug 14, 2026', 'Aug 14, 2026 10:30 AM', 'Admin'],
  ['Receipt Summary Report', 'Receipt Analytics', 'Aug 8 - Aug 14, 2026', 'Aug 14, 2026 10:28 AM', 'Admin'],
  ['Product Category Report', 'Product Analytics', 'Aug 8 - Aug 14, 2026', 'Aug 14, 2026 10:25 AM', 'Admin'],
  ['Food Recall Alert Report', 'Food Recall Analytics', 'Aug 8 - Aug 14, 2026', 'Aug 14, 2026 10:20 AM', 'Admin'],
  ['System Performance Report', 'System Analytics', 'Aug 8 - Aug 14, 2026', 'Aug 14, 2026 10:15 AM', 'Admin'],
];

function LineChart() {
  return (
    <div className="reports-chart reports-line-chart">
      <svg viewBox="0 0 640 330" preserveAspectRatio="none" aria-hidden="true">
        <defs><linearGradient id="reportsLineFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#2F6B56" stopOpacity="0.22" /><stop offset="100%" stopColor="#2F6B56" stopOpacity="0.04" /></linearGradient></defs>
        {[40, 90, 140, 190, 240, 290].map((y) => <line key={y} x1="40" x2="620" y1={y} y2={y} />)}
        <path d="M40 260 L130 170 L220 182 L320 100 L410 190 L520 130 L620 190 L620 300 L40 300 Z" />
        <polyline points="40,260 130,170 220,182 320,100 410,190 520,130 620,190" />
        {[['40', '260'], ['130', '170'], ['220', '182'], ['320', '100'], ['410', '190'], ['520', '130'], ['620', '190']].map(([cx, cy]) => <circle key={cx} cx={cx} cy={cy} r="8" />)}
      </svg>
      <div className="reports-axis"><span>Aug 8</span><span>Aug 9</span><span>Aug 10</span><span>Aug 11</span><span>Aug 12</span><span>Aug 13</span><span>Aug 14</span></div>
    </div>
  );
}

function DonutPanel() {
  const items = [['Groceries', '7,532', '40.1%', '#16A34A'], ['Beverages', '2,845', '15.2%', '#FACC15'], ['Dairy & Eggs', '2,341', '12.5%', '#60A5FA'], ['Snacks', '1,987', '10.6%', '#A855F7'], ['Personal Care', '1,623', '8.7%', '#EC4899'], ['Others', '1,221', '6.4%', '#CBD5E1']];
  return (
    <div className="reports-donut-layout">
      <div className="reports-donut"><strong>18,763</strong><span>Products</span></div>
      <div className="reports-legend">
        {items.map(([label, count, pct, color]) => <div key={label}><i style={{ background: color }} /><span>{label}</span><strong>{count}</strong><small>{pct}</small></div>)}
      </div>
    </div>
  );
}

function BarMini({ danger = false }) {
  return <div className={`reports-bars ${danger ? 'is-danger' : ''}`}>{[46, 72, 61, 52, 72, 59, 84].map((height, index) => <span key={index} style={{ height: `${height}%` }} />)}</div>;
}

function SmallPanel({ title, action, children }) {
  return <section className="admin-panel reports-small-panel"><div className="admin-panel-header"><h2>{title}</h2>{action}</div>{children}</section>;
}

export default function ReportsAnalytics() {
  return (
    <AdminLayout
      title="Reports & Analytics"
      subtitle="View detailed reports and analytics about platform performance and usage."
      actions={<><AdminButton icon={Calendar}>Aug 8 - Aug 14, 2026 <ChevronDown size={16} /></AdminButton><AdminButton icon={Filter}>Filter</AdminButton><AdminButton icon={Download} variant="primary">Export Report</AdminButton></>}
    >
      <div className="admin-stat-grid reports-stat-grid">{stats.map(([icon, label, value, trend, tone]) => <AdminStatCard key={label} icon={icon} label={label} value={value} trend={trend} tone={tone} />)}</div>
      <div className="admin-tabs reports-tabs"><button className="is-active">Overview</button><button>User Analytics</button><button>Receipt Analytics</button><button>Product Analytics</button><button>Food Recall Analytics</button></div>

      <div className="reports-grid">
        <section className="admin-panel reports-chart-panel"><div className="admin-panel-header"><h2>Receipts Scanned Over Time</h2><AdminButton>Daily <ChevronDown size={16} /></AdminButton></div><LineChart /></section>
        <section className="admin-panel reports-chart-panel"><div className="admin-panel-header"><h2>Top Product Categories</h2></div><DonutPanel /></section>
        <aside className="reports-insights"><h2>Key Insights</h2>{['Receipts scanned increased by 18.4% compared to last week.', 'Food recall alerts increased by 6.3% compared to last week.', 'New user signups increased by 15.3% compared to last week.', 'Total amount analyzed increased by 14.2% compared to last week.'].map((item) => <p key={item}><TrendingUp size={18} />{item}</p>)}</aside>
        <SmallPanel title="User Growth" action={<AdminButton>This Week <ChevronDown size={16} /></AdminButton>}><BarMini /></SmallPanel>
        <SmallPanel title="Top Active Users" action={<AdminButton>This Week <ChevronDown size={16} /></AdminButton>}><div className="reports-user-list">{topUsers.map(([name, count]) => <div key={name}><span>{name.split(' ').map((part) => part[0]).join('')}</span><strong>{name}</strong><b>{count}</b></div>)}</div></SmallPanel>
        <SmallPanel title="Recall Alerts Trend" action={<AdminButton>This Week <ChevronDown size={16} /></AdminButton>}><BarMini danger /></SmallPanel>
      </div>

      <section className="admin-table-card reports-table-card">
        <div className="admin-table-title"><h2>Reports Summary</h2></div>
        <div className="admin-table-wrap">
          <table className="admin-table reports-table">
            <thead><tr><th>Report Name</th><th>Category</th><th>Period</th><th>Generated On</th><th>Generated By</th><th>Actions</th></tr></thead>
            <tbody>{reports.map(([name, category, period, generated, author]) => <tr key={name}><td><strong>{name}</strong></td><td>{category}</td><td>{period}</td><td>{generated}</td><td>{author}</td><td><div className="admin-row-actions"><button><Eye size={16} /></button><button><Download size={16} /></button><button><MoreVertical size={16} /></button></div></td></tr>)}</tbody>
          </table>
        </div>
        <TablePagination totalLabel="Showing 1 to 5 of 24 reports" lastPage="5" />
      </section>
    </AdminLayout>
  );
}
