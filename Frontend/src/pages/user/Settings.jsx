import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from '../../components/User/Sidebar';
import TopNav from '../../components/User/TopNav';
import { motion } from 'framer-motion';
import {
  Settings as SettingsIcon, Globe, Moon, DollarSign, Calendar,
  Bell, Shield, User, HardDrive, Sliders, Target, Link2,
  Info, ChevronRight, ChevronDown, Check, Save, Download,
  Trash2, Smartphone, HelpCircle, Zap, BarChart2, Package,
  AlertTriangle, Lock, Eye, EyeOff, CreditCard, Flame
} from 'lucide-react';

// ─── Settings Sub-Nav Items ───────────────────────────────────────────────────

const settingsSections = [
  { id: 'general', label: 'General', icon: SettingsIcon },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'privacy', label: 'Privacy & Security', icon: Shield },
  { id: 'account', label: 'Account', icon: User },
  { id: 'data', label: 'Data & Storage', icon: HardDrive },
  { id: 'preferences', label: 'Preferences', icon: Sliders },
  { id: 'budget', label: 'Budget & Goals', icon: Target },
  { id: 'connected', label: 'Connected Apps', icon: Link2 },
  { id: 'about', label: 'About', icon: Info },
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
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 20px', background: '#FFF', borderRadius: 14, border: '1px solid #F1F5F9' }}>
      <div>
        <div style={{ fontSize: 14, fontWeight: 600, color: '#0F172A', marginBottom: 3 }}>{label}</div>
        <div style={{ fontSize: 12, color: '#94A3B8' }}>{sub}</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, border: '1px solid #E2E8F0', borderRadius: 10, padding: '7px 12px', background: '#FAFCFC', cursor: 'pointer', minWidth: 130, justifyContent: 'space-between' }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: '#334155' }}>{value}</span>
        <ChevronDown size={13} color="#94A3B8" />
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

