"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchAllOrders } from "../../redux/adminSlices/orderSlice.js"
import { fetchAllProducts } from "../../redux/adminSlices/productSlice.js"
import { ShoppingCart, Package, Users, TrendingUp, Truck, Check, Clock, AlertCircle } from "lucide-react"
import Link from "next/link"

export default function AdminDashboard() {
  const dispatch = useDispatch()
  const { orders } = useSelector(state => state.adminOrder)
  const { products } = useSelector(state => state.adminProduct)
  const [stats, setStats] = useState(null)
  const [recentOrders, setRecentOrders] = useState([])
  const [recentProducts, setRecentProducts] = useState([])

  useEffect(() => {
    dispatch(fetchAllOrders())
    dispatch(fetchAllProducts())
  }, [dispatch])

  useEffect(() => {
    if (orders.length > 0) {
      // Calculate statistics
      const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0)
      const deliveredOrders = orders.filter(o => o.orderStatus === "DELIVERED").length
      const pendingOrders = orders.filter(o => o.orderStatus === "PENDING").length
      const shippedOrders = orders.filter(o => o.orderStatus === "SHIPPED" || o.orderStatus === "OUT_FOR_DELIVERY").length

      setStats({
        totalOrders: orders.length,
        totalRevenue,
        deliveredOrders,
        pendingOrders,
        shippedOrders,
        totalProducts: products.length,
      })

      // Get recent orders (last 5)
      setRecentOrders(orders.slice(0, 5))
    }
  }, [orders, products])

  useEffect(() => {
    if (products.length > 0) {
      setRecentProducts(products.slice(0, 4))
    }
  }, [products])

  const StatCard = ({ icon: Icon, label, value, subtext, bgColor, iconColor }) => (
    <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 hover:border-gray-300 transition-all">
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
          <h1 className="text-4xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's your business overview</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
          <StatCard
            icon={ShoppingCart}
            label="Total Orders"
            value={stats?.totalOrders || 0}
            bgColor="bg-blue-100"
            iconColor="text-blue-600"
          />
          <StatCard
            icon={TrendingUp}
            label="Total Revenue"
            value={`₹${(stats?.totalRevenue || 0).toLocaleString()}`}
            bgColor="bg-green-100"
            iconColor="text-green-600"
          />
          <StatCard
            icon={Package}
            label="Total Products"
            value={stats?.totalProducts || 0}
            bgColor="bg-purple-100"
            iconColor="text-purple-600"
          />
          <StatCard
            icon={Check}
            label="Delivered Orders"
            value={stats?.deliveredOrders || 0}
            subtext={`${stats?.totalOrders ? Math.round((stats.deliveredOrders / stats.totalOrders) * 100) : 0}% of total`}
            bgColor="bg-green-100"
            iconColor="text-green-600"
          />
          <StatCard
            icon={Clock}
            label="Pending Orders"
            value={stats?.pendingOrders || 0}
            subtext="Waiting for confirmation"
            bgColor="bg-yellow-100"
            iconColor="text-yellow-600"
          />
          <StatCard
            icon={Truck}
            label="In Transit"
            value={stats?.shippedOrders || 0}
            subtext="Shipped or out for delivery"
            bgColor="bg-orange-100"
            iconColor="text-orange-600"
          />
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Recent Orders</h2>
              <Link
                href="/admin/orders"
                className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
              >
                View All
              </Link>
            </div>

            {recentOrders.length === 0 ? (
              <div className="p-6 text-center">
                <AlertCircle size={32} className="mx-auto text-gray-400 mb-2" />
                <p className="text-gray-600">No orders yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase">Image</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase">Title</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase">Price</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {recentOrders.map((order) => {
                      const statusColor = {
                        PENDING: "bg-yellow-100 text-yellow-800",
                        CONFIRMED: "bg-blue-100 text-blue-800",
                        SHIPPED: "bg-blue-100 text-blue-800",
                        OUT_FOR_DELIVERY: "bg-orange-100 text-orange-800",
                        DELIVERED: "bg-green-100 text-green-800",
                        CANCELLED: "bg-red-100 text-red-800",
                      }[order.orderStatus] || "bg-gray-100 text-gray-800"

                      return (
                        <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex -space-x-2">
                              {order.orderItems?.slice(0, 2).map((item, idx) => (
                                <div
                                  key={idx}
                                  className="h-8 w-8 rounded border-2 border-white overflow-hidden bg-gray-100"
                                >
                                  {item.product?.imageUrl ? (
                                    <img
                                      src={item.product.imageUrl}
                                      alt="product"
                                      className="h-full w-full object-cover"
                                      onError={(e) => {
                                        e.target.style.display = 'none'
                                      }}
                                    />
                                  ) : (
                                    <div className="h-full w-full bg-gray-300" />
                                  )}
                                </div>
                              ))}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-gray-900 font-medium line-clamp-1">
                              {order.orderItems?.[0]?.product?.title || "Product"}
                            </p>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <p className="text-gray-900 font-semibold">#{order._id.slice(-6).toUpperCase()}</p>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <p className="text-gray-900 font-bold">₹{order.totalPrice}</p>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusColor}`}>
                              {order.orderStatus === "PENDING" ? "Placed" : order.orderStatus}
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Recent Products */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Recent Products</h2>
              <Link
                href="/admin/products"
                className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
              >
                View All
              </Link>
            </div>

            {recentProducts.length === 0 ? (
              <div className="p-6 text-center">
                <AlertCircle size={32} className="mx-auto text-gray-400 mb-2" />
                <p className="text-gray-600">No products yet</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {recentProducts.map((product) => (
                  <div key={product._id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex gap-4">
                      <div className="h-16 w-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        {product.imageUrl ? (
                          <img
                            src={product.imageUrl}
                            alt={product.title}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              e.target.style.display = 'none'
                            }}
                          />
                        ) : (
                          <div className="h-full w-full bg-gray-300" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 line-clamp-1">{product.title}</p>
                        <p className="text-sm text-gray-600 mt-1">
                          Category: <span className="font-medium text-gray-900">
                            {product.category?.category3 || "N/A"}
                          </span>
                        </p>
                        <div className="flex gap-4 mt-2 text-sm">
                          <span className="text-gray-600">Price: <span className="font-bold text-gray-900">₹{product.price}</span></span>
                          <span className="text-gray-600">Stock: <span className="font-bold text-gray-900">{product.quantity}</span></span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Action Links */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/admin/orders"
            className="bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg p-4 transition-colors text-center"
          >
            <ShoppingCart className="mx-auto mb-2 text-blue-600" size={24} />
            <p className="font-semibold text-gray-900">View Orders</p>
            <p className="text-sm text-gray-600">{orders.length} total</p>
          </Link>
          <Link
            href="/admin/products"
            className="bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg p-4 transition-colors text-center"
          >
            <Package className="mx-auto mb-2 text-purple-600" size={24} />
            <p className="font-semibold text-gray-900">View Products</p>
            <p className="text-sm text-gray-600">{products.length} total</p>
          </Link>
          <Link
            href="/admin/addProduct"
            className="bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg p-4 transition-colors text-center"
          >
            <Package className="mx-auto mb-2 text-green-600" size={24} />
            <p className="font-semibold text-gray-900">Add Product</p>
            <p className="text-sm text-gray-600">Create new</p>
          </Link>
          <Link
            href="/admin/customers"
            className="bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg p-4 transition-colors text-center"
          >
            <Users className="mx-auto mb-2 text-indigo-600" size={24} />
            <p className="font-semibold text-gray-900">Customers</p>
            <p className="text-sm text-gray-600">Manage customers</p>
          </Link>
        </div>
      </div>
    </div>
  )
}