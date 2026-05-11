import { useState } from 'react'
import { LoginForm } from '../../features/auth/LoginForm'
import { SignupForm } from '../../features/auth/SignupForm'

export function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-blue-900 flex items-center justify-center p-4">
      <div className="w-full max-w-[400px]">
        {isLogin ? (
          <LoginForm onGoToSignup={() => setIsLogin(false)} />
        ) : (
          <SignupForm onGoToLogin={() => setIsLogin(true)} />
        )}
      </div>
    </div>
  )
}
