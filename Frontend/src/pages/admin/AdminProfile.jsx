import { useState, useEffect } from 'react';
import axios from 'axios';
import { Bell, Calendar, Check, ChevronDown, Clock, KeyRound, Lock, LogIn, Mail, Moon, Monitor, Save, Settings, Shield, UserRound, X } from 'lucide-react';
import AdminLayout from '../../components/Admin/AdminLayout';
import { AdminButton, StatusBadge } from '../../components/Admin/AdminUI';
import { useTheme } from '../../hooks/useTheme';

function ProfileField({ label, value, select = false, type = 'text', name, onChange, options = [] }) {
  if (select) {
    return (
      <label className="admin-profile-field">
        <span>{label}</span>
        <div style={{ position: 'relative' }}>
          <select value={value} name={name} onChange={onChange} style={{ width: '100%', appearance: 'none', background: 'none', border: 'none', color: 'inherit', fontSize: 'inherit', fontWeight: 'inherit', cursor: 'pointer', outline: 'none' }}>
            {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
          <ChevronDown size={17} style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
        </div>
      </label>
    );
  }
  return (
    <label className="admin-profile-field">
      <span>{label}</span>
      <input type={type} name={name} value={value} onChange={onChange} style={{ background: 'none', border: 'none', color: 'inherit', fontSize: 'inherit', fontWeight: 'inherit', width: '100%', outline: 'none' }} />
    </label>
  );
}

function ActionRow({ title, help, action, status }) {
  return <div className="admin-profile-action-row"><div><strong>{title}</strong><p>{help}</p></div>{status ? <StatusBadge tone="green">{status}</StatusBadge> : action}</div>;
}

export default function AdminProfile() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  
  // Forms state
  const [infoForm, setInfoForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    employeeId: '',
    dateOfBirth: '',
    department: '',
    language: ''
  });

  const [prefForm, setPrefForm] = useState({
    theme: '',
    defaultView: '',
    itemsPerPage: '',
    timeFormat: '',
    dateFormat: ''
  });

  // Password Modal
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  const { setTheme } = useTheme();

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('shopsense_token');
      const res = await axios.get('http://localhost:5000/api/admin/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        const p = res.data.data.profile;
        setProfile(p);
        
        // Format Date of Birth for input type="date"
        let dobString = '';
        if (p.dateOfBirth) {
          const date = new Date(p.dateOfBirth);
          dobString = date.toISOString().split('T')[0];
        }

        setInfoForm({
          fullName: p.fullName || '',
          email: p.email || '',
          phone: p.phone || '',
          employeeId: p.employeeId || '',
          dateOfBirth: dobString,
          department: p.department || '',
          language: p.settings?.general?.language || 'English'
        });

        setPrefForm({
          theme: p.settings?.general?.theme || 'Light',
          defaultView: p.settings?.displayPreferences?.defaultView || 'Overview',
          itemsPerPage: p.settings?.displayPreferences?.itemsPerPage || '20',
          timeFormat: p.settings?.general?.timeFormat || '12 Hours (AM/PM)',
          dateFormat: p.settings?.general?.dateFormat || 'DD MMM, YYYY'
        });
      }
    } catch (error) {
      console.error('Failed to fetch profile', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleInfoChange = (e) => setInfoForm({ ...infoForm, [e.target.name]: e.target.value });
  const handlePrefChange = (e) => setPrefForm({ ...prefForm, [e.target.name]: e.target.value });
  const handlePasswordChange = (e) => setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });

  const saveInfo = async () => {
    try {
      const token = localStorage.getItem('shopsense_token');
      await axios.put('http://localhost:5000/api/admin/profile', infoForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchProfile();
      alert('Profile information saved successfully!');
    } catch (error) {
      console.error('Failed to save profile', error);
      alert('Failed to save profile info');
    }
  };

  const savePreferences = async () => {
    try {
      const token = localStorage.getItem('shopsense_token');
      await axios.put('http://localhost:5000/api/admin/profile/preferences', prefForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTheme(prefForm.theme);
      fetchProfile();
      alert('Preferences saved successfully!');
    } catch (error) {
      console.error('Failed to save preferences', error);
      alert('Failed to save preferences');
    }
  };

  const submitPasswordChange = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      return setPasswordError('New passwords do not match');
    }

    try {
      const token = localStorage.getItem('shopsense_token');
      const res = await axios.put('http://localhost:5000/api/admin/profile/password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setPasswordSuccess('Password changed successfully!');
        setTimeout(() => {
          setShowPasswordModal(false);
          setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
          setPasswordSuccess('');
        }, 1500);
      }
    } catch (error) {
      setPasswordError(error.response?.data?.message || 'Failed to change password');
    }
  };

  if (loading) return <AdminLayout title="Admin Profile" subtitle="Loading..."><p>Loading profile...</p></AdminLayout>;

  // Compute login stats
  const loginCountThisMonth = profile?.loginHistory?.filter(l => {
    const d = new Date(l.loginTime);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length || 0;

  const joinedDate = new Date(profile?.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  const lastLoginDateObj = profile?.lastLogin ? new Date(profile.lastLogin) : null;
  const lastLoginFormatted = lastLoginDateObj ? lastLoginDateObj.toLocaleString() : 'Never';
  const lastLoginIp = profile?.loginHistory?.length > 0 ? profile.loginHistory[profile.loginHistory.length - 1].ip : 'Unknown IP';

  return (
    <AdminLayout
      title="Admin Profile"
      subtitle="View and manage your personal information and account settings."
      actions={<><button className="admin-icon-btn has-dot" type="button" aria-label="Notifications"><Bell size={19} /></button><button className="admin-icon-btn" type="button" aria-label="Theme"><Moon size={19} /></button><div className="admin-profile-mini"><span>{profile?.fullName?.charAt(0) || 'A'}</span><strong>{profile?.fullName || 'Admin'}<small>{profile?.role === 'admin' ? 'Super Admin' : 'Admin'}</small></strong><ChevronDown size={17} /></div></>}
    >
      <section className="admin-profile-hero admin-panel">
        <aside className="admin-profile-card">
          <div className="admin-profile-avatar">{profile?.fullName?.charAt(0) || 'A'}</div>
          <StatusBadge tone="teal">{profile?.role === 'admin' ? 'Super Admin' : 'Admin'}</StatusBadge>
          <h2>{profile?.fullName || 'Admin'}</h2>
          <p>{profile?.department || 'System Administrator'}</p>
          <ul><li><Mail size={16} />{profile?.email}</li><li><Calendar size={16} />Joined on {joinedDate}</li><li><Clock size={16} />Last login: {lastLoginFormatted}</li></ul>
          <StatusBadge tone="green">{profile?.accountStatus === 'active' ? 'Active' : profile?.accountStatus}</StatusBadge>
        </aside>
        <div className="admin-profile-form">
          <header><UserRound size={24} /><div><h2>Profile Information</h2><p>Update your personal information and profile details.</p></div></header>
          <div className="admin-profile-form-grid">
            <ProfileField label="Full Name" name="fullName" value={infoForm.fullName} onChange={handleInfoChange} />
            <ProfileField label="Email Address" name="email" type="email" value={infoForm.email} onChange={handleInfoChange} />
            <ProfileField label="Phone Number" name="phone" value={infoForm.phone} onChange={handleInfoChange} />
            <ProfileField label="Employee ID" name="employeeId" value={infoForm.employeeId} onChange={handleInfoChange} />
            <ProfileField label="Date of Birth" name="dateOfBirth" type="date" value={infoForm.dateOfBirth} onChange={handleInfoChange} />
            <ProfileField label="Department" name="department" value={infoForm.department} onChange={handleInfoChange} />
            <ProfileField label="Language Preference" name="language" select options={['English', 'Hindi', 'Marathi']} value={infoForm.language} onChange={handleInfoChange} />
          </div>
          <AdminButton icon={Save} variant="primary" className="admin-profile-save" onClick={saveInfo}>Save Changes</AdminButton>
        </div>
      </section>

      <div className="admin-profile-grid">
        <section className="admin-panel admin-profile-section">
          <h2><Shield size={23} />Security</h2>
          <p>Manage your password and security settings.</p>
          <ActionRow title="Change Password" help="Update your password regularly to keep your account secure." action={<AdminButton icon={Lock} onClick={() => setShowPasswordModal(true)}>Change Password</AdminButton>} />
          {/* Removed 2FA as per request */}
          <ActionRow title="Active Sessions" help="Manage your active sessions across devices." action={<AdminButton icon={Monitor}>View Sessions</AdminButton>} />
          <ActionRow title="Login History" help="View your recent login activity." action={<AdminButton icon={Clock}>View History</AdminButton>} />
        </section>
        <section className="admin-panel admin-profile-section">
          <h2><Settings size={23} />Preferences</h2>
          <p>Customize your admin panel experience.</p>
          <ProfileField label="Theme" name="theme" select options={['Light', 'Dark', 'System']} value={prefForm.theme} onChange={handlePrefChange} />
          <ProfileField label="Dashboard Default View" name="defaultView" select options={['Overview', 'Detailed', 'Minimal']} value={prefForm.defaultView} onChange={handlePrefChange} />
          <ProfileField label="Items Per Page" name="itemsPerPage" select options={['10', '20', '50', '100']} value={prefForm.itemsPerPage} onChange={handlePrefChange} />
          <ProfileField label="Time Format" name="timeFormat" select options={['12 Hours (AM/PM)', '24 Hours']} value={prefForm.timeFormat} onChange={handlePrefChange} />
          <ProfileField label="Date Format" name="dateFormat" select options={['DD MMM, YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD']} value={prefForm.dateFormat} onChange={handlePrefChange} />
          <AdminButton icon={Save} variant="primary" className="admin-profile-save" onClick={savePreferences}>Save Preferences</AdminButton>
        </section>
      </div>

      <section className="admin-panel admin-profile-activity">
        <h2><BarIcon />Account Activity Summary</h2>
        <div>
          <article><span><LogIn size={22} /></span><div><small>TOTAL LOGINS</small><strong>{loginCountThisMonth}</strong><p>This Month</p></div></article>
          <article><span><Clock size={22} /></span><div><small>LAST LOGIN</small><strong>{lastLoginFormatted}</strong><p>IP: {lastLoginIp}</p></div></article>
          <article><span><Check size={22} /></span><div><small>ACCOUNT STATUS</small><strong>{profile?.accountStatus === 'active' ? 'Active' : profile?.accountStatus}</strong><p>All systems operational</p></div></article>
          <article><span><KeyRound size={22} /></span><div><small>PERMISSIONS</small><strong>Full Access</strong><p>All modules</p></div></article>
        </div>
      </section>

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="admin-modal-overlay" style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="admin-modal-content admin-panel" style={{ width: '400px', padding: '24px', position: 'relative' }}>
            <button className="admin-icon-btn" onClick={() => setShowPasswordModal(false)} style={{ position: 'absolute', top: '16px', right: '16px' }}><X size={20} /></button>
            <h2 style={{ marginBottom: '8px' }}><Lock size={20} style={{ verticalAlign: 'middle', marginRight: '8px', color: '#10b981' }}/>Change Password</h2>
            <p style={{ color: '#6b7280', marginBottom: '24px', fontSize: '14px' }}>Please enter your current password and a new one.</p>
            
            {passwordError && <div style={{ padding: '12px', backgroundColor: '#fee2e2', color: '#b91c1c', borderRadius: '6px', marginBottom: '16px', fontSize: '14px' }}>{passwordError}</div>}
            {passwordSuccess && <div style={{ padding: '12px', backgroundColor: '#d1fae5', color: '#047857', borderRadius: '6px', marginBottom: '16px', fontSize: '14px' }}>{passwordSuccess}</div>}

            <form onSubmit={submitPasswordChange} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="admin-form-group">
                <label>Current Password</label>
                <input type="password" name="currentPassword" value={passwordForm.currentPassword} onChange={handlePasswordChange} required className="admin-input" />
              </div>
              <div className="admin-form-group">
                <label>New Password</label>
                <input type="password" name="newPassword" value={passwordForm.newPassword} onChange={handlePasswordChange} required minLength="6" className="admin-input" />
              </div>
              <div className="admin-form-group">
                <label>Confirm New Password</label>
                <input type="password" name="confirmPassword" value={passwordForm.confirmPassword} onChange={handlePasswordChange} required minLength="6" className="admin-input" />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
                <AdminButton type="button" onClick={() => setShowPasswordModal(false)}>Cancel</AdminButton>
                <AdminButton type="submit" variant="primary">Change Password</AdminButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

function BarIcon() {
  return <span className="admin-profile-bars"><i /><i /><i /></span>;
}
