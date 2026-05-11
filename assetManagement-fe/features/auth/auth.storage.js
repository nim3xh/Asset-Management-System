const AUTH_STORAGE_KEY = 'assetManagement.auth'

const decodeJwtPayload = (token) => {
  if (!token || typeof token !== 'string' || token.split('.').length !== 3) {
    return null
  }

  try {
    const payloadPart = token.split('.')[1]
    const base64 = payloadPart.replace(/-/g, '+').replace(/_/g, '/')
    const paddedBase64 = base64 + '='.repeat((4 - (base64.length % 4)) % 4)
    const payloadJson = atob(paddedBase64)
    return JSON.parse(payloadJson)
  } catch {
    return null
  }
}

const normalizeRole = (roleValue) => {
  if (!roleValue || typeof roleValue !== 'string') {
    return null
  }

  return roleValue.replace(/^ROLE_/, '').toUpperCase()
}

const extractRoleFromPayload = (payload) => {
  if (!payload || typeof payload !== 'object') {
    return null
  }

  const directRole = payload.role ?? payload.userRole
  if (typeof directRole === 'string') {
    return normalizeRole(directRole)
  }

  const rolesValue = payload.roles ?? payload.authorities
  if (Array.isArray(rolesValue)) {
    const roleCandidate = rolesValue
      .map((entry) => (typeof entry === 'string' ? entry : entry?.authority ?? null))
      .find((entry) => typeof entry === 'string' && entry.trim().length > 0)

    if (roleCandidate) {
      return normalizeRole(roleCandidate)
    }
  }

  if (typeof rolesValue === 'string' && rolesValue.trim()) {
    return normalizeRole(rolesValue.split(/[\s,]+/).find(Boolean))
  }

  return null
}

const isAccessTokenValid = (token) => {
  const payload = decodeJwtPayload(token)

  if (!payload || typeof payload.exp !== 'number') {
    return false
  }

  const nowInSeconds = Math.floor(Date.now() / 1000)
  return payload.exp > nowInSeconds
}

export const authStorage = {
  getPayload(token) {
    return decodeJwtPayload(token)
  },

  getRoleFromAccessToken(token) {
    const payload = decodeJwtPayload(token)
    return extractRoleFromPayload(payload)
  },

  get() {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY)

    if (!raw) return null

    try {
      return JSON.parse(raw)
    } catch {
      localStorage.removeItem(AUTH_STORAGE_KEY)
      return null
    }
  },

  set(authState) {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authState))
  },

  clear() {
    localStorage.removeItem(AUTH_STORAGE_KEY)
  },

  getValid() {
    const state = this.get()

    if (!state?.accessToken) {
      return null
    }

    if (!isAccessTokenValid(state.accessToken)) {
      this.clear()
      return null
    }

    const payload = decodeJwtPayload(state.accessToken)
    const tokenRole = extractRoleFromPayload(payload)
    const resolvedRole = normalizeRole(
      state?.role ?? state?.user?.role ?? state?.user?.userType ?? tokenRole ?? null,
    )
    const resolvedEmail = state?.email ?? payload?.email ?? payload?.preferred_username ?? payload?.sub ?? null
    const resolvedName = state?.name ?? payload?.name ?? payload?.username ?? null
    const enrichedState = {
      ...state,
      role: resolvedRole,
      email: resolvedEmail,
      name: resolvedName,
    }

    const hasChanges =
      enrichedState.role !== state.role ||
      enrichedState.email !== state.email ||
      enrichedState.name !== state.name

    if (hasChanges) {
      this.set(enrichedState)
    }

    return enrichedState
  },
}
