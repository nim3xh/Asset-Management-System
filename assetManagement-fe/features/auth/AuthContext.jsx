import { createContext, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { apiClient } from '../../lib/apiClient'
import { authService } from './auth.service'
import { authStorage } from './auth.storage'

export const AuthContext = createContext(null)

const normalizeRole = (roleValue) => {
  if (!roleValue || typeof roleValue !== 'string') {
    return null
  }

  return roleValue.replace(/^ROLE_/, '').toUpperCase()
}

const normalizeAuth = (state) => ({
  accessToken: state?.accessToken ?? null,
  refreshToken: state?.refreshToken ?? null,
  user: state?.user ?? null,
  role: normalizeRole(
    state?.role ??
      state?.user?.role ??
      state?.user?.userType ??
      authStorage.getRoleFromAccessToken(state?.accessToken) ??
      null,
  ),
  email: state?.email ?? state?.user?.email ?? null,
  name: state?.name ?? state?.user?.name ?? null,
})

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => normalizeAuth(authStorage.getValid()))
  const [isLoading, setIsLoading] = useState(false)
  const roleHydrationAttemptedRef = useRef(false)

  const clearSession = useCallback(() => {
    setAuth(normalizeAuth(null))
    authStorage.clear()
  }, [])

  const persistSession = useCallback((nextAuth) => {
    const normalized = normalizeAuth(nextAuth)
    setAuth(normalized)
    authStorage.set(normalized)
    return normalized
  }, [])

  useEffect(() => {
    roleHydrationAttemptedRef.current = false
  }, [auth.accessToken])

  const login = useCallback(
    async ({ email, password }) => {
      setIsLoading(true)
      try {
        const result = await authService.login(email, password)
        persistSession(result)
        return result
      } finally {
        setIsLoading(false)
      }
    },
    [persistSession],
  )

  const register = useCallback(async (registrationData) => {
    setIsLoading(true)
    try {
      const result = await authService.register(registrationData)

      if (result.accessToken) {
        persistSession(result)
      }

      return result
    } finally {
      setIsLoading(false)
    }
  }, [persistSession])

  const refresh = useCallback(async () => {
    const current = authStorage.get()

    if (!current?.refreshToken) {
      clearSession()
      throw new Error('Session expired, please login again')
    }

    try {
      const refreshed = await authService.refresh(current.refreshToken)
      return persistSession({ ...current, ...refreshed })
    } catch (error) {
      clearSession()
      throw error
    }
  }, [clearSession, persistSession])

  const logout = useCallback(() => {
    clearSession()
  }, [clearSession])

  const hasRole = useCallback(
    (role) => {
      if (!role) {
        return false
      }

      return normalizeRole(auth.role) === normalizeRole(role)
    },
    [auth.role],
  )

  const hasAnyRole = useCallback(
    (roles) => {
      if (!Array.isArray(roles) || roles.length === 0) {
        return true
      }

      const sessionRole = normalizeRole(auth.role)
      if (!sessionRole) {
        return false
      }

      return roles.map(normalizeRole).includes(sessionRole)
    },
    [auth.role],
  )

  const canAccess = useCallback(
    (allowedRoles) => {
      if (!Array.isArray(allowedRoles) || allowedRoles.length === 0) {
        return true
      }

      return hasAnyRole(allowedRoles)
    },
    [hasAnyRole],
  )

  useEffect(() => {
    apiClient.setAccessTokenResolver(() => authStorage.getValid()?.accessToken ?? null)
    apiClient.setRefreshHandler(refresh)
  }, [refresh])

  useEffect(() => {
    if (!auth?.accessToken || auth?.role || roleHydrationAttemptedRef.current) {
      return
    }

    roleHydrationAttemptedRef.current = true

    authService
      .resolveSession(auth)
      .then((resolved) => {
        if (resolved?.role && resolved.role !== auth.role) {
          persistSession({ ...auth, ...resolved })
        }
      })
      .catch(() => {
      })
  }, [auth, persistSession])

  const value = useMemo(
    () => ({
      auth,
      role: auth.role,
      isAuthenticated: Boolean(auth.accessToken),
      isLoading,
      register,
      login,
      logout,
      refresh,
      hasRole,
      hasAnyRole,
      canAccess,
    }),
    [auth, isLoading, register, login, logout, refresh, hasRole, hasAnyRole, canAccess],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
