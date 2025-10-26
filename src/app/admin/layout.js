'use client'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import AdminSidebar from '../../components/Admin/AdminSidebar.jsx'
import { checkTokenExpiry } from '@/redux/adminSlices/authSlice'

export default function Layout({ children }) {
  const pathname = usePathname()
  const router = useRouter()
  const dispatch = useDispatch()
  const { isAuthenticated } = useSelector(state => state.adminAuth)
  const [isMounted, setIsMounted] = useState(false)
  const [hasToken, setHasToken] = useState(false)
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    setIsMounted(true)
    // Check if token exists and is not expired
    const token = localStorage.getItem('adminToken')
    const tokenTime = localStorage.getItem('adminTokenTime')
    
    if (token && tokenTime) {
      const expiryTime = 2 * 24 * 60 * 60 * 1000 // 2 days
      const tokenAge = Date.now() - parseInt(tokenTime)
      
      if (tokenAge < expiryTime) {
        setHasToken(true)
      } else {
        // Token expired, clear it
        localStorage.removeItem('adminToken')
        localStorage.removeItem('adminTokenTime')
        setHasToken(false)
      }
    } else {
      setHasToken(false)
    }
    
    setIsChecking(false)
  }, [])

  useEffect(() => {
    // Check token expiry before navigating
    if (isMounted && !isChecking) {
      dispatch(checkTokenExpiry())
    }
  }, [isMounted, isChecking, dispatch, pathname])

  useEffect(() => {
    // Redirect if not authenticated and not on login page
    if (isMounted && !isChecking && pathname !== '/admin/login' && !isAuthenticated && !hasToken) {
      console.log("Token expired or not found, redirecting to login")
      router.push('/admin/login')
    }
  }, [isMounted, isChecking, isAuthenticated, hasToken, pathname, router])

  // Show loading while checking
  if (!isMounted || isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-600">Checking authentication...</p>
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