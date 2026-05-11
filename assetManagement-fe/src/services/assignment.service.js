import { apiClient } from '../../lib/apiClient'

export const assignmentService = {
  async getAll(params) {
    return apiClient.get('/assign/get/all', { params })
  },

  async getById(id) {
    return apiClient.get(`/assign/get/${id}`)
  },

  async create(data) {
    return apiClient.post('/assign/create', data)
  },

  async update(id, data) {
    return apiClient.put(`/assign/update/${id}`, data)
  },

  async delete(id) {
    return apiClient.put(`/assign/delete/${id}`)
  },

  async returnDevice(id, returnDate) {
    return apiClient.put(`/assign/return/${id}`, null, {
      params: { returnDate }
    })
  }
}
