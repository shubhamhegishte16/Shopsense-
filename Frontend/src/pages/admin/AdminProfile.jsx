import { Bell, Calendar, Check, ChevronDown, Clock, KeyRound, Lock, LogIn, Mail, Moon, Monitor, Save, Settings, Shield, User, UserRound } from 'lucide-react';
import AdminLayout from '../../components/Admin/AdminLayout';
import { AdminButton, StatusBadge } from '../../components/Admin/AdminUI';

function ProfileField({ label, value, select = false }) {
  return <label className="admin-profile-field"><span>{label}</span><button type="button">{value}{select && <ChevronDown size={17} />}</button></label>;
}

function ActionRow({ title, help, action, status }) {
  return <div className="admin-profile-action-row"><div><strong>{title}</strong><p>{help}</p></div>{status ? <StatusBadge tone="green">{status}</StatusBadge> : action}</div>;
}

export default function AdminProfile() {
  return (
    <AdminLayout
      title="Admin Profile"
      subtitle="View and manage your personal information and account settings."
      actions={<><button className="admin-icon-btn has-dot" type="button" aria-label="Notifications"><Bell size={19} /></button><button className="admin-icon-btn" type="button" aria-label="Theme"><Moon size={19} /></button><div className="admin-profile-mini"><span>A</span><strong>Admin<small>Super Admin</small></strong><ChevronDown size={17} /></div></>}
    >
      <section className="admin-profile-hero admin-panel">
        <aside className="admin-profile-card">
          <div className="admin-profile-avatar">A</div>
          <StatusBadge tone="teal">Super Admin</StatusBadge>
          <h2>Admin</h2>
          <p>System Administrator</p>
          <ul><li><Mail size={16} />admin@shopsense.ai</li><li><Calendar size={16} />Joined on 15 Jan 2025</li><li><Clock size={16} />Last login: Today, 10:30 AM</li></ul>
          <StatusBadge tone="green">Active</StatusBadge>
        </aside>
        <div className="admin-profile-form">
          <header><UserRound size={24} /><div><h2>Profile Information</h2><p>Update your personal information and profile details.</p></div></header>
          <div className="admin-profile-form-grid">
            <ProfileField label="Full Name" value="Admin" />
            <ProfileField label="Role" value="Super Admin" select />
            <ProfileField label="Email Address" value="admin@shopsense.ai" />
            <ProfileField label="Employee ID" value="ADM-0001" />
            <ProfileField label="Phone Number" value="+91 98765 43210" />
            <ProfileField label="Date of Birth" value="01 Jan 1990" />
            <ProfileField label="Department" value="Administration" select />
            <ProfileField label="Language Preference" value="English" select />
          </div>
          <AdminButton icon={Save} variant="primary" className="admin-profile-save">Save Changes</AdminButton>
        </div>
      </section>

      <div className="admin-profile-grid">
        <section className="admin-panel admin-profile-section"><h2><Shield size={23} />Security</h2><p>Manage your password and security settings.</p><ActionRow title="Change Password" help="Update your password regularly to keep your account secure." action={<AdminButton icon={Lock}>Change Password</AdminButton>} /><ActionRow title="Two-Factor Authentication (2FA)" help="Add an extra layer of security to your account." status="Enabled" /><ActionRow title="Active Sessions" help="Manage your active sessions across devices." action={<AdminButton icon={Monitor}>View Sessions</AdminButton>} /><ActionRow title="Login History" help="View your recent login activity." action={<AdminButton icon={Clock}>View History</AdminButton>} /></section>
        <section className="admin-panel admin-profile-section"><h2><Settings size={23} />Preferences</h2><p>Customize your admin panel experience.</p>{[['Theme', 'Light'], ['Dashboard Default View', 'Overview'], ['Items Per Page', '10'], ['Time Format', '12 Hours (AM/PM)'], ['Date Format', 'DD MMM, YYYY']].map(([label, value]) => <ProfileField key={label} label={label} value={value} select />)}<AdminButton icon={Save} variant="primary" className="admin-profile-save">Save Preferences</AdminButton></section>
      </div>

      <section className="admin-panel admin-profile-activity"><h2><BarIcon />Account Activity Summary</h2><div>{[['TOTAL LOGINS', '156', 'This Month', LogIn], ['LAST LOGIN', 'Today, 10:30 AM', 'IP: 103.21.244.XX', Clock], ['ACCOUNT STATUS', 'Active', 'All systems operational', Check], ['PERMISSIONS', 'Full Access', 'All modules', KeyRound]].map(([label, value, help, Icon]) => <article key={label}><span><Icon size={22} /></span><div><small>{label}</small><strong>{value}</strong><p>{help}</p></div></article>)}</div></section>
    </AdminLayout>
  );
}

function BarIcon() {
  return <span className="admin-profile-bars"><i /><i /><i /></span>;
}
