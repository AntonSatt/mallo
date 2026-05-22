import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/protectedRoute/ProtectedRoute'
import LoginPage from './pages/login/LoginPage'
import RegisterPage from './pages/register/RegisterPage'
import Settings from './pages/settings/SettingsPage'
import ForumPage from './pages/forum/ForumPage'
import LandingPage from './pages/landing/LandingPage'
import HomePage from './pages/home/HomePage'
import ForgotPasswordPage from './pages/resetPassword/ForgotPasswordPage'
import ResetPasswordPage from './pages/resetPassword/ResetPasswordPage'
import ConversationPage from './pages/chat/ConversationPage';
import ActivityPage from './pages/activity/ActivityPage.jsx'
import "moment/dist/locale/sv";

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
          <Route path='/forum' element={<ProtectedRoute><HomePage page="forum" /></ProtectedRoute>} />
          <Route path='/message' element={<ProtectedRoute><HomePage page="message" /></ProtectedRoute>} />
          <Route path='/message/:userId' element={<ProtectedRoute><HomePage page="conversation" /></ProtectedRoute>} />
          <Route path='/maps' element={<ProtectedRoute><HomePage page="maps" /></ProtectedRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App