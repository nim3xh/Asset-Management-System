import { useAuth } from '../../features/auth/useAuth'

export function Dashboard() {
  const { auth } = useAuth()

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Welcome Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-10 text-white shadow-2xl shadow-blue-900/20">
        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-4">
            Welcome back, {auth.name || auth.email.split('@')[0]}!
          </h1>
          <p className="text-blue-100 text-lg max-w-2xl">
            Manage your organization's assets with ease. You have full access to the 
            {auth.role === 'ADMIN' ? ' administrative tools' : ' management features'} assigned to your profile.
          </p>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-64 h-64 bg-indigo-400/20 rounded-full blur-3xl" />
      </div>

      {/* Stats/Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Role Authority', value: auth.role || 'IT Staff', color: 'text-blue-400' },
          { label: 'Login Email', value: auth.email, color: 'text-slate-200' },
          { label: 'System Status', value: 'Operational', color: 'text-emerald-400' },
        ].map((stat) => (
          <div key={stat.label} className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm">
            <p className="text-slate-500 text-sm font-medium mb-1 uppercase tracking-wider">{stat.label}</p>
            <p className={`text-lg font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Features Overview */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-10 backdrop-blur-sm">
        <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
          <div className="w-2 h-8 bg-blue-500 rounded-full" />
          Quick Overview
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { title: 'Assets Tracking', desc: 'Monitor all hardware and software licenses.', status: 'Active' },
            { title: 'Assignment Logs', desc: 'Track device assignments and history.', status: 'Active' },
            { title: 'Maintenance', desc: 'Schedule and track device repairs.', status: 'Upcoming' },
          ].map((item) => (
            <div key={item.title} className="group p-6 rounded-2xl bg-slate-800/30 border border-slate-700/50 hover:border-blue-500/30 transition-all duration-300">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">{item.title}</h3>
                <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${
                  item.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                }`}>
                  {item.status}
                </span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
