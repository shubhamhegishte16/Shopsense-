import { useMemo, useState, useEffect } from 'react';
import axios from 'axios';
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
  UserPlus,
  Receipt,
  PackagePlus
} from 'lucide-react';
import AdminLayout from '../../components/Admin/AdminLayout';
import { AdminButton, AdminStatCard, StatusBadge, TablePagination } from '../../components/Admin/AdminUI';

const typeMeta = {
  new_user: { label: 'New User', tone: 'green', icon: UserPlus },
  new_receipt: { label: 'New Receipt', tone: 'blue', icon: Receipt },
  new_product: { label: 'New Product', tone: 'purple', icon: PackagePlus },
  new_recall: { label: 'Food Recall', tone: 'red', icon: ShieldAlert },
  system: { label: 'System', tone: 'neutral', icon: Info },
};

function priorityTone(priority) {
  if (priority === 'High') return 'red';
  if (priority === 'Medium') return 'amber';
  return 'green';
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

function ActionDropdown({ onRemove, onMarkRead, read }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="admin-action-dropdown" ref={ref} style={{ position: 'relative' }}>
      <button onClick={() => setOpen(!open)} title="More actions"><MoreVertical size={16} /></button>
      {open && (
        <div className="admin-dropdown-menu" style={{
          position: 'absolute', right: 0, top: '100%', zIndex: 20,
          background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8,
          boxShadow: '0 4px 16px rgba(0,0,0,0.10)', minWidth: 160, padding: '4px 0'
        }}>
          {!read && (
            <button
              className="admin-dropdown-item"
              style={{
                display: 'flex', alignItems: 'center', gap: 8, width: '100%',
                padding: '10px 16px', background: 'none', border: 'none',
                cursor: 'pointer', fontSize: 14, color: '#374151', textAlign: 'left'
              }}
              onClick={() => { setOpen(false); onMarkRead(); }}
            >
              <MailOpen size={15} /> Mark Read
            </button>
          )}
          <button
            className="admin-dropdown-item"
            style={{
              display: 'flex', alignItems: 'center', gap: 8, width: '100%',
              padding: '10px 16px', background: 'none', border: 'none',
              cursor: 'pointer', fontSize: 14, color: '#dc2626', textAlign: 'left'
            }}
            onClick={() => { setOpen(false); onRemove(); }}
          >
            <Trash2 size={15} /> Delete
          </button>
        </div>
      )}
    </div>
  );
}
import { useRef } from 'react';

function NotificationDetailPanel({ notification, onClose }) {
  if (!notification) return null;

  const { _id, title, message, type, priority, read, createdAt } = notification;
  const meta = typeMeta[type] || typeMeta.system;
  
  const createdDate = new Date(createdAt).toLocaleDateString();
  const createdTime = new Date(createdAt).toLocaleTimeString();

  return (
    <aside className="admin-detail-panel notification-detail-panel">
      <div className="admin-detail-header notification-detail-top">
        <div className="notification-detail-heading">
          <NotificationIcon type={type} />
          <div>
            <h2>{title}</h2>
            <p>{message}</p>
          </div>
        </div>
        <button className="admin-icon-btn" type="button" aria-label="Close notification details" onClick={onClose}><X size={18} /></button>
      </div>

      <div className="admin-detail-body">
        <dl className="admin-detail-list notification-detail-list">
          <dt>Notification ID</dt><dd>{_id} <Copy size={15} /></dd>
          <dt>Type</dt><dd><StatusBadge tone={meta.tone}>{meta.label}</StatusBadge></dd>
          <dt>Priority</dt><dd><StatusBadge tone={priorityTone(priority)}>{priority}</StatusBadge></dd>
          <dt>Status</dt><dd><StatusBadge tone={read ? 'green' : 'amber'}>{read ? 'Read' : 'Unread'}</StatusBadge></dd>
          <dt>Created On</dt><dd>{createdDate} {createdTime}</dd>
        </dl>
      </div>
    </aside>
  );
}

