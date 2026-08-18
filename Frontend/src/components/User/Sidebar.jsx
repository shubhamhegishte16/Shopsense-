import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart2,
  Bell,
  ChevronRight,
  Home,
  Menu,
  MessageSquare,
  Package,
  PieChart,
  ReceiptText,
  Settings,
  User,
  UsersRound,
  X,
  Zap,
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import useWindowWidth, { isMobile, isTablet } from '../../hooks/useWindowWidth';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home, path: '/dashboard' },
  { id: 'receipts', label: 'Receipts', icon: ReceiptText, path: '/receipts' },
  { id: 'optimizer', label: 'Optimizer', icon: Zap, path: '/optimizer' },
  { id: 'compare', label: 'Compare', icon: BarChart2, path: '/compare' },
  { id: 'pantry', label: 'Pantry', icon: Package, path: '/pantry' },
  { id: 'insights', label: 'Insights', icon: PieChart, path: '/insights' },
  { id: 'chat', label: 'Chat AI', icon: MessageSquare, path: '/chat' },
  { id: 'community', label: 'Community', icon: UsersRound, path: '/community' },
  { id: 'notifications', label: 'Notifications', icon: Bell, path: '/notifications' },
  { id: 'profile', label: 'Profile', icon: User, path: '/profile' },
  { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' },
];

const mobileNavItems = [
  { id: 'dashboard', label: 'Home', icon: Home, path: '/dashboard' },
  { id: 'receipts', label: 'Receipt', icon: ReceiptText, path: '/receipts' },
  { id: 'pantry', label: 'Pantry', icon: Package, path: '/pantry' },
  { id: 'insights', label: 'Insights', icon: PieChart, path: '/insights' },
];

function NavItem({ item, currentPath, compact = false, onClick }) {
  const Icon = item.icon;
  const isActive = currentPath === item.path || (item.path !== '/dashboard' && currentPath.startsWith(item.path));

  return (
    <Link className="user-sidebar-link" to={item.path} title={item.label} onClick={onClick}>
      <span className={`user-sidebar-item ${isActive ? 'is-active' : ''} ${compact ? 'is-compact' : ''}`}>
        <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
        {!compact && <span>{item.label}</span>}
      </span>
    </Link>
  );
}

export default function Sidebar() {
  const { pathname } = useLocation();
  const width = useWindowWidth();
  const mobile = isMobile(width);
  const tablet = isTablet(width);
  const [drawerOpen, setDrawerOpen] = useState(false);

  if (mobile) {
    return (
      <>
        <nav className="user-mobile-nav">
          {mobileNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path || (item.path !== '/dashboard' && pathname.startsWith(item.path));
            return (
              <Link key={item.id} to={item.path} className={`user-mobile-nav-item ${isActive ? 'is-active' : ''}`}>
                <Icon size={21} strokeWidth={isActive ? 2.5 : 2} />
                <span>{item.label}</span>
              </Link>
            );
          })}
          <button className="user-mobile-nav-item" type="button" onClick={() => setDrawerOpen(true)}>
            <Menu size={21} />
            <span>More</span>
          </button>
        </nav>

        <AnimatePresence>
          {drawerOpen && (
            <>
              <motion.button
                className="user-drawer-scrim"
                type="button"
                aria-label="Close user menu"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setDrawerOpen(false)}
              />
              <motion.aside
                className="user-sidebar user-sidebar-drawer"
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 30, stiffness: 320 }}
              >
                <div className="user-sidebar-brand">
                  <img src="/Shopsense logo.png" alt="ShopSense AI" />
                  <div>
                    <strong>ShopSense</strong>
                    <span>AI User Panel</span>
                  </div>
                  <button className="user-icon-btn user-sidebar-close" type="button" onClick={() => setDrawerOpen(false)}>
                    <X size={18} />
                  </button>
                </div>
                <nav className="user-sidebar-nav">
                  {navItems.map((item) => (
                    <NavItem key={item.id} item={item} currentPath={pathname} onClick={() => setDrawerOpen(false)} />
                  ))}
                </nav>
                <Link className="user-sidebar-user" to="/profile" onClick={() => setDrawerOpen(false)}>
                  <span className="user-sidebar-avatar">S</span>
                  <span>
                    <strong>Shubham H.</strong>
                    <small>Free User</small>
                  </span>
                  <ChevronRight size={17} />
                </Link>
              </motion.aside>
            </>
          )}
        </AnimatePresence>
      </>
    );
  }

  if (tablet) {
    return (
      <aside className="user-sidebar user-sidebar-rail">
        <Link to="/dashboard" className="user-sidebar-logo">
          <img src="/Shopsense logo.png" alt="ShopSense AI" />
        </Link>
        <nav className="user-sidebar-nav">
          {navItems.map((item) => (
            <NavItem key={item.id} item={item} currentPath={pathname} compact />
          ))}
        </nav>
        <Link to="/profile" className="user-sidebar-avatar-link">
          <div className="user-sidebar-avatar">S</div>
        </Link>
      </aside>
    );
  }

  return (
    <aside className="user-sidebar">
      <div className="user-sidebar-brand">
        <img src="/Shopsense logo.png" alt="ShopSense AI" />
        <div>
          <strong>ShopSense</strong>
          <span>User Panel</span>
        </div>
      </div>

      <div className="user-sidebar-alert">
        <Bell size={18} />
        <div>
          <strong>Smart shopping on</strong>
          <span>Tracking savings, pantry, and alerts</span>
        </div>
      </div>

      <nav className="user-sidebar-nav">
        {navItems.map((item) => (
          <NavItem key={item.id} item={item} currentPath={pathname} />
        ))}
      </nav>

      <div className="user-sidebar-footer">
        <Link className="user-sidebar-user" to="/profile">
          <span className="user-sidebar-avatar">S</span>
          <span>
            <strong>Shubham H.</strong>
            <small>Free User</small>
          </span>
          <ChevronRight size={17} />
        </Link>
      </div>
    </aside>
  );
}
