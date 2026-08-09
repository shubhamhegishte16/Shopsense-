import { useState } from 'react';
import Sidebar from '../../components/User/Sidebar';
import TopNav from '../../components/User/TopNav';
import { 
  ReceiptsHeader, 
  UploadZone, 
  CategoryFilters, 
  ReceiptGrid, 
  ReceiptSummaryPanel, 
  TopCategoriesPanel, 
  AIInsightPanel 
} from '../../components/User/ReceiptsWidgets';

export default function Receipts() {
  // Increment this to trigger ReceiptGrid to re-fetch receipts from the backend
  const [refreshTrigger, setRefreshTrigger] = useState(0);

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
        <TopNav showReceiptFilters={true} />
        
        <div style={{ padding: '0 40px 40px', maxWidth: 1400, margin: '0 auto', width: '100%', display: 'flex', gap: 32 }}>
          
          {/* Left Column (Main) */}
          <div style={{ flex: 1 }}>
            <ReceiptsHeader />
            <UploadZone onUploadSuccess={() => setRefreshTrigger(t => t + 1)} />
            <CategoryFilters />
            <ReceiptGrid refreshTrigger={refreshTrigger} />
          </div>

          {/* Right Column (Sidebar for Receipts) */}
          <div style={{ width: 300, flexShrink: 0, marginTop: 76 }}>
            <ReceiptSummaryPanel />
            <TopCategoriesPanel />
            <AIInsightPanel />
          </div>

        </div>
      </main>
    </div>
  );
}