export default function NotificationManagement() {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('All Notifications');
  const [selected, setSelected] = useState(null);
  
  const [notifications, setNotifications] = useState([]);
  const [stats, setStats] = useState({ total: 0, unread: 0, read: 0 });

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('shopsense_token');
      const res = await axios.get('/api/admin/notifications', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setNotifications(res.data.data.notifications);
        setStats(res.data.data.stats);
      }
    } catch (error) {
      console.error('Failed to fetch admin notifications', error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markRead = async (id) => {
    try {
      const token = localStorage.getItem('shopsense_token');
      await axios.patch(`/api/admin/notifications/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchNotifications();
    } catch (error) {
      console.error('Failed to mark read', error);
    }
  };

  const markAllRead = async () => {
    try {
      const token = localStorage.getItem('shopsense_token');
      await axios.post(`/api/admin/notifications/mark-all-read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchNotifications();
    } catch (error) {
      console.error('Failed to mark all read', error);
    }
  };

  const deleteNotification = async (id) => {
    try {
      const token = localStorage.getItem('shopsense_token');
      await axios.delete(`/api/admin/notifications/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (selected && selected._id === id) {
        setSelected(null);
      }
      fetchNotifications();
    } catch (error) {
      console.error('Failed to delete', error);
    }
  };

  const filteredNotifications = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    return notifications.filter((notification) => {
      const { title, message, type } = notification;
      const matchesSearch = !normalizedSearch || [title, message, type].some((value) => String(value).toLowerCase().includes(normalizedSearch));
      
      let matchesTab = true;
      if (activeTab === 'Unread') matchesTab = !notification.read;
      if (activeTab === 'Read') matchesTab = notification.read;
      
      return matchesSearch && matchesTab;
    });
  }, [search, activeTab, notifications]);

  const dashboardStats = [
    [Bell, 'Total Events', String(stats.total), '', 'blue'],
    [MailOpen, 'Unread', String(stats.unread), '', 'amber'],
    [FileText, 'Read', String(stats.read), '', 'green'],
  ];

  return (
    <AdminLayout
      title="Admin Notifications"
      subtitle="Monitor platform events like new users, receipts, products, and recalls."
      actions={(
        <>
          <label className="admin-search notification-search">
            <Search size={19} />
            <input type="search" placeholder="Search by title, message or type..." value={search} onChange={(event) => setSearch(event.target.value)} />
          </label>
          <AdminButton icon={MailOpen} variant="primary" onClick={markAllRead}>Mark All Read</AdminButton>
        </>
      )}
      detailPanel={<NotificationDetailPanel notification={selected} onClose={() => setSelected(null)} />}
    >
      <div className="admin-stat-grid notification-stat-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        {dashboardStats.map(([icon, label, value, trend, tone]) => (
          <AdminStatCard key={label} icon={icon} label={label} value={value} trend={trend} tone={tone} />
        ))}
      </div>

      <section className="admin-table-card">
        <div className="admin-tabs admin-table-tabs notification-table-tabs">
          {['All Notifications', 'Unread', 'Read'].map((tab) => (
            <button key={tab} className={activeTab === tab ? 'is-active' : ''} type="button" onClick={() => setActiveTab(tab)}>{tab}</button>
          ))}
        </div>

        <div className="admin-table-wrap">
          <table className="admin-table notification-table">
            <thead>
              <tr>
                <th>Title</th><th>Message</th><th>Type</th><th>Priority</th><th>Status</th><th>Created On</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredNotifications.length ? filteredNotifications.map((notification) => {
                const { _id, title, message, type, priority, read, createdAt } = notification;
                const meta = typeMeta[type] || typeMeta.system;
                const createdDate = new Date(createdAt).toLocaleDateString();
                const createdTime = new Date(createdAt).toLocaleTimeString();
                
                return (
                  <tr key={_id} className={selected?._id === _id ? 'is-selected' : ''}>
                    <td>
                      <div className="notification-title-cell">
                        <NotificationIcon type={type} />
                        <div><strong>{title}</strong></div>
                      </div>
                    </td>
                    <td><small>{message}</small></td>
                    <td><StatusBadge tone={meta.tone}>{meta.label}</StatusBadge></td>
                    <td><StatusBadge tone={priorityTone(priority)}>{priority}</StatusBadge></td>
                    <td><StatusBadge tone={read ? 'green' : 'amber'}>{read ? 'Read' : 'Unread'}</StatusBadge></td>
                    <td>{createdDate}<small>{createdTime}</small></td>
                    <td>
                      <div className="admin-row-actions">
                        <button type="button" aria-label={`View ${title}`} onClick={() => {
                          setSelected(notification);
                          if (!read) markRead(_id);
                        }}><Eye size={16} /></button>
                        <ActionDropdown 
                          read={read}
                          onMarkRead={() => markRead(_id)}
                          onRemove={() => deleteNotification(_id)}
                        />
                      </div>
                    </td>
                  </tr>
                );
              }) : (
                <tr><td colSpan="7" style={{ textAlign: 'center', padding: '24px', color: '#999' }}>No admin notifications match your search.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </AdminLayout>
  );
}
