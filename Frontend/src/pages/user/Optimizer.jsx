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
  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      background: '#FAFCFC',
      fontFamily: "'Inter', sans-serif"
    }}>
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto', height: '100vh' }}>
        <TopNav />

        <div style={{ padding: '0 40px 40px', display: 'flex', gap: 32 }}>

          {/* Left: Main Content */}
          <div style={{ flex: 1 }}>
            {/* Page Header */}
            <div style={{ marginBottom: 28 }}>
              <h1 style={{ fontSize: 26, fontWeight: 800, color: '#0F172A', letterSpacing: '-0.5px', margin: '0 0 4px 0' }}>
                Optimizer
              </h1>
              <p style={{ fontSize: 14, color: '#64748B', margin: 0 }}>
                AI powered insights to help you spend smarter and save more.
              </p>
            </div>

            <OptimizerHero />
            <InsightCards />
            <BottomSection />
          </div>

          {/* Right: Stats Panel */}
          <div style={{ width: 300, flexShrink: 0, paddingTop: 76 }}>
            <SavingsBreakdownPanel />
            <StoreOptimizerPanel />
            <BudgetPlannerPanel />
          </div>

        </div>
      </main>
    </div>
  );
}
