import { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../../components/User/Sidebar';
import { Search, Bell, RotateCw, X, Search as SearchIcon } from 'lucide-react';
import { CompareHero, StoreComparisonTable, YouCanSavePanel, PriceTrendPanel, SmartPicksPanel } from '../../components/User/CompareWidgets';

function CompareTopNav({ titleNode, onOpenSearch }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      padding: '32px 40px 24px', background: '#FAFCFC',
      position: 'sticky', top: 0, zIndex: 10,
      borderBottom: '1px solid #F1F5F9',
      width: '100%', boxSizing: 'border-box'
    }}>
      {/* Top Row: Title + Icons */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: titleNode ? 24 : 0, width: '100%' }}>
        <div>{titleNode}</div>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <button style={{ width: 44, height: 44, borderRadius: '50%', border: '1px solid #E2E8F0', background: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', position: 'relative' }}>
            <Bell size={20} color="#334155" />
            <div style={{ position: 'absolute', top: 10, right: 12, width: 8, height: 8, background: '#10B981', borderRadius: '50%', border: '2px solid #FFF' }} />
            <div style={{ position: 'absolute', top: -2, right: -2, background: '#154539', color: '#FFF', fontSize: 9, fontWeight: 800, width: 16, height: 16, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #FAFCFC' }}>3</div>
          </button>
          <button style={{ width: 44, height: 44, borderRadius: '50%', border: '1px solid #E2E8F0', background: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <RotateCw size={18} color="#334155" />
          </button>
        </div>
      </div>
    </div>
  );
}

function BarChartIcon(props) {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>;
}

export default function Compare() {
  const [searchedProduct, setSearchedProduct] = useState(null);
  const [loading, setLoading] = useState(false);

  // Form Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formName, setFormName] = useState('');
  const [formBrand, setFormBrand] = useState('');
  const [formCategory, setFormCategory] = useState('Groceries');
  const [formDesc, setFormDesc] = useState('');

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formName.trim()) return;

    setIsModalOpen(false);
    setLoading(true);

    try {
      const token = localStorage.getItem('shopsense_token');
      const res = await axios.post('http://localhost:5000/api/compare/search-stores', {
        productName: formName,
        brand: formBrand,
        category: formCategory,
        description: formDesc
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success) {
        setSearchedProduct(res.data.product);
      }
    } catch (err) {
      console.error('Search failed', err);
      alert('Failed to generate product comparison. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#FAFCFC', fontFamily: "'Inter', sans-serif" }}>
      <Sidebar />

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto', height: '100vh' }}>
        <CompareTopNav 
          onOpenSearch={() => setIsModalOpen(true)}
          titleNode={
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.5px' }}>Compare</h1>
              <BarChartIcon size={22} color="#10B981" />
            </div>
          } 
        />

        <div style={{ padding: '0 40px', marginTop: -20, marginBottom: 20 }}>
          <button 
            onClick={() => setIsModalOpen(true)}
            style={{
              display: 'flex', alignItems: 'center', gap: 12,
              background: '#FFFFFF', border: '1px solid #E2E8F0',
              borderRadius: 999, padding: '12px 24px',
              width: '100%', maxWidth: 500,
              boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
              cursor: 'pointer', color: '#64748B', fontSize: 15
            }}
          >
            <SearchIcon size={20} color="#94A3B8" />
            <span>Search for a product to compare across all stores...</span>
          </button>
        </div>

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, gap: 16 }}>
            <div style={{ width: 50, height: 50, border: '4px solid #E2E8F0', borderTop: '4px solid #10B981', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
            <p style={{ color: '#64748B', fontSize: 15, fontWeight: 500 }}>Scanning stores with AI...</p>
            <style>{`
              @keyframes spin { transform: rotate(0deg); } to { transform: rotate(360deg); }
            `}</style>
          </div>
        ) : !searchedProduct ? (
           <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, gap: 16 }}>
            <div style={{ width: 80, height: 80, background: '#E2E8F0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
              <SearchIcon size={40} color="#94A3B8" />
            </div>
            <h2 style={{ color: '#0F172A', fontSize: 20, margin: 0, fontWeight: 700 }}>Real-time Store Comparison</h2>
            <p style={{ color: '#64748B', fontSize: 15, textAlign: 'center', maxWidth: 400, marginTop: 0 }}>
              Search for any product to instantly compare live prices, delivery times, and ratings across all top online stores.
            </p>
          </div>
        ) : (
          <div style={{ padding: '0 40px 40px', display: 'flex', gap: 32 }}>
            {/* Main Content */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 24 }}>
              <CompareHero product={searchedProduct} />
              <StoreComparisonTable comparisons={searchedProduct.comparisons} />
            </div>

            {/* Right Panel */}
            <div style={{ width: 300, flexShrink: 0 }}>
              <YouCanSavePanel product={searchedProduct} />
              <PriceTrendPanel product={searchedProduct} />
              <SmartPicksPanel />
            </div>
          </div>
        )}
      </main>

      {/* Modal Form Overlay */}
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.4)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999
        }}>
          <div style={{
            background: '#FFFFFF',
            borderRadius: 24,
            width: '100%',
            maxWidth: 480,
            padding: 36,
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            boxSizing: 'border-box'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0F172A', margin: 0 }}>Search Product Across Stores</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#475569', marginBottom: 6 }}>PRODUCT NAME *</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Aashirvaad Atta, iPhone 15 Pro, Standing Desk"
                  style={{ width: '100%', padding: '12px 16px', borderRadius: 10, border: '1px solid #CBD5E1', outline: 'none', fontSize: 14, color: '#0F172A', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#475569', marginBottom: 6 }}>BRAND / COMPANY (Optional)</label>
                <input
                  type="text"
                  value={formBrand}
                  onChange={(e) => setFormBrand(e.target.value)}
                  placeholder="e.g. ITC, Apple, IKEA"
                  style={{ width: '100%', padding: '12px 16px', borderRadius: 10, border: '1px solid #CBD5E1', outline: 'none', fontSize: 14, color: '#0F172A', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#475569', marginBottom: 6 }}>CATEGORY</label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  style={{ width: '100%', padding: '12px 16px', borderRadius: 10, border: '1px solid #CBD5E1', outline: 'none', fontSize: 14, color: '#0F172A', background: '#FFF', boxSizing: 'border-box' }}
                >
                  <option value="Groceries">Groceries</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Furniture">Furniture</option>
                  <option value="Household">Household</option>
                  <option value="General">General E-Commerce</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#475569', marginBottom: 6 }}>ADDITIONAL DETAILS (Optional)</label>
                <input
                  type="text"
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder="e.g. 5kg, 128GB, 120x60cm"
                  style={{ width: '100%', padding: '12px 16px', borderRadius: 10, border: '1px solid #CBD5E1', outline: 'none', fontSize: 14, color: '#0F172A', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{ flex: 1, padding: '14px 0', border: '1px solid #CBD5E1', background: '#FFFFFF', borderRadius: 12, fontSize: 14, fontWeight: 600, color: '#64748B', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ flex: 1, padding: '14px 0', border: 'none', background: '#154539', borderRadius: 12, fontSize: 14, fontWeight: 600, color: '#FFFFFF', cursor: 'pointer', boxShadow: '0 8px 16px rgba(21, 69, 57, 0.15)' }}
                >
                  Compare Now
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
