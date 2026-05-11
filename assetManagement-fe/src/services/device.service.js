import { apiClient } from '../../lib/apiClient'

export const deviceService = {
  async getAll(params) {
    return apiClient.get('/device/get/all', { params })
  },

  async getById(id) {
    return apiClient.get(`/device/get/${id}`)
  },

  async create(data) {
    return apiClient.post('/device/create', data)
  },

  async update(id, data) {
    return apiClient.put(`/device/update/${id}`, data)
  },

  async delete(id) {
    return apiClient.put(`/device/delete/${id}`)
  }
}
