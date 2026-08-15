import { useEffect, useState, useMemo } from 'react';
import { AlertTriangle, Boxes, Edit3, Eye, Filter, MoreVertical, PackageCheck, Plus, Search, Store, Tag } from 'lucide-react';
import AdminLayout from '../../components/Admin/AdminLayout';
import { AdminButton, AdminStatCard, StatusBadge, TablePagination } from '../../components/Admin/AdminUI';
import { apiRequest, formatDate, formatCurrency } from '../../utils/api';

function ProductThumb() {
  return (
    <span className="admin-product-thumb">
      <PackageCheck size={18} />
    </span>
  );
}

function ProductDetailPanel({ product, onClose }) {
  if (!product) return null;
  return (
    <aside className="admin-detail-panel">
      <div className="admin-detail-header">
        <h2>Product Details</h2>
        <button className="admin-icon-btn" type="button" aria-label="Close product details" onClick={onClose}>x</button>
      </div>
      <div className="admin-detail-body">
        <div className="admin-product-hero">
          <ProductThumb />
          <div>
            <h3>{product.name}</h3>
            <StatusBadge tone={product.status === 'Active' ? 'green' : 'orange'}>{product.status}</StatusBadge>
            <p><span>Brand</span> {product.brand}</p>
            <p><span>Category</span> {product.category}</p>
            <p><span>Store</span> {product.store}</p>
          </div>
        </div>
        <div className="admin-detail-section">
          <h4>Basic Information</h4>
          <dl className="admin-detail-list">
            <dt>Product ID</dt><dd>{String(product._id).slice(-8).toUpperCase()}</dd>
            <dt>Unit</dt><dd>{product.defaultUnit || '-'}</dd>
            <dt>Selling Price</dt><dd>&#8377;{formatCurrency(product.price)}</dd>
            <dt>Added On</dt><dd>{formatDate(product.createdAt)}</dd>
          </dl>
        </div>
        <div className="admin-detail-section">
          <h4>Status & Recall</h4>
          <dl className="admin-detail-list">
            <dt>Recall Status</dt><dd>{product.recallStatus === 'Recalled' ? <StatusBadge tone="red">Recalled</StatusBadge> : 'None'}</dd>
            <dt>Product Status</dt><dd><StatusBadge tone={product.status === 'Active' ? 'green' : 'orange'}>{product.status}</StatusBadge></dd>
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
  const [rows, setRows] = useState([]);
  const [stats, setStats] = useState({ totalProducts: 0, activeProducts: 0, recalledProducts: 0, totalCategories: 0, totalBrands: 0 });
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);

  async function loadProducts(query = search) {
    setLoading(true);
    setError('');
    try {
      const data = await apiRequest('/api/admin/products' + (query ? '?search=' + encodeURIComponent(query) : ''));
      setRows(data.products || []);
      setStats(data.stats || { totalProducts: 0, activeProducts: 0, recalledProducts: 0, totalCategories: 0, totalBrands: 0 });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadProducts(''); }, []);

  const statCards = useMemo(() => [
    [Boxes, 'Total Products', stats.totalProducts, '', 'green'],
    [Tag, 'Active Products', stats.activeProducts, '', 'green'],
    [AlertTriangle, 'Recalled Products', stats.recalledProducts, '', 'amber'],
    [Eye, 'Total Categories', stats.totalCategories, '', 'blue'],
    [Store, 'Total Brands', stats.totalBrands, '', 'green'],
  ], [stats]);

  return (
    <AdminLayout
      title="Product Database"
      subtitle="Manage and maintain all products in the system."
      actions={(
        <>
          <label className="admin-search product-search">
            <Search size={19} />
            <input placeholder="Search by product name, brand, category..." value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && loadProducts()} />
          </label>
          <AdminButton icon={Filter} onClick={() => loadProducts()}>Filter</AdminButton>
          <AdminButton icon={Plus} variant="primary">Add Product</AdminButton>
        </>
      )}
      detailPanel={<ProductDetailPanel product={selectedProduct} onClose={() => setSelectedProduct(null)} />}
    >
      <div className="admin-stat-grid product-stat-grid">
        {statCards.map(([icon, label, value, trend, tone]) => (
          <AdminStatCard key={label} icon={icon} label={label} value={value} trend={trend} tone={tone} />
        ))}
      </div>
      
      {error && <p className="admin-error">{error}</p>}
      
      <section className="admin-table-card">
        <div className="admin-table-title stacked">
          <h2>All Products</h2>
          <div className="admin-tabs">
            <button className="is-active">All ({stats.totalProducts})</button>
            <button>Active ({stats.activeProducts})</button>
            <button>Recalled ({stats.recalledProducts})</button>
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
              {loading ? (
                <tr><td colSpan="10">Loading products...</td></tr>
              ) : rows.length ? rows.map((product) => (
                <tr key={product._id}>
                  <td><input type="checkbox" /></td>
                  <td><div className="admin-product-name"><ProductThumb /><strong>{product.name}</strong></div></td>
                  <td>{product.brand}</td>
                  <td>{product.category}</td>
                  <td>{product.store}</td>
                  <td>&#8377;{formatCurrency(product.price)}</td>
                  <td>{product.recallStatus === 'Recalled' ? <StatusBadge tone="red">Recalled</StatusBadge> : '-'}</td>
                  <td><StatusBadge tone={product.status === 'Active' ? 'green' : 'orange'}>{product.status}</StatusBadge></td>
                  <td>{formatDate(product.createdAt)}</td>
                  <td>
                    <div className="admin-row-actions">
                      <button type="button" onClick={() => setSelectedProduct(product)}><Eye size={16} /></button>
                      <button type="button"><Edit3 size={16} /></button>
                      <button type="button"><MoreVertical size={16} /></button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="10">No products found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <TablePagination totalLabel={`Showing ${rows.length ? 1 : 0} to ${rows.length} of ${stats.totalProducts} products`} />
      </section>
    </AdminLayout>
  );
}
