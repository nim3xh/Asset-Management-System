import axios from 'axios'
import { env } from '../config/env'
import { normalizeApiError } from './apiError'

const API_PREFIX = `/api/${env.apiVersion}`
const BASE_URL = `${env.apiBaseUrl}${API_PREFIX}`

let accessTokenResolver = () => null
let refreshHandler = null

const http = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

const buildError = (payload, status) => {
  const details = normalizeApiError(payload, status)
  const errorMessage = details.message

  const error = new Error(errorMessage)
  error.status = status
  error.payload = payload
  error.fieldErrors = details.fieldErrors
  return error
}

const doRequest = async (path, options = {}) => {
  const token = accessTokenResolver()
  const headers = {
    ...(options.headers ?? {}),
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await http.request({
    url: path,
    ...options,
    headers,
  })

  return response?.data ?? null
}

const request = async (path, options = {}) => {
  try {
    return await doRequest(path, options)
  } catch (error) {
    const status = error?.response?.status ?? error?.status
    const payload = error?.response?.data ?? error?.payload ?? null

    const normalizedError = buildError(payload, status ?? 0)
    const isUnauthorized = status === 401

    if (!isUnauthorized || !refreshHandler || options.__isRetry) {
      throw normalizedError
    }

    await refreshHandler()

    return doRequest(path, {
      ...options,
      __isRetry: true,
    })
  }
}

export const apiClient = {
  setAccessTokenResolver(resolver) {
    accessTokenResolver = resolver
  },

  setRefreshHandler(handler) {
    refreshHandler = handler
  },

  post(path, body, options = {}) {
    return request(path, {
      ...options,
      method: 'post',
      data: body,
    })
  },

  get(path, options = {}) {
    return request(path, {
      ...options,
      method: 'get',
    })
  },

  put(path, body, options = {}) {
    return request(path, {
      ...options,
      method: 'put',
      data: body,
    })
  },

  delete(path, options = {}) {
    return request(path, {
      ...options,
      method: 'delete',
    })
  },
}