function SaveBtn({ onClick, saved }) {
  return (
    <button onClick={onClick} style={{ marginTop: 24, padding: '12px 28px', background: saved ? '#10B981' : 'linear-gradient(135deg, #154539, #0F3028)', color: '#FFF', border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
      {saved ? <Check size={16} /> : <Save size={16} />} {saved ? 'Saved!' : 'Save Changes'}
    </button>
  );
}

// ─── General ──────────────────────────────────────────────────────────────────

function GeneralSection() {
  const [saved, setSaved] = useState(false);
  const [theme, setTheme] = useState('Light');
  const [toggles, setToggles] = useState({ smart: true, autocat: true, lowstock: true, pricedrop: false });
  const toggle = k => setToggles(p => ({ ...p, [k]: !p[k] }));
  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  const themes = ['Light', 'Dark', 'System'];

  return (
    <div>
      <SectionHeader title="General Settings" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '18px 20px', background: '#FFF', borderRadius: 14, border: '1px solid #F1F5F9' }}>
          <Globe size={18} color="#154539" />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#0F172A', marginBottom: 2 }}>Language</div>
            <div style={{ fontSize: 12, color: '#94A3B8' }}>Choose your preferred language</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, border: '1px solid #E2E8F0', borderRadius: 10, padding: '7px 12px', background: '#FAFCFC', cursor: 'pointer', minWidth: 110, justifyContent: 'space-between' }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#334155' }}>English</span>
            <ChevronDown size={13} color="#94A3B8" />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '18px 20px', background: '#FFF', borderRadius: 14, border: '1px solid #F1F5F9' }}>
          <Moon size={18} color="#8B5CF6" />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#0F172A', marginBottom: 2 }}>Theme</div>
            <div style={{ fontSize: 12, color: '#94A3B8' }}>Choose your app appearance</div>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {themes.map(t => (
              <button key={t} onClick={() => setTheme(t)} style={{ padding: '7px 14px', borderRadius: 8, border: theme === t ? '2px solid #154539' : '1px solid #E2E8F0', background: theme === t ? '#F0FDF4' : '#FAFCFC', color: theme === t ? '#154539' : '#64748B', fontSize: 12, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}>
                {theme === t && <Check size={11} />} {t}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '18px 20px', background: '#FFF', borderRadius: 14, border: '1px solid #F1F5F9' }}>
          <DollarSign size={18} color="#10B981" />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#0F172A', marginBottom: 2 }}>Currency</div>
            <div style={{ fontSize: 12, color: '#94A3B8' }}>Set your default currency</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, border: '1px solid #E2E8F0', borderRadius: 10, padding: '7px 12px', background: '#FAFCFC', cursor: 'pointer', minWidth: 110, justifyContent: 'space-between' }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#334155' }}>INR (₹)</span>
            <ChevronDown size={13} color="#94A3B8" />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '18px 20px', background: '#FFF', borderRadius: 14, border: '1px solid #F1F5F9' }}>
          <Calendar size={18} color="#F59E0B" />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#0F172A', marginBottom: 2 }}>Date Format</div>
            <div style={{ fontSize: 12, color: '#94A3B8' }}>Select your preferred date format</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, border: '1px solid #E2E8F0', borderRadius: 10, padding: '7px 12px', background: '#FAFCFC', cursor: 'pointer', minWidth: 130, justifyContent: 'space-between' }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#334155' }}>DD MMM YYYY</span>
            <ChevronDown size={13} color="#94A3B8" />
          </div>
        </div>
      </div>

      <SectionHeader title="App Preferences" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
        {[
          { k: 'smart', icon: Zap, iconColor: '#10B981', iconBg: '#D1FAE5', label: 'Smart Recommendations', sub: 'Get AI powered product and saving suggestions' },
          { k: 'autocat', icon: Package, iconColor: '#3B82F6', iconBg: '#DBEAFE', label: 'Auto-categorize Receipts', sub: 'Automatically categorize items from receipts' },
          { k: 'lowstock', icon: AlertTriangle, iconColor: '#EF4444', iconBg: '#FEE2E2', label: 'Low Stock Alerts', sub: 'Get alerts when pantry items are running low' },
          { k: 'pricedrop', icon: BarChart2, iconColor: '#8B5CF6', iconBg: '#EDE9FE', label: 'Price Drop Alerts', sub: 'Receive alerts when prices drop for saved items' },
        ].map(item => (
          <div key={item.k} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px', background: '#FFF', borderRadius: 14, border: '1px solid #F1F5F9' }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: item.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <item.icon size={17} color={item.iconColor} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#0F172A', marginBottom: 2 }}>{item.label}</div>
              <div style={{ fontSize: 12, color: '#94A3B8' }}>{item.sub}</div>
            </div>
            <Toggle value={toggles[item.k]} onChange={() => toggle(item.k)} />
          </div>
        ))}
      </div>

      <SectionHeader title="Default Units" sub="Set your default units for measurements" />
      <div style={{ display: 'flex', gap: 16, marginBottom: 8 }}>
        {[
          { label: 'WEIGHT', value: 'Kilogram (kg)', icon: '⚖️' },
          { label: 'VOLUME', value: 'Liter (L)', icon: '🧴' },
          { label: 'DISTANCE', value: 'Kilometer (km)', icon: '📏' },
        ].map((u, i) => (
          <div key={i} style={{ flex: 1, border: '1px solid #E2E8F0', borderRadius: 12, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', background: '#FAFCFC' }}>
            <span style={{ fontSize: 18 }}>{u.icon}</span>
            <div>
              <div style={{ fontSize: 10, color: '#94A3B8', fontWeight: 700, letterSpacing: 0.5 }}>{u.label}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#334155', display: 'flex', alignItems: 'center', gap: 4 }}>{u.value} <ChevronDown size={11} color="#94A3B8" /></div>
            </div>
          </div>
        ))}
      </div>

      <SaveBtn onClick={save} saved={saved} />
    </div>
  );
}

// ─── Notifications ────────────────────────────────────────────────────────────

