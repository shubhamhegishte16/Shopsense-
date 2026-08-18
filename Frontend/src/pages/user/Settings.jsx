import { useState, useEffect, createContext, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from '../../components/User/Sidebar';
import TopNav from '../../components/User/TopNav';
import { useTheme } from '../../hooks/useTheme';
import useWindowWidth, { isMobile } from '../../hooks/useWindowWidth';
import { motion } from 'framer-motion';
import {
  Settings as SettingsIcon, Globe, Moon, DollarSign, Calendar,
  Bell, Shield, User, HardDrive, Sliders, Target, Link2,
  Info, ChevronRight, ChevronDown, Check, Save, Download,
  Trash2, Smartphone, HelpCircle, Zap, BarChart2, Package,
  AlertTriangle, Lock, Eye, Loader2, RefreshCw
} from 'lucide-react';

// ─── API helpers ──────────────────────────────────────────────────────────────

const API_BASE = 'http://localhost:5000/api';

function getAuthHeaders() {
  const token = localStorage.getItem('shopsense_token');
  return { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) };
}

async function fetchSettings() {
  const res = await fetch(`${API_BASE}/settings`, { headers: getAuthHeaders() });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to fetch settings');
  return data;
}

async function saveSection(section, data) {
  const res = await fetch(`${API_BASE}/settings`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify({ section, data }),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.error || 'Failed to save settings');
  return result;
}

