'use client'

import { useEffect, useState } from 'react'
import { X, Ruler } from 'lucide-react'

interface SizeChartModalProps {
  isOpen: boolean
  onClose: () => void
  category?: string
}

// Size chart data: Pakistan / UK / USA / EU / Foot Length (cm)
const mensSizeData = [
  { pk: '6',    uk: '5',   usa: '6',    eu: '38', cm: '24.0' },
  { pk: '7',    uk: '6',   usa: '7',    eu: '39', cm: '24.8' },
  { pk: '7.5',  uk: '6.5', usa: '7.5',  eu: '40', cm: '25.4' },
  { pk: '8',    uk: '7',   usa: '8',    eu: '41', cm: '26.0' },
  { pk: '8.5',  uk: '7.5', usa: '8.5',  eu: '42', cm: '26.7' },
  { pk: '9',    uk: '8',   usa: '9',    eu: '43', cm: '27.3' },
  { pk: '9.5',  uk: '8.5', usa: '9.5',  eu: '43', cm: '27.9' },
  { pk: '10',   uk: '9',   usa: '10',   eu: '44', cm: '28.6' },
  { pk: '10.5', uk: '9.5', usa: '10.5', eu: '44', cm: '29.2' },
  { pk: '11',   uk: '10',  usa: '11',   eu: '45', cm: '29.8' },
  { pk: '12',   uk: '11',  usa: '12',   eu: '46', cm: '30.5' },
  { pk: '13',   uk: '12',  usa: '13',   eu: '47', cm: '31.2' },
]

const womensSizeData = [
  { pk: '3',    uk: '2',   usa: '4',    eu: '35', cm: '21.6' },
  { pk: '4',    uk: '3',   usa: '5',    eu: '36', cm: '22.5' },
  { pk: '4.5',  uk: '3.5', usa: '5.5',  eu: '36', cm: '23.0' },
  { pk: '5',    uk: '4',   usa: '6',    eu: '37', cm: '23.5' },
  { pk: '5.5',  uk: '4.5', usa: '6.5',  eu: '37', cm: '24.0' },
  { pk: '6',    uk: '5',   usa: '7',    eu: '38', cm: '24.5' },
  { pk: '6.5',  uk: '5.5', usa: '7.5',  eu: '38', cm: '25.1' },
  { pk: '7',    uk: '6',   usa: '8',    eu: '39', cm: '25.4' },
  { pk: '7.5',  uk: '6.5', usa: '8.5',  eu: '40', cm: '26.0' },
  { pk: '8',    uk: '7',   usa: '9',    eu: '41', cm: '26.7' },
  { pk: '9',    uk: '8',   usa: '10',   eu: '42', cm: '27.3' },
]

const kidsSizeData = [
  { pk: '1',    uk: '13',  usa: '1.5',  eu: '33', cm: '20.3' },
  { pk: '2',    uk: '1',   usa: '2',    eu: '33', cm: '21.0' },
  { pk: '2.5',  uk: '1.5', usa: '2.5',  eu: '34', cm: '21.6' },
  { pk: '3',    uk: '2',   usa: '3',    eu: '35', cm: '22.2' },
  { pk: '3.5',  uk: '2.5', usa: '3.5',  eu: '35', cm: '22.9' },
  { pk: '4',    uk: '3',   usa: '4',    eu: '36', cm: '23.5' },
  { pk: '4.5',  uk: '3.5', usa: '4.5',  eu: '36', cm: '24.0' },
  { pk: '5',    uk: '4',   usa: '5',    eu: '37', cm: '24.5' },
  { pk: '5.5',  uk: '4.5', usa: '5.5',  eu: '37', cm: '25.0' },
  { pk: '6',    uk: '5',   usa: '6',    eu: '38', cm: '25.4' },
]

