'use client'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import AdminSidebar from '../../components/Admin/AdminSidebar.jsx'

export default function Layout({ children }) {
  const pathname = usePathname()
  const router = useRouter()
  const { isAuthenticated } = useSelector(state => state.adminAuth)
  const [isMounted, setIsMounted] = useState(false)
  const [hasToken, setHasToken] = useState(false)
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    setIsMounted(true)
    const token = localStorage.getItem('adminToken')
    setHasToken(!!token)
    setIsChecking(false)
  }, [])

  useEffect(() => {
    if (isMounted && !isChecking && pathname !== '/admin/login' && !isAuthenticated && !hasToken) {
      router.push('/admin/login')
    }
  }, [isMounted, isChecking, isAuthenticated, hasToken, pathname, router])

  if (!isMounted || isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (pathname !== '/admin/login' && !isAuthenticated && !hasToken) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {pathname !== '/admin/login' && <AdminSidebar />}
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  )
}