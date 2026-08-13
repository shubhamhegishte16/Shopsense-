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
  AIInsightPanel,
  useReceipts
} from '../../components/User/ReceiptsWidgets';

export default function Receipts() {
  // Increment this to trigger ReceiptGrid to re-fetch receipts from the backend
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { receipts, loading, fetchError, fetchReceipts } = useReceipts(refreshTrigger);

  return (
    <div className="page-wrapper">
      {/* Left Sidebar */}
      <div className="sidebar-wrapper"><Sidebar /></div>

      {/* Main Content Area */}
      <main className="responsive-main">
        <TopNav showReceiptFilters={true} titleNode={<ReceiptsHeader />} />
        
        <div className="content-with-right responsive-padding" style={{ maxWidth: 1400, margin: '0 auto', width: '100%' }}>
          
          {/* Left Column (Main) */}
          <div style={{ flex: 1 }}>
            <UploadZone onUploadSuccess={() => setRefreshTrigger(t => t + 1)} />
            <CategoryFilters receipts={receipts} />
            <ReceiptGrid receipts={receipts} loading={loading} fetchError={fetchError} fetchReceipts={fetchReceipts} />
          </div>

          {/* Right Column (Sidebar for Receipts) */}
          <div className="right-panel-aside" style={{ marginTop: 76 }}>
            <ReceiptSummaryPanel receipts={receipts} />
            <TopCategoriesPanel receipts={receipts} />
            <AIInsightPanel receipts={receipts} />
          </div>

        </div>
      </main>
    </div>
  );
}
