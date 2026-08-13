'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { CldUploadWidget } from 'next-cloudinary'
import {
  Plus, Edit2, Trash2, X, Save, Upload, ImageIcon,
  Clock, Calendar, ChevronDown, ChevronUp, Eye, EyeOff,
  CheckCircle2, AlertCircle, Timer, Zap
} from 'lucide-react'

interface ISeasonalBanner {
  _id: string;
  season: 'Summer' | 'Winter' | 'Spring' | 'Fall';
  title: string;
  description?: string;
  bannerImage: string;
  galleryImages?: string[];
  linkUrl?: string;
  discountPercent?: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  displayOrder: number;
}

const toInputDateTime = (value: string | Date) => {
  const date = value instanceof Date ? value : new Date(value)
  if (!Number.isFinite(date.getTime())) return ''
  const pad = (segment: number) => segment.toString().padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

const toApiDate = (value: string) => {
  const date = new Date(value)
  return Number.isFinite(date.getTime()) ? date.toISOString() : value
}

const formatDuration = (milliseconds: number) => {
  const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000))
  const days = Math.floor(totalSeconds / 86400)
  const hours = Math.floor((totalSeconds % 86400) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  const chunks: string[] = []
  if (days > 0) chunks.push(`${days}d`)
  if (hours > 0 || days > 0) chunks.push(`${hours}h`)
  if (minutes > 0 || hours > 0 || days > 0) chunks.push(`${minutes}m`)
  chunks.push(`${seconds}s`)
  return chunks.slice(0, 3).join(' ')
}

const QUICK_SCHEDULES = [
  { label: '1 Day', days: 1 },
  { label: '7 Days', days: 7 },
  { label: '14 Days', days: 14 },
  { label: '30 Days', days: 30 },
  { label: '60 Days', days: 60 },
  { label: '90 Days', days: 90 },
]

