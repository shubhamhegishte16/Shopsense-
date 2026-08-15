import { AlertTriangle, Boxes, Edit3, Eye, Filter, MoreVertical, PackageCheck, Plus, Search, Store, Tag } from 'lucide-react';
import AdminLayout from '../../components/Admin/AdminLayout';
import { AdminButton, AdminStatCard, StatusBadge, TablePagination } from '../../components/Admin/AdminUI';
import { products } from './adminData';

const stats = [
  [Boxes, 'Total Products', '8,523', '+3.6%', 'green'],
  [Tag, 'Active Products', '8,102', '+2.9%', 'green'],
  [AlertTriangle, 'Recalled Products', '24', '-4.0%', 'amber'],
  [Eye, 'Total Categories', '128', '+1.6%', 'blue'],
  [Store, 'Total Brands', '312', '+2.3%', 'green'],
];

function ProductThumb() {
  return (
    <span className="admin-product-thumb">
      <PackageCheck size={18} />
    </span>
  );
}

function ProductDetailPanel() {
  return (
    <aside className="admin-detail-panel">
      <div className="admin-detail-header">
        <h2>Product Details</h2>
        <button className="admin-icon-btn" type="button" aria-label="Close product details">x</button>
      </div>
      <div className="admin-detail-body">
        <div className="admin-product-hero">
          <ProductThumb />
          <div>
            <h3>Amul Taaza Toned Milk 1 L</h3>
            <StatusBadge tone="green">Active</StatusBadge>
            <p><span>Brand</span> Amul</p>
            <p><span>Category</span> Dairy & Eggs</p>
            <p><span>Store</span> D-Mart</p>
          </div>
        </div>
        <div className="admin-detail-section">
          <h4>Basic Information</h4>
          <dl className="admin-detail-list">
            <dt>Product ID</dt><dd>PRD-0008523</dd>
            <dt>Barcode</dt><dd>8901262000016</dd>
            <dt>Unit</dt><dd>1L</dd>
            <dt>Selling Price</dt><dd>&#8377;65.00</dd>
            <dt>Added On</dt><dd>Aug 14, 2026 10:30 AM</dd>
            <dt>Added By</dt><dd>Admin</dd>
          </dl>
        </div>
        <div className="admin-detail-section">
          <h4>Status & Recall</h4>
          <dl className="admin-detail-list">
            <dt>Recall Status</dt><dd>-</dd>
            <dt>Product Status</dt><dd><StatusBadge tone="green">Active</StatusBadge></dd>
          </dl>
        </div>
        <div className="admin-detail-section">
          <h4>Statistics</h4>
          <dl className="admin-detail-list">
            <dt>Total Times Purchased</dt><dd>1,248</dd>
            <dt>Unique Users Purchased</dt><dd>892</dd>
            <dt>Average Price</dt><dd>&#8377;64.20</dd>
            <dt>Last Updated</dt><dd>Aug 14, 2026 11:20 AM</dd>
          </dl>
        </div>
        <div className="admin-detail-actions">
          <AdminButton icon={Edit3}>Edit</AdminButton>
          <AdminButton icon={AlertTriangle}>Recall</AdminButton>
        </div>
      </div>
    </aside>
  );
}

export default function ProductDatabase() {
  return (
    <AdminLayout
      title="Product Database"
      subtitle="Manage and maintain all products in the system."
      actions={(
        <>
          <label className="admin-search product-search"><Search size={19} /><input placeholder="Search by product name, brand, category..." /></label>
          <AdminButton icon={Filter}>Filter</AdminButton>
          <AdminButton icon={Plus} variant="primary">Add Product</AdminButton>
        </>
      )}
      detailPanel={<ProductDetailPanel />}
    >
      <div className="admin-stat-grid product-stat-grid">
        {stats.map(([icon, label, value, trend, tone]) => (
          <AdminStatCard key={label} icon={icon} label={label} value={value} trend={trend} tone={tone} />
        ))}
      </div>
      <section className="admin-table-card">
        <div className="admin-table-title stacked">
          <h2>All Products</h2>
          <div className="admin-tabs">
            <button className="is-active">All (8,523)</button><button>Active (8,102)</button><button>Recalled (24)</button><button>Inactive (397)</button>
          </div>
        </div>
        <div className="admin-filter-row">
          {['All Categories', 'All Brands', 'All Stores', 'All', 'All'].map((label) => <button key={label} type="button">{label}<span>v</span></button>)}
          <button type="button">Clear</button>
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table products-table">
            <thead>
              <tr><th><input type="checkbox" /></th><th>Product Name</th><th>Brand</th><th>Category</th><th>Store</th><th>Price</th><th>Recall Status</th><th>Status</th><th>Added On</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {products.map(([name, brand, category, store, price, recall, status, added]) => (
                <tr key={name}>
                  <td><input type="checkbox" /></td>
                  <td><div className="admin-product-name"><ProductThumb /><strong>{name}</strong></div></td>
                  <td>{brand}</td><td>{category}</td><td>{store}</td><td>&#8377;{price}</td>
                  <td>{recall === 'Recalled' ? <StatusBadge tone="red">Recalled</StatusBadge> : '-'}</td>
                  <td><StatusBadge tone="green">{status}</StatusBadge></td>
                  <td>{added}</td>
                  <td><div className="admin-row-actions"><button><Edit3 size={16} /></button><button><MoreVertical size={16} /></button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <TablePagination totalLabel="Showing 1 to 10 of 8,523 products" lastPage="853" />
      </section>
    </AdminLayout>
  );
}
