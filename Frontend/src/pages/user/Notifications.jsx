import { useMemo, useState } from 'react';
import { AlertTriangle, Bell, CheckCircle2, FileText, Filter, Gift, Handshake, PackageCheck, Search, ShieldAlert, Sparkles, Tag, TrendingUp } from 'lucide-react';
import Sidebar from '../../components/User/Sidebar';

const userNotifications = [
  ['Receipt scanned successfully', 'Your receipt from D-Mart on Aug 14, 2026 has been scanned and analyzed.', 'Receipt', 'Just now', true, FileText, 'green'],
  ['Food Recall Alert', 'A product in your recent receipt has been recalled. Tap to view details.', 'Alert', '5 mins ago', true, ShieldAlert, 'red'],
  ['Budget limit reached', 'You have reached 90% of your monthly Groceries budget.', 'Budget', '1 hour ago', true, Tag, 'amber'],
  ['New offer for you!', 'Exclusive offer on your favorite products. Check now and save more!', 'Offer', '3 hours ago', false, Sparkles, 'purple'],
  ['Weekly spending summary is ready', 'Check out your spending summary for Aug 8 - Aug 14, 2026.', 'Insight', 'Yesterday', false, TrendingUp, 'blue'],
  ['Pantry item running low', 'Milk is running low in your pantry. Add it to your shopping list?', 'Pantry', 'Yesterday', false, PackageCheck, 'green'],
  ['System update', "We've improved receipt scanning accuracy. Update now for better experience.", 'System', '2 days ago', false, Bell, 'purple'],
  ['You earned 50 points!', 'Scan more receipts to earn more points and unlock exciting rewards.', 'Reward', '3 days ago', false, Gift, 'teal'],
  ['Welcome to ShopSense AI!', "Let's get started! Scan your first receipt and explore smart insights.", 'Welcome', '1 week ago', false, Handshake, 'orange'],
];

const tabs = ['All', 'Unread', 'Receipts', 'Alerts', 'System', 'Offers'];

function toneClass(tone) {
  return `user-notification-tone-${tone}`;
}

export default function Notifications() {
  const [activeTab, setActiveTab] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return userNotifications.filter(([title, message, type, , unread]) => {
      const tabMatch = activeTab === 'All'
        || (activeTab === 'Unread' && unread)
        || type.toLowerCase() === activeTab.replace(/s$/, '').toLowerCase();
      const searchMatch = !query || `${title} ${message} ${type}`.toLowerCase().includes(query);
      return tabMatch && searchMatch;
    });
  }, [activeTab, search]);

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
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search notifications..." />
            </label>
            <button type="button"><Filter size={19} />Filter</button>
          </div>
        </header>

        <nav className="user-notification-tabs" aria-label="Notification filters">
          {tabs.map((tab) => (
            <button key={tab} className={activeTab === tab ? 'is-active' : ''} type="button" onClick={() => setActiveTab(tab)}>{tab}</button>
          ))}
        </nav>

        <section className="user-notification-card">
          <div className="user-notification-table-head">
            <span>Notification</span>
            <span>Type</span>
            <span>Time</span>
          </div>
          {filtered.map(([title, message, type, time, unread, Icon, tone]) => (
            <article className="user-notification-row" key={title}>
              <div className="user-notification-message">
                <span className={`user-notification-icon ${toneClass(tone)}`}><Icon size={22} /></span>
                <div>
                  <h2>{title}</h2>
                  <p>{message}</p>
                </div>
              </div>
              <span className={`user-notification-badge ${toneClass(tone)}`}>{type}</span>
              <time>{time}</time>
              {unread && <i aria-label="Unread notification" />}
            </article>
          ))}
        </section>

        <div className="user-notification-empty">
          <span>No more notifications to show</span>
          <CheckCircle2 size={24} />
        </div>
      </main>
    </div>
  );
}
