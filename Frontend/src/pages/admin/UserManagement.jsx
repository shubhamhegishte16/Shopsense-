import { useEffect, useMemo, useState } from 'react';
import { Download, Eye, FileText, Filter, MoreVertical, Shield, Trash2, UserCheck, UserPlus, Users, X } from 'lucide-react';
import AdminLayout from '../../components/Admin/AdminLayout';
import { AdminButton, AdminStatCard, Avatar, StatusBadge, TablePagination } from '../../components/Admin/AdminUI';
import { apiRequest, formatCurrency, formatDate } from '../../utils/api';

const emptyStats = { totalUsers: 0, newUsersThisWeek: 0, activeUsers: 0, suspendedUsers: 0, deletedUsers: 0 };

function statusTone(status) {
  if (status === 'active') return 'green';
  if (status === 'suspended') return 'red';
  return 'orange';
}

function initials(name = 'User') {
  return name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase();
}

function UserDetailPanel({ detail, latestReceipt, onClose }) {
  if (!detail && !latestReceipt) return null;
  const user = detail?.user;
  const stats = detail?.stats || {};

  return (
    <aside className="admin-detail-panel">
      <div className="admin-detail-header">
        <h2>{latestReceipt ? 'Latest Receipt' : 'User Profile'}</h2>
        <button className="admin-icon-btn" type="button" aria-label="Close details" onClick={onClose}><X size={18} /></button>
      </div>
      <div className="admin-detail-body">
        {user && (
          <>
            <div className="admin-product-hero">
              <Avatar src={user.avatar} initials={initials(user.fullName)} name={user.fullName} />
              <div>
                <h3>{user.fullName}</h3>
                <StatusBadge tone={statusTone(user.accountStatus)}>{user.accountStatus}</StatusBadge>
                <p><span>Email</span> {user.email}</p>
                <p><span>Phone</span> {user.phone || '-'}</p>
              </div>
            </div>
            <div className="admin-detail-section">
              <h4>Profile Details</h4>
              <dl className="admin-detail-list">
                <dt>Location</dt><dd>{user.location || '-'}</dd>
                <dt>Gender</dt><dd>{user.gender || '-'}</dd>
                <dt>Date of Birth</dt><dd>{user.dateOfBirth ? formatDate(user.dateOfBirth) : '-'}</dd>
                <dt>Joined</dt><dd>{formatDate(user.createdAt)}</dd>
                <dt>Last Login</dt><dd>{formatDate(user.lastLogin)}</dd>
                <dt>Bio</dt><dd>{user.bio || '-'}</dd>
              </dl>
            </div>
            <div className="admin-detail-section">
              <h4>Shopping Summary</h4>
              <dl className="admin-detail-list">
                <dt>Receipts</dt><dd>{stats.receipts || 0}</dd>
                <dt>Total Spending</dt><dd>&#8377;{formatCurrency(stats.totalSpending)}</dd>
                <dt>Average Receipt</dt><dd>&#8377;{formatCurrency(stats.avgReceipt)}</dd>
                <dt>Suspension Reason</dt><dd>{user.suspensionReason || '-'}</dd>
              </dl>
            </div>
          </>
        )}

        {latestReceipt && (
          <>
            <div className="admin-detail-title-row">
              <h3>{latestReceipt.storeName || 'Receipt'} <FileText size={16} /></h3>
              <StatusBadge tone={latestReceipt.status === 'processed' ? 'green' : 'orange'}>{latestReceipt.status}</StatusBadge>
            </div>
            <div className="admin-receipt-overview">
              <div className="admin-receipt-image">
                <strong>{latestReceipt.storeName || 'Store'}</strong>
                <span>{formatDate(latestReceipt.date || latestReceipt.createdAt)}</span>
                <i />
                <small>Receipt ID: {String(latestReceipt._id).slice(-8).toUpperCase()}</small>
                <b>Total &#8377;{formatCurrency(latestReceipt.totalAmount)}</b>
              </div>
              <dl>
                <dt>Items</dt><dd>{latestReceipt.items?.length || 0}</dd>
                <dt>Subtotal</dt><dd>&#8377;{formatCurrency(latestReceipt.subtotal)}</dd>
                <dt>Tax</dt><dd>&#8377;{formatCurrency(latestReceipt.taxes)}</dd>
                <dt>Discount</dt><dd>&#8377;{formatCurrency(latestReceipt.discounts)}</dd>
                <dt>Validation</dt><dd>{latestReceipt.validationStatus || '-'}</dd>
              </dl>
            </div>
          </>
        )}
      </div>
    </aside>
  );
}

