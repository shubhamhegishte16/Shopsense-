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
import Community from './pages/user/Community'
import Profile from './pages/user/Profile'
import Settings from './pages/user/Settings'
import Notifications from './pages/user/Notifications'
import AdminDashboard from './pages/admin/AdminDashboard'

import UserManagement from './pages/admin/UserManagement'
import ReceiptManagement from './pages/admin/ReceiptManagement'
import ProductDatabase from './pages/admin/ProductDatabase'
import FoodRecallManagement from './pages/admin/FoodRecallManagement'
import CommunityInsights from './pages/admin/CommunityInsights'
import NotificationManagement from './pages/admin/NotificationManagement'
import ReportsAnalytics from './pages/admin/ReportsAnalytics'
import AdminSettings from './pages/admin/AdminSettings'
import AdminProfile from './pages/admin/AdminProfile'

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
          <Route path="/community" element={<Community />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/settings/:section" element={<Settings />} />
          <Route path="/admin" element={<AdminDashboard />} />

          <Route path="/admin/users" element={<UserManagement />} />
          <Route path="/admin/receipts" element={<ReceiptManagement />} />
          <Route path="/admin/products" element={<ProductDatabase />} />
          <Route path="/admin/recalls" element={<FoodRecallManagement />} />
          <Route path="/admin/community" element={<CommunityInsights />} />
          <Route path="/admin/notifications" element={<NotificationManagement />} />
          <Route path="/admin/reports" element={<ReportsAnalytics />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
          <Route path="/admin/profile" element={<AdminProfile />} />
        </Routes>
      </Router>
    </ThemeProvider>
  )
}
