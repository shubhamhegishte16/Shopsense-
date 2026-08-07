import { Zap, Tag, TrendingUp, Lock, AlertTriangle, Sparkles, MessageSquare, Bot } from 'lucide-react';

const feedItems = [
  {
    id: 1,
    icon: Tag,
    iconBg: '#E0F2FE', // light blue
    iconColor: '#0EA5E9',
    time: '2M AGO',
    text: 'Milk is 18% cheaper today at D-Mart Ready.',
    linkText: 'View Deal',
  },
  {
    id: 2,
    icon: TrendingUp,
    iconBg: '#FEF3C7', // light yellow
    iconColor: '#D97706',
    time: '1H AGO',
    text: 'Grocery prices increased 4% this week.',
    linkText: 'See Analysis',
  },
  {
    id: 3,
    icon: Lock,
    iconBg: '#F3E8FF', // light purple
    iconColor: '#9333EA',
    time: '3H AGO',
    text: 'Buy cooking oil this week. Prices may rise soon.',
    linkText: 'Remind Me',
  },
  {
    id: 4,
    icon: AlertTriangle,
    iconBg: '#FEE2E2', // light red
    iconColor: '#DC2626',
    time: '5H AGO',
    text: '1 product in your recent order is under recall.',
    linkText: 'Check Now',
  },
  {
    id: 5,
    icon: Sparkles,
    iconBg: '#D1FAE5', // light green
    iconColor: '#10B981',
    time: '1D AGO',
    text: 'AI found ₹523 savings in your last 5 orders.',
    linkText: 'See How',
  }
];

const presetQuestions = [
  "Cheapest place to buy milk?",
  "Show me healthy alternatives",
  "How can I save more?"
];

export default function RightPanel() {
  return (
    <div style={{
      width: 320,
      height: '100vh',
      background: '#FFFFFF',
      borderLeft: '1px solid #F1F5F9',
      display: 'flex',
      flexDirection: 'column',
      padding: '32px 24px',
      position: 'sticky',
      top: 0,
      fontFamily: "'Inter', sans-serif",
      overflowY: 'auto'
    }}>
      
      {/* AI Feed Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Zap size={20} color="#10B981" fill="#10B981" />
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0F172A', margin: 0 }}>AI Feed</h3>
        </div>
        <a href="#" style={{ fontSize: 12, color: '#64748B', textDecoration: 'none', fontWeight: 600 }}>View All</a>
      </div>

      {/* Feed Timeline */}
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 24, marginBottom: 40 }}>
        {/* Timeline line */}
        <div style={{
          position: 'absolute',
          left: 15,
          top: 20,
          bottom: 20,
          width: 2,
          background: '#F1F5F9',
          zIndex: 0
        }} />

        {feedItems.map((item) => (
          <div key={item.id} style={{ display: 'flex', gap: 16, position: 'relative', zIndex: 1 }}>
            {/* Icon */}
            <div style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: item.iconBg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              boxShadow: '0 0 0 4px #FFFFFF'
            }}>
              <item.icon size={16} color={item.iconColor} />
            </div>
            
            {/* Content */}
            <div style={{ flex: 1, paddingTop: 4 }}>
              <div style={{ fontSize: 10, color: '#94A3B8', fontWeight: 600, marginBottom: 4 }}>{item.time}</div>
              <p style={{ fontSize: 13, color: '#334155', margin: '0 0 6px 0', lineHeight: 1.4, fontWeight: 500 }}>
                {item.text}
              </p>
              <a href="#" style={{ fontSize: 12, color: '#10B981', textDecoration: 'none', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                {item.linkText} <span>→</span>
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Ask ShopSense AI */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <MessageSquare size={20} color="#10B981" />
        <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0F172A', margin: 0 }}>Ask ShopSense AI</h3>
      </div>

      <div style={{
        background: '#F8FAFC',
        border: '1px solid #E2E8F0',
        borderRadius: 16,
        padding: '16px',
        marginBottom: 16
      }}>
        <p style={{ margin: 0, fontSize: 13, color: '#94A3B8' }}>How can I help you save today?</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 40 }}>
        {presetQuestions.map((q, idx) => (
          <div key={idx} style={{
            padding: '12px 16px',
            background: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: 12,
            fontSize: 13,
            color: '#334155',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
          }}>
            {q}
          </div>
        ))}
      </div>

      {/* Floating Chat Button */}
      <div style={{
        position: 'fixed',
        bottom: 32,
        right: 32,
        width: 60,
        height: 60,
        borderRadius: '50%',
        background: '#154539',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 12px 24px rgba(21,69,57,0.3)',
        cursor: 'pointer',
        zIndex: 100
      }}>
        <Bot size={28} color="#FFFFFF" />
        <div style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: 14,
          height: 14,
          background: '#10B981',
          borderRadius: '50%',
          border: '3px solid #154539'
        }} />
      </div>

    </div>
  );
}
