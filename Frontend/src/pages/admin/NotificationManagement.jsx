import { useMemo, useState } from 'react';
import {
  AlertTriangle,
  Bell,
  ChevronDown,
  Copy,
  Download,
  Edit3,
  Eye,
  FileText,
  Filter,
  Info,
  MailOpen,
  MoreVertical,
  Search,
  Send,
  ShieldAlert,
  Sparkles,
  Trash2,
  X,
} from 'lucide-react';
import AdminLayout from '../../components/Admin/AdminLayout';
import { AdminButton, AdminStatCard, StatusBadge, TablePagination } from '../../components/Admin/AdminUI';
import { notifications } from './adminData';

const stats = [
  [Bell, 'Total Sent', '1,842', '+15.3%', 'green'],
  [Send, 'Scheduled', '128', '+8.7%', 'blue'],
  [MailOpen, 'Delivered', '1,684', '91.4%', 'orange'],
  [FileText, 'Read', '1,102', '65.4%', 'purple'],
  [AlertTriangle, 'Failed', '26', '-1.5%', 'red'],
];

const typeMeta = {
  recall: { label: 'Alert', tone: 'red', icon: ShieldAlert },
  system: { label: 'System', tone: 'blue', icon: Info },
  feature: { label: 'Feature', tone: 'green', icon: Sparkles },
  admin_note: { label: 'Admin Note', tone: 'neutral', icon: Bell },
};

function priorityTone(priority) {
  if (priority === 'High') return 'red';
  if (priority === 'Medium') return 'amber';
  return 'green';
}

function statusTone(status) {
  if (status === 'Sent') return 'green';
  if (status === 'Scheduled') return 'blue';
  if (status === 'Draft') return 'neutral';
  return 'red';
}

function NotificationIcon({ type }) {
  const meta = typeMeta[type] || typeMeta.system;
  const Icon = meta.icon;
  return (
    <span className={`admin-stat-icon notification-row-icon tone-${meta.tone}`}>
      <Icon size={20} />
    </span>
  );
}

