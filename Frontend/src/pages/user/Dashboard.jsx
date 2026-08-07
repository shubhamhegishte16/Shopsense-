import { useEffect } from 'react';
import Sidebar from '../../components/User/Sidebar';
import TopNav from '../../components/User/TopNav';
import RightPanel from '../../components/User/RightPanel';
import { 
  HeroCard, ShoppingDNACard, AISavingsCard, SmartReceiptCard, 
  PriceRadarCard, RecentActivityCard, SpendingChartCard, PantryEssentialsCard 
} from '../../components/User/DashboardWidgets';

export default function Dashboard() {
  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      background: '#FAFCFC',
      fontFamily: "'Inter', sans-serif"
    }}>
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto', height: '100vh' }}>
        <TopNav />
        
        <div style={{ padding: '0 40px 40px', maxWidth: 1200, margin: '0 auto', width: '100%' }}>
          {/* Header */}
          <div style={{ marginBottom: 32 }}>
            <h1 style={{ fontSize: 32, fontWeight: 800, color: '#0F172A', letterSpacing: '-0.5px', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
              Good Morning, Shubham! <span style={{ fontSize: 28 }}>👋</span>
            </h1>
            <p style={{ fontSize: 16, color: '#64748B', margin: 0 }}>
              Here's your AI shopping overview
            </p>
          </div>

          {/* Hero Widget */}
          <HeroCard />

          {/* Top Row Widgets */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 24,
            marginBottom: 24
          }}>
            <ShoppingDNACard />
            <AISavingsCard />
            <SmartReceiptCard />
            <PriceRadarCard />
          </div>

          {/* Bottom Row Widgets */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1.2fr 2fr 1.2fr',
            gap: 24
          }}>
            <RecentActivityCard />
            <SpendingChartCard />
            <PantryEssentialsCard />
          </div>
        </div>
      </main>

      {/* Right AI Panel */}
      <RightPanel />
    </div>
  );
}
