import { useState } from 'react';
import { AlertTriangle, Copy, Edit3, Eye, Filter, MoreVertical, Plus, Search, ShieldCheck, Sprout, TimerReset, Trash2, UsersRound, X } from 'lucide-react';
import AdminLayout from '../../components/Admin/AdminLayout';
import { AdminButton, AdminStatCard, StatusBadge, TablePagination } from '../../components/Admin/AdminUI';
import { recalls } from './adminData';

const stats = [
  [ShieldCheck, 'Active Recalls', '24', '+9.1%', 'green'],
  [TimerReset, 'New Recalls (This Week)', '6', '+20.0%', 'blue'],
  [AlertTriangle, 'Affected Products', '86', '+6.3%', 'orange'],
  [UsersRound, 'Affected Users', '1,248', '+12.7%', 'teal'],
];

function severityTone(severity) {
  if (severity === 'High') return 'red';
  if (severity === 'Medium') return 'amber';
  return 'green';
}

function RecallDetailPanel() {
  return (
    <aside className="admin-detail-panel recall-detail-panel">
      <div className="admin-detail-header">
        <h2>Recall Details</h2>
        <button className="admin-icon-btn" type="button" aria-label="Close recall details"><X size={18} /></button>
      </div>
      <div className="admin-detail-body">
        <div className="admin-recall-hero">
          <span className="admin-stat-icon tone-red"><ShieldCheck size={22} /></span>
          <div>
            <div className="admin-detail-title-row">
              <h3>RC-2026-00024</h3>
              <StatusBadge tone="green">Active</StatusBadge>
            </div>
            <p>Amul Taaza Toned Milk 1L</p>
          </div>
        </div>
        <div className="admin-tabs">
          <button className="is-active">Overview</button>
          <button>Affected Products</button>
          <button>Affected Users</button>
          <button>Timeline</button>
        </div>
        <dl className="admin-detail-list recall-detail-list">
          <dt>Recall ID</dt><dd>RC-2026-00024 <Copy size={15} /></dd>
          <dt>Product</dt><dd>Amul Taaza Toned Milk 1L</dd>
          <dt>Brand</dt><dd>Amul</dd>
          <dt>Category</dt><dd>Dairy & Eggs</dd>
          <dt>Reason</dt><dd>Possible contamination (Listeria)</dd>
          <dt>Severity</dt><dd><StatusBadge tone="red">High</StatusBadge></dd>
          <dt>Recall Date</dt><dd>Aug 14, 2026</dd>
          <dt>Effective Date</dt><dd>Aug 14, 2026</dd>
          <dt>Issued By</dt><dd>FSSAI</dd>
          <dt>Reference No.</dt><dd>FSSL/REC/2026/1458</dd>
          <dt>Description</dt><dd>Routine testing has detected possible Listeria contamination in the above product. Consumers are advised not to consume this product.</dd>
          <dt>Affected Region</dt><dd>All India</dd>
        </dl>
        <div className="admin-detail-section">
          <h4>Actions</h4>
          <div className="admin-detail-actions recall-actions">
            <AdminButton icon={Edit3}>Edit Recall</AdminButton>
            <AdminButton icon={TimerReset}>Deactivate</AdminButton>
            <AdminButton icon={Trash2}>Delete Recall</AdminButton>
          </div>
        </div>
      </div>
    </aside>
  );
}

const initialRecallForm = {
  id: 'RC-2026-00025',
  product: '',
  brand: '',
  category: '',
  reason: '',
  severity: 'High',
  recallDate: '',
  effectiveDate: '',
  issuedBy: 'FSSAI',
  referenceNo: '',
  description: '',
  affectedRegion: 'All India',
  affectedUsers: '',
  status: 'Active',
};

