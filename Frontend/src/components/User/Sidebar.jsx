import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, 
  Home, 
  ReceiptText, 
  Zap, 
  BarChart2, 
  Package, 
  PieChart, 
  MessageSquare, 
  Crown,
  ChevronRight,
  User,
  Settings,
  Menu,
  X
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import useWindowWidth, { isMobile, isTablet } from '../../hooks/useWindowWidth';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home,          path: '/dashboard' },
  { id: 'receipts',  label: 'Receipts',  icon: ReceiptText,  path: '/receipts' },
  { id: 'optimizer', label: 'Optimizer', icon: Zap,           path: '/optimizer' },
  { id: 'compare',   label: 'Compare',   icon: BarChart2,     path: '/compare' },
  { id: 'pantry',    label: 'Pantry',    icon: Package,       path: '/pantry' },
  { id: 'insights',  label: 'Insights',  icon: PieChart,      path: '/insights' },
  { id: 'chat',      label: 'Chat AI',   icon: MessageSquare, path: '/chat' },
  { id: 'profile',   label: 'Profile',   icon: User,          path: '/profile' },
  { id: 'settings',  label: 'Settings',  icon: Settings,      path: '/settings' },
];

// Items shown in the mobile bottom bar (most important ones)
const mobileNavItems = [
  { id: 'dashboard', label: 'Home',     icon: Home,          path: '/dashboard' },
  { id: 'receipts',  label: 'Receipts', icon: ReceiptText,  path: '/receipts' },
  { id: 'pantry',    label: 'Pantry',   icon: Package,       path: '/pantry' },
  { id: 'insights',  label: 'Insights', icon: PieChart,      path: '/insights' },
  { id: 'chat',      label: 'Chat',     icon: MessageSquare, path: '/chat' },
];

