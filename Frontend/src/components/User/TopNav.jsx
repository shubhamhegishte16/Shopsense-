import { Search, Bell, Settings, Filter, ChevronDown } from 'lucide-react';

export default function TopNav({ showReceiptFilters = false }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '24px 40px',
      background: '#FAFCFC',
      position: 'sticky',
      top: 0,
      zIndex: 10
    }}>
      {/* Left Side (Search & Filters) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, flex: 1 }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          background: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: 16,
          padding: '10px 16px',
          width: '100%',
          maxWidth: 480,
          boxShadow: '0 2px 10px rgba(0,0,0,0.02)'
        }}>
          <Search size={20} color="#94A3B8" />
          <input 
            type="text"
            placeholder={showReceiptFilters ? "Search receipts, stores, products..." : "Search for products, brands or insights..."}
            style={{
              border: 'none',
              outline: 'none',
              background: 'transparent',
              marginLeft: 12,
              width: '100%',
              fontSize: 14,
              color: '#0F172A',
              fontFamily: "'Inter', sans-serif"
            }}
          />
          {!showReceiptFilters && (
            <div style={{
              background: '#F1F5F9',
              padding: '4px 8px',
              borderRadius: 6,
              fontSize: 12,
              fontWeight: 600,
              color: '#64748B',
              letterSpacing: 1
            }}>
              ⌘ K
            </div>
          )}
        </div>

        {showReceiptFilters && (
          <>
            <button style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: '#FFFFFF', border: '1px solid #E2E8F0',
              padding: '10px 16px', borderRadius: 12,
              fontSize: 14, fontWeight: 600, color: '#334155',
              cursor: 'pointer'
            }}>
              <Filter size={16} /> Filter
            </button>
            <button style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: '#FFFFFF', border: '1px solid #E2E8F0',
              padding: '10px 16px', borderRadius: 12,
              fontSize: 14, fontWeight: 600, color: '#334155',
              cursor: 'pointer'
            }}>
              <CalendarIcon size={16} /> This Month <ChevronDown size={16} color="#94A3B8" />
            </button>
          </>
        )}
      </div>

      {/* Action Icons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <button style={{
          width: 44,
          height: 44,
          borderRadius: '50%',
          border: '1px solid #E2E8F0',
          background: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          position: 'relative'
        }}>
          <Bell size={20} color="#334155" />
          <div style={{
            position: 'absolute',
            top: 10,
            right: 12,
            width: 8,
            height: 8,
            background: '#10B981',
            borderRadius: '50%',
            border: '2px solid #FFFFFF'
          }} />
        </button>
        
        {showReceiptFilters ? (
          <div style={{
            width: 44,
            height: 44,
            borderRadius: '50%',
            background: '#154539',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFF',
            fontWeight: 700,
            fontSize: 14,
            cursor: 'pointer'
          }}>
            i
          </div>
        ) : (
          <button style={{
            width: 44,
            height: 44,
            borderRadius: '50%',
            border: '1px solid #E2E8F0',
            background: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}>
            <Settings size={20} color="#334155" />
          </button>
        )}
      </div>
    </div>
  );
}

function CalendarIcon(props) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="16" y1="2" x2="16" y2="6"></line>
      <line x1="8" y1="2" x2="8" y2="6"></line>
      <line x1="3" y1="10" x2="21" y2="10"></line>
    </svg>
  );
}
