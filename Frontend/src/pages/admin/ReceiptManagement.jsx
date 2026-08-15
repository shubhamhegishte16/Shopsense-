import { useEffect, useMemo, useState } from 'react';
import { Check, Copy, Eye, FileText, Filter, MoreVertical, TimerReset, Upload, X, XCircle } from 'lucide-react';
import AdminLayout from '../../components/Admin/AdminLayout';
import { AdminButton, AdminStatCard, Avatar, StatusBadge, TablePagination } from '../../components/Admin/AdminUI';
import { apiRequest, formatCurrency, formatDate } from '../../utils/api';

const emptyStats = { totalReceipts: 0, processed: 0, needsReview: 0, failed: 0 };

function statusTone(status, validationStatus) {
  if (status === 'processed' && validationStatus !== 'mismatch') return 'green';
  if (status === 'flagged' || validationStatus === 'mismatch') return 'red';
  return 'orange';
}

function initials(name = 'User') {
  return name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase();
}

function ReceiptDetailPanel({ receipt, activeTab, setActiveTab, note, setNote, onSaveNote, onClose }) {
  if (!receipt) return null;
  const tabs = ['Overview', 'Items (' + (receipt.items?.length || 0) + ')', 'AI Extraction', 'Activity'];

  return (
    <aside className="admin-detail-panel">
      <div className="admin-detail-header">
        <h2>Receipt Details</h2>
        <button className="admin-icon-btn" type="button" aria-label="Close receipt details" onClick={onClose}><X size={18} /></button>
      </div>
      <div className="admin-detail-body">
        <div className="admin-detail-title-row">
          <h3>{String(receipt._id).slice(-10).toUpperCase()} <Copy size={16} /></h3>
          <StatusBadge tone={statusTone(receipt.status, receipt.validationStatus)}>{receipt.status}</StatusBadge>
        </div>
        <div className="admin-tabs">
          {tabs.map((tab) => (
            <button key={tab} className={activeTab === tab ? 'is-active' : ''} type="button" onClick={() => setActiveTab(tab)}>{tab}</button>
          ))}
        </div>

        {activeTab === 'Overview' && (
          <>
            <div className="admin-receipt-overview">
              <div className="admin-receipt-image">
                <strong>{receipt.storeName || 'Store'}</strong>
                <span>{formatDate(receipt.date || receipt.createdAt)}</span>
                <i />
                <small>Receipt ID: {receipt._id}</small>
                <b>Total &#8377;{formatCurrency(receipt.totalAmount)}</b>
              </div>
              <dl>
                <dt>User</dt><dd><Avatar src={receipt.userId?.avatar} initials={initials(receipt.userId?.fullName)} name={receipt.userId?.fullName} />{receipt.userId?.fullName || '-'}</dd>
                <dt>Store</dt><dd>{receipt.storeName || '-'}</dd>
                <dt>Upload Date</dt><dd>{formatDate(receipt.createdAt)}</dd>
                <dt>Total Amount</dt><dd>&#8377;{formatCurrency(receipt.totalAmount)}</dd>
                <dt>Status</dt><dd><StatusBadge tone={statusTone(receipt.status, receipt.validationStatus)}>{receipt.status}</StatusBadge></dd>
                <dt>AI Extraction</dt><dd><StatusBadge tone={receipt.aiExtraction ? 'green' : 'orange'}>{receipt.aiExtraction ? 'Success' : 'Pending'}</StatusBadge></dd>
              </dl>
            </div>
            <div className="admin-detail-section">
              <h4>Summary</h4>
              <div className="admin-summary-box">
                <span>Items<strong>{receipt.items?.length || 0}</strong></span>
                <span>Subtotal<strong>&#8377;{formatCurrency(receipt.subtotal)}</strong></span>
                <span>Discount<strong>&#8377;{formatCurrency(receipt.discounts)}</strong></span>
                <span>Tax<strong>&#8377;{formatCurrency(receipt.taxes)}</strong></span>
                <b>Total Amount <strong>&#8377;{formatCurrency(receipt.totalAmount)}</strong></b>
              </div>
            </div>
          </>
        )}

        {activeTab.startsWith('Items') && (
          <div className="admin-detail-section">
            <h4>Items Scanned</h4>
            <dl className="admin-detail-list">
              {(receipt.items || []).map((item, index) => (
                <div key={(item.name || 'item') + index}>
                  <dt>{item.name || 'Unnamed item'}</dt>
                  <dd>{item.quantity || 1} x &#8377;{formatCurrency(item.unitPrice || item.totalPrice)} {item.category ? '- ' + item.category : ''}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}

        {activeTab === 'AI Extraction' && (
          <div className="admin-detail-section">
            <h4>AI Extracted Data</h4>
            <dl className="admin-detail-list">
              <dt>Summary</dt><dd>{receipt.aiExtraction?.summary || '-'}</dd>
              <dt>Confidence</dt><dd>{receipt.aiExtraction?.confidence ? Math.round(receipt.aiExtraction.confidence * 100) + '%' : '-'}</dd>
              <dt>Raw Store</dt><dd>{receipt.aiExtraction?.raw?.storeName || '-'}</dd>
              <dt>Raw Total</dt><dd>&#8377;{formatCurrency(receipt.aiExtraction?.raw?.totalAmount)}</dd>
            </dl>
          </div>
        )}

        {activeTab === 'Activity' && (
          <div className="admin-detail-section">
            <h4>Activity</h4>
            <dl className="admin-detail-list">
              {(receipt.activity || []).map((event, index) => (
                <div key={(event.label || 'event') + index}>
                  <dt>{event.label}</dt>
                  <dd>{event.description} <small>{formatDate(event.createdAt)}</small></dd>
                </div>
              ))}
              {(receipt.adminNotes || []).map((adminNote) => (
                <div key={adminNote._id || adminNote.createdAt}>
                  <dt>Admin Note</dt>
                  <dd>{adminNote.note} <small>{formatDate(adminNote.createdAt)}</small></dd>
                </div>
              ))}
            </dl>
          </div>
        )}

        <div className="admin-detail-section">
          <h4>Admin Note</h4>
          <textarea className="admin-note" placeholder="Add admin note..." value={note} onChange={(event) => setNote(event.target.value)} />
          <AdminButton variant="primary" className="admin-wide-btn" onClick={onSaveNote}>Save Note</AdminButton>
        </div>
      </div>
    </aside>
  );
}

export default function ReceiptManagement() {
  const [receipts, setReceipts] = useState([]);
  const [stats, setStats] = useState(emptyStats);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [activeTab, setActiveTab] = useState('Overview');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function loadReceipts(query = search) {
    setLoading(true);
    setError('');
    try {
      const data = await apiRequest('/api/admin/receipts' + (query ? '?search=' + encodeURIComponent(query) : ''));
      setReceipts(data.receipts || []);
      setStats(data.stats || emptyStats);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadReceipts(''); }, []);

  const statCards = useMemo(() => [
    [FileText, 'Total Receipts', stats.totalReceipts, '', 'green'],
    [Check, 'Processed Successfully', stats.processed, '', 'green'],
    [TimerReset, 'Needs Review', stats.needsReview, '', 'orange'],
    [XCircle, 'Processing Failed', stats.failed, '', 'red'],
  ], [stats]);

  async function openReceipt(receiptId) {
    try {
      const data = await apiRequest('/api/admin/receipts/' + receiptId);
      setSelected(data.receipt);
      setActiveTab('Overview');
      setNote('');
    } catch (err) {
      setError(err.message);
    }
  }

  async function saveNote() {
    if (!selected || !note.trim()) return;
    try {
      await apiRequest('/api/admin/receipts/' + selected._id + '/notes', {
        method: 'POST',
        body: JSON.stringify({ note }),
      });
      await openReceipt(selected._id);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <AdminLayout
      title="Receipt Management"
      subtitle="Monitor, review and manage all uploaded receipts."
      actions={(
        <>
          <label className="admin-search">
            <input type="search" placeholder="Search by receipt ID, user or store..." value={search} onChange={(event) => setSearch(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && loadReceipts()} />
          </label>
          <AdminButton icon={Filter} onClick={() => loadReceipts()}>Filter</AdminButton>
          <AdminButton icon={Upload}>Export</AdminButton>
        </>
      )}
      detailPanel={<ReceiptDetailPanel receipt={selected} activeTab={activeTab} setActiveTab={setActiveTab} note={note} setNote={setNote} onSaveNote={saveNote} onClose={() => setSelected(null)} />}
    >
      <div className="admin-stat-grid receipt-stat-grid">
        {statCards.map(([icon, label, value, trend, tone]) => (
          <AdminStatCard key={label} icon={icon} label={label} value={Number(value || 0).toLocaleString('en-IN')} trend={trend} tone={tone} />
        ))}
      </div>

      <section className="admin-table-card">
        <div className="admin-tabs admin-table-tabs">
          <button className="is-active" type="button">All Receipts</button><button type="button">Processing</button><button type="button">Needs Review</button><button type="button">Failed</button>
        </div>
        {error && <p className="admin-error">{error}</p>}
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th><input type="checkbox" /></th><th>Receipt ID</th><th>User</th><th>Store</th><th>Upload Date</th><th>Total Amount</th><th>Status</th><th>AI Extraction</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="9">Loading receipts...</td></tr>
              ) : receipts.length ? receipts.map((receipt) => (
                <tr key={receipt._id}>
                  <td><input type="checkbox" /></td>
                  <td><strong>{String(receipt._id).slice(-10).toUpperCase()}</strong> <Copy size={15} /></td>
                  <td><div className="admin-person"><Avatar src={receipt.userId?.avatar} initials={initials(receipt.userId?.fullName)} name={receipt.userId?.fullName} /><strong>{receipt.userId?.fullName || '-'}</strong></div></td>
                  <td>{receipt.storeName || '-'}</td>
                  <td>{formatDate(receipt.createdAt)}</td>
                  <td>&#8377;{formatCurrency(receipt.totalAmount)}</td>
                  <td><StatusBadge tone={statusTone(receipt.status, receipt.validationStatus)}>{receipt.status}</StatusBadge></td>
                  <td><StatusBadge tone={receipt.aiExtraction ? 'green' : 'blue'}>{receipt.aiExtraction ? 'Success' : 'Pending'}</StatusBadge></td>
                  <td><div className="admin-row-actions"><button type="button" onClick={() => openReceipt(receipt._id)}><Eye size={16} /></button><button type="button"><MoreVertical size={16} /></button></div></td>
                </tr>
              )) : (
                <tr><td colSpan="9">No receipts scanned yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <TablePagination totalLabel={'Showing ' + (receipts.length ? 1 : 0) + ' to ' + receipts.length + ' of ' + Number(stats.totalReceipts || 0).toLocaleString('en-IN') + ' receipts'} lastPage="1" />
      </section>
    </AdminLayout>
  );
}
