import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { AlertTriangle, Copy, Edit3, Eye, Filter, MoreVertical, Plus, Search, ShieldCheck, Sprout, TimerReset, Trash2, UsersRound, X } from 'lucide-react';
import AdminLayout from '../../components/Admin/AdminLayout';
import { AdminButton, AdminStatCard, StatusBadge, TablePagination } from '../../components/Admin/AdminUI';

function severityTone(severity) {
  if (severity === 'High') return 'red';
  if (severity === 'Medium') return 'amber';
  return 'green';
}

function RecallDetailPanel({ recall, onClose, onEdit }) {
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
        <dl className="admin-detail-list recall-detail-list">
          <dt>Recall ID</dt><dd>{recall.recallId} <Copy size={15} /></dd>
          <dt>Product</dt><dd>{recall.product}</dd>
          <dt>Brand</dt><dd>{recall.brand}</dd>
          <dt>Category</dt><dd>{recall.category}</dd>
          <dt>Reason</dt><dd>{recall.reason}</dd>
          <dt>Severity</dt><dd><StatusBadge tone={severityTone(recall.severity)}>{recall.severity}</StatusBadge></dd>
          <dt>Recall Date</dt><dd>{recall.recallDate ? new Date(recall.recallDate).toLocaleDateString() : '—'}</dd>
          <dt>Effective Date</dt><dd>{recall.effectiveDate ? new Date(recall.effectiveDate).toLocaleDateString() : '—'}</dd>
          <dt>Issued By</dt><dd>{recall.issuedByAuthority || '—'}</dd>
          <dt>Reference No.</dt><dd>{recall.referenceNo || '—'}</dd>
          <dt>Affected Region</dt><dd>{recall.affectedRegion || '—'}</dd>
          <dt>Affected Users</dt><dd>{recall.affectedUsers ?? 0}</dd>
          <dt>Description</dt><dd>{recall.description || '—'}</dd>
        </dl>
        <div className="admin-detail-section">
          <h4>Actions</h4>
          <div className="admin-detail-actions recall-actions">
            <AdminButton icon={Edit3} onClick={onEdit}>Edit Recall</AdminButton>
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

function RecallFormPanel({ form, onChange, onClose, onSubmit, isEditing }) {
  const updateField = (field) => (event) => onChange({ ...form, [field]: event.target.value });

  return (
    <aside className="admin-detail-panel recall-detail-panel">
      <div className="admin-detail-header">
        <h2>{isEditing ? 'Edit Recall' : 'Add Recall'}</h2>
        <button className="admin-icon-btn" type="button" aria-label="Close form" onClick={onClose}><X size={18} /></button>
      </div>
      <form className="admin-detail-body admin-recall-form" onSubmit={onSubmit}>
        <div className="admin-recall-hero">
          <span className="admin-stat-icon tone-red"><ShieldCheck size={22} /></span>
          <div>
            <h3>{isEditing ? 'Edit Food Recall' : 'New Food Recall'}</h3>
            <p>{isEditing ? 'Update the recall details below.' : 'Create an alert for affected products and users.'}</p>
          </div>
        </div>

        <div className="admin-form-grid">
          <label>
            <span>Recall ID</span>
            <input value={form.recallId} onChange={updateField('recallId')} placeholder="RC-2026-00025" required disabled={isEditing} style={isEditing ? { opacity: 0.6, cursor: 'not-allowed' } : {}} />
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
          <AdminButton icon={isEditing ? Edit3 : Plus} variant="primary" className="admin-wide-btn" type="submit">
            {isEditing ? 'Save Changes' : 'Add Recall'}
          </AdminButton>
        </div>
      </form>
    </aside>
  );
}

function formatDate(dateValue) {
  if (!dateValue) return '—';
  const date = new Date(dateValue);
  if (isNaN(date.getTime())) return dateValue;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function toDateInputValue(dateValue) {
  if (!dateValue) return '';
  const d = new Date(dateValue);
  if (isNaN(d.getTime())) return '';
  return d.toISOString().split('T')[0];
}

function ActionDropdown({ onRemove }) {
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
          <button
            className="admin-dropdown-item"
            style={{
              display: 'flex', alignItems: 'center', gap: 8, width: '100%',
              padding: '10px 16px', background: 'none', border: 'none',
              cursor: 'pointer', fontSize: 14, color: '#dc2626', textAlign: 'left'
            }}
            onClick={() => { setOpen(false); onRemove(); }}
          >
            <Trash2 size={15} /> Remove Recall
          </button>
        </div>
      )}
    </div>
  );
}

