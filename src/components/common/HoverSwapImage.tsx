'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

type HoverSwapImageProps = {
  primaryImage?: string
  secondaryImage?: string
  alt: string
  sizes: string
  className?: string
  fitClassName?: string
}

export default function HoverSwapImage({
  primaryImage,
  secondaryImage,
  alt,
  sizes,
  className,
  fitClassName = 'object-cover',
}: HoverSwapImageProps) {
  const primary = primaryImage || '/images/placeholder.jpg'
  const secondary = secondaryImage && secondaryImage.trim() !== '' ? secondaryImage : null
  const [isMobilePreviewVisible, setIsMobilePreviewVisible] = useState(false)

  useEffect(() => {
    if (!secondary || typeof window === 'undefined') {
      return
    }

    const mediaQuery = window.matchMedia('(max-width: 767px)')
    let intervalId: number | null = null

    const stopPreviewLoop = () => {
      if (intervalId !== null) {
        window.clearInterval(intervalId)
        intervalId = null
      }
    }

    const startPreviewLoop = () => {
      stopPreviewLoop()

      if (!mediaQuery.matches) {
        setIsMobilePreviewVisible(false)
        return
      }

      setIsMobilePreviewVisible(false)
      intervalId = window.setInterval(() => {
        setIsMobilePreviewVisible((prev) => !prev)
      }, 2000)
    }

    const handleMediaChange = () => {
      startPreviewLoop()
    }

    startPreviewLoop()

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleMediaChange)
    } else {
      mediaQuery.addListener(handleMediaChange)
    }

    return () => {
      stopPreviewLoop()
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleMediaChange)
      } else {
        mediaQuery.removeListener(handleMediaChange)
      }
    }
  }, [secondary])

  const wrapperClassName = className
    ? `relative block w-full h-full overflow-hidden ${className}`
    : 'relative block w-full h-full overflow-hidden'

  return (
    <div className={wrapperClassName}>
      <Image
        src={primary}
        alt={alt}
        fill
        sizes={sizes}
        className={`${fitClassName} transition-opacity duration-500 ${secondary ? 'md:group-hover:opacity-0' : ''} ${secondary && isMobilePreviewVisible ? 'opacity-0' : 'opacity-100'}`}
        unoptimized={primary.includes('cloudinary')}
        onError={(e) => {
          const target = e.target as HTMLImageElement
          target.src = '/images/placeholder.jpg'
        }}
      />

      {secondary ? (
        <Image
          src={secondary}
          alt={`${alt} alternate view`}
          fill
          sizes={sizes}
          className={`${fitClassName} transition-opacity duration-500 opacity-0 md:block md:opacity-0 md:group-hover:opacity-100 ${isMobilePreviewVisible ? 'opacity-100' : 'opacity-0'}`}
          unoptimized={secondary.includes('cloudinary')}
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.src = primary
          }}
        />
      ) : null}
    </div>
  )
}
