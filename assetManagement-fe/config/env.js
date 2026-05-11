const requiredEnv = {
  VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
  VITE_API_VERSION: import.meta.env.VITE_API_VERSION,
  VITE_AUTH_USER_PATH: import.meta.env.VITE_AUTH_USER_PATH,
}

const missing = Object.entries(requiredEnv)
  .filter(([, value]) => !value)
  .map(([key]) => key)

if (missing.length > 0) {
  throw new Error(`Missing required environment variables: ${missing.join(', ')}`)
}

const trimSlash = (value) => value.replace(/\/+$/, '')

const normalizePath = (value) => {
  if (value.startsWith('/')) return value
  return `/${value}`
}

export const env = {
  apiBaseUrl: trimSlash(requiredEnv.VITE_API_BASE_URL),
  apiVersion: requiredEnv.VITE_API_VERSION,
  authUserPath: normalizePath(requiredEnv.VITE_AUTH_USER_PATH),
}
