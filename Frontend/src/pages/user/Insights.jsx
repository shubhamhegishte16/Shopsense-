import { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../../components/User/Sidebar';
import TopNav from '../../components/User/TopNav';
import {
  InsightsHeader,
  InsightsActionBar,
  InsightStatCards,
  SpendingTrendPanel,
  SpendingByCategoryPanel,
  TopCategoriesPanel,
  MonthlyComparisonPanel,
  InsightsForYouPanel,
  SmartSummaryPanel,
} from '../../components/User/InsightsWidgets';

export default function Insights() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const token = localStorage.getItem('shopsense_token');
        const res = await axios.get('http://localhost:5000/api/insights', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data.success) {
          setData(res.data.data);
        }
      } catch (err) {
        console.error('Failed to fetch insights', err);
      } finally {
        setLoading(false);
      }
    };
    fetchInsights();
  }, []);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#FAFCFC', fontFamily: "'Inter', sans-serif" }}>
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto', height: '100vh' }}>
        <TopNav />

        <div style={{ padding: '32px 40px 48px' }}>
          {/* Page Header + Action Bar (inline, space-between) */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28 }}>
            <InsightsHeader />
            <InsightsActionBar />
          </div>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '100px 0' }}>
              <div style={{ color: '#64748B', fontWeight: 600 }}>Loading Insights...</div>
            </div>
          ) : !data ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '100px 0' }}>
              <div style={{ color: '#EF4444', fontWeight: 600 }}>Failed to load insights.</div>
            </div>
          ) : (
            <>
              {/* Stat Cards Row */}
              <InsightStatCards stats={data.stats} />

              {/* Main Grid: left 2/3 + right 1/3 */}
              <div style={{ display: 'flex', gap: 24 }}>

                {/* Left Column */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <SpendingTrendPanel data={data.spendingTrendData} />

                  {/* Row: Category donut + Monthly Comparison */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
                    <SpendingByCategoryPanel data={data.categoryData} totalSpent={data.totalSpent} />
                    <MonthlyComparisonPanel data={data.monthlyData} thisMonthTotal={data.totalSpent} lastMonthTotal={data.lastMonthTotal} />
                  </div>

                  <InsightsForYouPanel data={data.aiInsights} />
                </div>

                {/* Right Column */}
                <div style={{ width: 300, flexShrink: 0 }}>
                  <TopCategoriesPanel data={data.topCategories} />
                  <SmartSummaryPanel points={data.summaryPoints} totalSpent={data.totalSpent} lastMonthTotal={data.lastMonthTotal} />
                </div>

              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
