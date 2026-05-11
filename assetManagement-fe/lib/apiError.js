const isPlainObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value)

const flattenFieldErrors = (node, prefix = '', target = {}) => {
  if (!isPlainObject(node) && !Array.isArray(node)) {
    return target
  }

  if (isPlainObject(node) && typeof node.description === 'string') {
    if (prefix) {
      target[prefix] = node.description
    }
    return target
  }

  if (Array.isArray(node)) {
    node.forEach((item, index) => {
      const path = prefix ? `${prefix}[${index}]` : `[${index}]`
      flattenFieldErrors(item, path, target)
    })
    return target
  }

  Object.entries(node).forEach(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key
    flattenFieldErrors(value, path, target)
  })

  return target
}

const getGlobalMessage = (payload, status) => {
  if (payload?.message) return payload.message
  if (payload?.data?.message) return payload.data.message
  if (payload?.error) return payload.error
  if (payload?.description) return payload.description
  return `Request failed with status ${status}`
}

export const normalizeApiError = (payload, status) => {
  const fieldErrors = flattenFieldErrors(payload)
  const hasFieldErrors = Object.keys(fieldErrors).length > 0
  const fallbackMessage = getGlobalMessage(payload, status)

  return {
    fieldErrors,
    message: hasFieldErrors ? 'Please fix highlighted fields and try again.' : fallbackMessage,
  }
}
