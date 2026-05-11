import { NavLink } from 'react-router-dom'
import { 
  Smartphone, 
  Tag, 
  Users, 
  ChevronDown,
  Monitor,
  ShieldCheck,
  ClipboardList
} from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../../features/auth/useAuth'

export function Sidebar() {
  const { auth } = useAuth()
  const [isDeviceOpen, setIsDeviceOpen] = useState(true)

  const isAdmin = auth?.role === 'ADMIN'
  const isManager = auth?.role === 'IT_MANAGER' || isAdmin
  const isStaff = auth?.role === 'IT_STAFF' || isManager

  const navItemClass = ({ isActive }) => 
    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
      isActive 
        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' 
        : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
    }`

  const subItemClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 group ${
      isActive
        ? 'text-blue-400 font-medium'
        : 'text-slate-500 hover:text-slate-300'
    }`

  return (
    <aside className="w-72 h-screen bg-slate-950 border-r border-slate-800 flex flex-col fixed left-0 top-0 z-50">
      {/* Logo */}
      <div className="p-8">
        <div className="text-3xl font-bold tracking-tight">
          <span className="text-white">Asset</span>
          <span className="text-blue-500">X</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
        {/* Device Section */}
        {isStaff && (
          <div className="space-y-1">
            <button
              onClick={() => setIsDeviceOpen(!isDeviceOpen)}
              className="w-full flex items-center justify-between px-4 py-3 text-slate-400 hover:text-slate-200 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Monitor size={20} />
                <span className="font-medium">Devices</span>
              </div>
              <ChevronDown 
                size={16} 
                className={`transition-transform duration-200 ${isDeviceOpen ? 'rotate-180' : ''}`} 
              />
            </button>
            
            {isDeviceOpen && (
              <div className="pl-12 space-y-1">
                <NavLink to="/devices" className={subItemClass}>
                  <div className="w-1.5 h-1.5 rounded-full bg-current" />
                  <span>Device Manager</span>
                </NavLink>
                {isManager && (
                  <NavLink to="/brands" className={subItemClass}>
                    <div className="w-1.5 h-1.5 rounded-full bg-current" />
                    <span>Brand Manager</span>
                  </NavLink>
                )}
              </div>
            )}
          </div>
        )}

        {/* User Management - Admin Only */}
        {isAdmin && (
          <NavLink to="/users" className={navItemClass}>
            <Users size={20} />
            <span>User Manager</span>
          </NavLink>
        )}

        {/* Assignments */}
        <NavLink to="/assignments" className={navItemClass}>
          <ClipboardList size={20} />
          <span>Assignments</span>
        </NavLink>
      </nav>

      {/* User Profile Mini */}
      <div className="p-4 mt-auto">
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold">
              {auth?.name?.[0] || auth?.email?.[0]?.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-200 truncate">
                {auth?.name || 'User'}
              </p>
              <p className="text-xs text-slate-500 truncate">
                {auth?.role}
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}