function AddRecallPanel({ form, onChange, onClose, onSubmit }) {
  const updateField = (field) => (event) => onChange({ ...form, [field]: event.target.value });

  return (
    <aside className="admin-detail-panel recall-detail-panel">
      <div className="admin-detail-header">
        <h2>Add Recall</h2>
        <button className="admin-icon-btn" type="button" aria-label="Close add recall form" onClick={onClose}><X size={18} /></button>
      </div>
      <form className="admin-detail-body admin-recall-form" onSubmit={onSubmit}>
        <div className="admin-recall-hero">
          <span className="admin-stat-icon tone-red"><ShieldCheck size={22} /></span>
          <div>
            <h3>New Food Recall</h3>
            <p>Create an alert for affected products and users.</p>
          </div>
        </div>

        <div className="admin-form-grid">
          <label>
            <span>Recall ID</span>
            <input value={form.id} onChange={updateField('id')} placeholder="RC-2026-00025" required />
          </label>
          <label>
            <span>Status</span>
            <select value={form.status} onChange={updateField('status')}>
              <option>Active</option>
              <option>Draft</option>
              <option>Inactive</option>
              <option>Expired</option>
            </select>
          </label>
          <label className="wide">
            <span>Product</span>
            <input value={form.product} onChange={updateField('product')} placeholder="Amul Taaza Toned Milk 1L" required />
          </label>
          <label>
            <span>Brand</span>
            <input value={form.brand} onChange={updateField('brand')} placeholder="Amul" required />
          </label>
          <label>
            <span>Category</span>
            <input value={form.category} onChange={updateField('category')} placeholder="Dairy & Eggs" required />
          </label>
          <label className="wide">
            <span>Reason</span>
            <input value={form.reason} onChange={updateField('reason')} placeholder="Possible contamination (Listeria)" required />
          </label>
          <label>
            <span>Severity</span>
            <select value={form.severity} onChange={updateField('severity')}>
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
          </label>
          <label>
            <span>Affected Users</span>
            <input type="number" min="0" value={form.affectedUsers} onChange={updateField('affectedUsers')} placeholder="512" />
          </label>
          <label>
            <span>Recall Date</span>
            <input type="date" value={form.recallDate} onChange={updateField('recallDate')} required />
          </label>
          <label>
            <span>Effective Date</span>
            <input type="date" value={form.effectiveDate} onChange={updateField('effectiveDate')} required />
          </label>
          <label>
            <span>Issued By</span>
            <input value={form.issuedBy} onChange={updateField('issuedBy')} placeholder="FSSAI" />
          </label>
          <label>
            <span>Reference No.</span>
            <input value={form.referenceNo} onChange={updateField('referenceNo')} placeholder="FSSL/REC/2026/1458" />
          </label>
          <label className="wide">
            <span>Affected Region</span>
            <input value={form.affectedRegion} onChange={updateField('affectedRegion')} placeholder="All India" />
          </label>
          <label className="wide">
            <span>Description</span>
            <textarea value={form.description} onChange={updateField('description')} placeholder="Describe the issue, risk, and consumer advisory." rows={4} />
          </label>
        </div>

        <div className="admin-form-actions">
          <AdminButton onClick={onClose}>Cancel</AdminButton>
          <AdminButton icon={Plus} variant="primary" className="admin-wide-btn" type="submit">Add Recall</AdminButton>
        </div>
      </form>
    </aside>
  );
}

function formatDate(dateValue) {
  if (!dateValue) return 'Aug 15, 2026';
  const date = new Date(`${dateValue}T00:00:00`);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function FoodRecallManagement() {
  const [recallRows, setRecallRows] = useState(recalls);
  const [panelMode, setPanelMode] = useState('details');
  const [form, setForm] = useState(initialRecallForm);

  const handleAddRecall = (event) => {
    event.preventDefault();
    setRecallRows((rows) => [
      [
        form.id,
        form.product,
        form.brand,
        form.reason,
        form.severity,
        formatDate(form.recallDate),
        form.status,
        form.affectedUsers || '0',
      ],
      ...rows,
    ]);
    setForm(initialRecallForm);
    setPanelMode('details');
  };

  return (
    <AdminLayout
      title="Food Recall Management"
      subtitle="Manage and monitor food recall alerts and affected products."
      actions={(
        <>
          <label className="admin-search product-search"><Search size={19} /><input placeholder="Search by product, brand, recall ID..." /></label>
          <AdminButton icon={Filter}>Filter</AdminButton>
          <AdminButton icon={Plus} variant="primary" onClick={() => setPanelMode('form')}>Add Recall</AdminButton>
        </>
      )}
      detailPanel={panelMode === 'form'
        ? <AddRecallPanel form={form} onChange={setForm} onClose={() => setPanelMode('details')} onSubmit={handleAddRecall} />
        : <RecallDetailPanel />}
    >
      <div className="admin-stat-grid recall-stat-grid">
        {stats.map(([icon, label, value, trend, tone]) => (
          <AdminStatCard key={label} icon={icon} label={label} value={value} trend={trend} tone={tone} />
        ))}
      </div>

      <section className="admin-table-card">
        <div className="admin-tabs admin-table-tabs">
          <button className="is-active">All Recalls</button><button>Active</button><button>Inactive</button><button>Draft</button><button>Expired</button>
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table recall-table">
            <thead>
              <tr>
                <th>Recall ID</th><th>Product</th><th>Brand</th><th>Reason</th><th>Severity</th><th>Recall Date</th><th>Status</th><th>Affected Users</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {recallRows.map(([id, product, brand, reason, severity, date, status, users]) => (
                <tr key={id}>
                  <td><strong>{id}</strong></td>
                  <td><div className="admin-product-name"><span className="admin-product-thumb"><Sprout size={17} /></span><strong>{product}</strong></div></td>
                  <td>{brand}</td>
                  <td>{reason}</td>
                  <td><StatusBadge tone={severityTone(severity)}>{severity}</StatusBadge></td>
                  <td>{date}</td>
                  <td><StatusBadge tone={status === 'Active' ? 'green' : 'orange'}>{status}</StatusBadge></td>
                  <td>{users}</td>
                  <td><div className="admin-row-actions"><button><Eye size={16} /></button><button><Edit3 size={16} /></button><button><MoreVertical size={16} /></button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <TablePagination totalLabel="Showing 1 to 10 of 24 recalls" lastPage="3" />
      </section>
    </AdminLayout>
  );
}
