import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/protectedRoute/ProtectedRoute'
import Navbar from './components/layout/Navbar'
import HomePage from './pages/home/HomePage'
import LoginPage from './pages/login/LoginPage'
import RegisterPage from './pages/register/RegisterPage'
import Settings from './pages/settings/SettingsPage'
import ForumPage from './pages/forum/ForumPage'
import LandingPage from './pages/landing/LandingPage'
import ForgotPasswordPage from './pages/resetPassword/ForgotPasswordPage'
import ResetPasswordPage from './pages/resetPassword/ResetPasswordPage'
import ChatTestPage from './pages/chat/ChatTestPage'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path='/' element={<LandingPage />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/register' element={<RegisterPage />} />
          <Route path='/forgot-password' element={<ForgotPasswordPage />} />
          <Route path='/reset-password' element={<ResetPasswordPage />} />
          <Route path='/settings' element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path='/forum' element={<ProtectedRoute><ForumPage /></ProtectedRoute>} />
          <Route path='/chat-test' element={<ProtectedRoute><ChatTestPage /></ProtectedRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App