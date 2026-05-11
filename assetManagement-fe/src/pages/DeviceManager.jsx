import React, { useState, useEffect } from 'react'
import { Plus, Search, RefreshCw, Smartphone } from 'lucide-react'
import { Button } from '../components/common/Button'
import { Input } from '../components/common/Input'
import { Select } from '../components/common/Select'
import { Modal } from '../components/common/Modal'
import { DataTable } from '../components/common/DataTable'
import { deviceService } from '../services/device.service'
import { brandService } from '../services/brand.service'
import { useAuth } from '../features/auth/useAuth'

const STATUS_OPTIONS = [
  { value: 'AVAILABLE', label: 'Available' },
  { value: 'ASSIGNED', label: 'Assigned' },
  { value: 'IN_REPAIR', label: 'In Repair' },
  { value: 'RETIRED', label: 'Retired' },
]

export function DeviceManager() {
  const { auth } = useAuth()
  const isAdminOrManager = auth?.role === 'ADMIN' || auth?.role === 'IT_MANAGER'
  
  const [devices, setDevices] = useState([])
  const [brands, setBrands] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentDevice, setCurrentDevice] = useState(null)
  const [formData, setFormData] = useState({
    serialNumber: '',
    assetTag: '',
    brandId: '',
    model: '',
    purchaseCost: '',
    currentStatus: 'AVAILABLE'
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
    fetchBrands()
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchDevices()
    }, 500)
    return () => clearTimeout(timer)
  }, [pagination.currentPage, searchQuery])

  const fetchDevices = async () => {
    setIsLoading(true)
    try {
      const response = await deviceService.getAll({
        page: pagination.currentPage,
        size: pagination.pageSize,
        search: searchQuery
      })
      if (response?.data) {
        setDevices(response.data.content)
        setPagination(prev => ({
          ...prev,
          totalElements: response.data.totalElements,
          totalPages: response.data.totalPages
        }))
      }
    } catch (err) {
      console.error('Failed to fetch devices:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchBrands = async () => {
    try {
      const response = await brandService.getAll({ page: 0, size: 100 })
      if (response?.data?.content) {
        setBrands(response.data.content.map(b => ({ value: b.brandId, label: b.name })))
      }
    } catch (err) {
      console.error('Failed to fetch brands for select:', err)
    }
  }

  const handleOpenModal = (device = null) => {
    setCurrentDevice(device)
    setFormData({
      serialNumber: device?.serialNumber || '',
      assetTag: device?.assetTag || '',
      brandId: device?.brand?.brandId || '',
      model: device?.model || '',
      purchaseCost: device?.purchaseCost || '',
      currentStatus: device?.currentStatus || 'AVAILABLE'
    })
    setErrors({})
    setIsModalOpen(true)
  }

  const validate = () => {
    const newErrors = {}
    if (!formData.serialNumber) newErrors.serialNumber = 'Serial number is required'
    if (!formData.assetTag) newErrors.assetTag = 'Asset tag is required'
    if (!formData.brandId) newErrors.brandId = 'Brand is required'
    if (!formData.model) newErrors.model = 'Model is required'
    if (!formData.purchaseCost) newErrors.purchaseCost = 'Purchase cost is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setIsLoading(true)
    try {
      const payload = {
        ...formData,
        brand: { brandId: formData.brandId }
      }
      
      if (currentDevice) {
        await deviceService.update(currentDevice.deviceId, payload)
      } else {
        await deviceService.create(payload)
      }
      setIsModalOpen(false)
      fetchDevices()
    } catch (err) {
      setErrors({ submit: err.message || 'Action failed' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (device) => {
    if (window.confirm(`Delete device "${device.assetTag}"?`)) {
      try {
        await deviceService.delete(device.deviceId)
        fetchDevices()
      } catch (err) {
        alert('Failed to delete device')
      }
    }
  }

  const columns = [
    { key: 'assetTag', label: 'Asset Tag' },
    { key: 'serialNumber', label: 'Serial Number' },
    { 
      key: 'brand', 
      label: 'Brand',
      render: (val) => val?.name || 'N/A'
    },
    { key: 'model', label: 'Model' },
    { 
      key: 'currentStatus', 
      label: 'Status',
      render: (val) => (
        <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${
          val === 'AVAILABLE' ? 'bg-emerald-500/10 text-emerald-400' : 
          val === 'ASSIGNED' ? 'bg-blue-500/10 text-blue-400' : 
          val === 'IN_REPAIR' ? 'bg-amber-500/10 text-amber-400' : 
          'bg-red-500/10 text-red-400'
        }`}>
          {val}
        </span>
      )
    },
    { 
      key: 'purchaseCost', 
      label: 'Cost',
      render: (val) => val ? `$${Number(val).toLocaleString()}` : 'N/A'
    }
  ]

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Device Manager</h1>
          <p className="text-slate-400 mt-1">Track and manage hardware assets</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" onClick={fetchDevices} isLoading={isLoading}>
            <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
          </Button>
          {isAdminOrManager && (
            <Button onClick={() => handleOpenModal()}>
              <Plus size={18} />
              Add New Device
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4 flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="text" 
              placeholder="Search by tag or serial..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-800/50 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600/50 transition-all"
            />
          </div>
        </div>

        <DataTable
          columns={columns}
          data={devices}
          isLoading={isLoading}
          pagination={pagination}
          onPageChange={(page) => setPagination(prev => ({ ...prev, currentPage: page }))}
          onEdit={isAdminOrManager ? handleOpenModal : null}
          onDelete={isAdminOrManager ? handleDelete : null}
        />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentDevice ? 'Edit Device' : 'Register New Device'}
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} isLoading={isLoading}>
              {currentDevice ? 'Save Changes' : 'Register Device'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Asset Tag"
              placeholder="e.g. LAP-2024-001"
              value={formData.assetTag}
              onChange={(e) => setFormData({ ...formData, assetTag: e.target.value })}
              error={errors.assetTag}
            />
            <Input
              label="Serial Number"
              placeholder="e.g. SN123456789"
              value={formData.serialNumber}
              onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
              error={errors.serialNumber}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Brand"
              options={brands}
              value={formData.brandId}
              onChange={(e) => setFormData({ ...formData, brandId: e.target.value })}
              error={errors.brandId}
            />
            <Input
              label="Model"
              placeholder="e.g. MacBook Pro 14"
              value={formData.model}
              onChange={(e) => setFormData({ ...formData, model: e.target.value })}
              error={errors.model}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Purchase Cost ($)"
              type="number"
              step="0.01"
              value={formData.purchaseCost}
              onChange={(e) => setFormData({ ...formData, purchaseCost: e.target.value })}
              error={errors.purchaseCost}
            />
            <Select
              label="Device Status"
              options={STATUS_OPTIONS}
              value={formData.currentStatus}
              onChange={(e) => setFormData({ ...formData, currentStatus: e.target.value })}
            />
          </div>
          {errors.submit && <p className="text-sm text-red-500 text-center">{errors.submit}</p>}
        </form>
      </Modal>
    </div>
  )
}
