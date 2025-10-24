"use client"

import { useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import { useDispatch, useSelector } from "react-redux"
import { LayoutGrid, Package, Users, ShoppingCart, Plus, User, LogOut, UserPlus, ChevronDown } from "lucide-react"
import { toast } from "react-toastify"
import { logoutAdmin } from "../../redux/adminSlices/authSlice.js"

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const dispatch = useDispatch()
  const { admin } = useSelector(state => state.auth)
  
  const [isOpen, setIsOpen] = useState(true)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showCreateAdminModal, setShowCreateAdminModal] = useState(false)
  const [newAdminData, setNewAdminData] = useState({ username: "", password: "" })
  const [loading, setLoading] = useState(false)

  const menuItems = [
    { icon: LayoutGrid, label: "Dashboard", href: "/admin" },
    { icon: Package, label: "Products", href: "/admin/products" },
    { icon: Users, label: "Customers", href: "/admin/customers" },
    { icon: ShoppingCart, label: "Orders", href: "/admin/orders" },
    { icon: Plus, label: "Add Product", href: "/admin/addProduct" },
  ]

  const isActive = (href) => pathname === href

  const handleLogout = async () => {
    try {
      await dispatch(logoutAdmin()).unwrap()
      router.push("/admin/login")
      toast.success('Logout Successfully')
    } catch (error) {
      console.error("Logout failed:", error)
      toast.success('Logout Failed')
    }
  }

  const handleCreateAdmin = async (e) => {
    e.preventDefault()
    
    if (!newAdminData.username || !newAdminData.password) {
      toast.error("Please fill in all fields")
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/admin/auth/createAdmin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAdminData),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success("Admin created successfully!")
        setNewAdminData({ username: "", password: "" })
        setShowCreateAdminModal(false)
      } else {
        toast.error(data.message || "Error creating admin")
      }
    } catch (error) {
      toast.error("Error creating admin")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div
        className={`${
          isOpen ? "w-64" : "w-20"
        } bg-white border-r border-gray-200 transition-all duration-300 flex flex-col`}
      >
        {/* Logo Section */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-center">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-lg"
              style={{ backgroundColor: "#4f39f6" }}
            >
              A
            </div>
            {isOpen && <span className="ml-3 font-bold text-gray-900 text-lg">Admin</span>}
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 px-3 py-6 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                  active ? "bg-blue-50 text-white" : "text-gray-700 hover:bg-gray-100"
                }`}
                style={
                  active
                    ? {
                        backgroundColor: "#4f39f6",
                        color: "white",
                      }
                    : {}
                }
              >
                <Icon size={20} className="flex-shrink-0" />
                {isOpen && <span className="ml-3 font-medium text-sm">{item.label}</span>}
              </Link>
            )
          })}
        </nav>

        {/* User Menu Section */}
        <div className="p-3 border-t border-gray-200">
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-all duration-200"
            >
              <div className="flex items-center">
                <User size={20} className="flex-shrink-0" />
                {isOpen && <span className="ml-3 font-medium text-sm">{admin?.username || "Account"}</span>}
              </div>
              {isOpen && (
                <ChevronDown
                  size={18}
                  className={`transition-transform ${showUserMenu ? "rotate-180" : ""}`}
                />
              )}
            </button>

            {/* User Menu Dropdown */}
            {showUserMenu && isOpen && (
              <div className="absolute bottom-full left-0 right-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                <button
                  onClick={() => {
                    setShowCreateAdminModal(true)
                    setShowUserMenu(false)
                  }}
                  className="w-full flex items-center gap-2 px-4 py-3 text-gray-700 hover:bg-gray-100 transition-colors text-sm rounded-t-lg"
                >
                  <UserPlus size={18} />
                  Create Admin
                </button>
                <button
                  onClick={() => {
                    handleLogout()
                    setShowUserMenu(false)
                  }}
                  className="w-full flex items-center gap-2 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors text-sm rounded-b-lg"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Toggle Button */}
        <div className="p-3 border-t border-gray-200">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full flex items-center justify-center py-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <svg
              className={`w-5 h-5 transition-transform ${isOpen ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Create Admin Modal */}
      {showCreateAdminModal && (
       <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50">

          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Create New Admin</h2>
            
            <form onSubmit={handleCreateAdmin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  value={newAdminData.username}
                  onChange={(e) => setNewAdminData({ ...newAdminData, username: e.target.value })}
                  placeholder="Enter username"
                  disabled={loading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={newAdminData.password}
                  onChange={(e) => setNewAdminData({ ...newAdminData, password: e.target.value })}
                  placeholder="Enter password"
                  disabled={loading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateAdminModal(false)
                    setNewAdminData({ username: "", password: "" })
                  }}
                  disabled={loading}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-md font-medium hover:bg-indigo-700 disabled:opacity-50"
                >
                  {loading ? "Creating..." : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

// "use client"

// import { useState } from "react"
// import { usePathname } from "next/navigation"
// import Link from "next/link"
// import { LayoutGrid, Package, Users, ShoppingCart, Plus, User } from "lucide-react"

// export default function AdminSidebar() {
//   const pathname = usePathname()
//   const [isOpen, setIsOpen] = useState(true)

//   const menuItems = [
//     { icon: LayoutGrid, label: "Dashboard", href: "/admin/dashboard" },
//     { icon: Package, label: "Products", href: "/admin/products" },
//     { icon: Users, label: "Customers", href: "/admin/customers" },
//     { icon: ShoppingCart, label: "Orders", href: "/admin/orders" },
//     { icon: Plus, label: "Add Product", href: "/admin/addProduct" },
//   ]

//   const isActive = (href) => pathname === href

//   return (
//     <div className="flex h-screen">
//       {/* Sidebar */}
//       <div
//         className={`${
//           isOpen ? "w-64" : "w-20"
//         } bg-white border-r border-gray-200 transition-all duration-300 flex flex-col`}
//       >
//         {/* Logo Section */}
//         <div className="p-6 border-b border-gray-200">
//           <div className="flex items-center justify-center">
//             <div
//               className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-lg"
//               style={{ backgroundColor: "#4f39f6" }}
//             >
//               A
//             </div>
//             {isOpen && <span className="ml-3 font-bold text-gray-900 text-lg">Admin</span>}
//           </div>
//         </div>

//         {/* Menu Items */}
//         <nav className="flex-1 px-3 py-6 space-y-2">
//           {menuItems.map((item) => {
//             const Icon = item.icon
//             const active = isActive(item.href)
//             return (
//               <Link
//                 key={item.href}
//                 href={item.href}
//                 className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
//                   active ? "bg-blue-50 text-white" : "text-gray-700 hover:bg-gray-100"
//                 }`}
//                 style={
//                   active
//                     ? {
//                         backgroundColor: "#4f39f6",
//                         color: "white",
//                       }
//                     : {}
//                 }
//               >
//                 <Icon size={20} className="flex-shrink-0" />
//                 {isOpen && <span className="ml-3 font-medium text-sm">{item.label}</span>}
//               </Link>
//             )
//           })}
//         </nav>

//         {/* Account Section */}
//         <div className="p-3 border-t border-gray-200">
//           <button className="w-full flex items-center px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-all duration-200">
//             <User size={20} className="flex-shrink-0" />
//             {isOpen && <span className="ml-3 font-medium text-sm">Account</span>}
//           </button>
//         </div>

//         {/* Toggle Button */}
//         <div className="p-3 border-t border-gray-200">
//           <button
//             onClick={() => setIsOpen(!isOpen)}
//             className="w-full flex items-center justify-center py-2 text-gray-600 hover:text-gray-900 transition-colors"
//           >
//             <svg
//               className={`w-5 h-5 transition-transform ${isOpen ? "rotate-180" : ""}`}
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//             >
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//             </svg>
//           </button>
//         </div>
//       </div>
//     </div>
//   )
// }