export default function Sidebar() {
  const location   = useLocation();
  const currentPath = location.pathname;
  const width      = useWindowWidth();
  const mobile     = isMobile(width);
  const tablet     = isTablet(width);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // ─── Mobile: bottom nav bar + optional drawer ─────────────────────────────
  if (mobile) {
    return (
      <>
        {/* Bottom Navigation Bar */}
        <nav className="mobile-bottom-nav">
          {mobileNavItems.map(item => {
            const isActive = currentPath === item.path || (item.path !== '/' && currentPath.startsWith(item.path));
            return (
              <Link key={item.id} to={item.path} style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3, flex: 1, padding: '6px 0' }}>
                <item.icon size={22} color={isActive ? '#154539' : '#94A3B8'} strokeWidth={isActive ? 2.5 : 1.75} />
                <span style={{ fontSize: 10, fontWeight: isActive ? 700 : 500, color: isActive ? '#154539' : '#94A3B8' }}>{item.label}</span>
              </Link>
            );
          })}
          {/* More button to open full menu */}
          <button onClick={() => setMobileMenuOpen(true)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3, flex: 1, padding: '6px 0', background: 'none', border: 'none', cursor: 'pointer' }}>
            <Menu size={22} color="#94A3B8" strokeWidth={1.75} />
            <span style={{ fontSize: 10, fontWeight: 500, color: '#94A3B8' }}>More</span>
          </button>
        </nav>

        {/* Full-screen drawer for all nav items */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setMobileMenuOpen(false)}
                style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 200 }} />
              <motion.div initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                style={{ position: 'fixed', top: 0, left: 0, bottom: 0, width: 280, background: '#FFF', zIndex: 201, display: 'flex', flexDirection: 'column', padding: '24px 0', fontFamily: "'Inter', sans-serif" }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', marginBottom: 32 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <img src="/Shopsense logo.png" alt="ShopSense AI" style={{ height: 32, objectFit: 'contain' }} />
                    <div style={{ fontSize: 16, fontWeight: 800, color: '#0F172A' }}>ShopSense<span style={{ color: '#10B981' }}> AI</span></div>
                  </div>
                  <button onClick={() => setMobileMenuOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
                    <X size={22} color="#64748B" />
                  </button>
                </div>
                <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4, padding: '0 12px', overflowY: 'auto' }}>
                  {navItems.map(item => {
                    const isActive = currentPath === item.path || (item.path !== '/' && currentPath.startsWith(item.path));
                    return (
                      <Link key={item.id} to={item.path} style={{ textDecoration: 'none' }} onClick={() => setMobileMenuOpen(false)}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px', borderRadius: 12, background: isActive ? '#F0FDF4' : 'transparent', color: isActive ? '#154539' : '#64748B', fontWeight: isActive ? 600 : 500 }}>
                          <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                          <span style={{ fontSize: 15 }}>{item.label}</span>
                        </div>
                      </Link>
                    );
                  })}
                </nav>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </>
    );
  }

  // ─── Tablet: icon-only rail ───────────────────────────────────────────────
  if (tablet) {
    return (
      <div style={{ width: 68, height: '100vh', background: '#FFFFFF', borderRight: '1px solid #F1F5F9', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '28px 0', position: 'sticky', top: 0, flexShrink: 0 }}>
        <Link to="/dashboard" style={{ marginBottom: 32 }}>
          <img src="/Shopsense logo.png" alt="ShopSense AI" style={{ height: 30, objectFit: 'contain' }} />
        </Link>
        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, width: '100%', padding: '0 8px' }}>
          {navItems.map(item => {
            const isActive = currentPath === item.path || (item.path !== '/' && currentPath.startsWith(item.path));
            return (
              <Link key={item.id} to={item.path} style={{ textDecoration: 'none', width: '100%' }} title={item.label}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '12px', borderRadius: 12, background: isActive ? '#F0FDF4' : 'transparent', color: isActive ? '#154539' : '#64748B', transition: 'all 0.2s' }}
                  onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = '#F8FAFC'; }}
                  onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}>
                  <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                </div>
              </Link>
            );
          })}
        </nav>
        <Link to="/profile" style={{ textDecoration: 'none', marginTop: 8 }}>
          <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, #154539, #0F3028)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF', fontSize: 16, fontWeight: 800 }}>
            S
          </div>
        </Link>
      </div>
    );
  }

  // ─── Desktop: full labeled sidebar ───────────────────────────────────────
  return (
    <div style={{ width: 280, height: '100vh', background: '#FFFFFF', borderRight: '1px solid #F1F5F9', display: 'flex', flexDirection: 'column', padding: '32px 0', position: 'sticky', top: 0, fontFamily: "'Inter', sans-serif", flexShrink: 0 }}>
      {/* Brand */}
      <div style={{ padding: '0 28px', marginBottom: 40, display: 'flex', alignItems: 'center', gap: 10 }}>
        <img src="/Shopsense logo.png" alt="ShopSense AI" style={{ height: 36, objectFit: 'contain' }} />
        <div>
          <div style={{ fontSize: 18, fontWeight: 800, color: '#0F172A', letterSpacing: '-0.5px', lineHeight: 1.1 }}>ShopSense</div>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#10B981', background: '#D1FAE5', padding: '1px 6px', borderRadius: 4, display: 'inline-block', marginTop: 2 }}>AI</div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8, padding: '0 16px' }}>
        {navItems.map(item => {
          const isActive = currentPath === item.path || (item.path !== '/' && currentPath.startsWith(item.path));
          return (
            <Link key={item.id} to={item.path} style={{ textDecoration: 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px', borderRadius: 12, background: isActive ? '#F0FDF4' : 'transparent', color: isActive ? '#154539' : '#64748B', fontWeight: isActive ? 600 : 500, transition: 'all 0.2s ease', cursor: 'pointer' }}
                onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = '#F8FAFC'; e.currentTarget.style.color = '#334155'; } }}
                onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#64748B'; } }}>
                <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                <span style={{ fontSize: 15 }}>{item.label}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* User Profile */}
      <Link to="/profile" style={{ textDecoration: 'none' }}>
        <div style={{ padding: '16px 24px', borderTop: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, #154539, #0F3028)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF', fontSize: 16, fontWeight: 800 }}>S</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A' }}>Shubham H.</div>
              <div style={{ fontSize: 12, color: '#10B981', fontWeight: 500 }}>Free User</div>
            </div>
          </div>
          <ChevronRight size={18} color="#94A3B8" />
        </div>
      </Link>
    </div>
  );
}
