import { useState } from 'react';
import Sidebar from '../../components/User/Sidebar';
import TopNav from '../../components/User/TopNav';
import { motion } from 'framer-motion';
import {
  Edit2, Mail, Phone, MapPin, Camera, Star, ReceiptText,
  TrendingUp, Package, ChevronRight, Download, CreditCard,
  HelpCircle, Trash2, User, Shield, Link, Activity,
  Flame, Save, Check
} from 'lucide-react';

// ─── Tabs ─────────────────────────────────────────────────────────────────────

const tabs = [
  { id: 'personal', label: 'Personal Info', icon: User },
  { id: 'preferences', label: 'Preferences', icon: Star },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'connected', label: 'Connected Accounts', icon: Link },
  { id: 'activity', label: 'Activity', icon: Activity },
];

// ─── Personal Info Tab ────────────────────────────────────────────────────────

function PersonalInfoTab() {
  const [bio, setBio] = useState('');
  const [gender, setGender] = useState('Male');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0F172A', marginBottom: 24 }}>Personal Information</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <Field label="Full Name" value="Shubham Hegishte" />
          <Field label="Email Address" value="shubhamhegishte16@gmail.com" disabled />
          <Field label="Phone Number" value="+91 98765 43210" />
          <div>
            <label style={labelStyle}>Location</label>
            <div style={{ ...inputStyle, display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
              <span style={{ fontSize: 14, color: '#0F172A' }}>Badlapur, Thane, Maharashtra, India</span>
              <ChevronRight size={15} color="#94A3B8" />
            </div>
          </div>
          <div>
            <label style={labelStyle}>Date of Birth</label>
            <div style={{ ...inputStyle, display: 'flex', alignItems: 'center', gap: 10 }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
              <span style={{ fontSize: 14, color: '#0F172A' }}>16 Aug 2004</span>
            </div>
          </div>
          <div>
            <label style={labelStyle}>Gender</label>
            <div style={{ display: 'flex', gap: 10 }}>
              {['Male', 'Female', 'Prefer not to say'].map(g => (
                <button key={g} onClick={() => setGender(g)} style={{
                  padding: '10px 16px', borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer',
                  border: gender === g ? '2px solid #154539' : '1px solid #E2E8F0',
                  background: gender === g ? '#F0FDF4' : '#FFF',
                  color: gender === g ? '#154539' : '#64748B',
                  display: 'flex', alignItems: 'center', gap: 6,
                }}>
                  {gender === g && <Check size={13} />} {g}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div style={{ marginTop: 20 }}>
          <label style={labelStyle}>Bio</label>
          <textarea
            value={bio}
            onChange={e => setBio(e.target.value.slice(0, 150))}
            placeholder="Tell us something about yourself..."
            rows={4}
            style={{ ...inputStyle, resize: 'none', height: 100, fontSize: 14, fontFamily: "'Inter', sans-serif" }}
          />
          <div style={{ textAlign: 'right', fontSize: 12, color: '#94A3B8', marginTop: 4 }}>{bio.length}/150</div>
        </div>

        <button onClick={handleSave} style={{
          marginTop: 20, padding: '12px 28px',
          background: saved ? '#10B981' : 'linear-gradient(135deg, #154539, #0F3028)',
          color: '#FFF', border: 'none', borderRadius: 12,
          fontSize: 14, fontWeight: 700, cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 8,
          transition: 'background 0.3s',
        }}>
          {saved ? <Check size={16} /> : <Save size={16} />}
          {saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      {/* My Preferences */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0F172A', margin: 0 }}>My Preferences</h2>
          <button style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600, color: '#154539', background: 'none', border: 'none', cursor: 'pointer' }}>
            Manage Preferences <ChevronRight size={14} />
          </button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {[
            { label: 'Currency', value: 'INR (₹)', icon: '💱' },
            { label: 'Language', value: 'English', icon: '🌐' },
            { label: 'Notifications', value: 'Email & Push', icon: '🔔' },
            { label: 'Monthly Budget', value: '₹8,000', icon: '💰' },
          ].map((pref, i) => (
            <div key={i} style={{ background: '#F8FAFC', borderRadius: 14, padding: '16px 18px', border: '1px solid #F1F5F9' }}>
              <div style={{ fontSize: 20, marginBottom: 8 }}>{pref.icon}</div>
              <div style={{ fontSize: 11, color: '#94A3B8', fontWeight: 600, marginBottom: 4 }}>{pref.label}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A' }}>{pref.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, disabled }) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <input defaultValue={value} disabled={disabled} style={{ ...inputStyle, color: disabled ? '#94A3B8' : '#0F172A', background: disabled ? '#F8FAFC' : '#FFF' }} />
    </div>
  );
}

const labelStyle = { display: 'block', fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 8 };
const inputStyle = { width: '100%', padding: '11px 14px', border: '1px solid #E2E8F0', borderRadius: 10, fontSize: 14, outline: 'none', fontFamily: "'Inter', sans-serif", boxSizing: 'border-box' };

// ─── Security Tab ─────────────────────────────────────────────────────────────

function SecurityTab() {
  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0F172A', marginBottom: 24 }}>Security Settings</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {[
          { title: 'Change Password', sub: 'Last changed 3 months ago', badge: null },
          { title: 'Two-Factor Authentication', sub: 'Add an extra layer of security', badge: 'Recommended' },
          { title: 'Active Sessions', sub: '2 devices currently logged in', badge: null },
          { title: 'Login History', sub: 'View recent login activity', badge: null },
        ].map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 20px', background: '#FFF', borderRadius: 14, border: '1px solid #F1F5F9', boxShadow: '0 2px 8px rgba(0,0,0,0.03)', cursor: 'pointer' }}
            onMouseEnter={e => e.currentTarget.style.borderColor = '#E2E8F0'}
            onMouseLeave={e => e.currentTarget.style.borderColor = '#F1F5F9'}
          >
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A', marginBottom: 3, display: 'flex', alignItems: 'center', gap: 10 }}>
                {item.title}
                {item.badge && <span style={{ fontSize: 10, fontWeight: 700, color: '#10B981', background: '#D1FAE5', padding: '2px 8px', borderRadius: 20 }}>{item.badge}</span>}
              </div>
              <div style={{ fontSize: 12, color: '#94A3B8' }}>{item.sub}</div>
            </div>
            <ChevronRight size={16} color="#CBD5E1" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Preferences Tab ──────────────────────────────────────────────────────────

function PreferencesTab() {
  const [toggles, setToggles] = useState({ recommendations: true, alerts: true, darkMode: false, weekly: true });
  const toggle = key => setToggles(prev => ({ ...prev, [key]: !prev[key] }));

  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0F172A', marginBottom: 24 }}>App Preferences</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {[
          { key: 'recommendations', label: 'Smart Recommendations', sub: 'Get AI-powered product suggestions' },
          { key: 'alerts', label: 'Price Drop Alerts', sub: 'Notify me when prices drop' },
          { key: 'darkMode', label: 'Dark Mode', sub: 'Switch to dark theme' },
          { key: 'weekly', label: 'Weekly Spending Summary', sub: 'Receive weekly email reports' },
        ].map(item => (
          <div key={item.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', background: '#FFF', borderRadius: 14, border: '1px solid #F1F5F9' }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#0F172A', marginBottom: 2 }}>{item.label}</div>
              <div style={{ fontSize: 12, color: '#94A3B8' }}>{item.sub}</div>
            </div>
            <div onClick={() => toggle(item.key)} style={{ width: 44, height: 24, borderRadius: 12, background: toggles[item.key] ? '#154539' : '#E2E8F0', cursor: 'pointer', position: 'relative', transition: 'background 0.2s', flexShrink: 0 }}>
              <div style={{ position: 'absolute', top: 3, left: toggles[item.key] ? 23 : 3, width: 18, height: 18, borderRadius: '50%', background: '#FFF', transition: 'left 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Connected Accounts Tab ───────────────────────────────────────────────────

function ConnectedTab() {
  const platforms = [
    { name: 'Blinkit', color: '#FBBF24', connected: true, since: 'Connected Jan 2025' },
    { name: 'Zepto', color: '#8B5CF6', connected: true, since: 'Connected Feb 2025' },
    { name: 'Swiggy Instamart', color: '#F97316', connected: false, since: 'Not connected' },
    { name: 'BigBasket', color: '#10B981', connected: false, since: 'Not connected' },
  ];
  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0F172A', marginBottom: 24 }}>Connected Accounts</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {platforms.map((p, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', background: '#FFF', borderRadius: 14, border: '1px solid #F1F5F9' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: p.color + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 800, color: p.color }}>
                {p.name[0]}
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A' }}>{p.name}</div>
                <div style={{ fontSize: 12, color: p.connected ? '#10B981' : '#94A3B8' }}>{p.since}</div>
              </div>
            </div>
            <button style={{ padding: '8px 18px', borderRadius: 10, fontSize: 12, fontWeight: 700, cursor: 'pointer', border: p.connected ? '1px solid #FEE2E2' : '1px solid #E2E8F0', background: p.connected ? '#FEF2F2' : '#F0FDF4', color: p.connected ? '#EF4444' : '#154539' }}>
              {p.connected ? 'Disconnect' : 'Connect'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Activity Tab ─────────────────────────────────────────────────────────────

function ActivityTab() {
  const events = [
    { label: 'Receipt scanned from Blinkit', time: '10:30 AM, Today', color: '#10B981' },
    { label: 'Price comparison searched', time: '9:15 AM, Today', color: '#3B82F6' },
    { label: 'Pantry item added – Aashirvaad Atta', time: 'Yesterday, 6 PM', color: '#8B5CF6' },
    { label: 'Savings insight generated', time: 'Yesterday, 3 PM', color: '#F59E0B' },
    { label: 'Receipt scanned from Zepto', time: '2 days ago', color: '#10B981' },
  ];
  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0F172A', marginBottom: 24 }}>Recent Activity</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {events.map((ev, i) => (
          <div key={i} style={{ display: 'flex', gap: 16, paddingBottom: 20, position: 'relative' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: ev.color, flexShrink: 0, marginTop: 3 }} />
              {i < events.length - 1 && <div style={{ width: 2, flex: 1, background: '#F1F5F9', marginTop: 4 }} />}
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#0F172A', marginBottom: 2 }}>{ev.label}</div>
              <div style={{ fontSize: 12, color: '#94A3B8' }}>{ev.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Right Panel ──────────────────────────────────────────────────────────────

function ProfileRightPanel() {
  return (
    <div style={{ width: 290, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Shopping Summary */}
      <div style={{ background: '#FFF', borderRadius: 20, padding: '24px', border: '1px solid #F1F5F9', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: '#0F172A' }}>Shopping Summary</span>
          <button style={{ fontSize: 12, fontWeight: 600, color: '#154539', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
            View Insights <ChevronRight size={12} />
          </button>
        </div>
        {[
          { icon: ReceiptText, color: '#3B82F6', label: 'Receipts Scanned', value: '42' },
          { icon: TrendingUp, color: '#10B981', label: 'Total Spent', value: '₹12,846' },
          { icon: Star, color: '#F59E0B', label: 'Total Savings', value: '₹1,284' },
          { icon: Package, color: '#8B5CF6', label: 'Items Tracked in Pantry', value: '58' },
        ].map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: i < 3 ? '1px solid #F8FAFC' : 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <item.icon size={16} color={item.color} />
              <span style={{ fontSize: 13, color: '#475569', fontWeight: 500 }}>{item.label}</span>
            </div>
            <span style={{ fontSize: 14, fontWeight: 700, color: '#0F172A' }}>{item.value}</span>
          </div>
        ))}
        {/* Shopping Score */}
        <div style={{ marginTop: 16, padding: '14px 16px', background: '#FAFCFC', borderRadius: 12, border: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 44, height: 44, borderRadius: '50%', border: '3px solid #154539', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: '#154539' }}>94%</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>Shopping Score</div>
            <div style={{ fontSize: 11, color: '#10B981', fontWeight: 700 }}>94/100 · EXCELLENT</div>
          </div>
          <div style={{ marginLeft: 'auto', fontSize: 20 }}>📈</div>
        </div>
        <div style={{ marginTop: 12, padding: '12px 14px', background: '#F0FDF4', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 16 }}>💡</span>
          <span style={{ fontSize: 12, color: '#154539', fontWeight: 500, lineHeight: 1.4 }}>Great Job! You're making smart shopping choices.</span>
          <TrendingUp size={16} color="#10B981" style={{ marginLeft: 'auto', flexShrink: 0 }} />
        </div>
      </div>

      {/* Account Actions */}
      <div style={{ background: '#FFF', borderRadius: 20, padding: '24px', border: '1px solid #F1F5F9', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', marginBottom: 16 }}>Account Actions</div>
        {[
          { icon: Download, label: 'Download My Data', color: '#334155' },
          { icon: CreditCard, label: 'Manage Subscription', color: '#334155' },
          { icon: HelpCircle, label: 'Help & Support', color: '#334155' },
          { icon: Trash2, label: 'Delete Account', color: '#EF4444' },
        ].map((action, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: i < 3 ? '1px solid #F8FAFC' : 'none', cursor: 'pointer' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <action.icon size={16} color={action.color} />
              <span style={{ fontSize: 13, fontWeight: 600, color: action.color }}>{action.label}</span>
            </div>
            <ChevronRight size={14} color="#CBD5E1" />
          </div>
        ))}
      </div>

      {/* About */}
      <div style={{ background: '#F0FDF4', borderRadius: 20, padding: '20px 24px', border: '1px solid #D1FAE5' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: '#154539', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Flame size={16} color="#FFF" />
          </div>
          <span style={{ fontSize: 14, fontWeight: 700, color: '#154539' }}>About ShopSense AI</span>
        </div>
        <p style={{ fontSize: 12, color: '#475569', lineHeight: 1.6, margin: '0 0 10px 0' }}>Your AI powered shopping companion that helps you save more and spend smarter.</p>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#94A3B8' }}>
          <span>Version 1.0.0</span>
          <span>© 2025 ShopSense AI</span>
        </div>
      </div>
    </div>
  );
}

// ─── Profile Page ─────────────────────────────────────────────────────────────

export default function Profile() {
  const [activeTab, setActiveTab] = useState('personal');

  const renderTab = () => {
    switch (activeTab) {
      case 'personal': return <PersonalInfoTab />;
      case 'preferences': return <PreferencesTab />;
      case 'security': return <SecurityTab />;
      case 'connected': return <ConnectedTab />;
      case 'activity': return <ActivityTab />;
      default: return <PersonalInfoTab />;
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#FAFCFC', fontFamily: "'Inter', sans-serif" }}>
      <Sidebar />

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto', height: '100vh' }}>
        <TopNav />

        <div style={{ padding: '32px 40px 48px' }}>
          {/* Page Header */}
          <div style={{ marginBottom: 28 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
              <h1 style={{ fontSize: 26, fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.5px' }}>My Profile</h1>
              <User size={20} color="#64748B" />
            </div>
            <p style={{ fontSize: 14, color: '#64748B', margin: 0 }}>Manage your personal information and preferences.</p>
          </div>

          <div style={{ display: 'flex', gap: 28 }}>
            {/* Main Content */}
            <div style={{ flex: 1, minWidth: 0 }}>
              {/* Profile Card */}
              <div style={{ background: '#FFF', borderRadius: 20, padding: '28px', border: '1px solid #F1F5F9', boxShadow: '0 2px 12px rgba(0,0,0,0.04)', marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                  {/* Avatar */}
                  <div style={{ position: 'relative' }}>
                    <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#E2E8F0', overflow: 'hidden', border: '3px solid #F0FDF4' }}>
                      <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Shubham" alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div style={{ position: 'absolute', bottom: 0, right: 0, width: 26, height: 26, borderRadius: '50%', background: '#154539', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #FFF', cursor: 'pointer' }}>
                      <Camera size={12} color="#FFF" />
                    </div>
                  </div>
                  {/* Info */}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                      <span style={{ fontSize: 22, fontWeight: 800, color: '#0F172A' }}>Shubham Hegishte</span>
                      <button style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 8, border: '1px solid #E2E8F0', background: '#FAFCFC', fontSize: 12, fontWeight: 600, color: '#334155', cursor: 'pointer' }}>
                        <Edit2 size={11} /> Edit
                      </button>
                    </div>
                    <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                      {[
                        { icon: Mail, text: 'shubhamhegishte16@gmail.com' },
                        { icon: Phone, text: '+91 98765 43210' },
                        { icon: MapPin, text: 'Badlapur, Thane, Maharashtra, India' },
                      ].map((item, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#64748B' }}>
                          <item.icon size={13} color="#94A3B8" />{item.text}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Account Status */}
                <div style={{ textAlign: 'center', flexShrink: 0 }}>
                  <div style={{ fontSize: 11, color: '#94A3B8', fontWeight: 600, marginBottom: 10 }}>Account Status</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '6px 14px', border: '1px solid #E2E8F0', borderRadius: 20, marginBottom: 10, background: '#FAFCFC' }}>
                    <Flame size={14} color="#F59E0B" />
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#334155' }}>Free Plan</span>
                  </div>
                  <p style={{ fontSize: 11, color: '#94A3B8', margin: '0 0 12px', lineHeight: 1.4 }}>Upgrade to Premium for advanced AI insights and unlimited features.</p>
                  <button style={{ padding: '9px 20px', background: 'linear-gradient(135deg, #154539, #0F3028)', color: '#FFF', border: 'none', borderRadius: 10, fontSize: 12, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                    Upgrade Now <ChevronRight size={14} />
                  </button>
                </div>
              </div>

              {/* Tabs */}
              <div style={{ display: 'flex', gap: 4, background: '#F8FAFC', borderRadius: 14, padding: 6, marginBottom: 28, border: '1px solid #F1F5F9' }}>
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    style={{
                      flex: 1, padding: '10px 8px', borderRadius: 10, border: 'none', cursor: 'pointer',
                      background: activeTab === tab.id ? '#FFF' : 'transparent',
                      color: activeTab === tab.id ? '#154539' : '#64748B',
                      fontWeight: activeTab === tab.id ? 700 : 500,
                      fontSize: 13, transition: 'all 0.2s',
                      boxShadow: activeTab === tab.id ? '0 1px 6px rgba(0,0,0,0.08)' : 'none',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    <tab.icon size={14} />{tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div style={{ background: '#FFF', borderRadius: 20, padding: '28px', border: '1px solid #F1F5F9', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
                <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
                  {renderTab()}
                </motion.div>
              </div>
            </div>

            {/* Right Panel */}
            <ProfileRightPanel />
          </div>
        </div>
      </main>
    </div>
  );
}