function NotificationsSection() {
  const [saved, setSaved] = useState(false);
  const [t, setT] = useState({ email: true, push: true, sms: false, weekly: true, expiry: true, pricedrop: false, newfeature: true, offers: false });
  const tog = k => setT(p => ({ ...p, [k]: !p[k] }));
  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  const groups = [
    { title: 'Notification Channels', items: [
      { k: 'email', label: 'Email Notifications', sub: 'Receive updates via email' },
      { k: 'push', label: 'Push Notifications', sub: 'Browser and app push alerts' },
      { k: 'sms', label: 'SMS Notifications', sub: 'Receive alerts via SMS' },
    ]},
    { title: 'Alert Types', items: [
      { k: 'weekly', label: 'Weekly Summary', sub: 'Get a weekly spending report' },
      { k: 'expiry', label: 'Expiry Alerts', sub: 'When pantry items are about to expire' },
      { k: 'pricedrop', label: 'Price Drop Alerts', sub: 'When saved item prices fall' },
      { k: 'newfeature', label: 'New Features', sub: 'Be first to know about new features' },
      { k: 'offers', label: 'Promotional Offers', sub: 'Deals and discount notifications' },
    ]},
  ];

  return (
    <div>
      {groups.map(group => (
        <div key={group.title} style={{ marginBottom: 32 }}>
          <SectionHeader title={group.title} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {group.items.map(item => <ToggleRow key={item.k} label={item.label} sub={item.sub} value={t[item.k]} onChange={() => tog(item.k)} />)}
          </div>
        </div>
      ))}
      <SaveBtn onClick={save} saved={saved} />
    </div>
  );
}

// ─── Privacy & Security ───────────────────────────────────────────────────────

function PrivacySection() {
  const [t, setT] = useState({ analytics: true, crash: true, personalized: true, publicProfile: false });
  const tog = k => setT(p => ({ ...p, [k]: !p[k] }));
  const [saved, setSaved] = useState(false);
  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return (
    <div>
      <SectionHeader title="Privacy Settings" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 32 }}>
        <ToggleRow label="Usage Analytics" sub="Help us improve by sharing anonymous usage data" value={t.analytics} onChange={() => tog('analytics')} />
        <ToggleRow label="Crash Reports" sub="Automatically send crash reports to help fix issues" value={t.crash} onChange={() => tog('crash')} />
        <ToggleRow label="Personalized Experience" sub="Allow AI to use your data for recommendations" value={t.personalized} onChange={() => tog('personalized')} />
        <ToggleRow label="Public Profile" sub="Allow others to see your shopping score" value={t.publicProfile} onChange={() => tog('publicProfile')} />
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
      <SaveBtn onClick={save} saved={saved} />
    </div>
  );
}

// ─── Account ──────────────────────────────────────────────────────────────────

