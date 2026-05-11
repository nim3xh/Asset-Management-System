import { env } from '../../config/env'
import { apiClient } from '../../lib/apiClient'
import { authStorage } from './auth.storage'

const AUTH_BASE = env.authUserPath

const buildNameFromUser = (user) => {
  if (!user) {
    return null
  }

  if (user.name) {
    return user.name
  }

  const parts = [user.firstName, user.middleName, user.lastName].filter(Boolean)
  return parts.length > 0 ? parts.join(' ') : null
}

const getTokenUserId = (accessToken) => {
  const payload = authStorage.getPayload(accessToken)
  const userId = payload?.userId ?? payload?.user_id ?? payload?.uid ?? null

  if (userId == null) {
    return null
  }

  const parsedUserId = Number(userId)
  return Number.isFinite(parsedUserId) ? parsedUserId : null
}

const enrichWithCurrentUserProfile = async (authData) => {
  if (!authData?.accessToken) {
    return authData
  }

  const userId = getTokenUserId(authData.accessToken)
  const tokenPayload = authStorage.getPayload(authData.accessToken)
  const tokenEmail = tokenPayload?.email ?? tokenPayload?.userName ?? tokenPayload?.preferred_username ?? tokenPayload?.sub ?? null

  if (!userId) {
    return {
      ...authData,
      email: authData.email ?? tokenEmail,
      name: authData.name ?? tokenPayload?.name ?? tokenPayload?.userName ?? null,
    }
  }

  try {
    const profilePayload = await apiClient.get(`/adminuser/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${authData.accessToken}`,
      },
    })
    const profile = profilePayload?.data ?? null
    const profileName = buildNameFromUser(profile)

    return {
      ...authData,
      user: authData.user ?? profile,
      role: authData.role ?? profile?.role ?? null,
      email: authData.email ?? profile?.email ?? tokenEmail,
      name: authData.name ?? profileName ?? tokenPayload?.name ?? tokenPayload?.userName ?? null,
    }
  } catch {
    return {
      ...authData,
      email: authData.email ?? tokenEmail,
      name: authData.name ?? tokenPayload?.name ?? tokenPayload?.userName ?? null,
    }
  }
}

const mapAuthResponse = (payload) => {
  const responseData = payload?.data ?? {}
  const user = responseData.user ?? null
  const fullName = responseData.name ?? buildNameFromUser(user)
  const accessToken = responseData.token ?? null
  const tokenRole = authStorage.getRoleFromAccessToken(accessToken)
  const resolvedRole = responseData.role ?? user?.role ?? user?.userType ?? tokenRole ?? null

  return {
    accessToken,
    refreshToken: responseData.refreshToken ?? null,
    user,
    role: resolvedRole,
    email: responseData.email ?? user?.email ?? null,
    name: fullName,
  }
}

export const authService = {
  async register(requestBody) {
    const payload = await apiClient.post(`${AUTH_BASE}/register`, requestBody)
    return mapAuthResponse(payload)
  },

  async login(email, password) {
    const payload = await apiClient.post(`${AUTH_BASE}/login`, { email, password })

    const data = await enrichWithCurrentUserProfile(mapAuthResponse(payload))
    if (!data.accessToken) {
      throw new Error('Login succeeded but no access token was returned')
    }

    return data
  },

  async refresh(refreshToken) {
    if (!refreshToken) {
      throw new Error('Refresh token is missing')
    }

    const payload = await apiClient.post(`${AUTH_BASE}/refresh/token`, { token: refreshToken })

    const data = await enrichWithCurrentUserProfile(mapAuthResponse(payload))
    if (!data.accessToken) {
      throw new Error('Refresh succeeded but no access token was returned')
    }

    return data
  },

  async resolveSession(authState) {
    return enrichWithCurrentUserProfile(authState)
  },
}
