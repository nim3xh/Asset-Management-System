import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../features/auth/useAuth'
import { LogOut } from 'lucide-react'

export function Dashboard() {
  const navigate = useNavigate()
  const { auth, logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-blue-900">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <div className="flex items-center gap-3">
            <div className="text-4xl font-bold tracking-tight">
              <span className="text-white">Asset</span>
              <span className="text-sky-400">X</span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>

        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600/20 to-sky-600/20 border border-blue-500/30 rounded-2xl p-8 mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome, {auth.name || auth.email}!
          </h1>
          <p className="text-slate-300">
            You have successfully logged in to Asset Management System
          </p>
        </div>

        {/* User Info Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <p className="text-slate-400 text-sm mb-2">Email</p>
            <p className="text-white text-lg font-semibold">{auth.email}</p>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <p className="text-slate-400 text-sm mb-2">Role</p>
            <p className="text-white text-lg font-semibold">{auth.role || 'N/A'}</p>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <p className="text-slate-400 text-sm mb-2">Status</p>
            <p className="text-green-400 text-lg font-semibold">Active</p>
          </div>
        </div>

        {/* Placeholder for future features */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-white mb-4">Asset Management Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {['View Assets', 'Manage Devices', 'User Management', 'Reports'].map((feature) => (
              <div key={feature} className="bg-slate-700/50 rounded-lg p-4 text-center">
                <p className="text-slate-300">{feature}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
