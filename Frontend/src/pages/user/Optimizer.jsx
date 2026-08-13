import { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../../components/User/Sidebar';
import TopNav from '../../components/User/TopNav';
import {
  OptimizerHero,
  InsightCards,
  BottomSection,
  SavingsBreakdownPanel,
  StoreOptimizerPanel,
  BudgetPlannerPanel
} from '../../components/User/OptimizerWidgets';

export default function Optimizer() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOptimizerData = async () => {
      try {
        const token = localStorage.getItem('shopsense_token');
        const res = await axios.get('http://localhost:5000/api/optimizer', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data.success) {
          setData(res.data.data);
        }
      } catch (err) {
        console.error('Failed to fetch optimizer data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOptimizerData();
  }, []);

  return (
    <div className="page-wrapper">
      {/* Left Sidebar */}
      <div className="sidebar-wrapper"><Sidebar /></div>

      {/* Main Content */}
      <main className="responsive-main">
        <TopNav titleNode={
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: '#0F172A', letterSpacing: '-0.5px', margin: '0 0 4px 0' }}>
              Optimizer
            </h1>
            <p style={{ fontSize: 14, color: '#64748B', margin: 0 }}>
              AI powered insights to help you spend smarter and save more.
            </p>
          </div>
        } />

        {loading ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
            gap: 16
          }}>
            <div style={{
              width: 50,
              height: 50,
              border: '4px solid #E2E8F0',
              borderTop: '4px solid #10B981',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }} />
            <p style={{ color: '#64748B', fontSize: 14, fontWeight: 500 }}>Analyzing shopping habits & optimizing budget...</p>
            <style>{`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        ) : (
          <div className="content-with-right responsive-padding">

            {/* Left: Main Content */}
            <div style={{ flex: 1 }}>
              <OptimizerHero data={data} />
              <InsightCards cards={data?.insightCards} />
              <BottomSection recommendations={data?.recommendations} reorders={data?.reorders} />
            </div>

            {/* Right: Stats Panel */}
            <div className="right-panel-aside" style={{ paddingTop: 76 }}>
              <SavingsBreakdownPanel categoryData={data?.categoryData} totalSavings={data?.totalSavings} />
              <StoreOptimizerPanel stores={data?.stores} />
              <BudgetPlannerPanel budgetData={data?.budget} />
            </div>

          </div>
        )}
      </main>
    </div>
  );
}
