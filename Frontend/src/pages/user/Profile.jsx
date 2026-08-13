import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Sidebar from '../../components/User/Sidebar';
import TopNav from '../../components/User/TopNav';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail, Phone, MapPin, Camera, Star, ReceiptText,
  TrendingUp, Package, ChevronRight, Download, CreditCard,
  HelpCircle, Trash2, User, Shield, Activity,
  Flame, Save, Check, Bell, Globe, Wallet, Zap, Tag,
  Clock
} from 'lucide-react';

const API = 'http://localhost:5000';
const getToken = () => localStorage.getItem('shopsense_token');

// ─── Tabs (no Connected Accounts) ────────────────────────────────────────────
const tabs = [
  { id: 'personal',     label: 'Personal Info',  icon: User },
  { id: 'preferences',  label: 'Preferences',    icon: Star },
  { id: 'security',     label: 'Security',        icon: Shield },
  { id: 'activity',     label: 'Activity',        icon: Activity },
];

// ─── Avatar Helper ────────────────────────────────────────────────────────────
function getAvatarInitial(name) {
  if (!name) return 'U';
  return name.charAt(0).toUpperCase();
}

// ─── Shared Styles ────────────────────────────────────────────────────────────
const labelStyle = {
  display: 'block', fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 8,
};
const inputStyle = {
  width: '100%', padding: '11px 14px', border: '1px solid #E2E8F0',
  borderRadius: 10, fontSize: 14, outline: 'none',
  fontFamily: "'Inter', sans-serif", boxSizing: 'border-box',
};

function Field({ label, name, value, onChange, disabled, placeholder, type = 'text' }) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <input
        type={type} name={name} value={value}
        onChange={onChange} placeholder={placeholder} disabled={disabled}
        style={{ ...inputStyle, color: disabled ? '#94A3B8' : '#0F172A', background: disabled ? '#F8FAFC' : '#FFF' }}
      />
    </div>
  );
}