export default function FoodRecallManagement() {
  const [recalls, setRecalls] = useState([]);
  const [panelMode, setPanelMode] = useState('closed'); // 'closed' | 'details' | 'add' | 'edit'
  const [selectedRecall, setSelectedRecall] = useState(null);
  const [editingRecallId, setEditingRecallId] = useState(null);
  const [form, setForm] = useState(initialRecallForm);

  useEffect(() => {
    fetchRecalls();
  }, []);

  const token = () => localStorage.getItem('shopsense_token');
  const authHeaders = () => ({ headers: { Authorization: `Bearer ${token()}` } });

  const fetchRecalls = async () => {
    try {
      const res = await axios.get('/api/admin/community/food-recalls', authHeaders());
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
      await axios.post('/api/admin/community/food-recalls', form, authHeaders());
      setPanelMode('closed');
      setForm(initialRecallForm);
      fetchRecalls();
    } catch (err) {
      console.error('Failed to add recall', err);
      alert('Failed to add food recall: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleEditRecall = async (event) => {
    event.preventDefault();
    try {
      await axios.put(`/api/admin/community/food-recalls/${editingRecallId}`, form, authHeaders());
      setPanelMode('closed');
      setEditingRecallId(null);
      setForm(initialRecallForm);
      fetchRecalls();
    } catch (err) {
      console.error('Failed to update recall', err);
      alert('Failed to update food recall: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDeleteRecall = async (recall) => {
    if (!window.confirm(`Are you sure you want to remove the recall "${recall.recallId} - ${recall.product}"?\n\nAll users will be notified that this was a false recall.`)) return;
    try {
      await axios.delete(`/api/admin/community/food-recalls/${recall._id}`, authHeaders());
      // If the deleted recall was being viewed, close the panel
      if (selectedRecall && selectedRecall._id === recall._id) {
        setSelectedRecall(null);
        setPanelMode('closed');
      }
      fetchRecalls();
    } catch (err) {
      console.error('Failed to delete recall', err);
      alert('Failed to delete food recall: ' + (err.response?.data?.message || err.message));
    }
  };

  const openViewPanel = (recall) => {
    setSelectedRecall(recall);
    setPanelMode('details');
  };

  const openEditPanel = (recall) => {
    setEditingRecallId(recall._id);
    setForm({
      recallId: recall.recallId || '',
      product: recall.product || '',
      brand: recall.brand || '',
      category: recall.category || '',
      reason: recall.reason || '',
      severity: recall.severity || 'High',
      recallDate: toDateInputValue(recall.recallDate),
      effectiveDate: toDateInputValue(recall.effectiveDate),
      issuedByAuthority: recall.issuedByAuthority || '',
      referenceNo: recall.referenceNo || '',
      description: recall.description || '',
      affectedRegion: recall.affectedRegion || '',
      affectedUsers: recall.affectedUsers != null ? String(recall.affectedUsers) : '',
      status: recall.status || 'Active',
    });
    setPanelMode('edit');
  };

  const openAddPanel = () => {
    setEditingRecallId(null);
    setForm({ ...initialRecallForm, recallId: `RC-2026-${String(recalls.length + 26).padStart(5, '0')}` });
    setPanelMode('add');
  };

  const closePanel = () => {
    setPanelMode('closed');
    setSelectedRecall(null);
    setEditingRecallId(null);
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

  let detailPanel = null;
  if (panelMode === 'details') {
    detailPanel = <RecallDetailPanel recall={selectedRecall} onClose={closePanel} onEdit={() => { if (selectedRecall) openEditPanel(selectedRecall); }} />;
  } else if (panelMode === 'add') {
    detailPanel = <RecallFormPanel form={form} onChange={setForm} onClose={closePanel} onSubmit={handleAddRecall} isEditing={false} />;
  } else if (panelMode === 'edit') {
    detailPanel = <RecallFormPanel form={form} onChange={setForm} onClose={closePanel} onSubmit={handleEditRecall} isEditing={true} />;
  }

  return (
    <AdminLayout
      title="Food Recall Management"
      subtitle="Manage and monitor food recall alerts and affected products."
      actions={(
        <>
          <label className="admin-search product-search"><Search size={19} /><input placeholder="Search by product, brand, recall ID..." /></label>
          <AdminButton icon={Filter}>Filter</AdminButton>
          <AdminButton icon={Plus} variant="primary" onClick={openAddPanel}>Add Recall</AdminButton>
        </>
      )}
      detailPanel={detailPanel}
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
                      <button onClick={() => openViewPanel(recall)} title="View details"><Eye size={16} /></button>
                      <button onClick={() => openEditPanel(recall)} title="Edit recall"><Edit3 size={16} /></button>
                      <ActionDropdown onRemove={() => handleDeleteRecall(recall)} />
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
