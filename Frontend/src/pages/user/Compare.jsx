import Sidebar from '../../components/User/Sidebar';
import { Search, Bell, RotateCw } from 'lucide-react';
import { CompareContent, YouCanSavePanel, PriceTrendPanel, SmartPicksPanel } from '../../components/User/CompareWidgets';

function CompareTopNav({ titleNode }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      padding: '32px 40px 24px', background: '#FAFCFC',
      position: 'sticky', top: 0, zIndex: 10,
      borderBottom: '1px solid #F1F5F9',
      width: '100%', boxSizing: 'border-box'
    }}>
      {/* Top Row: Title + Icons */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: titleNode ? 24 : 0, width: '100%' }}>
        <div>{titleNode}</div>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <button style={{ width: 44, height: 44, borderRadius: '50%', border: '1px solid #E2E8F0', background: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', position: 'relative' }}>
            <Bell size={20} color="#334155" />
            <div style={{ position: 'absolute', top: 10, right: 12, width: 8, height: 8, background: '#10B981', borderRadius: '50%', border: '2px solid #FFF' }} />
            <div style={{ position: 'absolute', top: -2, right: -2, background: '#154539', color: '#FFF', fontSize: 9, fontWeight: 800, width: 16, height: 16, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #FAFCFC' }}>3</div>
          </button>
          <button style={{ width: 44, height: 44, borderRadius: '50%', border: '1px solid #E2E8F0', background: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <RotateCw size={18} color="#334155" />
          </button>
        </div>
      </div>

      {/* Search */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, width: '100%' }}>
        <div style={{
          display: 'flex', alignItems: 'center',
          background: '#FFFFFF', border: '1px solid #E2E8F0',
          borderRadius: 999, padding: '10px 20px',
          width: '100%', maxWidth: 400,
          boxShadow: '0 2px 10px rgba(0,0,0,0.02)'
        }}>
          <Search size={16} color="#94A3B8" />
          <input
            type="text"
            placeholder="Search for products, brands or stores..."
            style={{ border: 'none', outline: 'none', background: 'transparent', marginLeft: 10, width: '100%', fontSize: 14, color: '#0F172A', fontFamily: "'Inter', sans-serif" }}
          />
        </div>
      </div>
    </div>
  );
}

function BarChartIcon(props) {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>;
}

export default function Compare() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#FAFCFC', fontFamily: "'Inter', sans-serif" }}>
      <Sidebar />

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto', height: '100vh' }}>
        <CompareTopNav titleNode={
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.5px' }}>Compare</h1>
            <BarChartIcon size={22} color="#10B981" />
          </div>
        } />

        <div style={{ padding: '32px 40px', display: 'flex', gap: 32 }}>
          {/* Main Content */}
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 14, color: '#64748B', margin: '0 0 28px 0' }}>
              Compare products, prices and stores to get the best value.
            </p>
            <CompareContent />
          </div>

          {/* Right Panel */}
          <div style={{ width: 300, flexShrink: 0 }}>
            <YouCanSavePanel />
            <PriceTrendPanel />
            <SmartPicksPanel />
          </div>
        </div>
      </main>
    </div>
  );
}
