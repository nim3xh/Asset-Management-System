import React, { useState, useEffect } from 'react'
import { Plus, Search, RefreshCw, ClipboardCheck, CornerUpLeft } from 'lucide-react'
import { Button } from '../components/common/Button'
import { Input } from '../components/common/Input'
import { Select } from '../components/common/Select'
import { Modal } from '../components/common/Modal'
import { DataTable } from '../components/common/DataTable'
import { assignmentService } from '../services/assignment.service'
import { userService } from '../services/user.service'
import { deviceService } from '../services/device.service'

export function AssignmentManager() {
  const [assignments, setAssignments] = useState([])
  const [users, setUsers] = useState([])
  const [devices, setDevices] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false)
  const [currentAssignment, setCurrentAssignment] = useState(null)
  const [formData, setFormData] = useState({
    userId: '',
    deviceId: ''
  })
  const [returnDate, setReturnDate] = useState(new Date().toISOString().split('T')[0])
  const [errors, setErrors] = useState({})
  const [searchQuery, setSearchQuery] = useState('')
  const [pagination, setPagination] = useState({
    currentPage: 0,
    pageSize: 10,
    totalElements: 0,
    totalPages: 0
  })

  useEffect(() => {
    fetchFormData()
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchAssignments()
    }, 500)
    return () => clearTimeout(timer)
  }, [pagination.currentPage, searchQuery])

  const fetchAssignments = async () => {
    setIsLoading(true)
    try {
      const response = await assignmentService.getAll({
        page: pagination.currentPage,
        size: pagination.pageSize,
        search: searchQuery
      })
      if (response?.data) {
        const enhancedContent = response.data.content.map(item => ({
          ...item,
          actions: (row) => !row.returnDate && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => handleOpenReturnModal(row)}
              className="!p-2 hover:text-emerald-400"
              title="Return Device"
            >
              <CornerUpLeft size={16} />
            </Button>
          )
        }))
        setAssignments(enhancedContent)
        setPagination(prev => ({
          ...prev,
          totalElements: response.data.totalElements,
          totalPages: response.data.totalPages
        }))
      }
    } catch (err) {
      console.error('Failed to fetch assignments:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchFormData = async () => {
    try {
      const [usersRes, devicesRes] = await Promise.all([
        userService.getAll({ page: 0, size: 100 }),
        deviceService.getAll({ page: 0, size: 100, currentStatus: 'AVAILABLE' })
      ])
      
      if (usersRes?.data?.content) {
        setUsers(usersRes.data.content.map(u => ({ 
          value: u.userId, 
          label: `${u.firstName} ${u.lastName} (${u.email})`,
          original: u
        })))
      }
      
      if (devicesRes?.data?.content) {
        setDevices(devicesRes.data.content.map(d => ({ 
          value: d.deviceId, 
          label: `${d.assetTag} - ${d.brand?.name} ${d.model}`,
          original: d
        })))
      }
    } catch (err) {
      console.error('Failed to fetch users/devices for assignment:', err)
    }
  }

  const handleOpenModal = () => {
    setFormData({
      userId: '',
      deviceId: ''
    })
    setErrors({})
    setIsModalOpen(true)
  }

  const handleOpenReturnModal = (assignment) => {
    setCurrentAssignment(assignment)
    setReturnDate(new Date().toISOString().split('T')[0])
    setIsReturnModalOpen(true)
  }

  const validate = () => {
    const newErrors = {}
    if (!formData.userId) newErrors.userId = 'User is required'
    if (!formData.deviceId) newErrors.deviceId = 'Device is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setIsLoading(true)
    try {
      await assignmentService.create(formData)
      
      // Update device status to ASSIGNED
      const selectedDeviceOption = devices.find(d => String(d.value) === String(formData.deviceId))
      if (selectedDeviceOption?.original) {
        const device = selectedDeviceOption.original
        await deviceService.update(device.deviceId, {
          serialNumber: device.serialNumber,
          assetTag: device.assetTag,
          brandId: device.brand?.brandId,
          model: device.model,
          purchaseCost: device.purchaseCost,
          currentStatus: 'ASSIGNED',
          status: device.status
        })
      }

      setIsModalOpen(false)
      fetchAssignments()
      fetchFormData() // Refresh available devices
    } catch (err) {
      setErrors({ submit: err.message || 'Assignment failed' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleReturn = async () => {
    setIsLoading(true)
    try {
      await assignmentService.returnDevice(currentAssignment.id, returnDate)
      setIsReturnModalOpen(false)
      fetchAssignments()
      fetchFormData() // Refresh available devices
    } catch (err) {
      alert('Failed to return device')
    } finally {
      setIsLoading(false)
    }
  }

  const columns = [
    { 
      key: 'userId', 
      label: 'Employee',
      render: (val, row) => {
        if (row.user) return `${row.user.firstName} ${row.user.lastName}`
        const user = users.find(u => String(u.value) === String(val))?.original
        return user ? `${user.firstName} ${user.lastName}` : `User ID: ${val}`
      }
    },
    { 
      key: 'deviceId', 
      label: 'Asset',
      render: (val, row) => {
        if (row.device) return `${row.device.assetTag} (${row.device.model})`
        const device = devices.find(d => String(d.value) === String(val))?.original
        return device ? `${device.assetTag} (${device.model})` : `Device ID: ${val}`
      }
    },
    { 
      key: 'createdAt', 
      label: 'Assigned On',
      render: (val) => val ? new Date(val).toLocaleDateString() : 'N/A'
    },
    { 
      key: 'returnDate', 
      label: 'Returned On',
      render: (val) => val ? (
        <span className="text-emerald-400">{new Date(val).toLocaleDateString()}</span>
      ) : (
        <span className="text-amber-400 font-medium">In Use</span>
      )
    }
  ]

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Asset Assignments</h1>
          <p className="text-slate-400 mt-1">Manage device handovers and returns</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" onClick={fetchAssignments} isLoading={isLoading}>
            <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
          </Button>
          <Button onClick={handleOpenModal}>
            <ClipboardCheck size={18} />
            New Assignment
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4 flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="text" 
              placeholder="Search assignments..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-800/50 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600/50 transition-all"
            />
          </div>
        </div>

        <DataTable
          columns={columns}
          data={assignments}
          isLoading={isLoading}
          pagination={pagination}
          onPageChange={(page) => setPagination(prev => ({ ...prev, currentPage: page }))}
          onEdit={null} // We use a custom return button instead of general edit
          onDelete={null}
        />
        
        {/* Custom Action for Return (Manually rendering for now since DataTable doesn't support custom buttons easily yet) */}
        {/* Actually, I should update DataTable to allow custom actions or use the existing ones */}
      </div>

      {/* New Assignment Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="New Asset Assignment"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} isLoading={isLoading}>
              Assign Asset
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select
            label="Select Employee"
            options={users}
            value={formData.userId}
            onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
            error={errors.userId}
          />
          <Select
            label="Select Available Device"
            options={devices}
            value={formData.deviceId}
            onChange={(e) => setFormData({ ...formData, deviceId: e.target.value })}
            error={errors.deviceId}
          />
          {errors.submit && <p className="text-sm text-red-500 text-center">{errors.submit}</p>}
        </form>
      </Modal>

      {/* Return Modal */}
      <Modal
        isOpen={isReturnModalOpen}
        onClose={() => setIsReturnModalOpen(false)}
        title="Return Device"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsReturnModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleReturn} isLoading={isLoading}>
              Confirm Return
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-slate-300">
            Confirming the return of <strong>{currentAssignment?.device?.assetTag}</strong> from <strong>{currentAssignment?.user?.firstName}</strong>.
          </p>
          <Input
            label="Actual Return Date"
            type="date"
            value={returnDate}
            onChange={(e) => setReturnDate(e.target.value)}
          />
        </div>
      </Modal>
    </div>
  )
}
