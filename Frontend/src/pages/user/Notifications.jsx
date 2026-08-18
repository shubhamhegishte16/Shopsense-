import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle, Bell, CheckCircle2, FileText, Filter,
  Loader2, PackageCheck, Search, ShieldAlert, Sparkles, TrendingUp, User
} from 'lucide-react';
import Sidebar from '../../components/User/Sidebar';

const API_BASE = 'http://localhost:5000/api';

function getAuthHeaders() {
  const token = localStorage.getItem('shopsense_token');
  return { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) };
}

// Map backend type -> { icon, tone }
const TYPE_CONFIG = {
  receipt:    { Icon: FileText,     tone: 'green'  },
  system:     { Icon: Bell,         tone: 'purple' },
  pantry:     { Icon: PackageCheck, tone: 'green'  },
  profile:    { Icon: User,         tone: 'blue'   },
  compare:    { Icon: TrendingUp,   tone: 'blue'   },
  recall:     { Icon: ShieldAlert,  tone: 'red'    },
  admin_note: { Icon: AlertTriangle,tone: 'amber'  },
};

function typeConfig(type) {
  return TYPE_CONFIG[type] || { Icon: Sparkles, tone: 'purple' };
}

function toneClass(tone) {
  return `user-notification-tone-${tone}`;
}

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins < 1)   return 'Just now';
  if (mins < 60)  return `${mins} min${mins > 1 ? 's' : ''} ago`;
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (days === 1) return 'Yesterday';
  return `${days} days ago`;
}

const tabs = ['All', 'Unread', 'Receipt', 'Alert', 'Pantry', 'System'];

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState(null);
  const [activeTab, setActiveTab]         = useState('All');
  const [search, setSearch]               = useState('');

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/notifications`, { headers: getAuthHeaders() });
      if (!res.ok) throw new Error('Failed to fetch notifications');
      const data = await res.json();
      setNotifications(data.notifications || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchNotifications(); }, [fetchNotifications]);

  const markRead = useCallback(async (id) => {
    try {
      await fetch(`${API_BASE}/notifications/${id}/read`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
      });
      setNotifications(prev =>
        prev.map(n => (n._id === id ? { ...n, read: true } : n))
      );
    } catch { /* silent */ }
  }, []);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return notifications.filter(n => {
      const tabMatch =
        activeTab === 'All'    ||
        (activeTab === 'Unread' && !n.read) ||
        n.type?.toLowerCase() === activeTab.toLowerCase() ||
        (activeTab === 'Alert' && n.type === 'recall');
      const searchMatch = !query || `${n.title} ${n.message} ${n.type}`.toLowerCase().includes(query);
      return tabMatch && searchMatch;
    });
  }, [notifications, activeTab, search]);

  return (
    <div className="user-page-shell">
      <div className="sidebar-wrapper"><Sidebar /></div>
      <main className="user-notifications-main">
        <header className="user-notification-header">
          <div>
            <h1>Notifications</h1>
            <p>Stay updated with important alerts and updates.</p>
          </div>
          <div className="user-notification-actions">
            <label className="user-notification-search">
              <Search size={20} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search notifications..."
              />
            </label>
            <button type="button" onClick={fetchNotifications}><Filter size={19} />Refresh</button>
          </div>
        </header>

        <nav className="user-notification-tabs" aria-label="Notification filters">
          {tabs.map(tab => (
            <button
              key={tab}
              className={activeTab === tab ? 'is-active' : ''}
              type="button"
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </nav>

        <section className="user-notification-card">
          <div className="user-notification-table-head">
            <span>Notification</span>
            <span>Type</span>
            <span>Time</span>
          </div>

          {loading && (
            <div className="user-notification-empty">
              <Loader2 size={28} style={{ animation: 'spin 1s linear infinite' }} />
              <span>Loading notifications…</span>
            </div>
          )}

          {!loading && error && (
            <div className="user-notification-empty">
              <AlertTriangle size={24} />
              <span>{error}</span>
            </div>
          )}

          {!loading && !error && filtered.map(n => {
            const { Icon, tone } = typeConfig(n.type);
            return (
              <article
                className={`user-notification-row${!n.read ? ' is-unread' : ''}`}
                key={n._id}
                onClick={() => !n.read && markRead(n._id)}
                style={{ cursor: !n.read ? 'pointer' : 'default' }}
              >
                <div className="user-notification-message">
                  <span className={`user-notification-icon ${toneClass(tone)}`}>
                    <Icon size={22} />
                  </span>
                  <div>
                    <h2>{n.title}</h2>
                    <p>{n.message}</p>
                  </div>
                </div>
                <span className={`user-notification-badge ${toneClass(tone)}`}>{n.type}</span>
                <time>{timeAgo(n.createdAt)}</time>
                {!n.read && <i aria-label="Unread notification" />}
              </article>
            );
          })}
        </section>

        {!loading && !error && filtered.length === 0 && (
          <div className="user-notification-empty">
            <CheckCircle2 size={24} />
            <span>No notifications to show</span>
          </div>
        )}
      </main>
    </div>
  );
}