function NotificationDetailPanel({ notification, onClose }) {
  if (!notification) return null;

  const [id, title, subtitle, type, audience, audienceCount, priority, status, createdDate, createdTime, sentOn, createdBy, message, attachment, attachmentSize] = notification;
  const meta = typeMeta[type] || typeMeta.system;

  return (
    <aside className="admin-detail-panel notification-detail-panel">
      <div className="admin-detail-header notification-detail-top">
        <div className="notification-detail-heading">
          <NotificationIcon type={type} />
          <div>
            <h2>{title}</h2>
            <p>{subtitle}</p>
          </div>
        </div>
        <button className="admin-icon-btn" type="button" aria-label="Close notification details" onClick={onClose}><X size={18} /></button>
      </div>

      <div className="admin-detail-body">
        <div className="admin-tabs notification-detail-tabs">
          <button className="is-active" type="button">Overview</button>
          <button type="button">Audience</button>
          <button type="button">Delivery</button>
          <button type="button">Activity</button>
        </div>

        <dl className="admin-detail-list notification-detail-list">
          <dt>Notification ID</dt><dd>{id} <Copy size={15} /></dd>
          <dt>Type</dt><dd><StatusBadge tone={meta.tone}>{meta.label}</StatusBadge></dd>
          <dt>Priority</dt><dd><StatusBadge tone={priorityTone(priority)}>{priority}</StatusBadge></dd>
          <dt>Status</dt><dd><StatusBadge tone={statusTone(status)}>{status}</StatusBadge></dd>
          <dt>Created By</dt><dd>{createdBy}</dd>
          <dt>Created On</dt><dd>{createdDate} {createdTime}</dd>
          <dt>Sent On</dt><dd>{sentOn}</dd>
          <dt>Audience</dt><dd>{audience}<small>{audienceCount}</small></dd>
        </dl>

        <div className="admin-detail-section">
          <h4>Message</h4>
          <p className="notification-message-box">{message}</p>
        </div>

        {attachment && (
          <div className="admin-detail-section">
            <h4>Attachments (1)</h4>
            <div className="notification-attachment">
              <span className="admin-stat-icon tone-red"><FileText size={18} /></span>
              <div>
                <strong>{attachment}</strong>
                <small>{attachmentSize}</small>
              </div>
              <button className="admin-icon-btn" type="button" aria-label="Download attachment"><Download size={17} /></button>
            </div>
          </div>
        )}

        <div className="admin-detail-section">
          <h4>Actions</h4>
          <div className="admin-detail-actions notification-actions">
            <AdminButton icon={Send}>Resend</AdminButton>
            <AdminButton icon={Edit3}>Edit</AdminButton>
            <AdminButton icon={Trash2}>Delete</AdminButton>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default function NotificationManagement() {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('All Notifications');
  const [selected, setSelected] = useState(notifications[0]);

  const filteredNotifications = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    return notifications.filter((notification) => {
      const [, title, subtitle, , audience, , , status, , , , createdBy] = notification;
      const matchesSearch = !normalizedSearch || [title, subtitle, audience, status, createdBy].some((value) => String(value).toLowerCase().includes(normalizedSearch));
      const matchesTab = activeTab === 'All Notifications' || status === activeTab;
      return matchesSearch && matchesTab;
    });
  }, [search, activeTab]);

  return (
    <AdminLayout
      title="Notifications"
      subtitle="Manage and monitor all platform notifications."
      actions={(
        <>
          <label className="admin-search notification-search">
            <Search size={19} />
            <input type="search" placeholder="Search by title, message or user..." value={search} onChange={(event) => setSearch(event.target.value)} />
          </label>
          <AdminButton icon={Filter}>Filter</AdminButton>
          <AdminButton icon={Send} variant="primary">Send Notification</AdminButton>
        </>
      )}
      detailPanel={<NotificationDetailPanel notification={selected} onClose={() => setSelected(null)} />}
    >
      <div className="admin-stat-grid notification-stat-grid">
        {stats.map(([icon, label, value, trend, tone]) => (
          <AdminStatCard key={label} icon={icon} label={label} value={value} trend={trend} tone={tone} />
        ))}
      </div>

      <section className="admin-table-card">
        <div className="admin-tabs admin-table-tabs notification-table-tabs">
          {['All Notifications', 'Sent', 'Scheduled', 'Draft', 'Failed'].map((tab) => (
            <button key={tab} className={activeTab === tab ? 'is-active' : ''} type="button" onClick={() => setActiveTab(tab)}>{tab}</button>
          ))}
        </div>

        <div className="admin-filter-row notification-filter-row">
          <button type="button">All Types <ChevronDown size={16} /></button>
          <button type="button">All Status <ChevronDown size={16} /></button>
          <button type="button">All Priority <ChevronDown size={16} /></button>
          <button type="button">All Users <ChevronDown size={16} /></button>
          <button className="notification-date-filter" type="button">Aug 8 - Aug 14, 2026 <ChevronDown size={16} /></button>
          <button type="button">Clear</button>
        </div>

        <div className="admin-table-wrap">
          <table className="admin-table notification-table">
            <thead>
              <tr>
                <th><input type="checkbox" /></th><th>ID</th><th>Title</th><th>Type</th><th>Audience</th><th>Priority</th><th>Status</th><th>Created On</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredNotifications.length ? filteredNotifications.map((notification) => {
                const [id, title, subtitle, type, audience, audienceCount, priority, status, createdDate, createdTime] = notification;
                const meta = typeMeta[type] || typeMeta.system;
                return (
                  <tr key={id} className={selected?.[0] === id ? 'is-selected' : ''}>
                    <td><input type="checkbox" /></td>
                    <td><strong>{id}</strong></td>
                    <td>
                      <div className="notification-title-cell">
                        <NotificationIcon type={type} />
                        <div><strong>{title}</strong><small>{subtitle}</small></div>
                      </div>
                    </td>
                    <td><StatusBadge tone={meta.tone}>{meta.label}</StatusBadge></td>
                    <td><strong>{audience}</strong><small>{audienceCount}</small></td>
                    <td><StatusBadge tone={priorityTone(priority)}>{priority}</StatusBadge></td>
                    <td><StatusBadge tone={statusTone(status)}>{status}</StatusBadge></td>
                    <td>{createdDate}<small>{createdTime}</small></td>
                    <td>
                      <div className="admin-row-actions">
                        <button type="button" aria-label={`View ${title}`} onClick={() => setSelected(notification)}><Eye size={16} /></button>
                        <button type="button" aria-label={`More actions for ${title}`}><MoreVertical size={16} /></button>
                      </div>
                    </td>
                  </tr>
                );
              }) : (
                <tr><td colSpan="9">No notifications match your search.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <TablePagination totalLabel={`Showing ${filteredNotifications.length ? 1 : 0} to ${filteredNotifications.length} of 1,842 notifications`} lastPage="185" />
      </section>
    </AdminLayout>
  );
}
