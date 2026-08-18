import { useState } from 'react';
import { Search, Bell, Settings, Filter, ChevronDown, X } from 'lucide-react';
import useWindowWidth, { isMobile } from '../../hooks/useWindowWidth';

function getMonthOptions() {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const d = new Date();
  const m = d.getMonth();
  return ['This Month', 'Last Month', months[(m - 2 + 12) % 12], months[(m - 3 + 12) % 12], 'Last Year'];
}

function CalendarIcon(props) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

export default function TopNav({ showReceiptFilters = false, titleNode }) {
  const width = useWindowWidth();
  const mobile = isMobile(width);
  const [searchOpen, setSearchOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState('This Month');

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: mobile ? '14px 16px' : '32px 40px 24px',
      background: '#FBF6EE',
      position: 'sticky',
      top: 0,
      zIndex: 10,
      borderBottom: mobile ? '1px solid rgba(21, 69, 57, 0.06)' : 'none',
      width: '100%',
      boxSizing: 'border-box'
    }}>

      {/* Search row */}
      {mobile ? (
        /* Mobile: icon that expands inline or shows full search */
        <>
          {searchOpen ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', background: '#FFF', border: '1px solid #E2E8F0', borderRadius: 12, padding: '9px 12px', flex: 1 }}>
                <Search size={16} color="#94A3B8" />
                <input
                  type="text"
                  placeholder="Search..."
                  autoFocus
                  style={{ border: 'none', outline: 'none', background: 'transparent', marginLeft: 8, width: '100%', fontSize: 14, color: '#0F172A', fontFamily: "'Inter', sans-serif" }}
                />
              </div>
              <button onClick={() => setSearchOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
                <X size={20} color="#64748B" />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flex: 1 }}>
              <span style={{ fontSize: 17, fontWeight: 800, color: '#0F172A', letterSpacing: '-0.3px' }}>ShopSense</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <button onClick={() => setSearchOpen(true)} style={{ width: 38, height: 38, borderRadius: '50%', border: '1px solid #E2E8F0', background: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  <Search size={17} color="#334155" />
                </button>
                <button style={{ width: 38, height: 38, borderRadius: '50%', border: '1px solid #E2E8F0', background: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', position: 'relative' }}>
                  <Bell size={17} color="#334155" />
                  <div style={{ position: 'absolute', top: 9, right: 11, width: 7, height: 7, background: '#10B981', borderRadius: '50%', border: '2px solid #FFF' }} />
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        /* Tablet & Desktop: Title row then Search row */
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
          {/* Top Row: Title + Icons */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: titleNode ? 24 : 0, width: '100%' }}>
            <div>{titleNode}</div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <button style={{ width: 44, height: 44, borderRadius: '50%', border: '1px solid #E2E8F0', background: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', position: 'relative' }}>
                <Bell size={20} color="#334155" />
                <div style={{ position: 'absolute', top: 10, right: 12, width: 8, height: 8, background: '#10B981', borderRadius: '50%', border: '2px solid #FFFFFF' }} />
              </button>
              {showReceiptFilters ? (
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#154539', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>i</div>
              ) : (
                <button style={{ width: 44, height: 44, borderRadius: '50%', border: '1px solid #E2E8F0', background: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  <Settings size={20} color="#334155" />
                </button>
              )}
            </div>
          </div>

          {/* Bottom Row: Search */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 16, padding: '10px 16px', width: '100%', maxWidth: 480, boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
              <Search size={20} color="#94A3B8" />
              <input
                type="text"
                placeholder={showReceiptFilters ? 'Search receipts, stores...' : 'Search for products, brands or insights...'}
                style={{ border: 'none', outline: 'none', background: 'transparent', marginLeft: 12, width: '100%', fontSize: 14, color: '#0F172A', fontFamily: "'Inter', sans-serif" }}
              />
              {!showReceiptFilters && (
                <div style={{ background: '#F1F5F9', padding: '4px 8px', borderRadius: 6, fontSize: 12, fontWeight: 600, color: '#64748B', letterSpacing: 1 }}>⌘ K</div>
              )}
            </div>

            {showReceiptFilters && (
              <div style={{ position: 'relative' }}>
                <button 
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#FFFFFF', border: '1px solid #E2E8F0', padding: '10px 16px', borderRadius: 12, fontSize: 14, fontWeight: 600, color: '#334155', cursor: 'pointer' }}
                >
                  <CalendarIcon size={16} /> {selectedMonth} <ChevronDown size={16} color="#94A3B8" />
                </button>
                {dropdownOpen && (
                  <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: 8, background: '#FFF', border: '1px solid #E2E8F0', borderRadius: 12, padding: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.05)', width: 160, zIndex: 20 }}>
                    {getMonthOptions().map(opt => (
                      <div 
                        key={opt} 
                        onClick={() => { setSelectedMonth(opt); setDropdownOpen(false); }}
                        style={{ padding: '8px 12px', fontSize: 14, color: '#334155', cursor: 'pointer', borderRadius: 8, transition: 'background 0.2s', background: selectedMonth === opt ? '#F8FAFC' : 'transparent', fontWeight: selectedMonth === opt ? 600 : 400 }} 
                        onMouseEnter={e => e.target.style.background = '#F8FAFC'} 
                        onMouseLeave={e => e.target.style.background = selectedMonth === opt ? '#F8FAFC' : 'transparent'}
                      >
                        {opt}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
