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
import { Camera, X, Loader2 } from 'lucide-react';

export default function Optimizer() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Cart analysis state
  const [cartFile, setCartFile] = useState(null);
  const [cartPreview, setCartPreview] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [cartSuggestions, setCartSuggestions] = useState(null);

  const handleCartUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setCartFile(file);
    setCartPreview(URL.createObjectURL(file));
    setCartSuggestions(null);
    setAnalyzing(true);

    const formData = new FormData();
    formData.append('image', file);

    try {
      const token = localStorage.getItem('shopsense_token');
      const res = await axios.post('/api/optimizer/analyze-cart', formData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      });
      if (res.data.success) {
        setCartSuggestions(res.data.data);
      }
    } catch (err) {
      console.error('Cart upload failed', err);
      alert('Failed to analyze cart. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  const clearCart = () => {
    setCartFile(null);
    setCartPreview(null);
    setCartSuggestions(null);
  };

  useEffect(() => {
    const fetchOptimizerData = async () => {
      try {
        const token = localStorage.getItem('shopsense_token');
        const [optRes, comRes] = await Promise.all([
          axios.get('/api/optimizer', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('/api/community/prices', { headers: { Authorization: `Bearer ${token}` } })
        ]);

        if (optRes.data.success) {
          const optimizerData = optRes.data.data;
          if (comRes.data.success) {
            optimizerData.stores = comRes.data.data;
          }
          setData(optimizerData);
        }
      } catch (err) {
        console.error('Failed to fetch data', err);
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
              
              {/* Pre-Purchase Cart Optimizer */}
              <div style={{ background: '#FFF', border: '1px solid #E2E8F0', borderRadius: 24, padding: 24, marginBottom: 32, boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                  <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#0F172A' }}>Pre-Purchase Cart Optimizer</h3>
                  {cartPreview && (
                    <button onClick={clearCart} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}>
                      <X size={20} />
                    </button>
                  )}
                </div>
                
                {!cartPreview ? (
                  <div style={{ border: '2px dashed #CBD5E1', borderRadius: 16, padding: '32px 20px', textAlign: 'center', background: '#F8FAFC', cursor: 'pointer' }} onClick={() => document.getElementById('cart-upload').click()}>
                    <Camera size={32} color="#94A3B8" style={{ margin: '0 auto 12px' }} />
                    <p style={{ margin: '0 0 4px', fontSize: 14, fontWeight: 600, color: '#334155' }}>Upload Cart Screenshot</p>
                    <p style={{ margin: 0, fontSize: 13, color: '#64748B' }}>Analyze your Amazon/Blinkit cart before paying</p>
                    <input id="cart-upload" type="file" accept="image/*" style={{ display: 'none' }} onChange={handleCartUpload} />
                  </div>
                ) : (
                  <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
                    <img src={cartPreview} alt="Cart" style={{ width: 120, height: 'auto', borderRadius: 12, objectFit: 'cover', border: '1px solid #E2E8F0' }} />
                    <div style={{ flex: 1, minWidth: 250 }}>
                      {analyzing ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, height: '100%', color: '#10B981', fontWeight: 600 }}>
                          <Loader2 className="spin" size={20} /> Analyzing items & finding alternatives...
                        </div>
                      ) : (
                        <div>
                          <h4 style={{ margin: '0 0 12px', fontSize: 15, color: '#0F172A' }}>AI Suggestions</h4>
                          {cartSuggestions?.length > 0 ? (
                            <ul style={{ paddingLeft: 20, margin: 0, color: '#334155', fontSize: 14 }}>
                              {cartSuggestions.map((s, i) => (
                                <li key={i} style={{ marginBottom: 8 }}>
                                  <strong>{s.name}</strong>: {s.suggestion} <span style={{ color: '#10B981', fontWeight: 600 }}>(Save ~₹{s.estimatedSavings})</span>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p style={{ margin: 0, color: '#64748B', fontSize: 14 }}>Your cart looks fully optimized! No cheaper alternatives found.</p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
                <style>{`.spin { animation: spin 1s linear infinite; }`}</style>
              </div>

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
