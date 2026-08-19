import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  BarChart3,
  Bell,
  Boxes,
  ChevronRight,
  FileText,
  Flag,
  Home,
  LogOut,
  Menu,
  User,
  Settings,
  ShieldCheck,
  Users,
  X,
} from 'lucide-react';
import useWindowWidth, { isMobile, isTablet } from '../../hooks/useWindowWidth';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home, path: '/admin' },
  { id: 'users', label: 'User Management', icon: Users, path: '/admin/users' },
  { id: 'receipts', label: 'Receipt Management', icon: FileText, path: '/admin/receipts' },
  { id: 'products', label: 'Product Database', icon: Boxes, path: '/admin/products' },
  { id: 'recalls', label: 'Food Recalls', icon: Flag, path: '/admin/recalls' },
  { id: 'community', label: 'Community Insights', icon: BarChart3, path: '/admin/community' },
  { id: 'notifications', label: 'Notifications', icon: Bell, path: '/admin/notifications' },
  { id: 'reports', label: 'Reports & Analytics', icon: BarChart3, path: '/admin/reports' },
  { id: 'settings', label: 'Settings', icon: Settings, path: '/admin/settings' },
  { id: 'profile', label: 'Profile', icon: User, path: '/admin/profile' },
];

const mobileNavItems = navItems.slice(0, 4);

function NavLinkItem({ item, currentPath, compact = false, onClick }) {
  const Icon = item.icon;
  const isActive = currentPath === item.path || (item.path !== '/admin' && currentPath.startsWith(item.path));

  return (
    <Link className="admin-sidebar-link" to={item.path} title={item.label} onClick={onClick}>
      <span className={`admin-sidebar-item ${isActive ? 'is-active' : ''} ${compact ? 'is-compact' : ''}`}>
        <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
        {!compact && <span>{item.label}</span>}
      </span>
    </Link>
  );
}

export default function AdminSidebar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const width = useWindowWidth();
  const mobile = isMobile(width);
  const tablet = isTablet(width);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('shopsense_token');
    localStorage.removeItem('shopsense_user');
    navigate('/login');
  };

  if (mobile) {
    return (
      <>
        <nav className="admin-mobile-nav">
          {mobileNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path || (item.path !== '/admin' && pathname.startsWith(item.path));
            return (
              <Link key={item.id} to={item.path} className={`admin-mobile-nav-item ${isActive ? 'is-active' : ''}`}>
                <Icon size={21} strokeWidth={isActive ? 2.5 : 2} />
                <span>{item.id === 'dashboard' ? 'Home' : item.label.split(' ')[0]}</span>
              </Link>
            );
          })}
          <button className="admin-mobile-nav-item" type="button" onClick={() => setDrawerOpen(true)}>
            <Menu size={21} />
            <span>More</span>
          </button>
        </nav>

        {drawerOpen && (
          <>
            <button className="admin-drawer-scrim" type="button" aria-label="Close admin menu" onClick={() => setDrawerOpen(false)} />
            <aside className="admin-sidebar admin-sidebar-drawer">
              <div className="admin-sidebar-brand">
                <img src="/Shopsense logo.png" alt="ShopSense AI" />
                <div>
                  <strong>ShopSense</strong>
                  <span>Admin</span>
                </div>
                <button className="admin-icon-btn admin-sidebar-close" type="button" onClick={() => setDrawerOpen(false)}>
                  <X size={18} />
                </button>
              </div>
              <nav className="admin-sidebar-nav">
                {navItems.map((item) => (
                  <NavLinkItem key={item.id} item={item} currentPath={pathname} onClick={() => setDrawerOpen(false)} />
                ))}
              </nav>
            </aside>
          </>
        )}
      </>
    );
  }

  if (tablet) {
    return (
      <aside className="admin-sidebar admin-sidebar-rail">
        <Link to="/admin" className="admin-sidebar-logo">
          <img src="/Shopsense logo.png" alt="ShopSense AI" />
        </Link>
        <nav className="admin-sidebar-nav">
          {navItems.map((item) => (
            <NavLinkItem key={item.id} item={item} currentPath={pathname} compact />
          ))}
        </nav>
        <div className="admin-sidebar-avatar" onClick={handleLogout} style={{ cursor: 'pointer' }} title="Log out">A</div>
      </aside>
    );
  }

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-brand">
        <img src="/Shopsense logo.png" alt="ShopSense AI" />
        <div>
          <strong>ShopSense</strong>
          <span>Admin Console</span>
        </div>
      </div>
      <div className="admin-sidebar-alert">
        <ShieldCheck size={18} />
        <div>
          <strong>System healthy</strong>
          <span>5 services online</span>
        </div>
      </div>
      <nav className="admin-sidebar-nav">
        {navItems.map((item) => (
          <NavLinkItem key={item.id} item={item} currentPath={pathname} />
        ))}
      </nav>
      <div className="admin-sidebar-footer">
        <Link className="admin-sidebar-user" to="/admin/profile">
          <span className="admin-sidebar-avatar">A</span>
          <span>
            <strong>Admin</strong>
            <small>ops@shopsense.ai</small>
          </span>
          <ChevronRight size={17} />
        </Link>
        <div className="admin-sidebar-actions">
          <button className="admin-icon-btn" type="button" aria-label="Notifications"><Bell size={18} /></button>
          <button className="admin-icon-btn" type="button" aria-label="Log out" onClick={handleLogout}><LogOut size={18} /></button>
        </div>
      </div>
    </aside>
  );
}
