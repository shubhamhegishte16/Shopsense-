import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './hooks/useTheme'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/user/Dashboard'
import Receipts from './pages/user/Receipts'
import Optimizer from './pages/user/Optimizer'
import Compare from './pages/user/Compare'
import Pantry from './pages/user/Pantry'
import Insights from './pages/user/Insights'
import ChatAI from './pages/user/ChatAI'
import Profile from './pages/user/Profile'
import Settings from './pages/user/Settings'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminLogin from './pages/admin/AdminLogin'
import UserManagement from './pages/admin/UserManagement'
import ReceiptManagement from './pages/admin/ReceiptManagement'
import ProductDatabase from './pages/admin/ProductDatabase'
import FoodRecallManagement from './pages/admin/FoodRecallManagement'
import CommunityInsights from './pages/admin/CommunityInsights'

export default function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/receipts" element={<Receipts />} />
          <Route path="/optimizer" element={<Optimizer />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/pantry" element={<Pantry />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/chat" element={<ChatAI />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/settings/:section" element={<Settings />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/users" element={<UserManagement />} />
          <Route path="/admin/receipts" element={<ReceiptManagement />} />
          <Route path="/admin/products" element={<ProductDatabase />} />
          <Route path="/admin/recalls" element={<FoodRecallManagement />} />
          <Route path="/admin/community" element={<CommunityInsights />} />
        </Routes>
      </Router>
    </ThemeProvider>
  )
}