async function toggleApp(appName) {
  const res = await fetch(`${API_BASE}/settings/connected-apps/${encodeURIComponent(appName)}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.error || 'Failed to toggle app');
  return result;
}

// ─── Settings Context ─────────────────────────────────────────────────────────

const SettingsCtx = createContext(null);
const useSettings = () => useContext(SettingsCtx);

// ─── Settings Sub-Nav Items ───────────────────────────────────────────────────

const settingsSections = [
  { id: 'general',       label: 'General',           icon: SettingsIcon },
  { id: 'notifications', label: 'Notifications',      icon: Bell },
  { id: 'privacy',       label: 'Privacy & Security', icon: Shield },
  { id: 'account',       label: 'Account',            icon: User },
  { id: 'data',          label: 'Data & Storage',     icon: HardDrive },
  { id: 'preferences',   label: 'Preferences',        icon: Sliders },
  { id: 'budget',        label: 'Budget & Goals',     icon: Target },
  { id: 'connected',     label: 'Connected Apps',     icon: Link2 },
  { id: 'about',         label: 'About',              icon: Info },
];

// ─── Shared helpers ───────────────────────────────────────────────────────────

const labelStyle = { display: 'block', fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 6 };

function Toggle({ value, onChange }) {
  return (
    <div onClick={onChange} style={{ width: 48, height: 26, borderRadius: 13, background: value ? '#154539' : '#E2E8F0', cursor: 'pointer', position: 'relative', transition: 'background 0.2s', flexShrink: 0 }}>
      <div style={{ position: 'absolute', top: 3, left: value ? 25 : 3, width: 20, height: 20, borderRadius: '50%', background: '#FFF', transition: 'left 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }} />
    </div>
  );
}

function SelectRow({ label, sub, options, value, onChange }) {
  const [open, setOpen] = useState(false);
  const width = useWindowWidth();
  const mobile = isMobile(width);
  return (
    <div style={{ display: 'flex', flexDirection: mobile ? 'column' : 'row', alignItems: mobile ? 'stretch' : 'center', justifyContent: 'space-between', padding: '18px 20px', background: '#FFF', borderRadius: 14, border: '1px solid #F1F5F9', position: 'relative', gap: mobile ? 12 : 0 }}>
      <div>
        <div style={{ fontSize: 14, fontWeight: 600, color: '#0F172A', marginBottom: 3 }}>{label}</div>
        <div style={{ fontSize: 12, color: '#94A3B8' }}>{sub}</div>
      </div>
      <div onClick={() => setOpen(!open)} style={{ display: 'flex', alignItems: 'center', gap: 6, border: '1px solid #E2E8F0', borderRadius: 10, padding: '7px 12px', background: '#FAFCFC', cursor: 'pointer', minWidth: mobile ? '100%' : 130, justifyContent: 'space-between', position: 'relative' }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: '#334155' }}>{value}</span>
        <ChevronDown size={13} color="#94A3B8" />
        {open && (
          <div style={{ position: 'absolute', top: '110%', right: 0, background: '#FFF', border: '1px solid #E2E8F0', borderRadius: 10, padding: 6, zIndex: 50, minWidth: 140, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
            {options.map(opt => (
              <div key={opt} onClick={(e) => { e.stopPropagation(); onChange(opt); setOpen(false); }} style={{ padding: '8px 12px', fontSize: 13, color: opt === value ? '#154539' : '#334155', fontWeight: opt === value ? 700 : 400, borderRadius: 8, cursor: 'pointer', background: opt === value ? '#F0FDF4' : 'transparent' }}>
                {opt}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ToggleRow({ label, sub, value, onChange }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', background: '#FFF', borderRadius: 14, border: '1px solid #F1F5F9' }}>
      <div>
        <div style={{ fontSize: 14, fontWeight: 600, color: '#0F172A', marginBottom: 2 }}>{label}</div>
        <div style={{ fontSize: 12, color: '#94A3B8' }}>{sub}</div>
      </div>
      <Toggle value={value} onChange={onChange} />
    </div>
  );
}

function SaveBtn({ onClick, saving, saved }) {
  return (
    <button onClick={onClick} disabled={saving} style={{ marginTop: 24, padding: '12px 28px', background: saved ? '#10B981' : 'linear-gradient(135deg, #154539, #0F3028)', color: '#FFF', border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 8, opacity: saving ? 0.7 : 1 }}>
      {saving ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : saved ? <Check size={16} /> : <Save size={16} />}
      {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
    </button>
  );
}

function SectionHeader({ title, sub }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <h2 style={{ fontSize: 17, fontWeight: 700, color: '#0F172A', margin: 0 }}>{title}</h2>
      {sub && <p style={{ fontSize: 12, color: '#94A3B8', margin: '4px 0 0' }}>{sub}</p>}
    </div>
  );
}

// ─── General ──────────────────────────────────────────────────────────────────

function GeneralSection() {
  const { settings, reload } = useSettings();
  const { setTheme: applyGlobalTheme } = useTheme();
  const width = useWindowWidth();
  const mobile = isMobile(width);
  const g = settings?.general || {};

  const [local, setLocal] = useState({
    language: g.language || 'English',
    theme: g.theme || 'Light',
    currency: g.currency || 'INR (₹)',
    dateFormat: g.dateFormat || 'DD MMM YYYY',
    weightUnit: g.weightUnit || 'Kilogram (kg)',
    volumeUnit: g.volumeUnit || 'Liter (L)',
    distanceUnit: g.distanceUnit || 'Kilometer (km)',
    smartRecommendations: g.smartRecommendations ?? true,
    autoCategorize: g.autoCategorize ?? true,
    lowStockAlerts: g.lowStockAlerts ?? true,
    priceDropAlerts: g.priceDropAlerts ?? false,
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Sync when server data arrives
  useEffect(() => { if (g.language) setLocal(prev => ({ ...prev, ...g })); }, [settings]);

  const toggle = k => setLocal(p => ({ ...p, [k]: !p[k] }));
  const set = (k, v) => {
    setLocal(p => ({ ...p, [k]: v }));
    // Apply theme immediately without waiting for save
    if (k === 'theme') applyGlobalTheme(v);
  };

  const save = async () => {
    setSaving(true);
    try {
      await saveSection('general', local);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      reload();
    } catch (e) { alert(e.message); }
    finally { setSaving(false); }
  };

  const themes = ['Light', 'Dark', 'System'];

  return (
    <div>
      <SectionHeader title="General Settings" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
        <SelectRow label="Language" sub="Choose your preferred language" options={['English', 'Hindi', 'Marathi', 'Tamil']} value={local.language} onChange={v => set('language', v)} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '18px 20px', background: '#FFF', borderRadius: 14, border: '1px solid #F1F5F9', flexWrap: 'wrap' }}>
          <Moon size={18} color="#8B5CF6" />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#0F172A', marginBottom: 2 }}>Theme</div>
            <div style={{ fontSize: 12, color: '#94A3B8' }}>Choose your app appearance</div>
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {themes.map(t => (
              <button key={t} onClick={() => set('theme', t)} style={{ padding: '7px 14px', borderRadius: 8, border: local.theme === t ? '2px solid #154539' : '1px solid #E2E8F0', background: local.theme === t ? '#F0FDF4' : '#FAFCFC', color: local.theme === t ? '#154539' : '#64748B', fontSize: 12, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}>
                {local.theme === t && <Check size={11} />} {t}
              </button>
            ))}
          </div>
        </div>
        <SelectRow label="Currency" sub="Set your default currency" options={['INR (₹)', 'USD ($)', 'EUR (€)', 'GBP (£)']} value={local.currency} onChange={v => set('currency', v)} />
        <SelectRow label="Date Format" sub="Select your preferred date format" options={['DD MMM YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD']} value={local.dateFormat} onChange={v => set('dateFormat', v)} />
      </div>

      <SectionHeader title="App Preferences" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
        {[
          { k: 'smartRecommendations', icon: Zap, iconColor: '#10B981', iconBg: '#D1FAE5', label: 'Smart Recommendations', sub: 'Get AI powered product and saving suggestions' },
          { k: 'autoCategorize', icon: Package, iconColor: '#3B82F6', iconBg: '#DBEAFE', label: 'Auto-categorize Receipts', sub: 'Automatically categorize items from receipts' },
          { k: 'lowStockAlerts', icon: AlertTriangle, iconColor: '#EF4444', iconBg: '#FEE2E2', label: 'Low Stock Alerts', sub: 'Get alerts when pantry items are running low' },
          { k: 'priceDropAlerts', icon: BarChart2, iconColor: '#8B5CF6', iconBg: '#EDE9FE', label: 'Price Drop Alerts', sub: 'Receive alerts when prices drop for saved items' },
        ].map(item => (
          <div key={item.k} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px', background: '#FFF', borderRadius: 14, border: '1px solid #F1F5F9' }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: item.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <item.icon size={17} color={item.iconColor} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#0F172A', marginBottom: 2 }}>{item.label}</div>
              <div style={{ fontSize: 12, color: '#94A3B8' }}>{item.sub}</div>
            </div>
            <Toggle value={local[item.k]} onChange={() => toggle(item.k)} />
          </div>
        ))}
      </div>

      <SectionHeader title="Default Units" sub="Set your default units for measurements" />
      <div style={{ display: 'flex', flexDirection: mobile ? 'column' : 'row', gap: 16, marginBottom: 8 }}>
        {[
          { k: 'weightUnit', label: 'WEIGHT', icon: '⚖️', options: ['Kilogram (kg)', 'Pound (lb)', 'Gram (g)'] },
          { k: 'volumeUnit', label: 'VOLUME', icon: '🧴', options: ['Liter (L)', 'Milliliter (ml)', 'Fluid oz'] },
          { k: 'distanceUnit', label: 'DISTANCE', icon: '📏', options: ['Kilometer (km)', 'Mile (mi)', 'Meter (m)'] },
        ].map(u => (
          <div key={u.k} style={{ flex: 1, border: '1px solid #E2E8F0', borderRadius: 12, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', background: '#FAFCFC', position: 'relative', width: mobile ? '100%' : 'auto' }}>
            <span style={{ fontSize: 18 }}>{u.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 10, color: '#94A3B8', fontWeight: 700, letterSpacing: 0.5 }}>{u.label}</div>
              <SelectRow label="" sub="" options={u.options} value={local[u.k]} onChange={v => set(u.k, v)} />
            </div>
          </div>
        ))}
      </div>

      <SaveBtn onClick={save} saving={saving} saved={saved} />
    </div>
  );
}

// ─── Notifications ────────────────────────────────────────────────────────────

function NotificationsSection() {
  const { settings, reload } = useSettings();
  const n = settings?.notifications || {};
  const [local, setLocal] = useState({ email: true, push: true, sms: false, weekly: true, expiry: true, pricedrop: false, newfeature: true, offers: false, ...n });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => { if (n.email !== undefined) setLocal(prev => ({ ...prev, ...n })); }, [settings]);

  const tog = k => setLocal(p => ({ ...p, [k]: !p[k] }));
  const save = async () => {
    setSaving(true);
    try { await saveSection('notifications', local); setSaved(true); setTimeout(() => setSaved(false), 2000); reload(); }
    catch (e) { alert(e.message); }
    finally { setSaving(false); }
  };

  const groups = [
    { title: 'Notification Channels', items: [
      { k: 'email', label: 'Email Notifications', sub: 'Receive updates via email' },
      { k: 'push',  label: 'Push Notifications',  sub: 'Browser and app push alerts' },
      { k: 'sms',   label: 'SMS Notifications',   sub: 'Receive alerts via SMS' },
    ]},
    { title: 'Alert Types', items: [
      { k: 'weekly',     label: 'Weekly Summary',     sub: 'Get a weekly spending report' },
      { k: 'expiry',     label: 'Expiry Alerts',      sub: 'When pantry items are about to expire' },
      { k: 'pricedrop',  label: 'Price Drop Alerts',  sub: 'When saved item prices fall' },
      { k: 'newfeature', label: 'New Features',       sub: 'Be first to know about new features' },
      { k: 'offers',     label: 'Promotional Offers', sub: 'Deals and discount notifications' },
    ]},
  ];

  return (
    <div>
      {groups.map(group => (
        <div key={group.title} style={{ marginBottom: 32 }}>
          <SectionHeader title={group.title} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {group.items.map(item => <ToggleRow key={item.k} label={item.label} sub={item.sub} value={local[item.k]} onChange={() => tog(item.k)} />)}
          </div>
        </div>
      ))}
      <SaveBtn onClick={save} saving={saving} saved={saved} />
    </div>
  );
}

// ─── Privacy & Security ───────────────────────────────────────────────────────

function PrivacySection() {
  const { settings, reload } = useSettings();
  const p = settings?.privacy || {};
  const [local, setLocal] = useState({ analytics: true, crashReports: true, personalized: true, publicProfile: false, ...p });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => { if (p.analytics !== undefined) setLocal(prev => ({ ...prev, ...p })); }, [settings]);

  const tog = k => setLocal(prev => ({ ...prev, [k]: !prev[k] }));
  const save = async () => {
    setSaving(true);
    try { await saveSection('privacy', local); setSaved(true); setTimeout(() => setSaved(false), 2000); reload(); }
    catch (e) { alert(e.message); }
    finally { setSaving(false); }
  };

  return (
    <div>
      <SectionHeader title="Privacy Settings" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 32 }}>
        <ToggleRow label="Usage Analytics" sub="Help us improve by sharing anonymous usage data" value={local.analytics} onChange={() => tog('analytics')} />
        <ToggleRow label="Crash Reports" sub="Automatically send crash reports to help fix issues" value={local.crashReports} onChange={() => tog('crashReports')} />
        <ToggleRow label="Personalized Experience" sub="Allow AI to use your data for recommendations" value={local.personalized} onChange={() => tog('personalized')} />
        <ToggleRow label="Public Profile" sub="Allow others to see your shopping score" value={local.publicProfile} onChange={() => tog('publicProfile')} />
      </div>

      <SectionHeader title="Security" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
        {[
          { icon: Lock, label: 'Change Password', sub: 'Last changed 3 months ago' },
          { icon: Smartphone, label: 'Two-Factor Authentication', sub: 'Not enabled · Recommended', badge: 'Off' },
          { icon: Eye, label: 'Active Sessions', sub: '2 devices logged in' },
        ].map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px', background: '#FFF', borderRadius: 14, border: '1px solid #F1F5F9', cursor: 'pointer' }}>
            <item.icon size={17} color="#64748B" />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#0F172A' }}>{item.label}</div>
              <div style={{ fontSize: 12, color: '#94A3B8' }}>{item.sub}</div>
            </div>
            {item.badge && <span style={{ fontSize: 10, fontWeight: 700, color: '#EF4444', background: '#FEE2E2', padding: '2px 8px', borderRadius: 20 }}>{item.badge}</span>}
            <ChevronRight size={15} color="#CBD5E1" />
          </div>
        ))}
      </div>
      <SaveBtn onClick={save} saving={saving} saved={saved} />
    </div>
  );
}

// ─── Account ──────────────────────────────────────────────────────────────────

function AccountSection() {
  const { userMeta } = useSettings();
  const memberYear = userMeta?.memberSince ? new Date(userMeta.memberSince).toLocaleString('en-IN', { month: 'short', year: 'numeric' }) : 'Jan 2025';

  return (
    <div>
      <SectionHeader title="Account Details" />
      <div style={{ background: '#FFF', borderRadius: 16, padding: '20px', border: '1px solid #F1F5F9', marginBottom: 32, display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#E2E8F0', overflow: 'hidden' }}>
          <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userMeta?.fullName || 'user'}`} alt="Profile" style={{ width: '100%', height: '100%' }} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#0F172A' }}>{userMeta?.fullName || 'User'}</div>
          <div style={{ fontSize: 13, color: '#64748B' }}>{userMeta?.email || ''}</div>
          <div style={{ fontSize: 12, color: '#F59E0B', fontWeight: 600, marginTop: 4 }}>Free Plan · Member since {memberYear}</div>
        </div>
        <button style={{ padding: '10px 20px', background: 'linear-gradient(135deg, #154539, #0F3028)', color: '#FFF', border: 'none', borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
          Upgrade to Premium
        </button>
      </div>

      <SectionHeader title="Account Management" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {[
          { icon: Download,  label: 'Download My Data',    sub: 'Export all your data in JSON format',            color: '#334155' },
          { icon: HelpCircle, label: 'Help & Support',     sub: 'Get help or contact us',                        color: '#334155' },
          { icon: Trash2,    label: 'Delete Account',      sub: 'Permanently delete your account and data',       color: '#EF4444', danger: true },
        ].map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px', background: item.danger ? '#FFF5F5' : '#FFF', borderRadius: 14, border: item.danger ? '1px solid #FEE2E2' : '1px solid #F1F5F9', cursor: 'pointer' }}>
            <item.icon size={17} color={item.color} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: item.color }}>{item.label}</div>
              <div style={{ fontSize: 12, color: '#94A3B8' }}>{item.sub}</div>
            </div>
            <ChevronRight size={15} color="#CBD5E1" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Data & Storage ───────────────────────────────────────────────────────────

function DataSection() {
  const used = 2.4;
  const total = 10;
  const pct = (used / total) * 100;
  return (
    <div>
      <SectionHeader title="Storage Usage" />
      <div style={{ background: '#FFF', borderRadius: 16, padding: '24px', border: '1px solid #F1F5F9', marginBottom: 32 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: '#0F172A' }}>Storage Used</span>
          <span style={{ fontSize: 14, fontWeight: 700, color: '#154539' }}>{used} GB / {total} GB</span>
        </div>
        <div style={{ height: 10, background: '#F1F5F9', borderRadius: 999, overflow: 'hidden', marginBottom: 8 }}>
          <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg, #154539, #10B981)', borderRadius: 999 }} />
        </div>
        <div style={{ fontSize: 12, color: '#94A3B8' }}>{pct.toFixed(0)}% used · {(total - used).toFixed(1)} GB free</div>
      </div>

      <SectionHeader title="Data Actions" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {[
          { icon: Download,   label: 'Export All Data',  sub: 'Download a copy of all your data', color: '#334155' },
          { icon: Trash2,     label: 'Clear Cache',      sub: 'Free up space by clearing cached data', color: '#EF4444' },
          { icon: Smartphone, label: 'Manage Devices',   sub: 'Control which devices have access', color: '#334155' },
        ].map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px', background: '#FFF', borderRadius: 14, border: '1px solid #F1F5F9', cursor: 'pointer' }}>
            <item.icon size={17} color={item.color} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: item.color }}>{item.label}</div>
              <div style={{ fontSize: 12, color: '#94A3B8' }}>{item.sub}</div>
            </div>
            <ChevronRight size={15} color="#CBD5E1" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Preferences ──────────────────────────────────────────────────────────────

function PreferencesSection() {
  const { settings, reload } = useSettings();
  const dp = settings?.displayPreferences || {};
  const [local, setLocal] = useState({ smartRecs: true, autoCat: true, analytics: false, digest: true, defaultView: 'Overview', itemsPerPage: '20', defaultSort: 'Date', ...dp });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => { if (dp.defaultView) setLocal(prev => ({ ...prev, ...dp })); }, [settings]);

  const tog = k => setLocal(p => ({ ...p, [k]: !p[k] }));
  const set = (k, v) => setLocal(p => ({ ...p, [k]: v }));
  const save = async () => {
    setSaving(true);
    try { await saveSection('displayPreferences', local); setSaved(true); setTimeout(() => setSaved(false), 2000); reload(); }
    catch (e) { alert(e.message); }
    finally { setSaving(false); }
  };

  return (
    <div>
      <SectionHeader title="Shopping Preferences" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 32 }}>
        <ToggleRow label="Smart Recommendations" sub="Get AI powered product and saving suggestions" value={local.smartRecs} onChange={() => tog('smartRecs')} />
        <ToggleRow label="Auto-categorize Receipts" sub="Automatically categorize items from receipts" value={local.autoCat} onChange={() => tog('autoCat')} />
        <ToggleRow label="Spending Analytics" sub="Track and analyze your spending patterns" value={local.analytics} onChange={() => tog('analytics')} />
        <ToggleRow label="Weekly Digest" sub="Get a weekly email digest of your activity" value={local.digest} onChange={() => tog('digest')} />
      </div>

      <SectionHeader title="Display Preferences" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
        <SelectRow label="Default View" sub="Choose your preferred dashboard view" options={['Overview', 'Detailed', 'Compact']} value={local.defaultView} onChange={v => set('defaultView', v)} />
        <SelectRow label="Items Per Page" sub="Number of items to show per page" options={['10', '20', '50']} value={local.itemsPerPage} onChange={v => set('itemsPerPage', v)} />
        <SelectRow label="Default Sort" sub="Default sorting for lists" options={['Date', 'Amount', 'Category']} value={local.defaultSort} onChange={v => set('defaultSort', v)} />
      </div>
      <SaveBtn onClick={save} saving={saving} saved={saved} />
    </div>
  );
}

