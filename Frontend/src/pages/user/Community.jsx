import { useMemo, useState } from 'react';
import {
  AlertTriangle,
  Check,
  ClipboardList,
  Filter,
  Headphones,
  Megaphone,
  MessageCircle,
  MoreVertical,
  Pin,
  Search,
  UsersRound,
} from 'lucide-react';
import Sidebar from '../../components/User/Sidebar';

const filters = ['All Messages', 'Announcements', 'Food Recalls', 'Tips & Advice', 'General Chat', 'My Issues'];

const communityMessages = [
  {
    author: 'ShopSense AI (Admin)',
    category: 'Announcement',
    tone: 'green',
    title: 'Welcome to ShopSense Community!',
    body: "We're excited to have you here. Connect, share tips and stay updated.",
    time: 'Just now',
    icon: Megaphone,
    pinned: true,
  },
  {
    author: 'ShopSense AI (Admin)',
    category: 'Food Recall',
    tone: 'red',
    title: 'Food Recall Alert: Organic Peanut Butter (Batch B2408)',
    body: 'This batch may contain undeclared allergens. Please check your pantry and avoid consumption.',
    time: '15 min ago',
    icon: AlertTriangle,
    pinned: true,
  },
  {
    author: 'Aman M.',
    category: 'General',
    tone: 'blue',
    title: 'Any good budget tracker suggestions?',
    body: 'Looking for a simple app to track monthly expenses. Any recommendations?',
    time: '2 hours ago',
    initials: 'AM',
  },
  {
    author: 'You',
    category: 'My Issue',
    status: 'Open',
    tone: 'issue',
    title: 'Issue: Receipt not scanning properly',
    body: 'The app is not detecting items in my receipt. Please help.',
    time: '1 day ago',
    icon: Headphones,
  },
  {
    author: 'ShopSense AI (Admin)',
    category: 'Support Response',
    status: 'Resolved',
    tone: 'support',
    title: 'Re: Issue: Receipt not scanning properly',
    body: 'Thank you for reporting. The issue has been fixed in the latest update. Please try again.',
    time: '20 hrs ago',
    icon: Check,
  },
];

const communityActions = [
  {
    id: 'send',
    title: 'Send a message',
    body: 'Share tips, start a discussion or chat with the community.',
    icon: MessageCircle,
    tone: 'neutral',
  },
  {
    id: 'report',
    title: 'Report an Issue',
    body: "Facing a problem? Let us know and we'll help you.",
    icon: ClipboardList,
    tone: 'blue',
  },
  {
    id: 'issues',
    title: 'My Issues',
    body: 'View and track your reported issues.',
    icon: ClipboardList,
    tone: 'green',
  },
];

function matchesFilter(message, activeFilter) {
  if (activeFilter === 'All Messages') return true;
  if (activeFilter === 'Announcements') return message.category === 'Announcement';
  if (activeFilter === 'Food Recalls') return message.category === 'Food Recall';
  if (activeFilter === 'Tips & Advice') return message.category === 'Tips & Advice';
  if (activeFilter === 'General Chat') return message.category === 'General';
  if (activeFilter === 'My Issues') return message.category === 'My Issue' || message.category === 'Support Response';
  return true;
}