function AccountSection() {
  return (
    <div>
      <SectionHeader title="Account Details" />
      <div style={{ background: '#FFF', borderRadius: 16, padding: '20px', border: '1px solid #F1F5F9', marginBottom: 32, display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#E2E8F0', overflow: 'hidden' }}>
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Shubham" alt="Profile" style={{ width: '100%', height: '100%' }} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#0F172A' }}>Shubham Hegishte</div>
          <div style={{ fontSize: 13, color: '#64748B' }}>shubhamhegishte16@gmail.com</div>
          <div style={{ fontSize: 12, color: '#F59E0B', fontWeight: 600, marginTop: 4 }}>Free Plan · Member since Jan 2025</div>
        </div>
        <button style={{ padding: '10px 20px', background: 'linear-gradient(135deg, #154539, #0F3028)', color: '#FFF', border: 'none', borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
          Upgrade to Premium
        </button>
      </div>

      <SectionHeader title="Account Management" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {[
          { icon: Download, label: 'Download My Data', sub: 'Export all your data in JSON format', color: '#334155' },
          { icon: CreditCard, label: 'Manage Subscription', sub: 'View and manage your plan', color: '#334155' },
          { icon: HelpCircle, label: 'Help & Support', sub: 'Get help or contact us', color: '#334155' },
          { icon: Trash2, label: 'Delete Account', sub: 'Permanently delete your account and data', color: '#EF4444', danger: true },
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
          { icon: Download, label: 'Export All Data', sub: 'Download a copy of all your data' },
          { icon: Trash2, label: 'Clear Cache', sub: 'Free up space by clearing cached data', color: '#EF4444' },
          { icon: Smartphone, label: 'Manage Devices', sub: 'Control which devices have access' },
        ].map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px', background: '#FFF', borderRadius: 14, border: '1px solid #F1F5F9', cursor: 'pointer' }}>
            <item.icon size={17} color={item.color || '#64748B'} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: item.color || '#0F172A' }}>{item.label}</div>
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
  const [saved, setSaved] = useState(false);
  const [t, setT] = useState({ recs: true, autocat: true, analytics: false, digest: true });
  const tog = k => setT(p => ({ ...p, [k]: !p[k] }));
  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return (
    <div>
      <SectionHeader title="Shopping Preferences" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 32 }}>
        <ToggleRow label="Smart Recommendations" sub="Get AI powered product and saving suggestions" value={t.recs} onChange={() => tog('recs')} />
        <ToggleRow label="Auto-categorize Receipts" sub="Automatically categorize items from receipts" value={t.autocat} onChange={() => tog('autocat')} />
        <ToggleRow label="Spending Analytics" sub="Track and analyze your spending patterns" value={t.analytics} onChange={() => tog('analytics')} />
        <ToggleRow label="Weekly Digest" sub="Get a weekly email digest of your activity" value={t.digest} onChange={() => tog('digest')} />
      </div>

      <SectionHeader title="Display Preferences" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
        <SelectRow label="Default View" sub="Choose your preferred dashboard view" options={['Overview', 'Detailed', 'Compact']} value="Overview" />
        <SelectRow label="Items Per Page" sub="Number of items to show per page" options={['10', '20', '50']} value="20" />
        <SelectRow label="Default Sort" sub="Default sorting for lists" options={['Date', 'Amount', 'Category']} value="Date" />
      </div>
      <SaveBtn onClick={save} saved={saved} />
    </div>
  );
}

// ─── Budget & Goals ───────────────────────────────────────────────────────────

function BudgetSection() {
  const [saved, setSaved] = useState(false);
  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  const categories = [
    { label: 'Groceries', budget: 3000, spent: 2400, color: '#154539' },
    { label: 'Daily Needs', budget: 1500, spent: 900, color: '#3B82F6' },
    { label: 'Snacks & Beverages', budget: 800, spent: 1200, color: '#F59E0B' },
    { label: 'Household', budget: 1000, spent: 600, color: '#8B5CF6' },
  ];

  return (
    <div>
      <SectionHeader title="Monthly Budget" />
      <div style={{ background: '#FFF', borderRadius: 16, padding: '24px', border: '1px solid #F1F5F9', marginBottom: 32 }}>
        <label style={labelStyle}>Total Monthly Budget</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <span style={{ fontSize: 22, fontWeight: 800, color: '#154539' }}>₹</span>
          <input defaultValue="8,000" style={{ fontSize: 22, fontWeight: 800, color: '#0F172A', border: 'none', outline: 'none', width: 140, fontFamily: "'Inter', sans-serif" }} />
        </div>
        <div style={{ fontSize: 12, color: '#94A3B8' }}>You have spent ₹6,539 of ₹8,000 this month (81.7%)</div>
        <div style={{ height: 8, background: '#F1F5F9', borderRadius: 999, overflow: 'hidden', marginTop: 12 }}>
          <div style={{ height: '100%', width: '81.7%', background: 'linear-gradient(90deg, #154539, #10B981)', borderRadius: 999 }} />
        </div>
      </div>

      <SectionHeader title="Category Budgets" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 24 }}>
        {categories.map((cat, i) => {
          const pct = Math.min((cat.spent / cat.budget) * 100, 100);
          const over = cat.spent > cat.budget;
          return (
            <div key={i} style={{ background: '#FFF', borderRadius: 14, padding: '16px 20px', border: '1px solid #F1F5F9' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: '#0F172A' }}>{cat.label}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: over ? '#EF4444' : '#64748B' }}>₹{cat.spent.toLocaleString()} / ₹{cat.budget.toLocaleString()}</span>
              </div>
              <div style={{ height: 6, background: '#F1F5F9', borderRadius: 999, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${pct}%`, background: over ? '#EF4444' : cat.color, borderRadius: 999 }} />
              </div>
            </div>
          );
        })}
      </div>
      <SaveBtn onClick={save} saved={saved} />
    </div>
  );
}

// ─── Connected Apps ───────────────────────────────────────────────────────────

function ConnectedSection() {
  const apps = [
    { name: 'Blinkit', emoji: '🛒', connected: true, since: 'Connected Jan 2025', color: '#FBBF24' },
    { name: 'Zepto', emoji: '⚡', connected: true, since: 'Connected Feb 2025', color: '#8B5CF6' },
    { name: 'Swiggy Instamart', emoji: '🍔', connected: false, since: 'Not connected', color: '#F97316' },
    { name: 'BigBasket', emoji: '🧺', connected: false, since: 'Not connected', color: '#10B981' },
    { name: 'JioMart', emoji: '🏪', connected: false, since: 'Not connected', color: '#3B82F6' },
  ];

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
            <button style={{ padding: '8px 18px', borderRadius: 10, fontSize: 12, fontWeight: 700, cursor: 'pointer', border: app.connected ? '1px solid #FEE2E2' : '1px solid #D1FAE5', background: app.connected ? '#FEF2F2' : '#F0FDF4', color: app.connected ? '#EF4444' : '#154539' }}>
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

// ─── Section Header ───────────────────────────────────────────────────────────

function SectionHeader({ title, sub }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <h2 style={{ fontSize: 17, fontWeight: 700, color: '#0F172A', margin: 0 }}>{title}</h2>
      {sub && <p style={{ fontSize: 12, color: '#94A3B8', margin: '4px 0 0' }}>{sub}</p>}
    </div>
  );
}

// ─── Right Panel ──────────────────────────────────────────────────────────────

function SettingsRightPanel() {
  const used = 2.4;
  const total = 10;
  return (
    <div style={{ width: 270, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Account Summary */}
      <div style={{ background: '#FFF', borderRadius: 20, padding: '20px', border: '1px solid #F1F5F9', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A', marginBottom: 16 }}>Account Summary</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#E2E8F0', overflow: 'hidden' }}>
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Shubham" alt="User" style={{ width: '100%', height: '100%' }} />
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A' }}>Shubham Hegishte</div>
            <div style={{ fontSize: 12, color: '#F59E0B', fontWeight: 600 }}>Free Plan</div>
          </div>
        </div>
        <button style={{ width: '100%', padding: '10px 0', background: 'linear-gradient(135deg, #154539, #0F3028)', color: '#FFF', border: 'none', borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          Upgrade to Premium <ChevronRight size={14} />
        </button>
      </div>

      {/* Storage */}
      <div style={{ background: '#FFF', borderRadius: 20, padding: '20px', border: '1px solid #F1F5F9', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A' }}>Storage Usage</div>
          <span style={{ fontSize: 11, color: '#94A3B8', fontWeight: 600 }}>{used} GB / {total} GB used</span>
        </div>
        <div style={{ height: 8, background: '#F1F5F9', borderRadius: 999, overflow: 'hidden', marginBottom: 6 }}>
          <div style={{ height: '100%', width: `${(used / total) * 100}%`, background: 'linear-gradient(90deg, #154539, #10B981)', borderRadius: 999 }} />
        </div>
        <div style={{ textAlign: 'right', fontSize: 11, color: '#10B981', fontWeight: 600 }}>24%</div>
      </div>

      {/* Quick Actions */}
      <div style={{ background: '#FFF', borderRadius: 20, padding: '20px', border: '1px solid #F1F5F9', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A', marginBottom: 14 }}>Quick Actions</div>
        {[
          { icon: Download, label: 'Download My Data' },
          { icon: Trash2, label: 'Clear Cache' },
          { icon: Smartphone, label: 'Manage Devices' },
          { icon: HelpCircle, label: 'Help & Support' },
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

      {/* About */}
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

// ─── Settings Page ────────────────────────────────────────────────────────────

const sectionComponents = {
  general: GeneralSection,
  notifications: NotificationsSection,
  privacy: PrivacySection,
  account: AccountSection,
  data: DataSection,
  preferences: PreferencesSection,
  budget: BudgetSection,
  connected: ConnectedSection,
  about: AboutSection,
};

export default function Settings() {
  const { section = 'general' } = useParams();
  const navigate = useNavigate();
  const ActiveSection = sectionComponents[section] || GeneralSection;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#FAFCFC', fontFamily: "'Inter', sans-serif" }}>
      <Sidebar />

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto', height: '100vh' }}>
        <TopNav titleNode={
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
              <h1 style={{ fontSize: 26, fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.5px' }}>Settings</h1>
              <SettingsIcon size={20} color="#64748B" />
            </div>
            <p style={{ fontSize: 14, color: '#64748B', margin: 0 }}>Manage your preferences and app configurations.</p>
          </div>
        } />

        <div style={{ padding: '0 40px 48px' }}>

          <div style={{ display: 'flex', gap: 24 }}>
            {/* Settings Sub-Nav */}
            <div style={{ width: 210, flexShrink: 0 }}>
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
              <motion.div key={section} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
                <ActiveSection />
              </motion.div>
            </div>

            {/* Right Panel */}
            <SettingsRightPanel />
          </div>
        </div>
      </main>
    </div>
  );
}
