import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Calendar, CheckCircle2, Clock3, Download, Eye, Filter, Flag, Hourglass, MessageCircle, MoreVertical, X } from 'lucide-react';
import AdminLayout from '../../components/Admin/AdminLayout';
import { AdminButton, AdminStatCard, StatusBadge, TablePagination } from '../../components/Admin/AdminUI';

const CATEGORY_COLORS = {
  'Receipt scanning': '#F59E0B',
  'Pantry': '#3B82F6',
  'Notifications': '#A855F7',
  'Account': '#06B6D4',
  'Other': '#9CA3AF',
  'General': '#4D7C4A',
  'Uncategorized': '#EC4899',
};

function parseCategoryFromIssue(desc) {
  const match = desc.match(/^\[([^\]]+)\]/);
  return match ? match[1] : 'Uncategorized';
}

function categoryTone(category) {
  if (category.includes('scanning') || category.includes('Scanning')) return 'blue';
  if (category.includes('Pantry')) return 'green';
  if (category.includes('Notifications')) return 'purple';
  if (category.includes('Account')) return 'teal';
  return 'orange';
}

function statusTone(status) {
  if (status === 'pending') return 'orange';
  if (status === 'reviewed') return 'blue';
  if (status === 'resolved') return 'green';
  return 'neutral';
}

function ReportsDonut({ categories, total }) {
  return (
    <div className="community-donut-wrap">
      <div className="community-donut">
        <span><strong>{total}</strong><small>Total</small></span>
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
        {categories.length === 0 && <div><span style={{ color: '#999' }}>No issues reported yet</span></div>}
      </div>
    </div>
  );
}

function ReportsTrend({ trendData }) {
  if (!trendData || trendData.length === 0) {
    return (
      <div className="community-trend-chart" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 200, color: '#999' }}>
        No trend data available yet
      </div>
    );
  }

  const maxVal = Math.max(...trendData.map(d => d.count), 1);
  const chartWidth = 780;
  const chartHeight = 300;
  const padding = 40;

  const points = trendData.map((d, i) => {
    const x = trendData.length === 1 ? chartWidth / 2 : (i / (trendData.length - 1)) * (chartWidth - padding * 2) + padding;
    const y = chartHeight - padding - ((d.count / maxVal) * (chartHeight - padding * 2));
    return [x, y];
  });

  const polylineStr = points.map(([x, y]) => `${x},${y}`).join(' ');
  const areaPath = `M${points[0][0]} ${points[0][1]} ` + points.slice(1).map(([x, y]) => `L${x} ${y}`).join(' ') + ` L${points[points.length - 1][0]} ${chartHeight} L${points[0][0]} ${chartHeight} Z`;

  return (
    <div className="community-trend-chart">
      <svg viewBox={`0 0 ${chartWidth} ${chartHeight + 40}`} preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id="communityFill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#22C55E" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#22C55E" stopOpacity="0.06" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill="url(#communityFill)" />
        <polyline points={polylineStr} fill="none" stroke="#22C55E" strokeWidth="2.5" />
        {points.map(([cx, cy], i) => <circle key={i} cx={cx} cy={cy} r="5" fill="#22C55E" />)}
      </svg>
      <div className="community-trend-labels">
        {trendData.map(d => <span key={d.label}>{d.label}</span>)}
      </div>
    </div>
  );
}

