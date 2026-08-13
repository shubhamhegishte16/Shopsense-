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
    <div className="page-wrapper">
      {/* Left Sidebar */}
      <div className="sidebar-wrapper"><Sidebar /></div>

      {/* Main Content */}
      <main className="responsive-main">
        <TopNav titleNode={
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <InsightsHeader />
            <InsightsActionBar />
          </div>
        } />

        <div className="responsive-padding" style={{ paddingTop: 0 }}>

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
              <div className="content-with-right">

                {/* Left Column */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <SpendingTrendPanel data={data.spendingTrendData} />

                  {/* Row: Category donut + Monthly Comparison */}
                  <div className="responsive-grid-2" style={{ marginBottom: 24 }}>
                    <SpendingByCategoryPanel data={data.categoryData} totalSpent={data.totalSpent} />
                    <MonthlyComparisonPanel data={data.monthlyData} thisMonthTotal={data.totalSpent} lastMonthTotal={data.lastMonthTotal} />
                  </div>

                  <InsightsForYouPanel data={data.aiInsights} />
                </div>

                {/* Right Column */}
                <div className="right-panel-aside">
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
