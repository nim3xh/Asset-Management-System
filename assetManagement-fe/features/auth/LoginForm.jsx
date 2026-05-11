import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from './useAuth'
import { Mail, Lock, Loader2, ArrowRight } from 'lucide-react'

const initialForm = {
  email: '',
  password: '',
}

export function LoginForm({ onGoToSignup }) {
  const navigate = useNavigate()
  const { login, isLoading } = useAuth()
  const [form, setForm] = useState(initialForm)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})

  const onChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setFieldErrors((prev) => {
      if (!prev[name]) return prev
      const next = { ...prev }
      delete next[name]
      return next
    })
  }

  const onSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setFieldErrors({})

    try {
      await login(form)
      setForm(initialForm)
      navigate('/dashboard', { replace: true })
    } catch (submitError) {
      setFieldErrors(submitError.fieldErrors ?? {})
      setError(submitError.message || 'Unable to login with provided credentials')
    }
  }

  const getFieldError = (fieldName) => fieldErrors[fieldName]

  return (
    <div className="w-[400px] w-full max-w-[400px]">
      {/* Brand */}
      <div className="mb-8 flex justify-center text-4xl font-bold tracking-tight">
        <span className="text-white">Asset</span>
        <span className="text-sky-400">X</span>
      </div>

      <form
        onSubmit={onSubmit}
        className="rounded-2xl border border-slate-800/60 bg-[#161a23] p-8 shadow-2xl transition-all duration-300 hover:shadow-sky-500/5 relative overflow-hidden"
      >
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 -m-16 h-32 w-32 rounded-full bg-sky-500/10 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -m-16 h-32 w-32 rounded-full bg-blue-600/10 blur-3xl"></div>

        <div className="relative">
          <h1 className="text-[22px] font-bold text-white mb-2">Welcome back</h1>
          <p className="text-[14px] font-medium text-slate-400 mb-8">
            Access your dashboard and manage Assets.
          </p>

          <div className="space-y-5 mb-8">
            <div className="group">
              <label htmlFor="email" className="mb-2 block text-[13px] font-medium text-slate-300 group-focus-within:text-sky-400 transition-colors">
                Email Address
              </label>
              <div className="relative flex items-center">
                <Mail className="absolute left-3.5 text-slate-500 group-focus-within:text-sky-400 transition-colors" size={18} />
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={onChange}
                  required
                  placeholder="name@company.com"
                  aria-invalid={Boolean(getFieldError('email'))}
                  className={`w-full rounded-xl border bg-[#1f2430] py-3 pl-11 pr-4 text-[15px] font-medium text-white outline-none transition-all duration-200 placeholder:text-slate-500 focus:bg-[#161a23] focus:ring-2 focus:ring-sky-500/30 ${
                    getFieldError('email')
                      ? 'border-red-500/50 focus:border-red-400 focus:ring-red-500/30'
                      : 'border-slate-800 focus:border-sky-400'
                  }`}
                />
              </div>
              {getFieldError('email') ? <p className="mt-1.5 text-[13px] font-medium text-red-400">{getFieldError('email')}</p> : null}
            </div>

            <div className="group">
              <label htmlFor="password" className="mb-2 flex justify-between text-[13px] font-medium text-slate-300 group-focus-within:text-sky-400 transition-colors">
                <span>Password</span>
              </label>
              <div className="relative flex items-center">
                <Lock className="absolute left-3.5 text-slate-500 group-focus-within:text-sky-400 transition-colors" size={18} />
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={onChange}
                  required
                  placeholder="••••••••"
                  aria-invalid={Boolean(getFieldError('password'))}
                  className={`w-full rounded-xl border bg-[#1f2430] py-3 pl-11 pr-4 text-[15px] font-medium text-white outline-none transition-all duration-200 placeholder:text-slate-500 focus:bg-[#161a23] focus:ring-2 focus:ring-sky-500/30 ${
                    getFieldError('password')
                      ? 'border-red-500/50 focus:border-red-400 focus:ring-red-500/30'
                      : 'border-slate-800 focus:border-sky-400'
                  }`}
                />
              </div>
              {getFieldError('password') ? (
                <p className="mt-1.5 text-[13px] font-medium text-red-400">{getFieldError('password')}</p>
              ) : null}
            </div>
          </div>

          {error ? <div className="mb-5 rounded-xl bg-red-500/10 border border-red-500/20 p-3.5"><p className="text-[13.5px] font-medium text-red-400">{error}</p></div> : null}
          {Object.keys(fieldErrors).length > 0 ? (
            <div className="mb-5 rounded-xl bg-red-500/10 border border-red-500/20 p-3.5">
              <ul className="list-disc space-y-1 pl-4 text-[13.5px] font-medium text-red-400">
                {Object.entries(fieldErrors).map(([field, message]) => (
                  <li key={field}>
                    {field}: {message}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <button
            type="submit"
            disabled={isLoading}
            className="group relative flex w-full items-center justify-center gap-2 rounded-xl bg-sky-500 py-3.5 text-[15px] font-bold text-white transition-all duration-200 hover:bg-sky-400 hover:shadow-[0_0_25px_-5px_rgba(14,165,233,0.5)] active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400 disabled:shadow-none disabled:active:scale-100"
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Verifying...</span>
              </>
            ) : (
              <>
                <span>Secure Sign In</span>
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>

          <p className="mt-6 text-center text-sm text-slate-400">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={onGoToSignup}
              className="font-semibold text-sky-400 hover:text-sky-300 transition-colors"
            >
              Sign up
            </button>
          </p>
        </div>
      </form>
    </div>
  )
}
