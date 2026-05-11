import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from './useAuth'

const initialForm = {
  firstName: '',
  lastName: '',
  middleName: '',
  nickName: '',
  role: 'EMPLOYEE',
  email: '',
  password: '',
}

export function SignupForm({ onGoToLogin }) {
  const navigate = useNavigate()
  const { register, isLoading, isAuthenticated } = useAuth()
  const [form, setForm] = useState(initialForm)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
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
    setSuccess('')
    setFieldErrors({})

    try {
      const payload = {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        middleName: form.middleName.trim() || null,
        role: form.role,
        email: form.email.trim(),
        password: form.password,
      }

      const result = await register(payload)

      if (result?.accessToken) {
        setSuccess('Signup successful! Redirecting to dashboard...')
        setForm(initialForm)
        setTimeout(() => {
          navigate('/dashboard', { replace: true })
        }, 1000)
      } else {
        setSuccess('Signup successful. Please login with your credentials.')
        setForm(initialForm)
        setTimeout(() => {
          onGoToLogin()
        }, 2000)
      }
    } catch (submitError) {
      setFieldErrors(submitError.fieldErrors ?? {})
      setError(submitError.message || 'Unable to sign up with provided data')
    }
  }

  const getFieldError = (fieldName) => fieldErrors[fieldName]

  return (
    <div className="w-[400px] w-full max-w-[400px] my-10">
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
          <h1 className="text-[22px] font-bold text-white mb-2">Create an account</h1>
          <p className="text-[14px] font-medium text-slate-400 mb-8">
            Enter your details to register as a new user.
          </p>

      <div className="mt-6 grid grid-cols-1 gap-4">
        <div>
          <label htmlFor="firstName" className="mb-1 block text-sm text-slate-200">
            First Name
          </label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            value={form.firstName}
            onChange={onChange}
            required
            aria-invalid={Boolean(getFieldError('firstName'))}
            className={`w-full rounded-md border bg-slate-800 px-3 py-2 text-white outline-none ${
              getFieldError('firstName')
                ? 'border-red-500 focus:border-red-400'
                : 'border-slate-600 focus:border-blue-400'
            }`}
          />
          {getFieldError('firstName') ? (
            <p className="mt-1 text-xs text-red-400">{getFieldError('firstName')}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="lastName" className="mb-1 block text-sm text-slate-200">
            Last Name
          </label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            value={form.lastName}
            onChange={onChange}
            required
            aria-invalid={Boolean(getFieldError('lastName'))}
            className={`w-full rounded-md border bg-slate-800 px-3 py-2 text-white outline-none ${
              getFieldError('lastName')
                ? 'border-red-500 focus:border-red-400'
                : 'border-slate-600 focus:border-blue-400'
            }`}
          />
          {getFieldError('lastName') ? <p className="mt-1 text-xs text-red-400">{getFieldError('lastName')}</p> : null}
        </div>

        <div>
          <label htmlFor="middleName" className="mb-1 block text-sm text-slate-200">
            Middle Name (Optional)
          </label>
          <input
            id="middleName"
            name="middleName"
            type="text"
            value={form.middleName}
            onChange={onChange}
            aria-invalid={Boolean(getFieldError('middleName'))}
            className={`w-full rounded-md border bg-slate-800 px-3 py-2 text-white outline-none ${
              getFieldError('middleName')
                ? 'border-red-500 focus:border-red-400'
                : 'border-slate-600 focus:border-blue-400'
            }`}
          />
          {getFieldError('middleName') ? (
            <p className="mt-1 text-xs text-red-400">{getFieldError('middleName')}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="role" className="mb-1 block text-sm text-slate-200">
            Role
          </label>
          <select
            id="role"
            name="role"
            value={form.role}
            onChange={onChange}
            aria-invalid={Boolean(getFieldError('role'))}
            className={`w-full rounded-md border bg-slate-800 px-3 py-2 text-white outline-none ${
              getFieldError('role')
                ? 'border-red-500 focus:border-red-400'
                : 'border-slate-600 focus:border-blue-400'
            }`}
          >
            <option value="EMPLOYEE">Employee</option>
            <option value="ADMIN">Admin</option>
            <option value="IT_MANAGER">IT Manager</option>
            <option value="IT_STAFF">IT Staff</option>
          </select>
          {getFieldError('role') ? <p className="mt-1 text-xs text-red-400">{getFieldError('role')}</p> : null}
        </div>

        <div>
          <label htmlFor="email" className="mb-1 block text-sm text-slate-200">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={onChange}
            required
            aria-invalid={Boolean(getFieldError('email'))}
            className={`w-full rounded-md border bg-slate-800 px-3 py-2 text-white outline-none ${
              getFieldError('email')
                ? 'border-red-500 focus:border-red-400'
                : 'border-slate-600 focus:border-blue-400'
            }`}
          />
          {getFieldError('email') ? <p className="mt-1 text-xs text-red-400">{getFieldError('email')}</p> : null}
        </div>

        <div>
          <label htmlFor="password" className="mb-1 block text-sm text-slate-200">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={form.password}
            onChange={onChange}
            required
            minLength={6}
            aria-invalid={Boolean(getFieldError('password'))}
            className={`w-full rounded-md border bg-slate-800 px-3 py-2 text-white outline-none ${
              getFieldError('password')
                ? 'border-red-500 focus:border-red-400'
                : 'border-slate-600 focus:border-blue-400'
            }`}
          />
          {getFieldError('password') ? <p className="mt-1 text-xs text-red-400">{getFieldError('password')}</p> : null}
          <p className="mt-1 text-xs text-slate-400">Must include uppercase, lowercase, number, and special character.</p>
        </div>
      </div>

      {error ? <p className="mt-3 text-sm text-red-400">{error}</p> : null}
      {Object.keys(fieldErrors).length > 0 ? (
        <ul className="mt-3 list-disc space-y-1 pl-5 text-xs text-red-300">
          {Object.entries(fieldErrors).map(([field, message]) => (
            <li key={field}>
              {field}: {message}
            </li>
          ))}
        </ul>
      ) : null}
      {success ? <p className="mt-3 text-sm text-emerald-400">{success}</p> : null}

      <button
        type="submit"
        disabled={isLoading}
        className="mt-6 w-full rounded-xl bg-sky-500 px-3 py-3.5 text-[15px] font-bold text-white transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400 shadow-[0_0_20px_-3px_rgba(14,165,233,0.3)] hover:shadow-[0_0_25px_-3px_rgba(14,165,233,0.4)]"
      >
        {isLoading ? 'Creating account...' : 'Sign Up'}
      </button>

      <button
        type="button"
        onClick={onGoToLogin}
        className="mt-4 w-full rounded-xl border border-slate-700/60 px-3 py-3 text-[14px] font-medium text-slate-300 transition hover:bg-[#1f2430] hover:text-white"
      >
        Back to Login
      </button>
      </div>
    </form>
  </div>
  )
}