export default function Community() {
  const [activeFilter, setActiveFilter] = useState('All Messages');
  const [activeAction, setActiveAction] = useState('issues');
  const [search, setSearch] = useState('');
  const [messageText, setMessageText] = useState('');
  const [issueForm, setIssueForm] = useState({ title: '', category: 'Receipt scanning', details: '' });
  const [sentMessages, setSentMessages] = useState([]);
  const [userIssues, setUserIssues] = useState([
    {
      title: 'Receipt not scanning properly',
      category: 'Receipt scanning',
      details: 'The app is not detecting items in my receipt. Please help.',
      status: 'Open',
      time: '1 day ago',
    },
  ]);

  const allMessages = useMemo(() => [
    ...sentMessages,
    ...communityMessages,
  ], [sentMessages]);

  const filteredMessages = useMemo(() => {
    const query = search.trim().toLowerCase();
    return allMessages.filter((message) => {
      const filterMatch = matchesFilter(message, activeFilter);
      const searchMatch = !query
        || `${message.author} ${message.category} ${message.title} ${message.body}`.toLowerCase().includes(query);
      return filterMatch && searchMatch;
    });
  }, [activeFilter, allMessages, search]);

  function handleSendMessage(event) {
    event.preventDefault();
    const text = messageText.trim();
    if (!text) return;

    setSentMessages((messages) => [
      {
        author: 'You',
        category: 'General',
        tone: 'blue',
        title: 'Community message',
        body: text,
        time: 'Just now',
        initials: 'You',
      },
      ...messages,
    ]);
    setMessageText('');
    setActiveFilter('General Chat');
  }

  function handleReportIssue(event) {
    event.preventDefault();
    const title = issueForm.title.trim();
    const details = issueForm.details.trim();
    if (!title || !details) return;

    setUserIssues((issues) => [
      {
        title,
        category: issueForm.category,
        details,
        status: 'Open',
        time: 'Just now',
      },
      ...issues,
    ]);
    setIssueForm({ title: '', category: 'Receipt scanning', details: '' });
    setActiveAction('issues');
    setActiveFilter('My Issues');
  }

  return (
    <div className="user-page-shell">
      <div className="sidebar-wrapper"><Sidebar /></div>

      <main className="user-community-main">
        <header className="user-community-header">
          <div>
            <h1>Community</h1>
            <p>Stay connected with updates, announcements, and messages from admin and other users.</p>
          </div>

          <div className="user-community-actions">
            <label className="user-community-search">
              <Search size={20} />
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search messages..." />
            </label>
            <button type="button"><Filter size={19} />Filter</button>
          </div>
        </header>

        <nav className="user-community-tabs" aria-label="Community filters">
          {filters.map((filter) => (
            <button key={filter} className={activeFilter === filter ? 'is-active' : ''} type="button" onClick={() => setActiveFilter(filter)}>
              {filter}
              {filter === 'My Issues' && <span aria-label="Open issue" />}
            </button>
          ))}
        </nav>

        <section className="user-community-feed" aria-label="Community messages">
          {filteredMessages.map((message) => {
            const AvatarIcon = message.icon;
            return (
              <article className="user-community-message" key={message.title}>
                <div className={`user-community-avatar user-community-tone-${message.tone}`}>
                  {message.initials ? <strong>{message.initials}</strong> : <AvatarIcon size={26} />}
                </div>

                <div className="user-community-content">
                  <div className="user-community-meta">
                    <h2>{message.author}</h2>
                    <span className={`user-community-badge user-community-tone-${message.tone}`}>{message.category}</span>
                    {message.status && <span className={`user-community-status is-${message.status.toLowerCase()}`}>{message.status}</span>}
                  </div>
                  <h3>{message.title}</h3>
                  <p>{message.body}</p>
                </div>

                <div className="user-community-side">
                  <time>{message.time}</time>
                  {message.pinned && <Pin size={17} fill="currentColor" />}
                  <button type="button" aria-label={`More options for ${message.title}`}><MoreVertical size={18} /></button>
                </div>
              </article>
            );
          })}
        </section>

        <section className="user-community-quick-actions" aria-label="Community actions">
          {communityActions.map((action) => (
            <button className={activeAction === action.id ? 'is-active' : ''} type="button" key={action.title} onClick={() => setActiveAction(action.id)}>
              <span className={`user-community-action-icon user-community-action-${action.tone}`}><action.icon size={22} /></span>
              <span>
                <strong>{action.title}</strong>
                <small>{action.body}</small>
              </span>
            </button>
          ))}
        </section>

        <section className="user-community-action-panel">
          {activeAction === 'send' && (
            <form className="user-community-form-card" onSubmit={handleSendMessage}>
              <div>
                <h2>Send a message</h2>
                <p>Write a community update, question, or shopping tip.</p>
              </div>
              <textarea value={messageText} onChange={(event) => setMessageText(event.target.value)} placeholder="Type your message..." rows={5} maxLength={500} />
              <div className="user-community-form-actions">
                <span>{messageText.trim().length}/500</span>
                <button type="submit">Send Message</button>
              </div>
            </form>
          )}

          {activeAction === 'report' && (
            <form className="user-community-form-card" onSubmit={handleReportIssue}>
              <div>
                <h2>Report an Issue</h2>
                <p>Tell support what happened so they can help you faster.</p>
              </div>
              <div className="user-community-form-grid">
                <label>
                  <span>Issue title</span>
                  <input value={issueForm.title} onChange={(event) => setIssueForm((form) => ({ ...form, title: event.target.value }))} placeholder="Receipt not scanning properly" />
                </label>
                <label>
                  <span>Category</span>
                  <select value={issueForm.category} onChange={(event) => setIssueForm((form) => ({ ...form, category: event.target.value }))}>
                    <option>Receipt scanning</option>
                    <option>Pantry</option>
                    <option>Notifications</option>
                    <option>Account</option>
                    <option>Other</option>
                  </select>
                </label>
              </div>
              <label>
                <span>Details</span>
                <textarea value={issueForm.details} onChange={(event) => setIssueForm((form) => ({ ...form, details: event.target.value }))} placeholder="Describe the issue..." rows={5} />
              </label>
              <div className="user-community-form-actions">
                <span>Support usually replies within 24 hours</span>
                <button type="submit">Submit Issue</button>
              </div>
            </form>
          )}

          {activeAction === 'issues' && (
            <div className="user-community-form-card">
              <div>
                <h2>My Issues</h2>
                <p>Track the issues you reported and their current status.</p>
              </div>
              <div className="user-community-issue-list">
                {userIssues.map((issue) => (
                  <article key={`${issue.title}-${issue.time}`}>
                    <div>
                      <strong>{issue.title}</strong>
                      <p>{issue.details}</p>
                    </div>
                    <span>{issue.category}</span>
                    <b>{issue.status}</b>
                    <time>{issue.time}</time>
                  </article>
                ))}
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
