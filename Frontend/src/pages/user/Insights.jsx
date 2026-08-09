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

          {/* Stat Cards Row */}
          <InsightStatCards />

          {/* Main Grid: left 2/3 + right 1/3 */}
          <div style={{ display: 'flex', gap: 24 }}>

            {/* Left Column */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <SpendingTrendPanel />

              {/* Row: Category donut + Monthly Comparison */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
                <SpendingByCategoryPanel />
                <MonthlyComparisonPanel />
              </div>

              <InsightsForYouPanel />
            </div>

            {/* Right Column */}
            <div style={{ width: 300, flexShrink: 0 }}>
              <TopCategoriesPanel />
              <SmartSummaryPanel />
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
