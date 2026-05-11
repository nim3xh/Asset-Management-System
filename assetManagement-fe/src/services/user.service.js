import { apiClient } from '../../lib/apiClient'

export const userService = {
  async getAll(params) {
    return apiClient.get('/user-management/get/all', { params })
  },

  async getById(id) {
    return apiClient.get(`/user-management/get/${id}`)
  },

  async create(data) {
    return apiClient.post('/user-management/create', data)
  },

  async update(id, data) {
    return apiClient.put(`/user-management/update/${id}`, data)
  },

  async delete(id) {
    return apiClient.put(`/user-management/delete/${id}`)
  }
}
