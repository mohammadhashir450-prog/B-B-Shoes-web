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
        className={`${fitClassName} transition-opacity duration-500 ${secondary ? 'md:group-hover:opacity-0 md:mobile-primary-swap' : ''}`}
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
          className={`${fitClassName} opacity-0 md:block md:opacity-0 md:group-hover:opacity-100 md:mobile-secondary-swap transition-opacity duration-500`}
          unoptimized={secondary.includes('cloudinary')}
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.src = primary
          }}
        />
      ) : null}

      {secondary ? (
        <style jsx>{`
          .mobile-primary-swap {
            animation: primarySwap 4.8s ease-in-out infinite;
          }

          .mobile-secondary-swap {
            animation: secondarySwap 4.8s ease-in-out infinite;
          }

          @media (min-width: 768px) {
            .mobile-primary-swap,
            .mobile-secondary-swap {
              animation: none;
            }
          }

          @keyframes primarySwap {
            0%,
            44% {
              opacity: 1;
            }
            56%,
            100% {
              opacity: 0;
            }
          }

          @keyframes secondarySwap {
            0%,
            44% {
              opacity: 0;
            }
            56%,
            100% {
              opacity: 1;
            }
          }
        `}</style>
      ) : null}
    </div>
  )
}
