import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from '../features/auth/AuthContext'
import { PrivateRoute } from './components/PrivateRoute'
import { AuthPage } from './pages/AuthPage'
import { Dashboard } from './pages/Dashboard'
import { BrandManager } from './pages/BrandManager'
import { DeviceManager } from './pages/DeviceManager'
import { UserManager } from './pages/UserManager'
import { AssignmentManager } from './pages/AssignmentManager'
import { Layout } from './components/Layout'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<AuthPage />} />
          
          <Route element={<PrivateRoute><Layout /></PrivateRoute>}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/devices" element={<DeviceManager />} />
            <Route path="/brands" element={<BrandManager />} />
            <Route path="/users" element={<UserManager />} />
            <Route path="/assignments" element={<AssignmentManager />} />
          </Route>

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