export default function UserManagement() {
  const [rows, setRows] = useState([]);
  const [stats, setStats] = useState(emptyStats);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [detail, setDetail] = useState(null);
  const [latestReceipt, setLatestReceipt] = useState(null);

  async function loadUsers(query = search) {
    setLoading(true);
    setError('');
    try {
      const data = await apiRequest('/api/admin/users' + (query ? '?search=' + encodeURIComponent(query) : ''));
      setRows(data.users || []);
      setStats(data.stats || emptyStats);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadUsers(''); }, []);

  const statCards = useMemo(() => [
    [Users, 'Total Users', stats.totalUsers, '', 'teal'],
    [UserPlus, 'New Users (This Week)', stats.newUsersThisWeek, '', 'green'],
    [UserCheck, 'Active Users', stats.activeUsers, '', 'teal'],
    [Shield, 'Suspended Users', stats.suspendedUsers, '', 'red'],
    [Trash2, 'Deleted Users', stats.deletedUsers, '', 'orange'],
  ], [stats]);

  async function openUser(userId) {
    try {
      setLatestReceipt(null);
      setDetail(await apiRequest('/api/admin/users/' + userId));
    } catch (err) {
      setError(err.message);
    }
  }

  async function openLatestReceipt(userId) {
    try {
      setDetail(null);
      setLatestReceipt((await apiRequest('/api/admin/users/' + userId + '/latest-receipt')).receipt);
    } catch (err) {
      setError(err.message);
    }
  }

  async function toggleSuspension(user) {
    const shouldSuspend = user.status !== 'suspended';
    const reason = shouldSuspend ? window.prompt('Reason for suspension:', user.suspensionReason || '') : '';
    if (shouldSuspend && reason === null) return;
    if (!shouldSuspend && !window.confirm('Reactivate ' + user.fullName + '?')) return;

    try {
      await apiRequest('/api/admin/users/' + user.id + '/suspension', {
        method: 'PATCH',
        body: JSON.stringify({ suspended: shouldSuspend, reason }),
      });
      await loadUsers();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <AdminLayout
      title="User Management"
      subtitle="View and manage all registered users on the platform."
      actions={(
        <>
          <label className="admin-search">
            <input type="search" placeholder="Search by name or email..." value={search} onChange={(event) => setSearch(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && loadUsers()} />
          </label>
          <AdminButton icon={Filter} onClick={() => loadUsers()}>Filter</AdminButton>
          <AdminButton icon={Download} variant="primary">Export</AdminButton>
        </>
      )}
      detailPanel={<UserDetailPanel detail={detail} latestReceipt={latestReceipt} onClose={() => { setDetail(null); setLatestReceipt(null); }} />}
    >
      <div className="admin-stat-grid">
        {statCards.map(([icon, label, value, trend, tone]) => (
          <AdminStatCard key={label} icon={icon} label={label} value={Number(value || 0).toLocaleString('en-IN')} trend={trend} tone={tone} />
        ))}
      </div>

      <section className="admin-table-card">
        <div className="admin-table-title"><h2>All Users</h2></div>
        {error && <p className="admin-error">{error}</p>}
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>#</th><th>User</th><th>Email</th><th>Registered On</th><th>Status</th><th>Receipts</th><th>Total Spending</th><th>Last Active</th><th>Reported Issues</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="10">Loading users...</td></tr>
              ) : rows.length ? rows.map((user, index) => (
                <tr key={user.id}>
                  <td>{index + 1}</td>
                  <td><div className="admin-person"><Avatar src={user.avatar} initials={initials(user.fullName)} name={user.fullName} /><strong>{user.fullName}</strong></div></td>
                  <td>{user.email}</td>
                  <td>{formatDate(user.registeredOn)}</td>
                  <td><StatusBadge tone={statusTone(user.status)}>{user.status}</StatusBadge></td>
                  <td>{user.receipts}</td>
                  <td>&#8377;{formatCurrency(user.totalSpending)}</td>
                  <td>{formatDate(user.lastActive)}</td>
                  <td>{user.reportedIssues || 0}</td>
                  <td><div className="admin-row-actions"><button type="button" onClick={() => openUser(user.id)}><Eye size={16} /></button><button type="button" onClick={() => openLatestReceipt(user.id)}><FileText size={16} /></button><button type="button" onClick={() => toggleSuspension(user)} title={user.status === 'suspended' ? 'Reactivate account' : 'Suspend account'}><MoreVertical size={16} /></button></div></td>
                </tr>
              )) : (
                <tr><td colSpan="10">No registered users found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <TablePagination totalLabel={'Showing ' + (rows.length ? 1 : 0) + ' to ' + rows.length + ' of ' + Number(stats.totalUsers || 0).toLocaleString('en-IN') + ' users'} />
      </section>
    </AdminLayout>
  );
}
