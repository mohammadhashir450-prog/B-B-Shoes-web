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

  return (
    <div className={className}>
      <Image
        src={primary}
        alt={alt}
        fill
        sizes={sizes}
        className={`${fitClassName} transition-opacity duration-500 ${secondary ? 'md:group-hover:opacity-0' : ''}`}
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
          className={`${fitClassName} hidden md:block opacity-0 md:group-hover:opacity-100 transition-opacity duration-500`}
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
