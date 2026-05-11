import { apiClient } from '../../lib/apiClient'

export const brandService = {
  async getAll(params) {
    return apiClient.get('/brand/get/all', { params })
  },

  async getById(id) {
    return apiClient.get(`/brand/get/${id}`)
  },

  async create(data) {
    return apiClient.post('/brand/create', data)
  },

  async update(id, data) {
    return apiClient.put(`/brand/update/${id}`, data)
  },

  async delete(id) {
    return apiClient.put(`/brand/delete/${id}`)
  }
}