// ─── Personal Info Tab ────────────────────────────────────────────────────────
function PersonalInfoTab({ user, onUpdateUser }) {
  const [form, setForm] = useState({ fullName: '', phone: '', location: '', dateOfBirth: '', gender: '', bio: '' });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!user) return;
    setForm({
      fullName: user.fullName || '',
      phone: user.phone || '',
      location: user.location || '',
      dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : '',
      gender: user.gender || '',
      bio: user.bio || '',
    });
  }, [user]);

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await axios.put(`${API}/api/profile`, form, { headers: { Authorization: `Bearer ${getToken()}` } });
      if (res.data.success) {
        onUpdateUser(res.data.user);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update profile');
    } finally { setSaving(false); }
  };

  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0F172A', marginBottom: 24 }}>Personal Information</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <Field label="Full Name" name="fullName" value={form.fullName} onChange={handleChange} />
        <Field label="Email Address" value={user?.email || ''} disabled />
        <Field label="Phone Number" name="phone" value={form.phone} onChange={handleChange} placeholder="+91 XXXXXXXXXX" />
        <Field label="Location" name="location" value={form.location} onChange={handleChange} placeholder="City, Country" />
        <div>
          <label style={labelStyle}>Date of Birth</label>
          <input type="date" name="dateOfBirth" value={form.dateOfBirth} onChange={handleChange} style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Gender</label>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {['Male', 'Female', 'Prefer not to say'].map(g => (
              <button key={g} onClick={() => setForm(p => ({ ...p, gender: g }))} style={{
                padding: '9px 14px', borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer',
                border: form.gender === g ? '2px solid #154539' : '1px solid #E2E8F0',
                background: form.gender === g ? '#F0FDF4' : '#FFF',
                color: form.gender === g ? '#154539' : '#64748B',
                display: 'flex', alignItems: 'center', gap: 5,
              }}>
                {form.gender === g && <Check size={12} />}{g}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div style={{ marginTop: 20 }}>
        <label style={labelStyle}>Bio</label>
        <textarea name="bio" value={form.bio} onChange={handleChange} placeholder="Tell us something about yourself..." rows={4} maxLength={150}
          style={{ ...inputStyle, resize: 'none', height: 100, fontSize: 14 }} />
        <div style={{ textAlign: 'right', fontSize: 12, color: '#94A3B8', marginTop: 4 }}>{form.bio.length}/150</div>
      </div>
      <button onClick={handleSave} disabled={saving} style={{
        marginTop: 20, padding: '12px 28px',
        background: saved ? '#10B981' : 'linear-gradient(135deg, #154539, #0F3028)',
        color: '#FFF', border: 'none', borderRadius: 12,
        fontSize: 14, fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer',
        display: 'flex', alignItems: 'center', gap: 8, opacity: saving ? 0.7 : 1,
      }}>
        {saved ? <Check size={16} /> : <Save size={16} />}
        {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
      </button>
    </div>
  );
}

// ─── Preferences Tab ──────────────────────────────────────────────────────────
function PreferencesTab({ user, onUpdateUser }) {
  const prefs = user?.preferences || {};
  const [saving, setSaving] = useState(null); // key being saved

  const updatePref = async (key, value) => {
    setSaving(key);
    try {
      const res = await axios.put(`${API}/api/profile/preferences`, { [key]: value }, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      if (res.data.success) onUpdateUser(res.data.user);
    } catch (err) {
      console.error('Pref update failed', err);
    } finally { setSaving(null); }
  };

  const Toggle = ({ prefKey, label, sub, icon: Icon, color }) => {
    const val = prefs[prefKey] ?? true;
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', background: '#FFF', borderRadius: 14, border: '1px solid #F1F5F9', boxShadow: '0 1px 4px rgba(0,0,0,0.03)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: color + '15', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Icon size={17} color={color} />
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#0F172A', marginBottom: 2 }}>{label}</div>
            <div style={{ fontSize: 12, color: '#94A3B8' }}>{sub}</div>
          </div>
        </div>
        <div onClick={() => saving !== prefKey && updatePref(prefKey, !val)} style={{
          width: 44, height: 24, borderRadius: 12,
          background: val ? '#154539' : '#E2E8F0',
          cursor: saving === prefKey ? 'not-allowed' : 'pointer',
          position: 'relative', transition: 'background 0.25s', flexShrink: 0,
          opacity: saving === prefKey ? 0.6 : 1,
        }}>
          <div style={{ position: 'absolute', top: 3, left: val ? 23 : 3, width: 18, height: 18, borderRadius: '50%', background: '#FFF', transition: 'left 0.25s', boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }} />
        </div>
      </div>
    );
  };

  const [budgetEdit, setBudgetEdit] = useState(false);
  const [budgetVal, setBudgetVal] = useState(prefs.monthlyBudget || 8000);

  useEffect(() => { setBudgetVal(prefs.monthlyBudget || 8000); }, [prefs.monthlyBudget]);

  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0F172A', marginBottom: 6 }}>App Preferences</h2>
      <p style={{ fontSize: 13, color: '#94A3B8', marginBottom: 24 }}>Changes are saved automatically when you toggle a setting.</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
        <Toggle prefKey="smartRecommendations" label="Smart Recommendations" sub="Get AI-powered product suggestions" icon={Zap} color="#8B5CF6" />
        <Toggle prefKey="priceDropAlerts" label="Price Drop Alerts" sub="Notify me when prices drop" icon={Tag} color="#F59E0B" />
        <Toggle prefKey="weeklySummary" label="Weekly Spending Summary" sub="Receive weekly email reports" icon={Bell} color="#3B82F6" />
        <Toggle prefKey="darkMode" label="Dark Mode" sub="Switch to dark theme" icon={Globe} color="#64748B" />
      </div>

      <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0F172A', marginBottom: 20 }}>Shopping Settings</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {/* Currency */}
        <div style={{ background: '#F8FAFC', borderRadius: 14, padding: '16px 18px', border: '1px solid #F1F5F9' }}>
          <div style={{ fontSize: 20, marginBottom: 8 }}>💱</div>
          <div style={{ fontSize: 11, color: '#94A3B8', fontWeight: 600, marginBottom: 4 }}>Currency</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A' }}>{prefs.currency || 'INR (₹)'}</div>
        </div>
        {/* Language */}
        <div style={{ background: '#F8FAFC', borderRadius: 14, padding: '16px 18px', border: '1px solid #F1F5F9' }}>
          <div style={{ fontSize: 20, marginBottom: 8 }}>🌐</div>
          <div style={{ fontSize: 11, color: '#94A3B8', fontWeight: 600, marginBottom: 4 }}>Language</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A' }}>{prefs.language || 'English'}</div>
        </div>
        {/* Monthly Budget */}
        <div style={{ background: '#F8FAFC', borderRadius: 14, padding: '16px 18px', border: '1px solid #F1F5F9' }}>
          <div style={{ fontSize: 20, marginBottom: 8 }}>💰</div>
          <div style={{ fontSize: 11, color: '#94A3B8', fontWeight: 600, marginBottom: 4 }}>Monthly Budget</div>
          {budgetEdit ? (
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <input
                type="number" value={budgetVal}
                onChange={e => setBudgetVal(Number(e.target.value))}
                style={{ width: 80, padding: '4px 8px', border: '1px solid #E2E8F0', borderRadius: 6, fontSize: 13, outline: 'none' }}
              />
              <button onClick={async () => { await updatePref('monthlyBudget', budgetVal); setBudgetEdit(false); }}
                style={{ padding: '4px 8px', background: '#154539', color: '#FFF', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>
                Save
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A' }}>₹{(prefs.monthlyBudget || 8000).toLocaleString()}</div>
              <button onClick={() => setBudgetEdit(true)}
                style={{ padding: '2px 7px', background: 'none', border: '1px solid #E2E8F0', borderRadius: 6, cursor: 'pointer', fontSize: 11, color: '#64748B', fontWeight: 600 }}>
                Edit
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Security Tab ─────────────────────────────────────────────────────────────
function SecurityTab() {
  const [showPwdForm, setShowPwdForm] = useState(false);
  const [pwdData, setPwdData] = useState({ currentPassword: '', newPassword: '' });
  const [msg, setMsg] = useState({ type: '', text: '' });
  const [saving, setSaving] = useState(false);

  const handlePwdChange = async e => {
    e.preventDefault();
    setMsg({ type: '', text: '' });
    if (pwdData.newPassword.length < 6) return setMsg({ type: 'error', text: 'New password must be at least 6 characters.' });
    setSaving(true);
    try {
      const res = await axios.put(`${API}/api/profile/password`, pwdData, { headers: { Authorization: `Bearer ${getToken()}` } });
      if (res.data.success) {
        setMsg({ type: 'success', text: 'Password updated successfully!' });
        setPwdData({ currentPassword: '', newPassword: '' });
        setTimeout(() => setShowPwdForm(false), 2000);
      }
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Failed to update password' });
    } finally { setSaving(false); }
  };

  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0F172A', marginBottom: 24 }}>Security Settings</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Change Password — expandable */}
        <div style={{ background: '#FFF', borderRadius: 14, border: '1px solid #F1F5F9', boxShadow: '0 2px 8px rgba(0,0,0,0.03)', overflow: 'hidden' }}>
          <div onClick={() => setShowPwdForm(!showPwdForm)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 20px', cursor: 'pointer', background: showPwdForm ? '#F8FAFC' : '#FFF' }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A', marginBottom: 3 }}>Change Password</div>
              <div style={{ fontSize: 12, color: '#94A3B8' }}>Update your account password securely</div>
            </div>
            <ChevronRight size={16} color="#CBD5E1" style={{ transform: showPwdForm ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }} />
          </div>
          <AnimatePresence>
            {showPwdForm && (
              <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} style={{ overflow: 'hidden' }}>
                <form onSubmit={handlePwdChange} style={{ padding: '20px', borderTop: '1px solid #E2E8F0' }}>
                  {msg.text && (
                    <div style={{ padding: 10, borderRadius: 8, marginBottom: 14, fontSize: 13, fontWeight: 600, background: msg.type === 'error' ? '#FEF2F2' : '#F0FDF4', color: msg.type === 'error' ? '#EF4444' : '#10B981' }}>
                      {msg.text}
                    </div>
                  )}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 16 }}>
                    <div>
                      <label style={labelStyle}>Current Password</label>
                      <input type="password" value={pwdData.currentPassword} onChange={e => setPwdData(p => ({ ...p, currentPassword: e.target.value }))} style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>New Password</label>
                      <input type="password" value={pwdData.newPassword} onChange={e => setPwdData(p => ({ ...p, newPassword: e.target.value }))} style={inputStyle} />
                    </div>
                  </div>
                  <button type="submit" disabled={saving} style={{ padding: '10px 22px', background: '#154539', color: '#FFF', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1 }}>
                    {saving ? 'Updating...' : 'Update Password'}
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {[
          { title: 'Two-Factor Authentication', sub: 'Add an extra layer of security', badge: 'Recommended' },
          { title: 'Active Sessions', sub: '2 devices currently logged in', badge: null },
        ].map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 20px', background: '#FFF', borderRadius: 14, border: '1px solid #F1F5F9', cursor: 'pointer' }}>
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

// ─── Activity Tab ─────────────────────────────────────────────────────────────
const iconMap = { ReceiptText, Package, TrendingUp, Clock };

function ActivityTab() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get(`${API}/api/profile/activity`, { headers: { Authorization: `Bearer ${getToken()}` } });
        if (res.data.success) setEvents(res.data.activity);
      } catch (err) { console.error('Activity fetch failed', err); }
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  if (loading) return <div style={{ padding: '40px 0', textAlign: 'center', color: '#94A3B8', fontSize: 14 }}>Loading activity...</div>;
  if (!events.length) return (
    <div style={{ padding: '48px 0', textAlign: 'center' }}>
      <Clock size={40} color="#E2E8F0" style={{ marginBottom: 12 }} />
      <div style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', marginBottom: 6 }}>No Activity Yet</div>
      <div style={{ fontSize: 13, color: '#94A3B8' }}>Start scanning receipts to see your activity here.</div>
    </div>
  );

  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0F172A', marginBottom: 24 }}>Recent Activity</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {events.map((ev, i) => {
          const IconComp = iconMap[ev.iconName] || Clock;
          return (
            <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
              style={{ display: 'flex', gap: 16, paddingBottom: 20, position: 'relative' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: ev.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <IconComp size={16} color={ev.color} />
                </div>
                {i < events.length - 1 && <div style={{ width: 2, flex: 1, background: '#F1F5F9', marginTop: 6 }} />}
              </div>
              <div style={{ paddingTop: 8 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#0F172A', marginBottom: 2 }}>{ev.label}</div>
                <div style={{ fontSize: 12, color: '#94A3B8' }}>{ev.time}</div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Right Panel ──────────────────────────────────────────────────────────────
function ProfileRightPanel() {
  return (
    <div style={{ width: 290, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 20 }}>
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

// ─── Main Profile Page ────────────────────────────────────────────────────────
export default function Profile() {
  const [activeTab, setActiveTab] = useState('personal');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${API}/api/auth/me`, { headers: { Authorization: `Bearer ${getToken()}` } });
        if (res.data.success) {
          setUser(res.data.user);
          localStorage.setItem('shopsense_user', JSON.stringify(res.data.user));
        }
      } catch (err) { console.error('Failed to fetch user', err); }
      finally { setLoading(false); }
    };
    fetchUser();
  }, []);

  const handleUpdateUser = updated => {
    setUser(updated);
    localStorage.setItem('shopsense_user', JSON.stringify(updated));
  };

  const handleAvatarChange = async e => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append('avatar', file);
    setUploading(true);
    try {
      const res = await axios.post(`${API}/api/profile/avatar`, fd, {
        headers: { Authorization: `Bearer ${getToken()}`, 'Content-Type': 'multipart/form-data' }
      });
      if (res.data.success) handleUpdateUser(res.data.user);
    } catch (err) { alert(err.response?.data?.message || 'Failed to upload picture'); }
    finally { setUploading(false); }
  };

  const renderTab = () => {
    switch (activeTab) {
      case 'personal':    return <PersonalInfoTab user={user} onUpdateUser={handleUpdateUser} />;
      case 'preferences': return <PreferencesTab user={user} onUpdateUser={handleUpdateUser} />;
      case 'security':    return <SecurityTab />;
      case 'activity':    return <ActivityTab />;
      default:            return <PersonalInfoTab user={user} onUpdateUser={handleUpdateUser} />;
    }
  };

  if (loading) {
    return (
      <div className="page-wrapper">
        <div className="sidebar-wrapper"><Sidebar /></div>
        <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ color: '#64748B', fontWeight: 600 }}>Loading Profile...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="sidebar-wrapper"><Sidebar /></div>
      <main className="responsive-main">
        <TopNav titleNode={
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
              <h1 style={{ fontSize: 26, fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.5px' }}>My Profile</h1>
              <User size={20} color="#64748B" />
            </div>
            <p style={{ fontSize: 14, color: '#64748B', margin: 0 }}>Manage your personal information and preferences.</p>
          </div>
        } />
        <div className="responsive-padding" style={{ paddingTop: 0 }}>

          <div className="content-with-right">
            <div style={{ flex: 1, minWidth: 0 }}>

              {/* Profile Card */}
              <div style={{ background: '#FFF', borderRadius: 20, padding: '28px', border: '1px solid #F1F5F9', boxShadow: '0 2px 12px rgba(0,0,0,0.04)', marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                  {/* Avatar */}
                  <div style={{ position: 'relative' }}>
                    <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#E2E8F0', overflow: 'hidden', border: '3px solid #F0FDF4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {uploading ? (
                        <div style={{ fontSize: 12, fontWeight: 600, color: '#64748B' }}>...</div>
                      ) : user?.avatar ? (
                        <img src={user.avatar} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #154539, #0F3028)', color: '#FFF', fontSize: 32, fontWeight: 800 }}>
                          {getAvatarInitial(user?.fullName)}
                        </div>
                      )}
                    </div>
                    <div onClick={() => fileInputRef.current?.click()} style={{ position: 'absolute', bottom: 0, right: 0, width: 26, height: 26, borderRadius: '50%', background: '#154539', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #FFF', cursor: 'pointer' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#0F3028'}
                      onMouseLeave={e => e.currentTarget.style.background = '#154539'}>
                      <Camera size={12} color="#FFF" />
                    </div>
                    <input type="file" accept="image/*" ref={fileInputRef} onChange={handleAvatarChange} style={{ display: 'none' }} />
                  </div>
                  {/* Info */}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                      <span style={{ fontSize: 22, fontWeight: 800, color: '#0F172A' }}>{user?.fullName}</span>
                      <span style={{ fontSize: 12, padding: '2px 8px', borderRadius: 6, background: '#F0FDF4', color: '#10B981', fontWeight: 700, border: '1px solid #D1FAE5' }}>{user?.role}</span>
                    </div>
                    <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                      {[
                        { icon: Mail, text: user?.email },
                        user?.phone && { icon: Phone, text: user.phone },
                        user?.location && { icon: MapPin, text: user.location },
                      ].filter(Boolean).map((item, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#64748B' }}>
                          <item.icon size={13} color="#94A3B8" />{item.text}
                        </div>
                      ))}
                    </div>
                    {user?.bio && <p style={{ fontSize: 13, color: '#64748B', margin: '8px 0 0', fontStyle: 'italic' }}>{user.bio}</p>}
                  </div>
                </div>
                <div style={{ textAlign: 'center', flexShrink: 0 }}>
                  <div style={{ fontSize: 11, color: '#94A3B8', fontWeight: 600, marginBottom: 10 }}>Member Since</div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: '#0F172A' }}>{user?.createdAt ? new Date(user.createdAt).getFullYear() : '—'}</div>
                  <div style={{ fontSize: 12, color: '#10B981', fontWeight: 600, marginTop: 4 }}>Active Account</div>
                </div>
              </div>

              {/* Tabs */}
              <div style={{ display: 'flex', gap: 4, background: '#F8FAFC', borderRadius: 14, padding: 6, marginBottom: 28, border: '1px solid #F1F5F9' }}>
                {tabs.map(tab => (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
                    flex: 1, padding: '10px 8px', borderRadius: 10, border: 'none', cursor: 'pointer',
                    background: activeTab === tab.id ? '#FFF' : 'transparent',
                    color: activeTab === tab.id ? '#154539' : '#64748B',
                    fontWeight: activeTab === tab.id ? 700 : 500,
                    fontSize: 13, transition: 'all 0.2s',
                    boxShadow: activeTab === tab.id ? '0 1px 6px rgba(0,0,0,0.08)' : 'none',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                    fontFamily: "'Inter', sans-serif",
                  }}>
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

            <div className="right-panel-aside">
              <ProfileRightPanel />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
