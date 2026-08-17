import { Bell, Calendar, ChevronDown, Clock, Cpu, Globe2, MessageSquare, Monitor, Palette, Search, Settings, Shield, Upload, Users } from 'lucide-react';
import AdminLayout from '../../components/Admin/AdminLayout';
import { AdminButton } from '../../components/Admin/AdminUI';

const tabs = [[Settings, 'General'], [Users, 'Users & Roles'], [Monitor, 'System'], [Bell, 'Notifications'], [Cpu, 'AI Settings'], [Shield, 'Security'], [Globe2, 'Integration']];

const generalSettings = [
  [BarIcon, 'Platform Name', 'The name of your platform displayed to users.', 'ShopSense AI', 'input'],
  [MessageSquare, 'Platform Tagline', 'Short tagline shown on the login and landing pages.', 'Smart Shopping, Smarter You', 'input'],
  [Globe2, 'Default Language', 'Select the default language for the platform.', 'English', 'select'],
  [Clock, 'Timezone', 'Set the default timezone for the system.', '(GMT+05:30) Asia/Kolkata', 'select'],
  [Calendar, 'Date Format', 'Choose the date format used across the platform.', 'DD MMM, YYYY (14 Aug, 2026)', 'select'],
  [Palette, 'Theme', 'Select the default theme for the admin panel.', 'Light Mode', 'select'],
];

function BarIcon(props) {
  return <Settings {...props} />;
}

function FieldControl({ value, type = 'input' }) {
  if (type === 'textarea') return <textarea defaultValue={value} rows={4} />;
  return type === 'select'
    ? <button className="admin-settings-select" type="button">{value}<ChevronDown size={17} /></button>
    : <input defaultValue={value} />;
}

function SettingsRow({ icon: Icon, title, help, value, type }) {
  return <div className="admin-settings-row"><Icon size={20} /><div><strong>{title}</strong><p>{help}</p></div><FieldControl value={value} type={type} /></div>;
}

function ToggleRow({ title, help, active = true }) {
  return <div className="admin-toggle-row"><div><strong>{title}</strong><p>{help}</p></div><button className={active ? 'is-on' : ''} type="button" aria-label={title}><span /></button></div>;
}

export default function AdminSettings() {
  return (
    <AdminLayout title="Settings" subtitle="Manage and configure system settings and preferences." actions={<label className="admin-search admin-settings-search"><Search size={19} /><input placeholder="Search settings..." /></label>}>
      <div className="admin-tabs admin-settings-tabs">{tabs.map(([Icon, label], index) => <button key={label} className={index === 0 ? 'is-active' : ''} type="button"><Icon size={18} />{label}</button>)}</div>
      <div className="admin-settings-grid">
        <div className="admin-settings-main">
          <section className="admin-panel admin-settings-card admin-settings-main-card">
            <h2>General Settings</h2><p>Manage basic information about the platform.</p>
            {generalSettings.map(([Icon, title, help, value, type]) => <SettingsRow key={title} icon={Icon} title={title} help={help} value={value} type={type} />)}
            <AdminButton variant="primary" className="admin-settings-save">Save Changes</AdminButton>
          </section>
          <section className="admin-panel admin-settings-card admin-settings-main-card"><h2>Admin Profile</h2><p>Manage your admin account information.</p><SettingsRow icon={Users} title="Admin Name" help="Your name displayed in the system." value="Admin" /><SettingsRow icon={MessageSquare} title="Email Address" help="Your login email address." value="admin@shopsense.ai" /><div className="admin-settings-row"><Upload size={20} /><div><strong>Profile Picture</strong><p>Upload a profile picture.</p></div><div className="admin-settings-picture"><span>A</span><AdminButton icon={Upload}>Change Picture</AdminButton></div></div><AdminButton variant="primary" className="admin-settings-save">Save Changes</AdminButton></section>
        </div>
        <aside className="admin-settings-side">
          <section className="admin-panel admin-settings-card"><h2>Email Settings</h2><p>Configure email preferences and sender details.</p>{[['Sender Name', 'ShopSense AI'], ['Sender Email', 'no-reply@shopsense.ai'], ['Reply-To Email', 'support@shopsense.ai'], ['Email Signature', 'Thanks,\nShopSense AI Team']].map(([label, value], index) => <label className="admin-settings-field" key={label}><span>{label}</span><small>{index === 0 ? 'Name shown in outgoing emails.' : index === 3 ? 'This will be added to the end of emails.' : 'Email address used for sending emails.'}</small><FieldControl value={value} type={index === 3 ? 'textarea' : 'input'} /></label>)}<AdminButton variant="primary" className="admin-settings-save">Save Changes</AdminButton></section>
          <section className="admin-panel admin-settings-card"><h2>Others</h2><ToggleRow title="Allow User Registration" help="Allow new users to sign up on the platform." /><ToggleRow title="Email Verification" help="Require email verification for new users." /><ToggleRow title="Two-Factor Authentication" help="Require 2FA for admin and staff logins." /><ToggleRow title="Maintenance Mode" help="Enable maintenance mode for the platform." active={false} /><ToggleRow title="Data Backup (Auto)" help="Automatically backup system data." /><AdminButton variant="primary" className="admin-settings-save">Save Changes</AdminButton></section>
        </aside>
      </div>
    </AdminLayout>
  );
}
