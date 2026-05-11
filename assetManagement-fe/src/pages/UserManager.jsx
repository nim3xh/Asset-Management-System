import React, { useState, useEffect } from 'react'
import { Plus, Search, RefreshCw, UserPlus } from 'lucide-react'
import { Button } from '../components/common/Button'
import { Input } from '../components/common/Input'
import { Select } from '../components/common/Select'
import { Modal } from '../components/common/Modal'
import { DataTable } from '../components/common/DataTable'
import { userService } from '../services/user.service'

const ROLES = [
  { value: 'ADMIN', label: 'Administrator' },
  { value: 'IT_MANAGER', label: 'IT Manager' },
  { value: 'IT_STAFF', label: 'IT Staff' },
  { value: 'EMPLOYEE', label: 'Employee' },
]

export function UserManager() {
  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    middleName: '',
    email: '',
    password: '',
    role: ''
  })
  const [errors, setErrors] = useState({})
  const [searchQuery, setSearchQuery] = useState('')
  const [pagination, setPagination] = useState({
    currentPage: 0,
    pageSize: 10,
    totalElements: 0,
    totalPages: 0
  })

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers()
    }, 500)
    return () => clearTimeout(timer)
  }, [pagination.currentPage, searchQuery])

  const fetchUsers = async () => {
    setIsLoading(true)
    try {
      const response = await userService.getAll({
        page: pagination.currentPage,
        size: pagination.pageSize,
        name: searchQuery
      })
      if (response?.data) {
        setUsers(response.data.content)
        setPagination(prev => ({
          ...prev,
          totalElements: response.data.totalElements,
          totalPages: response.data.totalPages
        }))
      }
    } catch (err) {
      console.error('Failed to fetch users:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpenModal = (user = null) => {
    setCurrentUser(user)
    setFormData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      middleName: user?.middleName || '',
      email: user?.email || '',
      password: '',
      role: user?.role || ''
    })
    setErrors({})
    setIsModalOpen(true)
  }

  const validate = () => {
    const newErrors = {}
    if (!formData.firstName) newErrors.firstName = 'First name is required'
    if (!formData.lastName) newErrors.lastName = 'Last name is required'
    if (!formData.email) newErrors.email = 'Email is required'
    if (!currentUser && !formData.password) newErrors.password = 'Password is required'
    if (!formData.role) newErrors.role = 'Role is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setIsLoading(true)
    try {
      if (currentUser) {
        const updateData = { ...formData }
        if (!updateData.password) delete updateData.password
        await userService.update(currentUser.userId, updateData)
      } else {
        await userService.create(formData)
      }
      setIsModalOpen(false)
      fetchUsers()
    } catch (err) {
      setErrors({ submit: err.message || 'Action failed' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (user) => {
    if (window.confirm(`Deactivate user "${user.firstName} ${user.lastName}"?`)) {
      try {
        await userService.delete(user.userId)
        fetchUsers()
      } catch (err) {
        alert('Failed to deactivate user')
      }
    }
  }

  const columns = [
    { 
      key: 'name', 
      label: 'Full Name',
      render: (_, item) => `${item.firstName} ${item.middleName ? item.middleName + ' ' : ''}${item.lastName}`
    },
    { key: 'email', label: 'Email' },
    { 
      key: 'role', 
      label: 'Role',
      render: (val) => (
        <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${
          val === 'ADMIN' ? 'bg-red-500/10 text-red-400' : 
          val === 'IT_MANAGER' ? 'bg-blue-500/10 text-blue-400' : 
          'bg-slate-500/10 text-slate-400'
        }`}>
          {val}
        </span>
      )
    },
    { 
      key: 'isActive', 
      label: 'Status',
      render: (val) => (
        <span className={val ? 'text-emerald-400' : 'text-red-400'}>
          {val ? 'Active' : 'Inactive'}
        </span>
      )
    }
  ]

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">User Manager</h1>
          <p className="text-slate-400 mt-1">Administer user accounts and access levels</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" onClick={fetchUsers} isLoading={isLoading}>
            <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
          </Button>
          <Button onClick={() => handleOpenModal()}>
            <UserPlus size={18} />
            Add New User
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4 flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="text" 
              placeholder="Search by name or email..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-800/50 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600/50 transition-all"
            />
          </div>
        </div>

        <DataTable
          columns={columns}
          data={users}
          isLoading={isLoading}
          pagination={pagination}
          onPageChange={(page) => setPagination(prev => ({ ...prev, currentPage: page }))}
          onEdit={handleOpenModal}
          onDelete={handleDelete}
        />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentUser ? 'Edit User' : 'Create New User'}
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} isLoading={isLoading}>
              {currentUser ? 'Update User' : 'Create User'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="First Name"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              error={errors.firstName}
            />
            <Input
              label="Last Name"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              error={errors.lastName}
            />
          </div>
          <Input
            label="Middle Name (Optional)"
            value={formData.middleName}
            onChange={(e) => setFormData({ ...formData, middleName: e.target.value })}
          />
          <Input
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            error={errors.email}
          />
          <Input
            label={currentUser ? "New Password (Leave blank to keep current)" : "Password"}
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            error={errors.password}
          />
          <Select
            label="System Role"
            options={ROLES}
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            error={errors.role}
          />
          {errors.submit && <p className="text-sm text-red-500 text-center">{errors.submit}</p>}
        </form>
      </Modal>
    </div>
  )
}
