import { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../../components/User/Sidebar';
import TopNav from '../../components/User/TopNav';
import RightPanel from '../../components/User/RightPanel';
import { 
  HeroCard, ShoppingDNACard, AISavingsCard, SmartReceiptCard, 
  PriceRadarCard, RecentActivityCard, SpendingChartCard, PantryEssentialsCard 
} from '../../components/User/DashboardWidgets';

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('shopsense_token');
        const res = await axios.get('http://localhost:5000/api/dashboard', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data.success) {
          setDashboardData(res.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  return (
    <div className="responsive-flex-wrap" style={{
      minHeight: '100vh',
      background: '#FAFCFC',
      fontFamily: "'Inter', sans-serif"
    }}>
      {/* Left Sidebar */}
      <div className="sidebar-wrapper">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <main className="responsive-main">
        <TopNav titleNode={
          <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%' }}>
            <h1 style={{ fontSize: 32, fontWeight: 800, color: '#0F172A', letterSpacing: '-0.5px', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
              Good Morning! <span style={{ fontSize: 28 }}>👋</span>
            </h1>
            <p style={{ fontSize: 16, color: '#64748B', margin: 0 }}>
              Here's your AI shopping overview
            </p>
          </div>
        } />
        
        <div className="responsive-padding" style={{ maxWidth: 1200, margin: '0 auto', width: '100%' }}>
          {loading ? (
            <div style={{ padding: 40, textAlign: 'center', color: '#64748B' }}>Loading Dashboard...</div>
          ) : (
            <>
              {/* Hero Widget */}
              <HeroCard data={dashboardData?.heroStats} />

              {/* Top Row Widgets */}
              <div className="responsive-grid-4" style={{ marginBottom: 24 }}>
                <ShoppingDNACard data={dashboardData?.shoppingDNA} />
                <AISavingsCard data={dashboardData?.aiSavings} />
                <SmartReceiptCard />
                <PriceRadarCard data={dashboardData?.priceRadar} />
              </div>

              {/* Bottom Row Widgets */}
              <div className="responsive-grid-3">
                <RecentActivityCard data={dashboardData?.recentActivity} />
                <SpendingChartCard data={dashboardData?.spendingChart} />
                <PantryEssentialsCard data={dashboardData?.pantryEssentials} />
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
