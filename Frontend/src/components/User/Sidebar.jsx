import { useState } from 'react';
import { motion } from 'framer-motion';
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
  ChevronRight
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home, path: '/dashboard' },
  { id: 'receipts', label: 'Receipts', icon: ReceiptText, path: '/receipts' },
  { id: 'optimizer', label: 'Optimizer', icon: Zap, path: '/optimizer' },
  { id: 'compare', label: 'Compare', icon: BarChart2, path: '/compare' },
  { id: 'pantry', label: 'Pantry', icon: Package, path: '/pantry' },
  { id: 'insights', label: 'Insights', icon: PieChart, path: '/insights' },
  { id: 'chat', label: 'Chat AI', icon: MessageSquare, path: '/chat' },
];

export default function Sidebar() {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div style={{
      width: 280,
      height: '100vh',
      background: '#FFFFFF',
      borderRight: '1px solid #F1F5F9',
      display: 'flex',
      flexDirection: 'column',
      padding: '32px 0',
      position: 'sticky',
      top: 0,
      fontFamily: "'Inter', sans-serif"
    }}>
      {/* Brand Logo */}
      <div style={{ padding: '0 28px', marginBottom: 40, display: 'flex', alignItems: 'center', gap: 10 }}>
        <img 
          src="/Shopsense logo.png" 
          alt="ShopSense AI" 
          style={{ height: 36, objectFit: 'contain' }} 
        />
        <div>
          <div style={{ fontSize: 18, fontWeight: 800, color: '#0F172A', letterSpacing: '-0.5px', lineHeight: 1.1 }}>
            ShopSense
          </div>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#10B981', background: '#D1FAE5', padding: '1px 6px', borderRadius: 4, display: 'inline-block', marginTop: 2 }}>AI</div>
        </div>
      </div>


      {/* Navigation */}
      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8, padding: '0 16px' }}>
        {navItems.map((item) => {
          const isActive = currentPath === item.path || (item.path !== '/' && currentPath.startsWith(item.path));
          
          return (
            <Link 
              key={item.id} 
              to={item.path} 
              style={{ textDecoration: 'none' }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                padding: '12px 16px',
                borderRadius: 12,
                background: isActive ? '#F0FDF4' : 'transparent',
                color: isActive ? '#154539' : '#64748B',
                fontWeight: isActive ? 600 : 500,
                transition: 'all 0.2s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                if(!isActive) {
                  e.currentTarget.style.background = '#F8FAFC';
                  e.currentTarget.style.color = '#334155';
                }
              }}
              onMouseLeave={(e) => {
                if(!isActive) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#64748B';
                }
              }}
              >
                <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                <span style={{ fontSize: 15 }}>{item.label}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Premium Upgrade Card */}
      <div style={{ padding: '0 24px', marginBottom: 24 }}>
        <div style={{
          background: 'linear-gradient(135deg, #154539 0%, #0F3028 100%)',
          borderRadius: 20,
          padding: '24px 20px',
          color: '#FFFFFF',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Abstract decoration */}
          <div style={{
            position: 'absolute',
            top: -20,
            right: -20,
            width: 80,
            height: 80,
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '50%'
          }} />
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <Crown size={20} color="#FBBF24" fill="#FBBF24" />
            <span style={{ fontWeight: 700, fontSize: 15 }}>Go Premium</span>
          </div>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', lineHeight: 1.5, marginBottom: 16 }}>
            Unlock advanced AI insights, price alerts, and unlimited scans.
          </p>
          <button style={{
            width: '100%',
            padding: '10px 0',
            background: '#FFFFFF',
            color: '#154539',
            border: 'none',
            borderRadius: 10,
            fontWeight: 700,
            fontSize: 13,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6
          }}>
            Upgrade Now <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* User Profile */}
      <div style={{ 
        padding: '16px 24px', 
        borderTop: '1px solid #F1F5F9',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        cursor: 'pointer'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            background: '#E2E8F0',
            overflow: 'hidden'
          }}>
            <img 
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Shubham" 
              alt="User" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            />
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A' }}>Shubham H.</div>
            <div style={{ fontSize: 12, color: '#10B981', fontWeight: 500 }}>Premium User</div>
          </div>
        </div>
        <ChevronRight size={18} color="#94A3B8" />
      </div>
    </div>
  );
}
