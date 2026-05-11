import React, { useState, useEffect } from 'react'
import { Plus, Search, RefreshCw } from 'lucide-react'
import { Button } from '../components/common/Button'
import { Input } from '../components/common/Input'
import { Modal } from '../components/common/Modal'
import { DataTable } from '../components/common/DataTable'
import { brandService } from '../services/brand.service'

export function BrandManager() {
  const [brands, setBrands] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [currentBrand, setCurrentBrand] = useState(null)
  const [formData, setFormData] = useState({ name: '' })
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [showInactive, setShowInactive] = useState(false)
  const [pagination, setPagination] = useState({
    currentPage: 0,
    pageSize: 10,
    totalElements: 0,
    totalPages: 0
  })

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchBrands()
    }, 500)
    return () => clearTimeout(timer)
  }, [pagination.currentPage, searchQuery, showInactive])

  const fetchBrands = async () => {
    setIsLoading(true)
    try {
      const response = await brandService.getAll({
        page: pagination.currentPage,
        size: pagination.pageSize,
        name: searchQuery,
        status: showInactive ? '' : 'ACTIVE'
      })
      if (response?.data) {
        setBrands(response.data.content)
        setPagination(prev => ({
          ...prev,
          totalElements: response.data.totalElements,
          totalPages: response.data.totalPages
        }))
      }
    } catch (err) {
      console.error('Failed to fetch brands:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpenModal = (brand = null) => {
    setCurrentBrand(brand)
    setFormData({ name: brand ? brand.name : '' })
    setError('')
    setIsModalOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.name.trim()) {
      setError('Brand name is required')
      return
    }

    setIsLoading(true)
    try {
      if (currentBrand) {
        await brandService.update(currentBrand.brandId, formData)
      } else {
        await brandService.create(formData)
      }
      setIsModalOpen(false)
      fetchBrands()
    } catch (err) {
      setError(err.message || 'Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (brand) => {
    if (window.confirm(`Are you sure you want to delete brand "${brand.name}"?`)) {
      try {
        await brandService.delete(brand.brandId)
        fetchBrands()
      } catch (err) {
        alert('Failed to delete brand')
      }
    }
  }

  const columns = [
    { key: 'brandId', label: 'ID' },
    { key: 'name', label: 'Brand Name' },
    { 
      key: 'status', 
      label: 'Status',
      render: (val) => (
        <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${
          val === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
        }`}>
          {val || 'ACTIVE'}
        </span>
      )
    },
    { 
      key: 'createdAt', 
      label: 'Created At',
      render: (val) => val ? new Date(val).toLocaleDateString() : 'N/A'
    }
  ]

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Brand Manager</h1>
          <p className="text-slate-400 mt-1">Manage and organize your device brands</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" onClick={fetchBrands} isLoading={isLoading}>
            <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
          </Button>
          <Button onClick={() => handleOpenModal()}>
            <Plus size={18} />
            Add New Brand
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-4">
        {/* Search/Filter Bar placeholder */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4 flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="text" 
              placeholder="Search brands..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-800/50 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600/50 transition-all"
            />
          </div>
          <div className="flex items-center gap-2 bg-slate-800/50 border border-slate-700 rounded-xl px-3 py-1.5">
            <label htmlFor="show-inactive" className="text-xs text-slate-400 cursor-pointer select-none">
              Show Inactive
            </label>
            <input 
              id="show-inactive"
              type="checkbox" 
              checked={showInactive}
              onChange={(e) => setShowInactive(e.target.checked)}
              className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-blue-600/50"
            />
          </div>
        </div>

        {/* Data Table */}
        <DataTable
          columns={columns}
          data={brands}
          isLoading={isLoading}
          pagination={pagination}
          onPageChange={(page) => setPagination(prev => ({ ...prev, currentPage: page }))}
          onEdit={handleOpenModal}
          onDelete={handleDelete}
        />
      </div>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentBrand ? 'Edit Brand' : 'Create New Brand'}
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} isLoading={isLoading}>
              {currentBrand ? 'Save Changes' : 'Create Brand'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Brand Name"
            placeholder="e.g. Apple, Dell, HP"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={error}
            autoFocus
          />
        </form>
      </Modal>
    </div>
  )
}