// ─── Budget & Goals ───────────────────────────────────────────────────────────

function BudgetSection() {
  const { settings, reload } = useSettings();
  const b = settings?.budget || {};
  const [monthlyLimit, setMonthlyLimit] = useState(b.monthlyLimit ?? 8000);
  const [categories, setCategories] = useState(b.categories || [
    { label: 'Groceries', budget: 3000, color: '#154539' },
    { label: 'Daily Needs', budget: 1500, color: '#3B82F6' },
    { label: 'Snacks & Beverages', budget: 800, color: '#F59E0B' },
    { label: 'Household', budget: 1000, color: '#8B5CF6' },
  ]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (b.monthlyLimit !== undefined) {
      setMonthlyLimit(b.monthlyLimit);
      if (b.categories?.length) setCategories(b.categories);
    }
  }, [settings]);

  const totalSpent = 6539; // In a real app this would come from receipts aggregation
  const spentPct = Math.min((totalSpent / monthlyLimit) * 100, 100).toFixed(1);

  const save = async () => {
    setSaving(true);
    try {
      await saveSection('budget', { monthlyLimit: Number(monthlyLimit), categories });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      reload();
    } catch (e) { alert(e.message); }
    finally { setSaving(false); }
  };

  return (
    <div>
      <SectionHeader title="Monthly Budget" />
      <div style={{ background: '#FFF', borderRadius: 16, padding: '24px', border: '1px solid #F1F5F9', marginBottom: 32 }}>
        <label style={labelStyle}>Total Monthly Budget</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <span style={{ fontSize: 22, fontWeight: 800, color: '#154539' }}>₹</span>
          <input
            type="number"
            value={monthlyLimit}
            onChange={e => setMonthlyLimit(e.target.value)}
            style={{ fontSize: 22, fontWeight: 800, color: '#0F172A', border: '1px solid #E2E8F0', outline: 'none', width: 160, fontFamily: "'Inter', sans-serif", borderRadius: 8, padding: '4px 8px' }}
          />
        </div>
        <div style={{ fontSize: 12, color: '#94A3B8' }}>You have spent ₹{totalSpent.toLocaleString()} of ₹{Number(monthlyLimit).toLocaleString()} this month ({spentPct}%)</div>
        <div style={{ height: 8, background: '#F1F5F9', borderRadius: 999, overflow: 'hidden', marginTop: 12 }}>
          <div style={{ height: '100%', width: `${spentPct}%`, background: 'linear-gradient(90deg, #154539, #10B981)', borderRadius: 999 }} />
        </div>
      </div>

      <SectionHeader title="Category Budgets" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 24 }}>
        {categories.map((cat, i) => {
          const pct = Math.min((3000 / cat.budget) * 100, 100); // placeholder spent per category
          const over = false;
          return (
            <div key={i} style={{ background: '#FFF', borderRadius: 14, padding: '16px 20px', border: '1px solid #F1F5F9' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, gap: 12 }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: '#0F172A' }}>{cat.label}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 12, color: '#94A3B8' }}>₹</span>
                  <input
                    type="number"
                    value={cat.budget}
                    onChange={e => {
                      const updated = [...categories];
                      updated[i] = { ...updated[i], budget: Number(e.target.value) };
                      setCategories(updated);
                    }}
                    style={{ width: 90, fontSize: 13, fontWeight: 700, color: '#0F172A', border: '1px solid #E2E8F0', borderRadius: 6, padding: '3px 6px', outline: 'none' }}
                  />
                </div>
              </div>
              <div style={{ height: 6, background: '#F1F5F9', borderRadius: 999, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${pct}%`, background: over ? '#EF4444' : cat.color, borderRadius: 999 }} />
              </div>
            </div>
          );
        })}
      </div>
      <SaveBtn onClick={save} saving={saving} saved={saved} />
    </div>
  );
}

// ─── Connected Apps ───────────────────────────────────────────────────────────

function ConnectedSection() {
  const { settings, reload } = useSettings();
  const [apps, setApps] = useState(settings?.connectedApps || [
    { name: 'Blinkit', emoji: '🛒', connected: false, since: 'Not connected', color: '#FBBF24' },
    { name: 'Zepto', emoji: '⚡', connected: false, since: 'Not connected', color: '#8B5CF6' },
    { name: 'Swiggy Instamart', emoji: '🍔', connected: false, since: 'Not connected', color: '#F97316' },
    { name: 'BigBasket', emoji: '🧺', connected: false, since: 'Not connected', color: '#10B981' },
    { name: 'JioMart', emoji: '🏪', connected: false, since: 'Not connected', color: '#3B82F6' },
  ]);
  const [toggling, setToggling] = useState(null);

  useEffect(() => {
    if (settings?.connectedApps?.length) setApps(settings.connectedApps);
  }, [settings]);

  const handleToggle = async (app) => {
    setToggling(app.name);
    try {
      const result = await toggleApp(app.name);
      setApps(prev => prev.map(a => a.name === app.name ? result.app : a));
      reload();
    } catch (e) { alert(e.message); }
    finally { setToggling(null); }
  };

  return (
    <div>
      <SectionHeader title="Connected Apps & Stores" sub="Connect your shopping accounts for seamless tracking" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {apps.map((app, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', background: '#FFF', borderRadius: 14, border: '1px solid #F1F5F9' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: app.color + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>{app.emoji}</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A' }}>{app.name}</div>
                <div style={{ fontSize: 12, color: app.connected ? '#10B981' : '#94A3B8', fontWeight: 500 }}>{app.since}</div>
              </div>
            </div>
            <button
              onClick={() => handleToggle(app)}
              disabled={toggling === app.name}
              style={{ padding: '8px 18px', borderRadius: 10, fontSize: 12, fontWeight: 700, cursor: 'pointer', border: app.connected ? '1px solid #FEE2E2' : '1px solid #D1FAE5', background: app.connected ? '#FEF2F2' : '#F0FDF4', color: app.connected ? '#EF4444' : '#154539', display: 'flex', alignItems: 'center', gap: 6, opacity: toggling === app.name ? 0.6 : 1 }}
            >
              {toggling === app.name ? <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} /> : null}
              {app.connected ? 'Disconnect' : 'Connect'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── About ────────────────────────────────────────────────────────────────────

function AboutSection() {
  return (
    <div>
      <div style={{ background: 'linear-gradient(135deg, #154539, #0F3028)', borderRadius: 20, padding: '32px', color: '#FFF', marginBottom: 28, textAlign: 'center' }}>
        <div style={{ width: 64, height: 64, borderRadius: 18, background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: 28 }}>🛒</div>
        <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 6 }}>ShopSense AI</div>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', marginBottom: 16 }}>Your AI powered shopping companion</div>
        <div style={{ display: 'inline-flex', background: 'rgba(255,255,255,0.1)', borderRadius: 20, padding: '4px 14px', fontSize: 12, fontWeight: 600 }}>Version 1.0.0</div>
      </div>

      {[
        { title: 'What we do', body: 'ShopSense AI helps you track expenses, optimize spending and save more by using advanced AI to analyze your shopping habits and suggest smarter choices.' },
        { title: 'Privacy First', body: 'We are committed to protecting your data. All your shopping data is encrypted and never shared with third parties without your consent.' },
      ].map((item, i) => (
        <div key={i} style={{ background: '#FFF', borderRadius: 16, padding: '20px', border: '1px solid #F1F5F9', marginBottom: 16 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', marginBottom: 8 }}>{item.title}</div>
          <div style={{ fontSize: 13, color: '#64748B', lineHeight: 1.6 }}>{item.body}</div>
        </div>
      ))}

      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 0', borderTop: '1px solid #F1F5F9', fontSize: 12, color: '#94A3B8' }}>
        <span>Version 1.0.0</span>
        <span>© 2025 ShopSense AI</span>
      </div>
    </div>
  );
}

// ─── Right Panel ──────────────────────────────────────────────────────────────

function SettingsRightPanel() {
  const { settings, userMeta } = useSettings();
  const used = 2.4;
  const total = 10;
  return (
    <div style={{ width: 270, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ background: '#FFF', borderRadius: 20, padding: '20px', border: '1px solid #F1F5F9', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A', marginBottom: 16 }}>Account Summary</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#E2E8F0', overflow: 'hidden' }}>
            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userMeta?.fullName || 'user'}`} alt="User" style={{ width: '100%', height: '100%' }} />
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A' }}>{userMeta?.fullName || 'User'}</div>
            <div style={{ fontSize: 12, color: '#F59E0B', fontWeight: 600 }}>Free Plan</div>
          </div>
        </div>
        <button style={{ width: '100%', padding: '10px 0', background: 'linear-gradient(135deg, #154539, #0F3028)', color: '#FFF', border: 'none', borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          Upgrade to Premium <ChevronRight size={14} />
        </button>
      </div>

      <div style={{ background: '#FFF', borderRadius: 20, padding: '20px', border: '1px solid #F1F5F9', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A' }}>Storage Usage</div>
          <span style={{ fontSize: 11, color: '#94A3B8', fontWeight: 600 }}>{used} GB / {total} GB</span>
        </div>
        <div style={{ height: 8, background: '#F1F5F9', borderRadius: 999, overflow: 'hidden', marginBottom: 6 }}>
          <div style={{ height: '100%', width: `${(used / total) * 100}%`, background: 'linear-gradient(90deg, #154539, #10B981)', borderRadius: 999 }} />
        </div>
        <div style={{ textAlign: 'right', fontSize: 11, color: '#10B981', fontWeight: 600 }}>24%</div>
      </div>

      <div style={{ background: '#FFF', borderRadius: 20, padding: '20px', border: '1px solid #F1F5F9', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A', marginBottom: 14 }}>Quick Actions</div>
        {[
          { icon: Download,    label: 'Download My Data' },
          { icon: Trash2,      label: 'Clear Cache' },
          { icon: Smartphone,  label: 'Manage Devices' },
          { icon: HelpCircle,  label: 'Help & Support' },
        ].map((a, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: i < 3 ? '1px solid #F8FAFC' : 'none', cursor: 'pointer' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <a.icon size={15} color="#64748B" />
              <span style={{ fontSize: 13, fontWeight: 500, color: '#334155' }}>{a.label}</span>
            </div>
            <ChevronRight size={13} color="#CBD5E1" />
          </div>
        ))}
      </div>

      <div style={{ background: '#F0FDF4', borderRadius: 20, padding: '20px', border: '1px solid #D1FAE5' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: '#154539', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🛒</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#154539' }}>About ShopSense AI</div>
        </div>
        <p style={{ fontSize: 12, color: '#475569', lineHeight: 1.6, margin: '0 0 10px' }}>ShopSense AI helps you track expenses, optimize spending and save more.</p>
        <div style={{ fontSize: 11, color: '#94A3B8' }}>Version 1.0.0</div>
      </div>
    </div>
  );
}

// ─── Section Map ──────────────────────────────────────────────────────────────

const sectionComponents = {
  general:       GeneralSection,
  notifications: NotificationsSection,
  privacy:       PrivacySection,
  account:       AccountSection,
  data:          DataSection,
  preferences:   PreferencesSection,
  budget:        BudgetSection,
  connected:     ConnectedSection,
  about:         AboutSection,
};

// ─── Settings Page ────────────────────────────────────────────────────────────

export default function Settings() {
  const { section = 'general' } = useParams();
  const navigate = useNavigate();
  const ActiveSection = sectionComponents[section] || GeneralSection;

  const [settings, setSettings] = useState(null);
  const [userMeta, setUserMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  const load = async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const data = await fetchSettings();
      setSettings(data.settings);
      setUserMeta({ email: data.email, fullName: data.fullName, memberSince: data.memberSince });
    } catch (e) {
      setFetchError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <SettingsCtx.Provider value={{ settings, userMeta, reload: load }}>
      <div className="page-wrapper">
        <div className="sidebar-wrapper"><Sidebar /></div>

        <main className="responsive-main">
          <TopNav titleNode={
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                <h1 style={{ fontSize: 26, fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.5px' }}>Settings</h1>
                <SettingsIcon size={20} color="#64748B" />
              </div>
              <p style={{ fontSize: 14, color: '#64748B', margin: 0 }}>Manage your preferences and app configurations.</p>
            </div>
          } />

          <div className="responsive-padding" style={{ paddingTop: 0 }}>
            <div className="content-with-right">
              {/* Settings Sub-Nav */}
              <div className="settings-subnav">
                <div style={{ background: '#FFF', borderRadius: 20, padding: '12px', border: '1px solid #F1F5F9', boxShadow: '0 2px 12px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {settingsSections.map(sec => {
                    const isActive = section === sec.id;
                    return (
                      <button
                        key={sec.id}
                        onClick={() => navigate(`/settings/${sec.id}`)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px',
                          borderRadius: 10, border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left',
                          background: isActive ? '#F0FDF4' : 'transparent',
                          color: isActive ? '#154539' : '#64748B',
                          fontWeight: isActive ? 700 : 500,
                          fontSize: 13, fontFamily: "'Inter', sans-serif",
                          transition: 'all 0.15s',
                        }}
                        onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = '#F8FAFC'; }}
                        onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
                      >
                        <sec.icon size={16} strokeWidth={isActive ? 2.5 : 2} />
                        {sec.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Main Content */}
              <div style={{ flex: 1, minWidth: 0, background: '#FFF', borderRadius: 20, padding: '28px', border: '1px solid #F1F5F9', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
                {loading ? (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 300, gap: 16 }}>
                    <Loader2 size={32} color="#154539" style={{ animation: 'spin 1s linear infinite' }} />
                    <div style={{ fontSize: 14, color: '#94A3B8' }}>Loading settings...</div>
                  </div>
                ) : fetchError ? (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 300, gap: 12 }}>
                    <div style={{ fontSize: 14, color: '#EF4444', fontWeight: 600 }}>Failed to load settings</div>
                    <div style={{ fontSize: 12, color: '#94A3B8' }}>{fetchError}</div>
                    <button onClick={load} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 20px', background: '#154539', color: '#FFF', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                      <RefreshCw size={14} /> Retry
                    </button>
                  </div>
                ) : (
                  <motion.div key={section} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
                    <ActiveSection />
                  </motion.div>
                )}
              </div>

              <div className="right-panel-aside">
                <SettingsRightPanel />
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Spin keyframe */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </SettingsCtx.Provider>
  );
}
