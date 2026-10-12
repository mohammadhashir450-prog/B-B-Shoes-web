'use client'

import { usePathname } from 'next/navigation'

// Applies the storefront premium theme to every route except the admin panel.
export default function SiteScope({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || ''
  const isAdmin = pathname === '/admin' || pathname.startsWith('/admin/')
  return <div className={isAdmin ? undefined : 'bb-site'}>{children}</div>
}
