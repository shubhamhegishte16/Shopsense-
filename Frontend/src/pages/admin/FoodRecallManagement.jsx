import { useState, useEffect } from 'react';
import axios from 'axios';
import { AlertTriangle, Copy, Edit3, Eye, Filter, MoreVertical, Plus, Search, ShieldCheck, Sprout, TimerReset, Trash2, UsersRound, X } from 'lucide-react';
import AdminLayout from '../../components/Admin/AdminLayout';
import { AdminButton, AdminStatCard, StatusBadge, TablePagination } from '../../components/Admin/AdminUI';

function severityTone(severity) {
  if (severity === 'High') return 'red';
  if (severity === 'Medium') return 'amber';
  return 'green';
}

function RecallDetailPanel({ recall, onClose }) {
  if (!recall) return null;
  return (
    <aside className="admin-detail-panel recall-detail-panel">
      <div className="admin-detail-header">
        <h2>Recall Details</h2>
        <button className="admin-icon-btn" type="button" aria-label="Close recall details" onClick={onClose}><X size={18} /></button>
      </div>
      <div className="admin-detail-body">
        <div className="admin-recall-hero">
          <span className="admin-stat-icon tone-red"><ShieldCheck size={22} /></span>
          <div>
            <div className="admin-detail-title-row">
              <h3>{recall.recallId}</h3>
              <StatusBadge tone={recall.status === 'Active' ? 'green' : 'orange'}>{recall.status}</StatusBadge>
            </div>
            <p>{recall.product}</p>
          </div>
        </div>
        <div className="admin-tabs">
          <button className="is-active">Overview</button>
          <button>Affected Products</button>
          <button>Affected Users</button>
          <button>Timeline</button>
        </div>
        <dl className="admin-detail-list recall-detail-list">
          <dt>Recall ID</dt><dd>{recall.recallId} <Copy size={15} /></dd>
          <dt>Product</dt><dd>{recall.product}</dd>
          <dt>Brand</dt><dd>{recall.brand}</dd>
          <dt>Category</dt><dd>{recall.category}</dd>
          <dt>Reason</dt><dd>{recall.reason}</dd>
          <dt>Severity</dt><dd><StatusBadge tone={severityTone(recall.severity)}>{recall.severity}</StatusBadge></dd>
          <dt>Recall Date</dt><dd>{recall.recallDate ? new Date(recall.recallDate).toLocaleDateString() : ''}</dd>
          <dt>Effective Date</dt><dd>{recall.effectiveDate ? new Date(recall.effectiveDate).toLocaleDateString() : ''}</dd>
          <dt>Issued By</dt><dd>{recall.issuedByAuthority}</dd>
          <dt>Reference No.</dt><dd>{recall.referenceNo}</dd>
          <dt>Description</dt><dd>{recall.description}</dd>
          <dt>Affected Region</dt><dd>{recall.affectedRegion}</dd>
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
  recallId: 'RC-2026-00025',
  product: '',
  brand: '',
  category: '',
  reason: '',
  severity: 'High',
  recallDate: '',
  effectiveDate: '',
  issuedByAuthority: 'FSSAI',
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
            <input value={form.recallId} onChange={updateField('recallId')} placeholder="RC-2026-00025" required />
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
            <input value={form.issuedByAuthority} onChange={updateField('issuedByAuthority')} placeholder="FSSAI" />
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
          <AdminButton onClick={onClose} type="button">Cancel</AdminButton>
          <AdminButton icon={Plus} variant="primary" className="admin-wide-btn" type="submit">Add Recall</AdminButton>
        </div>
      </form>
    </aside>
  );
}

function formatDate(dateValue) {
  if (!dateValue) return 'Aug 15, 2026';
  const date = new Date(dateValue);
  if (isNaN(date.getTime())) return dateValue;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function FoodRecallManagement() {
  const [recalls, setRecalls] = useState([]);
  const [panelMode, setPanelMode] = useState('details');
  const [selectedRecall, setSelectedRecall] = useState(null);
  const [form, setForm] = useState(initialRecallForm);

  useEffect(() => {
    fetchRecalls();
  }, []);

  const fetchRecalls = async () => {
    try {
      const token = localStorage.getItem('shopsense_token');
      const res = await axios.get('http://localhost:5000/api/admin/community/food-recalls', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setRecalls(res.data.data.recalls);
      }
    } catch (err) {
      console.error('Failed to fetch recalls', err);
    }
  };

  const handleAddRecall = async (event) => {
    event.preventDefault();
    try {
      const token = localStorage.getItem('shopsense_token');
      await axios.post('http://localhost:5000/api/admin/community/food-recalls', form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setForm({ ...initialRecallForm, recallId: `RC-2026-${String(recalls.length + 26).padStart(5, '0')}` });
      setPanelMode('details');
      fetchRecalls();
    } catch (err) {
      console.error('Failed to add recall', err);
      alert('Failed to add food recall');
    }
  };

  const activeCount = recalls.filter(r => r.status === 'Active').length;
  const newThisWeek = recalls.filter(r => new Date(r.createdAt) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length;
  const affectedUsersCount = recalls.reduce((acc, curr) => acc + (curr.affectedUsers || 0), 0);

  const stats = [
    [ShieldCheck, 'Active Recalls', String(activeCount), '', 'green'],
    [TimerReset, 'New Recalls (This Week)', String(newThisWeek), '', 'blue'],
    [AlertTriangle, 'Total Recalls', String(recalls.length), '', 'orange'],
    [UsersRound, 'Affected Users', String(affectedUsersCount), '', 'teal'],
  ];

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
        : <RecallDetailPanel recall={selectedRecall} onClose={() => setSelectedRecall(null)} />}
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
              {recalls.map((recall) => (
                <tr key={recall._id}>
                  <td><strong>{recall.recallId}</strong></td>
                  <td><div className="admin-product-name"><span className="admin-product-thumb"><Sprout size={17} /></span><strong>{recall.product}</strong></div></td>
                  <td>{recall.brand}</td>
                  <td>{recall.reason}</td>
                  <td><StatusBadge tone={severityTone(recall.severity)}>{recall.severity}</StatusBadge></td>
                  <td>{formatDate(recall.recallDate)}</td>
                  <td><StatusBadge tone={recall.status === 'Active' ? 'green' : 'orange'}>{recall.status}</StatusBadge></td>
                  <td>{recall.affectedUsers}</td>
                  <td>
                    <div className="admin-row-actions">
                      <button onClick={() => { setSelectedRecall(recall); setPanelMode('details'); }}><Eye size={16} /></button>
                      <button><Edit3 size={16} /></button>
                      <button><MoreVertical size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {recalls.length === 0 && (
                <tr><td colSpan={9} style={{ textAlign: 'center', padding: '24px', color: '#999' }}>No food recalls found</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <TablePagination totalLabel={`Showing ${recalls.length} recalls`} lastPage="1" />
      </section>
    </AdminLayout>
  );
}
