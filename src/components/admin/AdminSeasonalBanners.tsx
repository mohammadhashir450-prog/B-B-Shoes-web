'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Edit2, Trash2, X, Save, Camera, Check, Upload } from 'lucide-react'

interface ISeasonalBanner {
  _id: string;
  season: 'Summer' | 'Winter' | 'Spring' | 'Fall';
  title: string;
  description?: string;
  bannerImage: string;
  linkUrl?: string;
  discountPercent?: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  displayOrder: number;
}

export default function AdminSeasonalBanners() {
  const bannerFileInputRef = useRef<HTMLInputElement | null>(null)
  const [uploadingBanner, setUploadingBanner] = useState(false)
  const [banners, setBanners] = useState<ISeasonalBanner[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Partial<ISeasonalBanner>>({
    season: 'Summer',
    title: '',
    description: '',
    bannerImage: '',
    linkUrl: '/collections',
    discountPercent: 0,
    startDate: '',
    endDate: '',
    isActive: true,
    displayOrder: 0,
  })
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  // Fetch banners
  useEffect(() => {
    fetchBanners()
  }, [])

  const fetchBanners = async () => {
    try {
      const response = await fetch('/api/settings/seasonal-banners?all=true')
      const result = await response.json()
      setBanners(result?.data || [])
    } catch (error) {
      console.error('Failed to fetch banners:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = () => {
    setFormData({
      season: 'Summer',
      title: '',
      description: '',
      bannerImage: '',
      linkUrl: '/collections',
      discountPercent: 0,
      startDate: '',
      endDate: '',
      isActive: true,
      displayOrder: 0,
    })
    setEditingId(null)
    setShowForm(true)
  }

  const handleEdit = (banner: ISeasonalBanner) => {
    setFormData(banner)
    setEditingId(banner._id)
    setShowForm(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')

    if (!formData.title?.trim()) {
      setMessage('❌ Title is required')
      return
    }

    if (!formData.bannerImage) {
      setMessage('❌ Banner image is required')
      return
    }

    if (!formData.startDate || !formData.endDate) {
      setMessage('❌ Start date and end date are required')
      return
    }

    const start = new Date(formData.startDate)
    const end = new Date(formData.endDate)
    if (start >= end) {
      setMessage('❌ End date must be after start date')
      return
    }

    setSaving(true)

    try {
      const method = editingId ? 'PUT' : 'POST'
      const url = editingId 
        ? `/api/settings/seasonal-banners/${editingId}`
        : '/api/settings/seasonal-banners'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (response.ok) {
        setMessage(editingId ? '✅ Banner updated successfully' : '✅ Banner created successfully')
        setShowForm(false)
        await fetchBanners()
        setTimeout(() => setMessage(''), 3000)
      } else {
        setMessage(`❌ ${result?.message || 'Failed to save banner'}`)
      }
    } catch (error) {
      setMessage('❌ Error saving banner')
      console.error(error)
    } finally {
      setSaving(false)
    }
  }

  const toInputDateTime = (date: Date) => {
    const pad = (value: number) => value.toString().padStart(2, '0')
    const year = date.getFullYear()
    const month = pad(date.getMonth() + 1)
    const day = pad(date.getDate())
    const hours = pad(date.getHours())
    const minutes = pad(date.getMinutes())
    return `${year}-${month}-${day}T${hours}:${minutes}`
  }

  const applyQuickSchedule = (days: number) => {
    const now = new Date()
    const end = new Date(now.getTime() + days * 24 * 60 * 60 * 1000)
    setFormData((prev) => ({
      ...prev,
      startDate: toInputDateTime(now),
      endDate: toInputDateTime(end),
      isActive: true,
    }))
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this banner?')) return

    try {
      const response = await fetch(`/api/settings/seasonal-banners/${id}`, { method: 'DELETE' })

      if (response.ok) {
        setMessage('✅ Banner deleted successfully')
        await fetchBanners()
        setTimeout(() => setMessage(''), 3000)
      } else {
        setMessage('❌ Failed to delete banner')
      }
    } catch (error) {
      setMessage('❌ Error deleting banner')
      console.error(error)
    }
  }

  const uploadBannerImage = async (file: File) => {
    if (!file) {
      return
    }

    setMessage('')
    setUploadingBanner(true)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', 'bb_shoes/seasonal-banners')

      const response = await fetch('/api/uploads/cloudinary', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()

      if (!response.ok || !result?.success) {
        throw new Error(result?.message || 'Upload failed')
      }

      const uploadedUrl = result?.data?.secureUrl || result?.data?.secure_url

      if (!uploadedUrl) {
        throw new Error('Upload did not return a valid image URL')
      }

      setFormData((prev) => ({ ...prev, bannerImage: uploadedUrl }))
      setMessage('✅ Banner image uploaded successfully')
    } catch (error) {
      setMessage(error instanceof Error ? `❌ ${error.message}` : '❌ Upload failed')
    } finally {
      setUploadingBanner(false)
      if (bannerFileInputRef.current) {
        bannerFileInputRef.current.value = ''
      }
    }
  }

  if (loading) {
    return <div className="text-center py-12 text-white/50">Loading banners...</div>
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-serif font-black text-white mb-2">Seasonal Collections</h2>
          <p className="text-white/50 text-sm">Create and manage seasonal banners that display on home page</p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-[#D4AF37] text-[#0B101E] px-6 py-3 rounded-full font-bold text-[11px] tracking-[0.2em] uppercase hover:bg-[#E5C158] transition-all"
        >
          <Plus size={16} />
          New Collection
        </button>
      </div>

      {/* Message */}
      {message && (
        <div className="p-4 bg-white/10 border border-white/20 rounded-lg text-sm text-white">
          {message}
        </div>
      )}

      {/* Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-[#121A2F]/60 backdrop-blur-2xl p-8 rounded-2xl border border-white/10 space-y-6"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">
                {editingId ? 'Edit Collection' : 'Create New Collection'}
              </h3>
              <button
                onClick={() => setShowForm(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-all"
              >
                <X size={20} className="text-white/50" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="rounded-xl border border-[#D4AF37]/25 bg-[#D4AF37]/5 p-4">
                <p className="text-xs text-[#F5E7B8] tracking-wide">
                  Easy setup: 1) Choose season 2) Add title 3) Upload image 4) Set dates 5) Save.
                  Banner will auto show/hide based on date timer.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Season */}
                <div>
                  <label className="text-sm text-white/70 font-bold mb-2 block">Season</label>
                  <select
                    value={formData.season || ''}
                    onChange={(e) => setFormData({ ...formData, season: e.target.value as any })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
                  >
                    <option value="Summer">Summer</option>
                    <option value="Winter">Winter</option>
                    <option value="Spring">Spring</option>
                    <option value="Fall">Fall</option>
                  </select>
                  <p className="text-[11px] text-white/40 mt-1">This season name appears in hero section (e.g., Summer Collection).</p>
                </div>

                {/* Title */}
                <div>
                  <label className="text-sm text-white/70 font-bold mb-2 block">Title</label>
                  <input
                    type="text"
                    value={formData.title || ''}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Summer Collection 2026"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-white/30 focus:outline-none focus:border-[#D4AF37]"
                  />
                  <p className="text-[11px] text-white/40 mt-1">Short and clear title is best.</p>
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label className="text-sm text-white/70 font-bold mb-2 block">Description</label>
                  <textarea
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe the collection..."
                    rows={2}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-white/30 focus:outline-none focus:border-[#D4AF37] resize-none"
                  />
                </div>

                {/* Discount */}
                <div>
                  <label className="text-sm text-white/70 font-bold mb-2 block">Discount % (Optional)</label>
                  <input
                    type="number"
                    value={formData.discountPercent || 0}
                    onChange={(e) => setFormData({ ...formData, discountPercent: Number(e.target.value) })}
                    min="0"
                    max="100"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                  <p className="text-[11px] text-white/40 mt-1">Set 0 if this is a collection banner without discount.</p>
                </div>

                {/* Link URL */}
                <div>
                  <label className="text-sm text-white/70 font-bold mb-2 block">Link URL</label>
                  <input
                    type="text"
                    value={formData.linkUrl || ''}
                    onChange={(e) => setFormData({ ...formData, linkUrl: e.target.value })}
                    placeholder="/collections"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-white/30 focus:outline-none focus:border-[#D4AF37]"
                  />
                  <p className="text-[11px] text-white/40 mt-1">Where user goes after clicking banner. Example: /collections or /sales</p>
                </div>

                {/* Start Date */}
                <div>
                  <label className="text-sm text-white/70 font-bold mb-2 block">Start Date</label>
                  <input
                    type="datetime-local"
                    value={formData.startDate || ''}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                {/* End Date */}
                <div>
                  <label className="text-sm text-white/70 font-bold mb-2 block">End Date</label>
                  <input
                    type="datetime-local"
                    value={formData.endDate || ''}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div className="md:col-span-2">
                  <p className="text-xs text-white/60 mb-2">Quick Timer Presets</p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => applyQuickSchedule(7)}
                      className="px-3 py-1.5 rounded-full text-[10px] tracking-[0.12em] uppercase border border-white/15 text-white/70 hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all"
                    >
                      7 Days
                    </button>
                    <button
                      type="button"
                      onClick={() => applyQuickSchedule(15)}
                      className="px-3 py-1.5 rounded-full text-[10px] tracking-[0.12em] uppercase border border-white/15 text-white/70 hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all"
                    >
                      15 Days
                    </button>
                    <button
                      type="button"
                      onClick={() => applyQuickSchedule(30)}
                      className="px-3 py-1.5 rounded-full text-[10px] tracking-[0.12em] uppercase border border-white/15 text-white/70 hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all"
                    >
                      30 Days
                    </button>
                    <button
                      type="button"
                      onClick={() => applyQuickSchedule(60)}
                      className="px-3 py-1.5 rounded-full text-[10px] tracking-[0.12em] uppercase border border-white/15 text-white/70 hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all"
                    >
                      60 Days
                    </button>
                  </div>
                </div>

                {/* Display Order */}
                <div>
                  <label className="text-sm text-white/70 font-bold mb-2 block">Display Order</label>
                  <input
                    type="number"
                    value={formData.displayOrder || 0}
                    onChange={(e) => setFormData({ ...formData, displayOrder: Number(e.target.value) })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                {/* Active Toggle */}
                <div className="flex items-end">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isActive || false}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="w-5 h-5 rounded"
                    />
                    <span className="text-sm text-white/70 font-bold">Active</span>
                  </label>
                </div>
              </div>

              {/* Banner Image Upload */}
              <div>
                <label className="text-sm text-white/70 font-bold mb-2 block">Banner Image</label>
                <input
                  ref={bannerFileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      void uploadBannerImage(file)
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => bannerFileInputRef.current?.click()}
                  disabled={uploadingBanner}
                  className="w-full p-6 border-2 border-dashed border-[#D4AF37]/30 rounded-lg hover:border-[#D4AF37] transition-colors flex items-center justify-center gap-2 bg-white/5 disabled:opacity-60"
                >
                  {uploadingBanner ? (
                    <>
                      <Upload size={18} className="text-[#D4AF37] animate-pulse" />
                      <span className="text-white/70 text-sm">Uploading banner image...</span>
                    </>
                  ) : (
                    <>
                      <Camera size={18} className="text-[#D4AF37]" />
                      <span className="text-white/70 text-sm">
                        {formData.bannerImage ? 'Change Image' : 'Upload Banner Image'}
                      </span>
                    </>
                  )}
                </button>
                <p className="text-[11px] text-white/40 mt-1">Recommended size: 1400x600 or larger.</p>
                {formData.bannerImage && (
                  <div className="mt-4 relative h-40 rounded-lg overflow-hidden border border-white/10">
                    <Image
                      src={formData.bannerImage}
                      alt="Banner preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={saving || !formData.title || !formData.bannerImage}
                  className="flex-1 flex items-center justify-center gap-2 bg-[#D4AF37] text-[#0B101E] px-6 py-3 rounded-lg font-bold text-[11px] tracking-[0.2em] uppercase hover:bg-[#E5C158] disabled:opacity-50 transition-all"
                >
                  <Save size={16} />
                  {saving ? 'Saving...' : 'Save Collection'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-6 py-3 bg-white/5 border border-white/10 rounded-lg font-bold text-[11px] tracking-[0.2em] uppercase text-white/50 hover:bg-white/10 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Banners List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {banners.length === 0 ? (
          <div className="col-span-full text-center py-12 text-white/50">
             No seasonal collections yet. Create one to get started!
          </div>
        ) : (
          banners.map((banner) => (
            <motion.div
              key={banner._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#121A2F]/60 border border-white/10 rounded-2xl overflow-hidden hover:border-[#D4AF37]/50 transition-all"
            >
              {/* Banner Image */}
              <div className="relative h-32 bg-white/5">
                <Image
                  src={banner.bannerImage}
                  alt={banner.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-3 right-3 bg-[#D4AF37] text-[#0B101E] px-3 py-1 rounded-full text-[10px] font-bold">
                  {banner.season}
                </div>
              </div>

              {/* Content */}
              <div className="p-4 space-y-3">
                <h3 className="font-bold text-white truncate">{banner.title}</h3>
                {banner.discountPercent ? (
                  <p className="text-[#D4AF37] font-bold">{banner.discountPercent}% OFF</p>
                ) : null}
                <p className="text-[10px] text-white/50">
                  {new Date(banner.startDate).toLocaleDateString()} - {new Date(banner.endDate).toLocaleDateString()}
                </p>
                <div className="flex items-center gap-2">
                  {banner.isActive ? (
                    <span className="text-[10px] bg-green-500/20 text-green-400 px-2 py-1 rounded">Active</span>
                  ) : (
                    <span className="text-[10px] bg-red-500/20 text-red-400 px-2 py-1 rounded">Inactive</span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => handleEdit(banner)}
                    className="flex-1 flex items-center justify-center gap-1 bg-white/10 hover:bg-[#D4AF37]/20 text-white px-3 py-2 rounded-lg text-[10px] font-bold transition-all"
                  >
                    <Edit2 size={12} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(banner._id)}
                    className="flex-1 flex items-center justify-center gap-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 px-3 py-2 rounded-lg text-[10px] font-bold transition-all"
                  >
                    <Trash2 size={12} />
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}
