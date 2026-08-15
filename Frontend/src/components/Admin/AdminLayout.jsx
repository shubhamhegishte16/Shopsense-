import AdminSidebar from './AdminSidebar';

export default function AdminLayout({ title, subtitle, actions, children, detailPanel }) {
  return (
    <div className="admin-shell">
      <div className="admin-sidebar-wrapper">
        <AdminSidebar />
      </div>
      <main className={`admin-main ${detailPanel ? 'has-detail-panel' : ''}`}>
        <div className="admin-content">
          <header className="admin-page-header">
            <div>
              <h1>{title}</h1>
              <p>{subtitle}</p>
            </div>
            {actions && <div className="admin-header-actions">{actions}</div>}
          </header>
          {children}
        </div>
        {detailPanel}
      </main>
    </div>
  );
}