export default function SizeChartModal({ isOpen, onClose, category }: SizeChartModalProps) {
  // Animate in / out via CSS transitions
  const [visible, setVisible] = useState(false)
  const [rendered, setRendered] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setRendered(true)
      // Delay to let the DOM paint before triggering transition
      requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)))
    } else {
      setVisible(false)
      const t = setTimeout(() => setRendered(false), 280)
      return () => clearTimeout(t)
    }
  }, [isOpen])

  // Determine chart based on product category
  const isWomen = category?.toLowerCase() === 'women'
  const isKids  = category?.toLowerCase() === 'kids'
  const chartData  = isKids ? kidsSizeData : isWomen ? womensSizeData : mensSizeData
  const chartTitle = isKids ? "Kids' Size Chart" : isWomen ? "Women's Size Chart" : "Men's Size Chart"

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    if (isOpen) document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [isOpen, onClose])

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!rendered) return null

  return (
    <>
      {/* ─── Backdrop ─── */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 999,
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(4px)',
          transition: 'opacity 0.28s ease',
          opacity: visible ? 1 : 0,
        }}
      />

      {/* ─── Modal ─── */}
      <div
        style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '16px',
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            background: '#fff',
            borderRadius: '24px',
            boxShadow: '0 30px 80px rgba(0,0,0,0.35)',
            width: '100%',
            maxWidth: '680px',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            pointerEvents: 'all',
            transition: 'opacity 0.28s ease, transform 0.28s cubic-bezier(0.34,1.56,0.64,1)',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0) scale(1)' : 'translateY(32px) scale(0.97)',
          }}
        >
          {/* Header */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '20px 24px',
            background: 'linear-gradient(135deg, #18202B 0%, #253041 100%)',
            color: '#fff',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '38px', height: '38px',
                background: 'rgba(212,175,55,0.2)',
                borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Ruler size={18} color="#D4AF37" />
              </div>
              <div>
                <h2 style={{ margin: 0, fontSize: '15px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  {chartTitle}
                </h2>
                <p style={{ margin: 0, fontSize: '10px', color: 'rgba(255,255,255,0.5)', marginTop: '2px' }}>
                  Pakistan • UK • USA • EU • CM
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              aria-label="Close size chart"
              style={{
                width: '36px', height: '36px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.1)',
                border: 'none',
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background 0.2s',
              }}
              onMouseOver={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.22)')}
              onMouseOut={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}
            >
              <X size={17} color="#fff" />
            </button>
          </div>

          {/* How to Measure tip */}
          <div style={{
            background: '#FFF9EB',
            borderBottom: '1px solid #F0E6C0',
            padding: '12px 24px',
            display: 'flex', alignItems: 'flex-start', gap: '10px',
          }}>
            <span style={{ fontSize: '18px', marginTop: '1px' }}>📏</span>
            <div>
              <p style={{ margin: 0, fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#A97A18', marginBottom: '3px' }}>
                How to Measure
              </p>
              <p style={{ margin: 0, fontSize: '12px', color: '#5C4A2A', lineHeight: '1.6' }}>
                Apne pair ko zameen par rakhein aur eidi se sab se aage ki ungali tak ka fasla tape se napein.
                Woh measurement <strong>centimeters</strong> mein neeche wali table se match karein.
              </p>
            </div>
          </div>

          {/* Scrollable Table */}
          <div style={{ overflowY: 'auto', flex: 1 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'center' }}>
              <thead>
                <tr style={{ background: '#18202B', color: '#fff', position: 'sticky', top: 0, zIndex: 5 }}>
                  {[
                    { flag: '🇵🇰', label: 'Pakistan', sub: 'PK Size' },
                    { flag: '🇬🇧', label: 'UK',       sub: 'UK Size' },
                    { flag: '🇺🇸', label: 'USA',      sub: 'US Size' },
                    { flag: '🇪🇺', label: 'EU',       sub: 'EU Size' },
                    { flag: '📐',  label: 'Foot Length', sub: 'Centimeters' },
                  ].map((col) => (
                    <th key={col.label} style={{ padding: '14px 8px', fontWeight: 700, fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                      <span style={{ display: 'block', fontSize: '14px', marginBottom: '2px' }}>{col.flag} {col.label}</span>
                      <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: '9px', fontWeight: 400 }}>{col.sub}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {chartData.map((row, index) => (
                  <tr
                    key={row.pk}
                    style={{
                      borderBottom: '1px solid #f0f0f0',
                      background: index % 2 === 0 ? '#ffffff' : '#f9f9fa',
                      transition: 'background 0.15s',
                      cursor: 'default',
                    }}
                    onMouseOver={e => (e.currentTarget.style.background = '#FFF9EB')}
                    onMouseOut={e => (e.currentTarget.style.background = index % 2 === 0 ? '#ffffff' : '#f9f9fa')}
                  >
                    <td style={{ padding: '13px 8px', fontWeight: 700, fontSize: '15px', color: '#18202B' }}>{row.pk}</td>
                    <td style={{ padding: '13px 8px', color: '#444', fontWeight: 600 }}>{row.uk}</td>
                    <td style={{ padding: '13px 8px', color: '#444', fontWeight: 600 }}>{row.usa}</td>
                    <td style={{ padding: '13px 8px', color: '#444', fontWeight: 600 }}>{row.eu}</td>
                    <td style={{ padding: '13px 8px' }}>
                      <span style={{
                        display: 'inline-block',
                        background: 'rgba(212,175,55,0.12)',
                        color: '#A97A18',
                        fontWeight: 700,
                        padding: '3px 10px',
                        borderRadius: '20px',
                        fontSize: '12px',
                      }}>
                        {row.cm} cm
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div style={{
            padding: '14px 24px',
            borderTop: '1px solid #f0f0f0',
            background: '#fafafa',
          }}>
            <p style={{ margin: 0, fontSize: '11px', color: '#9ca3af', textAlign: 'center', lineHeight: '1.5' }}>
              ⚠️ Size charts are for reference only. Sizing may slightly vary by style.
              If you&apos;re between sizes, we recommend sizing up.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
