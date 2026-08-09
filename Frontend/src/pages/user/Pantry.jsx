import { useState } from 'react';
import { Search, Bell, RotateCw } from 'lucide-react';
import Sidebar from '../../components/User/Sidebar';
import { PantryStats, CategoryTabs, PantryControls, PantryGrid, ExpiryCalendarPanel, SmartAlertsPanel, PantryInsightsPanel } from '../../components/User/PantryWidgets';

function PantryTopNav() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '24px 40px', background: '#FAFCFC',
      position: 'sticky', top: 0, zIndex: 10,
      borderBottom: '1px solid #F1F5F9'
    }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: '#F0FDF4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <HomeIcon size={18} color="#154539" />
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.5px' }}>My Pantry</h1>
        </div>
        <p style={{ fontSize: 13, color: '#94A3B8', margin: 0, paddingLeft: 46 }}>Track items, get expiry alerts and manage groceries smarter.</p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16, flex: 1, justifyContent: 'center', maxWidth: 450, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 999, padding: '10px 20px', width: '100%', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
          <Search size={16} color="#94A3B8" />
          <input type="text" placeholder="Search for items in your pantry..." style={{ border: 'none', outline: 'none', background: 'transparent', marginLeft: 10, width: '100%', fontSize: 14, color: '#0F172A', fontFamily: "'Inter', sans-serif" }} />
        </div>
      </div>

      <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
        <button style={{ width: 44, height: 44, borderRadius: '50%', border: '1px solid #E2E8F0', background: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', position: 'relative' }}>
          <Bell size={20} color="#334155" />
          <div style={{ position: 'absolute', top: -2, right: -2, background: '#154539', color: '#FFF', fontSize: 9, fontWeight: 800, width: 16, height: 16, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #FAFCFC' }}>3</div>
        </button>
        <button style={{ width: 44, height: 44, borderRadius: '50%', border: 'none', background: '#154539', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <RotateCw size={18} color="#FFFFFF" />
        </button>
      </div>
    </div>
  );
}

function HomeIcon(props) {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>;
}

export default function Pantry() {
  const [activeTab, setActiveTab] = useState('All Items');

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#FAFCFC', fontFamily: "'Inter', sans-serif" }}>
      <Sidebar />

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto', height: '100vh' }}>
        <PantryTopNav />

        <div style={{ padding: '32px 40px', display: 'flex', gap: 32 }}>
          {/* Main Content */}
          <div style={{ flex: 1 }}>
            <PantryStats />
            <CategoryTabs active={activeTab} setActive={setActiveTab} />
            <PantryControls />
            <PantryGrid />
          </div>

          {/* Right Panel */}
          <div style={{ width: 300, flexShrink: 0 }}>
            <ExpiryCalendarPanel />
            <SmartAlertsPanel />
            <PantryInsightsPanel />
          </div>
        </div>
      </main>
    </div>
  );
}