export default function AdminSeasonalBanners() {
  const [banners, setBanners] = useState<ISeasonalBanner[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [previewNow, setPreviewNow] = useState<number>(() => Date.now())
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [uploadingPrimary, setUploadingPrimary] = useState(false)

  const [formData, setFormData] = useState<Partial<ISeasonalBanner>>({
    season: 'Summer',
    title: '',
    description: '',
    bannerImage: '',
    galleryImages: [],
    linkUrl: '/collections',
    discountPercent: 0,
    startDate: '',
    endDate: '',
    isActive: true,
    displayOrder: 0,
  })

  useEffect(() => { fetchBanners() }, [])

  useEffect(() => {
    if (!showForm) return
    const timer = window.setInterval(() => setPreviewNow(Date.now()), 1000)
    return () => window.clearInterval(timer)
  }, [showForm])

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

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text })
    setTimeout(() => setMessage(null), 4000)
  }

  const resetForm = () => {
    setFormData({
      season: 'Summer',
      title: '',
      description: '',
      bannerImage: '',
      galleryImages: [],
      linkUrl: '/collections',
      discountPercent: 0,
      startDate: '',
      endDate: '',
      isActive: true,
      displayOrder: 0,
    })
    setShowAdvanced(false)
  }

  const handleAdd = () => {
    resetForm()
    setEditingId(null)
    setShowForm(true)
  }

  const handleEdit = (banner: ISeasonalBanner) => {
    setFormData({
      ...banner,
      startDate: toInputDateTime(banner.startDate),
      endDate: toInputDateTime(banner.endDate),
      galleryImages: banner.galleryImages || [],
    })
    setEditingId(banner._id)
    setShowForm(true)
  }

  const applyQuickSchedule = (days: number) => {
    const now = new Date()
    const end = new Date(now.getTime() + days * 24 * 60 * 60 * 1000)
    setFormData(prev => ({
      ...prev,
      startDate: toInputDateTime(now),
      endDate: toInputDateTime(end),
      isActive: true,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)

    if (!formData.title?.trim()) { showMessage('error', 'Title is required'); return }
    if (!formData.bannerImage) { showMessage('error', 'Banner image is required — please upload an image first'); return }
    if (!formData.startDate || !formData.endDate) { showMessage('error', 'Start date and end date are required'); return }

    const start = new Date(formData.startDate)
    const end = new Date(formData.endDate)
    if (start >= end) { showMessage('error', 'End date must be after start date'); return }

    setSaving(true)
    try {
      const method = editingId ? 'PUT' : 'POST'
      const url = editingId
        ? `/api/settings/seasonal-banners/${editingId}`
        : '/api/settings/seasonal-banners'

      const payload = {
        ...formData,
        startDate: toApiDate(formData.startDate),
        endDate: toApiDate(formData.endDate),
      }

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const result = await response.json()

      if (response.ok) {
        showMessage('success', editingId ? 'Banner updated successfully' : 'Banner created and scheduled successfully')
        setShowForm(false)
        await fetchBanners()
      } else {
        showMessage('error', result?.message || 'Failed to save banner')
      }
    } catch {
      showMessage('error', 'Error saving banner. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this banner permanently?')) return
    try {
      const response = await fetch(`/api/settings/seasonal-banners/${id}`, { method: 'DELETE' })
      if (response.ok) {
        showMessage('success', 'Banner deleted successfully')
        await fetchBanners()
      } else {
        showMessage('error', 'Failed to delete banner')
      }
    } catch {
      showMessage('error', 'Error deleting banner')
    }
  }

  const extractCloudinaryUrl = (result: any) => {
    const info = result?.info
    if (!info) return ''
    return typeof info.secure_url === 'string' ? info.secure_url.trim() : ''
  }

  const removeAdditionalImage = (indexToRemove: number) => {
    setFormData(prev => ({
      ...prev,
      galleryImages: (prev.galleryImages || []).filter((_, index) => index !== indexToRemove),
    }))
  }

  // Countdown preview logic
  const startTimestamp = formData.startDate ? new Date(formData.startDate).getTime() : NaN
  const endTimestamp = formData.endDate ? new Date(formData.endDate).getTime() : NaN

  const countdownStatus = (() => {
    if (!formData.startDate || !formData.endDate) return { badge: 'No Dates', color: 'gray', primary: 'Set start and end dates to see countdown', secondary: '' }
    if (!Number.isFinite(startTimestamp) || !Number.isFinite(endTimestamp)) return { badge: 'Invalid', color: 'red', primary: 'Invalid date format', secondary: '' }
    if (startTimestamp >= endTimestamp) return { badge: 'Invalid Range', color: 'red', primary: 'End date must be after start date', secondary: '' }
    if (previewNow < startTimestamp) return { badge: 'Scheduled', color: 'sky', primary: `Goes live in ${formatDuration(startTimestamp - previewNow)}`, secondary: `Duration: ${formatDuration(endTimestamp - startTimestamp)}` }
    if (previewNow <= endTimestamp) return { badge: 'LIVE NOW', color: 'emerald', primary: `Expires in ${formatDuration(endTimestamp - previewNow)}`, secondary: `Active for ${formatDuration(previewNow - startTimestamp)}` }
    return { badge: 'Expired', color: 'rose', primary: `Expired ${formatDuration(previewNow - endTimestamp)} ago`, secondary: 'Banner is hidden from home page' }
  })()

  const countdownColorMap: Record<string, string> = {
    gray: 'border-white/15 bg-white/5 text-white/60',
    red: 'border-red-400/40 bg-red-500/10 text-red-300',
    sky: 'border-sky-400/40 bg-sky-500/10 text-sky-200',
    emerald: 'border-emerald-400/40 bg-emerald-500/10 text-emerald-200',
    rose: 'border-rose-400/40 bg-rose-500/10 text-rose-200',
  }

  const getBannerStatus = (banner: ISeasonalBanner) => {
    const now = Date.now()
    const start = new Date(banner.startDate).getTime()
    const end = new Date(banner.endDate).getTime()
    if (!banner.isActive) return { label: 'Inactive', dot: 'bg-white/30' }
    if (now < start) return { label: 'Scheduled', dot: 'bg-sky-400' }
    if (now <= end) return { label: 'Live', dot: 'bg-emerald-400' }
    return { label: 'Expired', dot: 'bg-rose-400' }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-[#D4AF37]/30 border-t-[#D4AF37] rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-serif font-black text-white mb-1">Banner Manager</h2>
          <p className="text-white/45 text-sm">Upload promotional banners that display on home page with timer-based scheduling</p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-[#D4AF37] text-[#0B101E] px-5 py-2.5 rounded-full font-bold text-[11px] tracking-[0.18em] uppercase hover:bg-[#E5C158] transition-all shadow-lg shadow-[#D4AF37]/20"
        >
          <Plus size={15} />
          New Banner
        </button>
      </div>

      {/* Global Message Toast */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`flex items-center gap-3 p-4 rounded-xl border text-sm font-medium ${
              message.type === 'success'
                ? 'bg-emerald-500/10 border-emerald-400/30 text-emerald-300'
                : 'bg-rose-500/10 border-rose-400/30 text-rose-300'
            }`}
          >
            {message.type === 'success'
              ? <CheckCircle2 size={16} className="shrink-0" />
              : <AlertCircle size={16} className="shrink-0" />}
            {message.text}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create / Edit Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3 }}
            className="bg-[#0D1526]/80 backdrop-blur-2xl rounded-2xl border border-white/10 overflow-hidden"
          >
            {/* Form Header */}
            <div className="flex items-center justify-between px-8 py-5 border-b border-white/8">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/15 flex items-center justify-center">
                  <ImageIcon size={15} className="text-[#D4AF37]" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm">{editingId ? 'Edit Banner' : 'Create New Banner'}</h3>
                  <p className="text-white/40 text-[11px]">Upload image and set display schedule</p>
                </div>
              </div>
              <button
                onClick={() => setShowForm(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
              >
                <X size={16} className="text-white/50" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-8">
              {/* ── STEP 1: Banner Image Upload ── */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-5 h-5 rounded-full bg-[#D4AF37] text-[#0B101E] text-[10px] font-black flex items-center justify-center">1</span>
                  <p className="text-white font-bold text-sm tracking-wide">Upload Banner Image</p>
                  <span className="text-rose-400 text-xs">*required</span>
                </div>

                {/* Upload Zone */}
                {!formData.bannerImage ? (
                  <CldUploadWidget
                    uploadPreset="bb_web"
                    options={{
                      cloudName: 'dt2ikjlfc',
                      sources: ['local', 'url'],
                      multiple: false,
                      maxFiles: 1,
                      maxFileSize: 10000000,
                      clientAllowedFormats: ['png', 'jpg', 'jpeg', 'webp'],
                      folder: 'bb_shoes/seasonal-banners',
                      cropping: false,
                    }}
                    onSuccess={(result: any) => {
                      const url = extractCloudinaryUrl(result)
                      if (!url) { showMessage('error', 'Upload failed: Could not get image URL'); return }
                      setFormData(prev => ({ ...prev, bannerImage: url }))
                      setUploadingPrimary(false)
                      showMessage('success', 'Banner image uploaded! Now fill in the details below.')
                    }}
                    onError={(error: any) => {
                      setUploadingPrimary(false)
                      showMessage('error', `Upload failed: ${error?.message || 'Unknown error'}`)
                    }}
                  >
                    {({ open }) => (
                      <button
                        type="button"
                        onClick={() => { setUploadingPrimary(true); open() }}
                        className="w-full group relative border-2 border-dashed border-[#D4AF37]/30 rounded-2xl bg-[#D4AF37]/3 hover:border-[#D4AF37]/70 hover:bg-[#D4AF37]/8 transition-all duration-300 overflow-hidden"
                      >
                        <div className="py-16 flex flex-col items-center gap-4">
                          <div className="w-16 h-16 rounded-2xl bg-[#D4AF37]/15 flex items-center justify-center group-hover:bg-[#D4AF37]/25 transition-colors">
                            <Upload size={28} className="text-[#D4AF37]" />
                          </div>
                          <div className="text-center">
                            <p className="text-white font-bold text-sm mb-1">Click to upload banner image</p>
                            <p className="text-white/45 text-xs">PNG, JPG, WebP up to 10MB</p>
                            <p className="text-[#D4AF37]/70 text-[11px] mt-2">Recommended: 1920×600px or wider (landscape)</p>
                          </div>
                        </div>
                        {/* Animated corner accents */}
                        <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-[#D4AF37]/40 rounded-tl-sm" />
                        <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-[#D4AF37]/40 rounded-tr-sm" />
                        <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-[#D4AF37]/40 rounded-bl-sm" />
                        <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-[#D4AF37]/40 rounded-br-sm" />
                      </button>
                    )}
                  </CldUploadWidget>
                ) : (
                  /* Image Preview */
                  <div className="relative rounded-2xl overflow-hidden border border-[#D4AF37]/30 bg-black shadow-2xl">
                    <div className="relative w-full" style={{ paddingBottom: '33%' }}>
                      <Image
                        src={formData.bannerImage}
                        alt="Banner preview"
                        fill
                        className="object-cover"
                      />
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      {/* Controls */}
                      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                        <div className="flex items-center gap-2 bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-full">
                          <CheckCircle2 size={13} className="text-emerald-400" />
                          <span className="text-white text-[11px] font-bold">Image Uploaded</span>
                        </div>
                        <CldUploadWidget
                          uploadPreset="bb_web"
                          options={{
                            cloudName: 'dt2ikjlfc',
                            sources: ['local', 'url'],
                            multiple: false,
                            maxFiles: 1,
                            maxFileSize: 10000000,
                            clientAllowedFormats: ['png', 'jpg', 'jpeg', 'webp'],
                            folder: 'bb_shoes/seasonal-banners',
                          }}
                          onSuccess={(result: any) => {
                            const url = extractCloudinaryUrl(result)
                            if (url) setFormData(prev => ({ ...prev, bannerImage: url }))
                          }}
                        >
                          {({ open }) => (
                            <button
                              type="button"
                              onClick={() => open()}
                              className="flex items-center gap-1.5 bg-black/50 backdrop-blur-sm border border-white/20 px-3 py-1.5 rounded-full text-white text-[11px] font-bold hover:bg-white/10 transition-colors"
                            >
                              <Upload size={12} />
                              Change Image
                            </button>
                          )}
                        </CldUploadWidget>
                      </div>
                    </div>
                    {/* Home Page Preview Label */}
                    <div className="bg-[#0B1020] px-4 py-2.5 flex items-center gap-2">
                      <Eye size={12} className="text-[#D4AF37]" />
                      <span className="text-[#D4AF37] text-[11px] font-bold tracking-[0.12em] uppercase">How it appears on home page</span>
                    </div>
                  </div>
                )}
              </div>

              {/* ── STEP 2: Banner Details ── */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-5 h-5 rounded-full bg-[#D4AF37] text-[#0B101E] text-[10px] font-black flex items-center justify-center">2</span>
                  <p className="text-white font-bold text-sm tracking-wide">Banner Details</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Title */}
                  <div className="md:col-span-2">
                    <label className="text-xs text-white/60 font-bold mb-1.5 block tracking-[0.1em] uppercase">Banner Title *</label>
                    <input
                      type="text"
                      value={formData.title || ''}
                      onChange={e => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g., Eid Sale — Up to 40% Off"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/25 focus:outline-none focus:border-[#D4AF37] transition-colors text-sm"
                    />
                  </div>

                  {/* Description */}
                  <div className="md:col-span-2">
                    <label className="text-xs text-white/60 font-bold mb-1.5 block tracking-[0.1em] uppercase">Description (optional)</label>
                    <textarea
                      value={formData.description || ''}
                      onChange={e => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Brief description shown below banner title…"
                      rows={2}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/25 focus:outline-none focus:border-[#D4AF37] transition-colors text-sm resize-none"
                    />
                  </div>

                  {/* Season */}
                  <div>
                    <label className="text-xs text-white/60 font-bold mb-1.5 block tracking-[0.1em] uppercase">Season</label>
                    <select
                      value={formData.season || 'Summer'}
                      onChange={e => setFormData({ ...formData, season: e.target.value as any })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37] transition-colors text-sm"
                    >
                      <option value="Summer">Summer</option>
                      <option value="Winter">Winter</option>
                      <option value="Spring">Spring</option>
                      <option value="Fall">Fall</option>
                    </select>
                  </div>

                  {/* Link URL */}
                  <div>
                    <label className="text-xs text-white/60 font-bold mb-1.5 block tracking-[0.1em] uppercase">Click Destination</label>
                    <input
                      type="text"
                      value={formData.linkUrl || ''}
                      onChange={e => setFormData({ ...formData, linkUrl: e.target.value })}
                      placeholder="/collections or /sales"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/25 focus:outline-none focus:border-[#D4AF37] transition-colors text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* ── STEP 3: Schedule ── */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-5 h-5 rounded-full bg-[#D4AF37] text-[#0B101E] text-[10px] font-black flex items-center justify-center">3</span>
                  <p className="text-white font-bold text-sm tracking-wide">Display Schedule</p>
                  <span className="text-white/40 text-xs">— banner auto shows/hides based on this timer</span>
                </div>

                {/* Quick Presets */}
                <div className="mb-4">
                  <p className="text-[11px] text-white/40 mb-2 tracking-[0.08em] uppercase">Quick Presets (starts now)</p>
                  <div className="flex flex-wrap gap-2">
                    {QUICK_SCHEDULES.map(({ label, days }) => (
                      <button
                        key={days}
                        type="button"
                        onClick={() => applyQuickSchedule(days)}
                        className="px-3.5 py-1.5 rounded-full text-[11px] font-bold tracking-[0.1em] uppercase border border-white/15 text-white/60 hover:border-[#D4AF37] hover:text-[#D4AF37] hover:bg-[#D4AF37]/8 transition-all"
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="text-xs text-white/60 font-bold mb-1.5 block tracking-[0.1em] uppercase">
                      <Calendar size={11} className="inline mr-1" />Start Date & Time *
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.startDate || ''}
                      onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37] transition-colors text-sm [color-scheme:dark]"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-white/60 font-bold mb-1.5 block tracking-[0.1em] uppercase">
                      <Clock size={11} className="inline mr-1" />End Date & Time *
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.endDate || ''}
                      onChange={e => setFormData({ ...formData, endDate: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37] transition-colors text-sm [color-scheme:dark]"
                    />
                  </div>
                </div>

                {/* Live Countdown Preview */}
                <div className={`rounded-xl border p-4 transition-colors ${countdownColorMap[countdownStatus.color] || countdownColorMap.gray}`}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <Timer size={13} />
                      <span className="text-[11px] font-bold tracking-[0.15em] uppercase">Live Timer Preview</span>
                    </div>
                    <span className={`text-[10px] font-black tracking-[0.15em] uppercase px-2 py-0.5 rounded-full ${
                      countdownStatus.color === 'emerald' ? 'bg-emerald-400/20' :
                      countdownStatus.color === 'sky' ? 'bg-sky-400/20' :
                      countdownStatus.color === 'rose' ? 'bg-rose-400/20' :
                      'bg-white/10'
                    }`}>
                      {countdownStatus.badge}
                    </span>
                  </div>
                  <p className="text-sm font-semibold">{countdownStatus.primary}</p>
                  {countdownStatus.secondary && (
                    <p className="text-[11px] opacity-75 mt-0.5">{countdownStatus.secondary}</p>
                  )}
                </div>
              </div>

              {/* ── Advanced Settings (collapsible) ── */}
              <div className="border border-white/8 rounded-xl overflow-hidden">
                <button
                  type="button"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Zap size={14} className="text-white/40" />
                    <span className="text-white/60 text-sm font-bold">Advanced Settings</span>
                    <span className="text-white/30 text-xs">(discount %, display order, gallery images)</span>
                  </div>
                  {showAdvanced ? <ChevronUp size={16} className="text-white/40" /> : <ChevronDown size={16} className="text-white/40" />}
                </button>

                <AnimatePresence>
                  {showAdvanced && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 pt-2 space-y-5 border-t border-white/8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Discount */}
                          <div>
                            <label className="text-xs text-white/60 font-bold mb-1.5 block tracking-[0.1em] uppercase">Discount % (0 = none)</label>
                            <input
                              type="number"
                              value={formData.discountPercent || 0}
                              onChange={e => setFormData({ ...formData, discountPercent: Number(e.target.value) })}
                              min="0" max="100"
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37] transition-colors text-sm"
                            />
                          </div>

                          {/* Display Order */}
                          <div>
                            <label className="text-xs text-white/60 font-bold mb-1.5 block tracking-[0.1em] uppercase">Display Order</label>
                            <input
                              type="number"
                              value={formData.displayOrder || 0}
                              onChange={e => setFormData({ ...formData, displayOrder: Number(e.target.value) })}
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37] transition-colors text-sm"
                            />
                          </div>

                          {/* Active Toggle */}
                          <div className="md:col-span-2 flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() => setFormData(prev => ({ ...prev, isActive: !prev.isActive }))}
                              className={`relative w-11 h-6 rounded-full transition-colors ${formData.isActive ? 'bg-[#D4AF37]' : 'bg-white/15'}`}
                            >
                              <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${formData.isActive ? 'translate-x-5' : 'translate-x-0'}`} />
                            </button>
                            <span className="text-white/70 text-sm font-bold">Active</span>
                            <span className="text-white/35 text-xs">(inactive banners won&apos;t show even if scheduled)</span>
                          </div>
                        </div>

                        {/* Gallery Images */}
                        <div>
                          <label className="text-xs text-white/60 font-bold mb-2 block tracking-[0.1em] uppercase">Additional Slider Images (max 2)</label>
                          <p className="text-[11px] text-white/35 mb-3">These cycle with the main banner image in the hero slider</p>

                          <CldUploadWidget
                            uploadPreset="bb_web"
                            options={{
                              cloudName: 'dt2ikjlfc',
                              sources: ['local', 'url'],
                              multiple: false,
                              maxFiles: 1,
                              maxFileSize: 10000000,
                              clientAllowedFormats: ['png', 'jpg', 'jpeg', 'webp'],
                              folder: 'bb_shoes/seasonal-banners',
                            }}
                            onSuccess={(result: any) => {
                              const existing = formData.galleryImages || []
                              if (existing.length >= 2) { showMessage('error', 'Maximum 2 additional images allowed'); return }
                              const url = extractCloudinaryUrl(result)
                              if (!url) return
                              setFormData(prev => ({ ...prev, galleryImages: [...(prev.galleryImages || []), url] }))
                            }}
                          >
                            {({ open }) => {
                              const isLimitReached = (formData.galleryImages || []).length >= 2
                              return (
                                <button
                                  type="button"
                                  onClick={() => open()}
                                  disabled={isLimitReached}
                                  className="w-full p-4 border-2 border-dashed border-white/15 rounded-xl flex items-center justify-center gap-2 text-white/50 hover:border-[#D4AF37]/40 hover:text-white/70 transition-all disabled:opacity-40 disabled:cursor-not-allowed text-sm"
                                >
                                  <Upload size={15} />
                                  {isLimitReached ? 'Maximum reached (2/2)' : `Upload Additional Image (${(formData.galleryImages || []).length}/2)`}
                                </button>
                              )
                            }}
                          </CldUploadWidget>

                          {(formData.galleryImages || []).length > 0 && (
                            <div className="mt-3 grid grid-cols-2 gap-3">
                              {(formData.galleryImages || []).map((image, index) => (
                                <div key={image} className="relative rounded-xl overflow-hidden border border-white/10 aspect-video">
                                  <Image src={image} alt={`Slider image ${index + 1}`} fill className="object-cover" />
                                  <button
                                    type="button"
                                    onClick={() => removeAdditionalImage(index)}
                                    className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-rose-500 transition-colors"
                                  >
                                    <X size={11} />
                                  </button>
                                  <div className="absolute bottom-2 left-2 bg-black/60 text-white/80 text-[10px] px-2 py-0.5 rounded">Slide {index + 2}</div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Submit Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving || !formData.title || !formData.bannerImage}
                  className="flex-1 flex items-center justify-center gap-2 bg-[#D4AF37] text-[#0B101E] px-6 py-3.5 rounded-xl font-bold text-[12px] tracking-[0.18em] uppercase hover:bg-[#E5C158] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-[#D4AF37]/20"
                >
                  {saving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-[#0B101E]/30 border-t-[#0B101E] rounded-full animate-spin" />
                      Saving…
                    </>
                  ) : (
                    <>
                      <Save size={15} />
                      {editingId ? 'Update Banner' : 'Publish Banner'}
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-6 py-3.5 bg-white/5 border border-white/10 rounded-xl font-bold text-[12px] tracking-[0.18em] uppercase text-white/50 hover:bg-white/10 transition-all"
                >
                  Cancel
                </button>
              </div>

              {/* Helper note */}
              {!formData.bannerImage && (
                <p className="text-center text-[11px] text-white/30">⬆ Upload a banner image first to enable publishing</p>
              )}
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Banners List */}
      {banners.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-white/10 rounded-2xl">
          <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
            <ImageIcon size={24} className="text-white/25" />
          </div>
          <p className="text-white/40 font-medium">No banners yet</p>
          <p className="text-white/25 text-sm mt-1">Create your first promotional banner to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {banners.map(banner => {
            const status = getBannerStatus(banner)
            const allImages = [banner.bannerImage, ...(banner.galleryImages || [])].filter(Boolean)
            const now = Date.now()
            const end = new Date(banner.endDate).getTime()
            const start = new Date(banner.startDate).getTime()

            return (
              <motion.div
                key={banner._id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="group bg-[#0D1526]/60 border border-white/8 rounded-2xl overflow-hidden hover:border-[#D4AF37]/30 transition-all duration-300"
              >
                {/* Banner image preview */}
                <div className="relative aspect-[16/5] bg-black/40 overflow-hidden">
                  <Image
                    src={banner.bannerImage}
                    alt={banner.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                  {/* Status badge */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-full">
                    <span className={`w-1.5 h-1.5 rounded-full ${status.dot} ${status.label === 'Live' ? 'animate-pulse' : ''}`} />
                    <span className="text-white text-[10px] font-bold">{status.label}</span>
                  </div>

                  {/* Image count */}
                  {allImages.length > 1 && (
                    <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white/80 text-[10px] px-2 py-1 rounded-full font-bold">
                      {allImages.length} slides
                    </div>
                  )}

                  {/* Season tag */}
                  <div className="absolute bottom-3 left-3">
                    <span className="bg-[#D4AF37] text-[#0B101E] text-[10px] font-black px-2.5 py-1 rounded-full tracking-[0.1em] uppercase">
                      {banner.season}
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="font-bold text-white text-sm truncate mb-1">{banner.title}</h3>
                  {banner.description && (
                    <p className="text-white/40 text-xs truncate mb-2">{banner.description}</p>
                  )}

                  <div className="flex items-center gap-3 text-[11px] text-white/35 mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar size={10} />
                      {new Date(banner.startDate).toLocaleDateString('en-PK', { month: 'short', day: 'numeric' })}
                    </span>
                    <span>→</span>
                    <span className="flex items-center gap-1">
                      <Clock size={10} />
                      {new Date(banner.endDate).toLocaleDateString('en-PK', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>

                  {/* Countdown */}
                  {banner.isActive && Number.isFinite(start) && Number.isFinite(end) && (
                    <div className={`text-[11px] font-bold mb-3 ${
                      now < start ? 'text-sky-400' :
                      now <= end ? 'text-emerald-400' :
                      'text-rose-400'
                    }`}>
                      {now < start && `Starts in ${formatDuration(start - now)}`}
                      {now >= start && now <= end && `Expires in ${formatDuration(end - now)}`}
                      {now > end && 'Expired'}
                    </div>
                  )}

                  {/* Discount badge */}
                  {banner.discountPercent ? (
                    <div className="inline-flex items-center bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[#D4AF37] text-[10px] font-bold px-2 py-0.5 rounded-full mb-3">
                      {banner.discountPercent}% OFF
                    </div>
                  ) : null}

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-3 border-t border-white/6">
                    <button
                      onClick={() => handleEdit(banner)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-white/6 hover:bg-white/12 text-white/60 hover:text-white transition-all text-[11px] font-bold tracking-[0.08em] uppercase"
                    >
                      <Edit2 size={12} />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(banner._id)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-white/6 hover:bg-rose-500/20 text-white/60 hover:text-rose-400 transition-all text-[11px] font-bold tracking-[0.08em] uppercase"
                    >
                      <Trash2 size={12} />
                      Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}
