import { Sidebar } from './Sidebar'
import { LogOut } from 'lucide-react'
import { useNavigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../features/auth/useAuth'

export function Layout({ children }) {
  const navigate = useNavigate()
  const { logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="flex min-h-screen bg-slate-950">
      <Sidebar />
      <div className="flex-1 ml-72 flex flex-col">
        {/* Top Header */}
        <header className="h-20 border-b border-slate-800 flex items-center justify-end px-8 sticky top-0 bg-slate-950/80 backdrop-blur-md z-40">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-slate-400 hover:text-white hover:bg-red-600/10 hover:border-red-600/30 border border-transparent rounded-xl transition-all duration-200"
          >
            <LogOut size={18} />
            <span className="font-medium">Logout</span>
          </button>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
