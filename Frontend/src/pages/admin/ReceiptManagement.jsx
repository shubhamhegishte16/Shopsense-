import { Check, Copy, Eye, FileText, Filter, MoreVertical, TimerReset, Upload, X, XCircle } from 'lucide-react';
import AdminLayout from '../../components/Admin/AdminLayout';
import { AdminButton, AdminStatCard, Avatar, SearchBox, StatusBadge, TablePagination } from '../../components/Admin/AdminUI';
import { receipts } from './adminData';

const stats = [
  [FileText, 'Total Receipts', '45,231', '+8.7%', 'green'],
  [Check, 'Processed Successfully', '43,562', '+96.3%', 'green'],
  [TimerReset, 'Needs Review', '1,248', '+2.8%', 'orange'],
  [XCircle, 'Processing Failed', '421', '-0.9%', 'red'],
];

function ReceiptDetailPanel() {
  return (
    <aside className="admin-detail-panel">
      <div className="admin-detail-header">
        <h2>Receipt Details</h2>
        <button className="admin-icon-btn" type="button" aria-label="Close receipt details"><X size={18} /></button>
      </div>
      <div className="admin-detail-body">
        <div className="admin-detail-title-row">
          <h3>RCPT-00045123 <Copy size={16} /></h3>
          <StatusBadge tone="green">Processed</StatusBadge>
        </div>
        <div className="admin-tabs">
          <button className="is-active">Overview</button>
          <button>Items (18)</button>
          <button>AI Extraction</button>
          <button>Activity</button>
        </div>
        <div className="admin-receipt-overview">
          <div className="admin-receipt-image">
            <strong>D-Mart</strong>
            <span>D'Mart Avenue Supermarts Ltd.</span>
            <i />
            <small>Bill No: 1845123</small>
            <small>Date: 14/08/2026 Time: 10:32 AM</small>
            <b>Total &#8377;2,845.60</b>
          </div>
          <dl>
            <dt>User</dt><dd><Avatar src="/Shopsense logo.png" name="Priya Deshmukh" />Priya Deshmukh</dd>
            <dt>Store</dt><dd>D-Mart</dd>
            <dt>Upload Date</dt><dd>Aug 14, 2026 10:32 AM</dd>
            <dt>Total Amount</dt><dd>&#8377;2,845.60</dd>
            <dt>Payment Method</dt><dd>UPI</dd>
            <dt>Status</dt><dd><StatusBadge tone="green">Processed</StatusBadge></dd>
            <dt>AI Extraction</dt><dd><StatusBadge tone="green">Success</StatusBadge></dd>
            <dt>Processed At</dt><dd>Aug 14, 2026 10:33 AM</dd>
          </dl>
        </div>
        <div className="admin-detail-section">
          <h4>Summary</h4>
          <div className="admin-summary-box">
            <span>Items<strong>18</strong></span>
            <span>Subtotal<strong>&#8377;2,615.00</strong></span>
            <span>Discount<strong>&#8377;125.00</strong></span>
            <span>Tax<strong>&#8377;133.30</strong></span>
            <b>Total Amount <strong>&#8377;2,845.60</strong></b>
          </div>
        </div>
        <div className="admin-detail-section">
          <h4>Actions</h4>
          <textarea className="admin-note" placeholder="Add admin note..." />
          <AdminButton variant="primary" className="admin-wide-btn">Save Note</AdminButton>
        </div>
      </div>
    </aside>
  );
}

export default function ReceiptManagement() {
  return (
    <AdminLayout
      title="Receipt Management"
      subtitle="Monitor, review and manage all uploaded receipts."
      actions={(
        <>
          <SearchBox placeholder="Search by receipt ID, user or store..." />
          <AdminButton icon={Filter}>Filter</AdminButton>
          <AdminButton icon={Upload}>Export</AdminButton>
        </>
      )}
      detailPanel={<ReceiptDetailPanel />}
    >
      <div className="admin-stat-grid receipt-stat-grid">
        {stats.map(([icon, label, value, trend, tone]) => (
          <AdminStatCard key={label} icon={icon} label={label} value={value} trend={trend} tone={tone} />
        ))}
      </div>

      <section className="admin-table-card">
        <div className="admin-tabs admin-table-tabs">
          <button className="is-active">All Receipts</button><button>Processing</button><button>Needs Review</button><button>Failed</button>
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th><input type="checkbox" /></th><th>Receipt ID</th><th>User</th><th>Store</th><th>Upload Date</th><th>Total Amount</th><th>Status</th><th>AI Extraction</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {receipts.map(([id, user, store, date, time, amount, status, ai, img]) => (
                <tr key={id}>
                  <td><input type="checkbox" /></td>
                  <td><strong>{id}</strong> <Copy size={15} /></td>
                  <td><div className="admin-person"><Avatar src={img} initials={user.split(' ').map((p) => p[0]).join('')} name={user} /><strong>{user}</strong></div></td>
                  <td>{store}</td>
                  <td>{date}<small>{time}</small></td>
                  <td>&#8377;{amount}</td>
                  <td><StatusBadge tone={status === 'Processed' ? 'green' : status === 'Processing' ? 'orange' : 'amber'}>{status}</StatusBadge></td>
                  <td><StatusBadge tone={ai === 'Success' ? 'green' : 'blue'}>{ai}</StatusBadge></td>
                  <td><div className="admin-row-actions"><button><Eye size={16} /></button><button><MoreVertical size={16} /></button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <TablePagination totalLabel="Showing 1 to 10 of 45,231 receipts" lastPage="4,524" />
      </section>
    </AdminLayout>
  );
}