export default function CommunityInsights() {
  const [showNewMessage, setShowNewMessage] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [issues, setIssues] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('shopsense_token');
      const headers = { Authorization: `Bearer ${token}` };

      const [issueRes, msgRes] = await Promise.all([
        axios.get('/api/admin/community/issues', { headers }),
        axios.get('/api/admin/community/messages', { headers }),
      ]);

      if (issueRes.data.success) setIssues(issueRes.data.data.issues);
      if (msgRes.data.success) setMessages(msgRes.data.data.messages);
    } catch (err) {
      console.error('Failed to fetch community data', err);
    } finally {
      setLoading(false);
    }
  };

  // Dynamic stats
  const statsData = useMemo(() => {
    const total = issues.length;
    const open = issues.filter(i => i.status === 'pending').length;
    const inProgress = issues.filter(i => i.status === 'reviewed').length;
    const resolved = issues.filter(i => i.status === 'resolved').length;
    return [
      [MessageCircle, 'Total Reports', String(total), '', 'neutral'],
      [Clock3, 'Open Reports', String(open), '', 'orange'],
      [Hourglass, 'In Progress', String(inProgress), '', 'blue'],
      [CheckCircle2, 'Resolved', String(resolved), '', 'green'],
      [Flag, 'Total Messages', String(messages.length), '', 'red'],
    ];
  }, [issues, messages]);

  // Dynamic categories for donut
  const categoryData = useMemo(() => {
    const catMap = {};
    issues.forEach(i => {
      const cat = parseCategoryFromIssue(i.issueDescription);
      catMap[cat] = (catMap[cat] || 0) + 1;
    });
    const total = issues.length || 1;
    return Object.entries(catMap)
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => [name, String(count), ((count / total) * 100).toFixed(1) + '%', CATEGORY_COLORS[name] || '#9CA3AF']);
  }, [issues]);

  // Dynamic trend (issues per day for the last 7 days)
  const trendData = useMemo(() => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days.push({
        date: d.toISOString().slice(0, 10),
        label: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      });
    }
    return days.map(day => {
      const count = issues.filter(i => new Date(i.createdAt).toISOString().slice(0, 10) === day.date).length;
      return { ...day, count };
    });
  }, [issues]);

  // Filtered issues for the table
  const filteredIssues = useMemo(() => {
    if (activeTab === 'All') return issues;
    const statusMap = { 'Open': 'pending', 'In Progress': 'reviewed', 'Resolved': 'resolved' };
    return issues.filter(i => i.status === statusMap[activeTab]);
  }, [issues, activeTab]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    try {
      const token = localStorage.getItem('shopsense_token');
      await axios.post('/api/admin/community/messages', { content: newMessage }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNewMessage('');
      setShowNewMessage(false);
      fetchData();
    } catch (error) {
      console.error('Failed to send admin message', error);
    }
  };

  const handleUpdateIssue = async (issueId, status) => {
    try {
      const token = localStorage.getItem('shopsense_token');
      await axios.patch(`/api/admin/community/issues/${issueId}`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
    } catch (error) {
      console.error('Failed to update issue', error);
    }
  };

  const tabs = ['All', 'Open', 'In Progress', 'Resolved'];

  return (
    <AdminLayout
      title="Community Insights"
      subtitle="Understand user feedback, issues and trends to improve the platform."
      actions={(
        <>
          <AdminButton icon={MessageCircle} onClick={() => setShowNewMessage(true)}>New Message</AdminButton>
          <AdminButton icon={Filter}>Filter</AdminButton>
          <AdminButton icon={Download}>Export</AdminButton>
        </>
      )}
    >
      <div className="admin-stat-grid community-stat-grid">
        {statsData.map(([icon, label, value, trend, tone]) => (
          <AdminStatCard key={label} icon={icon} label={label} value={value} trend={trend} tone={tone} />
        ))}
      </div>

      <div className="community-grid">
        <section className="admin-panel community-category-panel">
          <div className="admin-panel-header"><h2>Reports by Category</h2><button className="admin-panel-menu" type="button">...</button></div>
          <ReportsDonut categories={categoryData} total={issues.length} />
        </section>
        <section className="admin-panel community-trend-panel">
          <div className="admin-panel-header"><h2>Reports Trend (Last 7 Days)</h2><button className="admin-panel-menu" type="button">...</button></div>
          <ReportsTrend trendData={trendData} />
        </section>
      </div>

      {/* Messages Section */}
      <section className="admin-table-card" style={{ marginBottom: '24px' }}>
        <div className="admin-panel-header"><h2>Community Messages ({messages.length})</h2></div>
        <div className="admin-table-wrap">
          <table className="admin-table community-table">
            <thead>
              <tr><th>Sender</th><th>Type</th><th>Content</th><th>Date</th></tr>
            </thead>
            <tbody>
              {messages.map(m => (
                <tr key={m._id}>
                  <td><strong>{m.sender?.fullName || 'Unknown'}</strong></td>
                  <td><StatusBadge tone={m.type === 'admin_announcement' ? 'green' : m.type === 'food_recall' ? 'red' : 'blue'}>{m.type.replace('_', ' ')}</StatusBadge></td>
                  <td>{m.content.substring(0, 80)}{m.content.length > 80 ? '...' : ''}</td>
                  <td>{new Date(m.createdAt).toLocaleString()}</td>
                </tr>
              ))}
              {messages.length === 0 && <tr><td colSpan={4} style={{ textAlign: 'center', color: '#999', padding: '24px' }}>No messages yet</td></tr>}
            </tbody>
          </table>
        </div>
      </section>

      {/* Issues Table */}
      <section className="admin-table-card">
        <div className="admin-tabs admin-table-tabs">
          {tabs.map(tab => (
            <button key={tab} className={activeTab === tab ? 'is-active' : ''} onClick={() => setActiveTab(tab)}>{tab === 'All' ? 'All Reports' : tab}</button>
          ))}
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table community-table">
            <thead>
              <tr><th>ID</th><th>Issue</th><th>User</th><th>Status</th><th>Reported On</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {filteredIssues.map(issue => (
                <tr key={issue._id}>
                  <td><strong>{issue._id.slice(-6).toUpperCase()}</strong></td>
                  <td>{issue.issueDescription.substring(0, 60)}{issue.issueDescription.length > 60 ? '...' : ''}</td>
                  <td>{issue.user?.fullName || 'Unknown'}<small style={{ display: 'block', color: '#999' }}>{issue.user?.email}</small></td>
                  <td><StatusBadge tone={statusTone(issue.status)}>{issue.status}</StatusBadge></td>
                  <td>{new Date(issue.createdAt).toLocaleDateString()}<small style={{ display: 'block' }}>{new Date(issue.createdAt).toLocaleTimeString()}</small></td>
                  <td>
                    <div className="admin-row-actions">
                      {issue.status === 'pending' && <button onClick={() => handleUpdateIssue(issue._id, 'reviewed')} title="Mark as Reviewed"><Eye size={16} /></button>}
                      {issue.status === 'reviewed' && <button onClick={() => handleUpdateIssue(issue._id, 'resolved')} title="Mark as Resolved"><CheckCircle2 size={16} /></button>}
                      {issue.status === 'resolved' && <span style={{ color: '#22c55e', fontSize: '12px' }}>Done</span>}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredIssues.length === 0 && <tr><td colSpan={6} style={{ textAlign: 'center', color: '#999', padding: '24px' }}>No issues found</td></tr>}
            </tbody>
          </table>
        </div>
        <TablePagination totalLabel={`Showing ${filteredIssues.length} of ${issues.length} reports`} lastPage="1" />
      </section>

      {showNewMessage && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', width: '100%', maxWidth: '500px', position: 'relative' }}>
            <button onClick={() => setShowNewMessage(false)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
            <h2 style={{ marginBottom: '8px', fontSize: '18px', fontWeight: 'bold' }}>Send Community Message</h2>
            <p style={{ marginBottom: '20px', color: '#666', fontSize: '14px' }}>Broadcast an announcement or alert to all users.</p>
            <form onSubmit={handleSendMessage}>
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message here..."
                rows={5}
                maxLength={500}
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', marginBottom: '16px', fontFamily: 'inherit', resize: 'vertical' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', color: '#888' }}>{newMessage.length}/500</span>
                <button type="submit" style={{ background: '#10b981', color: '#fff', padding: '10px 20px', borderRadius: '6px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>Send Message</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
