"use client"

import { useEffect, useState, useMemo } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchAllOrders } from "../../../redux/adminSlices/orderSlice.js"
import { Search, Mail, Phone, MapPin, ShoppingBag, DollarSign, TrendingUp, Info, X, Eye } from "lucide-react"

export default function CustomersPage() {
  const dispatch = useDispatch()
  const { orders } = useSelector(state => state.adminOrder)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("orders") // orders, spent, recent
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [showDetailModal, setShowDetailModal] = useState(false)

  useEffect(() => {
    dispatch(fetchAllOrders())
  }, [dispatch])

  // Extract unique customers from orders with aggregated data
  const customers = useMemo(() => {
    const customerMap = new Map()

    orders.forEach(order => {
      if (!order.user || !order.shippingAddress) return

      const userId = order.user._id
      
      if (!customerMap.has(userId)) {
        customerMap.set(userId, {
          id: userId,
          name: order.user.name,
          email: order.user.email,
          phone: order.shippingAddress.mobile,
          address: order.shippingAddress,
          orders: [],
          totalSpent: 0,
          totalOrders: 0,
          lastOrder: order.orderDate,
        })
      }

      const customer = customerMap.get(userId)
      customer.orders.push(order)
      customer.totalSpent += order.totalPrice
      customer.totalOrders += 1
      customer.lastOrder = new Date(order.orderDate) > new Date(customer.lastOrder) 
        ? order.orderDate 
        : customer.lastOrder
    })

    return Array.from(customerMap.values())
  }, [orders])

  // Filter and sort customers
  const filteredCustomers = useMemo(() => {
   let result = customers.filter(customer =>
  (customer.name?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
  (customer.email?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
  (customer.phone || "").includes(searchQuery)
);


    result.sort((a, b) => {
      if (sortBy === "orders") return b.totalOrders - a.totalOrders
      if (sortBy === "spent") return b.totalSpent - a.totalSpent
      if (sortBy === "recent") return new Date(b.lastOrder) - new Date(a.lastOrder)
      return 0
    })

    return result
  }, [customers, searchQuery, sortBy])

  const openCustomerDetail = (customer) => {
    setSelectedCustomer(customer)
    setShowDetailModal(true)
  }

  const closeDetailModal = () => {
    setShowDetailModal(false)
    setSelectedCustomer(null)
  }

  // Summary stats
  const stats = useMemo(() => ({
    totalCustomers: customers.length,
    totalRevenue: customers.reduce((sum, c) => sum + c.totalSpent, 0),
    avgOrderValue: customers.length > 0 
      ? Math.round(customers.reduce((sum, c) => sum + c.totalSpent, 0) / customers.length)
      : 0,
    totalOrders: customers.reduce((sum, c) => sum + c.totalOrders, 0),
  }), [customers])

  const StatCard = ({ icon: Icon, label, value, subtext, bgColor, iconColor }) => (
    <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{label}</p>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {subtext && <p className="text-xs text-gray-500 mt-1">{subtext}</p>}
        </div>
        <div className={`p-3 rounded-lg ${bgColor}`}>
          <Icon className={`${iconColor}`} size={24} />
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-4xl font-bold text-gray-900">Customers</h1>
          <p className="text-gray-600 mt-1">Manage and view customer information</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <StatCard
            icon={ShoppingBag}
            label="Total Customers"
            value={stats.totalCustomers}
            bgColor="bg-blue-100"
            iconColor="text-blue-600"
          />
          <StatCard
            icon={DollarSign}
            label="Total Revenue"
            value={`₹${stats.totalRevenue.toLocaleString()}`}
            bgColor="bg-green-100"
            iconColor="text-green-600"
          />
          <StatCard
            icon={TrendingUp}
            label="Avg Order Value"
            value={`₹${stats.avgOrderValue.toLocaleString()}`}
            subtext="Average per customer"
            bgColor="bg-purple-100"
            iconColor="text-purple-600"
          />
          <StatCard
            icon={ShoppingBag}
            label="Total Orders"
            value={stats.totalOrders}
            bgColor="bg-orange-100"
            iconColor="text-orange-600"
          />
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by name, email, or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-medium"
            >
              <option value="orders">Sort by Orders</option>
              <option value="spent">Sort by Amount Spent</option>
              <option value="recent">Sort by Recent</option>
            </select>
          </div>
        </div>

        {/* Customers Table */}
        {filteredCustomers.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <p className="text-gray-600 text-lg">
              {customers.length === 0 ? "No customers yet" : "No customers match your search"}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase">Name</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase">Contact</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase">Orders</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase">Total Spent</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase">Avg Order</th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-900 uppercase">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredCustomers.map((customer) => (
                    <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-gray-900">{customer.name}</p>
                          <p className="text-sm text-gray-600 mt-1">{customer.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1 text-sm">
                          <div className="flex items-center gap-2 text-gray-700">
                            <Phone size={14} />
                            {customer.phone}
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <MapPin size={14} />
                            <span className="line-clamp-1">{customer.address.city}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-center">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800">
                            {customer.totalOrders}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="font-bold text-gray-900">₹{customer.totalSpent.toLocaleString()}</p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="font-semibold text-gray-900">₹{Math.round(customer.totalSpent / customer.totalOrders).toLocaleString()}</p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <button
                          onClick={() => openCustomerDetail(customer)}
                          className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 p-2 rounded-lg transition inline-block"
                        >
                          <Eye size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile View */}
            <div className="md:hidden divide-y divide-gray-200">
              {filteredCustomers.map((customer) => (
                <div key={customer.id} className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">{customer.name}</p>
                      <p className="text-sm text-gray-600">{customer.email}</p>
                    </div>
                    <button
                      onClick={() => openCustomerDetail(customer)}
                      className="text-indigo-600 hover:text-indigo-700 p-2 hover:bg-indigo-50 rounded-lg transition"
                    >
                      <Eye size={18} />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div className="bg-blue-50 p-2 rounded text-center">
                      <p className="text-gray-600 text-xs">Orders</p>
                      <p className="font-bold text-gray-900">{customer.totalOrders}</p>
                    </div>
                    <div className="bg-green-50 p-2 rounded text-center">
                      <p className="text-gray-600 text-xs">Spent</p>
                      <p className="font-bold text-gray-900">₹{Math.round(customer.totalSpent / 1000)}K</p>
                    </div>
                    <div className="bg-purple-50 p-2 rounded text-center">
                      <p className="text-gray-600 text-xs">Avg</p>
                      <p className="font-bold text-gray-900">₹{Math.round(customer.totalSpent / customer.totalOrders / 100) * 100}</p>
                    </div>
                  </div>

                  <div className="flex gap-2 text-xs text-gray-600">
                    <div className="flex items-center gap-1">
                      <Phone size={14} />
                      {customer.phone}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin size={14} />
                      {customer.address.city}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Results Info */}
        <div className="mt-4 text-sm text-gray-600">
          <p>Showing <span className="font-semibold">{filteredCustomers.length}</span> of <span className="font-semibold">{customers.length}</span> customers</p>
        </div>
      </div>

      {/* Customer Detail Modal */}
      {showDetailModal && selectedCustomer && (
       <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
  <div className="bg-white rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{selectedCustomer.name}</h2>
                <p className="text-sm text-gray-600">{selectedCustomer.email}</p>
              </div>
              <button
                onClick={closeDetailModal}
                className="text-gray-500 hover:text-gray-700 transition"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Contact Info */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Contact Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Mail size={18} className="text-gray-600" />
                    <div>
                      <p className="text-xs text-gray-600">Email</p>
                      <p className="font-medium text-gray-900">{selectedCustomer.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Phone size={18} className="text-gray-600" />
                    <div>
                      <p className="text-xs text-gray-600">Phone</p>
                      <p className="font-medium text-gray-900">{selectedCustomer.phone}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Address */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <MapPin size={18} className="text-blue-600" />
                  Shipping Address
                </h3>
                <div className="bg-blue-50 p-4 rounded-lg space-y-1 text-sm">
                  <p className="font-semibold text-gray-900">
                    {selectedCustomer.address.firstName} {selectedCustomer.address.lastName}
                  </p>
                  <p className="text-gray-700">{selectedCustomer.address.streetAddress}</p>
                  <p className="text-gray-700">
                    {selectedCustomer.address.city}, {selectedCustomer.address.state} {selectedCustomer.address.zipCode}
                  </p>
                </div>
              </div>

              {/* Customer Stats */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Customer Statistics</h3>
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg text-center border border-blue-200">
                    <p className="text-xs text-blue-700 font-medium mb-1">Total Orders</p>
                    <p className="text-2xl font-bold text-blue-900">{selectedCustomer.totalOrders}</p>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg text-center border border-green-200">
                    <p className="text-xs text-green-700 font-medium mb-1">Total Spent</p>
                    <p className="text-lg font-bold text-green-900">₹{(selectedCustomer.totalSpent / 1000).toFixed(1)}K</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg text-center border border-purple-200">
                    <p className="text-xs text-purple-700 font-medium mb-1">Avg Order</p>
                    <p className="text-lg font-bold text-purple-900">₹{Math.round(selectedCustomer.totalSpent / selectedCustomer.totalOrders)}</p>
                  </div>
                </div>
              </div>

              {/* Recent Orders */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Recent Orders ({selectedCustomer.orders.length})</h3>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {selectedCustomer.orders.slice(0, 5).map((order) => (
                    <div key={order._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div>
                        <p className="text-sm font-medium text-gray-900">#{order._id.slice(-6).toUpperCase()}</p>
                        <p className="text-xs text-gray-600">{new Date(order.orderDate).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">₹{order.totalPrice}</p>
                        <span className={`text-xs font-semibold px-2 py-1 rounded ${
                          order.orderStatus === "DELIVERED" ? "bg-green-100 text-green-800" :
                          order.orderStatus === "PENDING" ? "bg-yellow-100 text-yellow-800" :
                          "bg-blue-100 text-blue-800"
                        }`}>
                          {order.orderStatus === "PENDING" ? "Placed" : order.orderStatus}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}