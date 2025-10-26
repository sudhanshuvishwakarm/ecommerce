"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchAllOrders, updateOrderStatus, deleteOrder, clearSuccess, clearError } from "../../../redux/adminSlices/orderSlice.js"
import { Trash2, Loader, X, Info, MapPin, Check, Package, Truck, Home } from "lucide-react"
import { toast } from "react-toastify"

const STATUS_OPTIONS = [
  { value: "PENDING", label: "Pending", color: "bg-yellow-100 text-yellow-800" },
  { value: "CONFIRMED", label: "Confirmed", color: "bg-green-100 text-green-800" },
  { value: "SHIPPED", label: "Shipped", color: "bg-blue-100 text-blue-800" },
  { value: "OUT_FOR_DELIVERY", label: "Out For Delivery", color: "bg-orange-100 text-orange-800" },
  { value: "DELIVERED", label: "Delivered", color: "bg-green-500 text-white" },
  { value: "CANCELLED", label: "Cancelled", color: "bg-red-100 text-red-800" },
];

const ORDER_STEPS = [
  { value: "PENDING", label: "Placed", icon: Check },
  { value: "CONFIRMED", label: "Order Confirmed", icon: Package },
  { value: "SHIPPED", label: "Shipped", icon: Package },
  { value: "OUT_FOR_DELIVERY", label: "Out For Delivery", icon: Truck },
  { value: "DELIVERED", label: "Delivered", icon: Home },
];

export default function OrdersPage() {
  const dispatch = useDispatch()
  const { orders, loading, updateLoading, deleteLoading, error, success } = useSelector(state => state.adminOrder)
  const [selectedStatus, setSelectedStatus] = useState("ALL")
  const [selectedOrderId, setSelectedOrderId] = useState(null)
  const [showDetailModal, setShowDetailModal] = useState(false)

  useEffect(() => {
    dispatch(fetchAllOrders())
  }, [dispatch])

  useEffect(() => {
    if (success) {
      toast.success("✅ Order updated successfully!")
      dispatch(clearSuccess())
    }
  }, [success, dispatch])

  useEffect(() => {
    if (error) {
      toast.error(`❌ ${error}`)
      dispatch(clearError())
    }
  }, [error, dispatch])

  const handleStatusChange = (orderId, newStatus) => {
    dispatch(updateOrderStatus({ orderId, status: newStatus }))
  }

  const handleDelete = (orderId) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      dispatch(deleteOrder(orderId))
    }
  }

  const openDetailModal = (order) => {
    setSelectedOrderId(order)
    setShowDetailModal(true)
  }

  const closeDetailModal = () => {
    setShowDetailModal(false)
    setSelectedOrderId(null)
  }

  const getStatusBadge = (status) => {
    const statusObj = STATUS_OPTIONS.find(s => s.value === status)
    return statusObj || { label: status, color: "bg-gray-100 text-gray-800" }
  }

  const getOrderProgress = (status) => {
    const stepIndex = ORDER_STEPS.findIndex(step => step.value === status)
    return stepIndex === -1 ? 0 : stepIndex + 1
  }

  // Filter orders based on selected status
  const filteredOrders = selectedStatus === "ALL" 
    ? orders 
    : orders.filter(order => order.orderStatus === selectedStatus)

  const statusCounts = {
    ALL: orders.length,
    ...STATUS_OPTIONS.reduce((acc, status) => ({
      ...acc,
      [status.value]: orders.filter(o => o.orderStatus === status.value).length
    }), {})
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Uniform with Products Page */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-4xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-600 mt-1">Manage and track all customer orders</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        {/* Filter Row - Horizontal */}
        <div className="mb-6 bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex flex-wrap gap-2 items-center">
            <button
              onClick={() => setSelectedStatus("ALL")}
              className={`px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                selectedStatus === "ALL"
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All ({statusCounts.ALL})
            </button>

            <div className="h-6 w-px bg-gray-300 hidden sm:block"></div>

            {STATUS_OPTIONS.map((status) => (
              <button
                key={status.value}
                onClick={() => setSelectedStatus(status.value)}
                className={`px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                  selectedStatus === status.value
                    ? `${status.color} border-2 border-current`
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {status.label} ({statusCounts[status.value]})
              </button>
            ))}

            {selectedStatus !== "ALL" && (
              <button
                onClick={() => setSelectedStatus("ALL")}
                className="ml-auto px-3 py-1 text-red-600 hover:bg-red-50 rounded-lg transition"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>

        {/* Orders Table */}
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-96 bg-white rounded-lg border border-gray-200">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
            <p className="text-gray-600">Loading orders...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white rounded-lg p-8 text-center border border-gray-200">
            <p className="text-gray-600 text-lg">
              {selectedStatus === "ALL" ? "No orders found" : `No ${getStatusBadge(selectedStatus).label.toLowerCase()} orders`}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Image</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Title</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Id</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-900 uppercase tracking-wider">Update</th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-900 uppercase tracking-wider">Delete</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredOrders.map((order) => {
                    const statusObj = getStatusBadge(order.orderStatus)
                    return (
                      <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                        {/* Product Images */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex -space-x-2">
                            {order.orderItems?.slice(0, 3).map((item, idx) => (
                              <div
                                key={idx}
                                className="h-10 w-10 rounded-lg border-2 border-white overflow-hidden bg-gray-100"
                                style={{ zIndex: 10 - idx }}
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

                        {/* Title */}
                        <td className="px-6 py-4">
                          <div className="text-sm">
                            {order.orderItems?.slice(0, 2).map((item, idx) => (
                              <p key={idx} className="text-gray-900 font-medium line-clamp-1">
                                {item.product?.title}
                              </p>
                            ))}
                            {order.orderItems?.length > 2 && (
                              <p className="text-indigo-600 text-xs font-medium">+{order.orderItems.length - 2} more</p>
                            )}
                          </div>
                        </td>

                        {/* Order ID */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <p className="text-sm font-semibold text-gray-900">{order.totalItem}</p>
                        </td>

                        {/* Price */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <p className="text-sm font-bold text-gray-900">₹{order.totalPrice}</p>
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${statusObj.color}`}>
                            {statusObj.label}
                          </span>
                        </td>

                        {/* Update */}
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <button
                            onClick={() => openDetailModal(order)}
                            className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 p-2 rounded-lg transition inline-block"
                            title="View Details"
                          >
                            <Info size={18} />
                          </button>
                        </td>

                        {/* Delete */}
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <button
                            onClick={() => handleDelete(order._id)}
                            disabled={deleteLoading[order._id]}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition disabled:opacity-50 inline-block"
                            title="Delete Order"
                          >
                            {deleteLoading[order._id] ? (
                              <Loader size={18} className="animate-spin" />
                            ) : (
                              <Trash2 size={18} />
                            )}
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile View - Card Style */}
            <div className="md:hidden divide-y divide-gray-200">
              {filteredOrders.map((order) => {
                const statusObj = getStatusBadge(order.orderStatus)
                return (
                  <div key={order._id} className="p-4 space-y-3">
                    {/* Images & ID */}
                    <div className="flex items-start gap-3">
                      <div className="flex -space-x-2">
                        {order.orderItems?.slice(0, 2).map((item, idx) => (
                          <div
                            key={idx}
                            className="h-10 w-10 rounded-lg border-2 border-white overflow-hidden bg-gray-100"
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
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-900">{order.totalItem}</p>
                        <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-semibold mt-1 ${statusObj.color}`}>
                          {statusObj.label}
                        </span>
                      </div>
                      <p className="text-sm font-bold text-indigo-600 whitespace-nowrap">₹{order.totalPrice}</p>
                    </div>

                    {/* Product Title */}
                    <p className="text-sm text-gray-900 line-clamp-1">{order.orderItems?.[0]?.product?.title}</p>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => openDetailModal(order)}
                        className="flex-1 px-3 py-2 text-sm font-medium text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-50 transition flex items-center justify-center gap-2"
                      >
                        <Info size={16} />
                        Update
                      </button>
                      <button
                        onClick={() => handleDelete(order._id)}
                        disabled={deleteLoading[order._id]}
                        className="px-3 py-2 text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition disabled:opacity-50"
                      >
                        {deleteLoading[order._id] ? (
                          <Loader size={18} className="animate-spin" />
                        ) : (
                          <Trash2 size={18} />
                        )}
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal with Order Status Progress */}
      {showDetailModal && selectedOrderId && (
<div className="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center z-50 p-4">
  <div className="bg-white shadow-lg rounded-lg max-w-3xl w-full max-h-96 overflow-y-auto ">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Order Details</h2>
              <button
                onClick={closeDetailModal}
                className="text-gray-500 hover:text-gray-700 transition"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Order Status Progress */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-6">Order Status</h3>
                <div className="flex items-center justify-between">
                  {ORDER_STEPS.map((step, idx) => {
                    const Icon = step.icon
                    const isCompleted = getOrderProgress(selectedOrderId.orderStatus) > idx
                    const isCurrent = selectedOrderId.orderStatus === step.value
                    
                    return (
                      <div key={step.value} className="flex flex-col items-center flex-1">
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all ${
                            isCompleted || isCurrent
                              ? "bg-blue-600"
                              : "bg-gray-300"
                          }`}
                        >
                          <Icon className={`text-white`} size={20} />
                        </div>
                        
                        <p className={`text-xs font-medium text-center text-gray-900 line-clamp-2 px-1 ${
                          isCompleted || isCurrent ? "text-blue-600 font-semibold" : "text-gray-600"
                        }`}>
                          {step.label}
                        </p>

                        {/* Line */}
                      
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Status Update Dropdown */}
              <div className="border-t border-gray-200 pt-4">
                <label className="block text-sm font-semibold text-gray-900 mb-2">Change Status</label>
                <select
                  value={selectedOrderId.orderStatus}
                  onChange={(e) => {
                    handleStatusChange(selectedOrderId._id, e.target.value)
                    closeDetailModal()
                  }}
                  disabled={updateLoading[selectedOrderId._id]}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg font-medium focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50"
                >
                  {STATUS_OPTIONS.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Shipping Address */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <MapPin size={18} className="text-blue-600" />
                  Shipping Address
                </h3>
                {selectedOrderId.shippingAddress ? (
                  <div className="bg-blue-50 p-4 rounded-lg space-y-2 text-sm">
                    <p className="font-semibold text-gray-900">
                      {selectedOrderId.shippingAddress.firstName} {selectedOrderId.shippingAddress.lastName}
                    </p>
                    <p className="text-gray-700">{selectedOrderId.shippingAddress.streetAddress}</p>
                    <p className="text-gray-700">
                      {selectedOrderId.shippingAddress.city}, {selectedOrderId.shippingAddress.state} {selectedOrderId.shippingAddress.zipCode}
                    </p>
                    <p className="font-medium text-gray-900">📱 {selectedOrderId.shippingAddress.mobile}</p>
                  </div>
                ) : (
                  <p className="text-gray-600">No address available</p>
                )}
              </div>

              {/* Order Items */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Order Items ({selectedOrderId.totalItem})</h3>
                <div className="space-y-3 max-h-48 overflow-y-auto">
                  {selectedOrderId.orderItems?.map((item, idx) => (
                    <div key={idx} className="flex gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="h-16 w-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
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
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 text-sm line-clamp-2">{item.product?.title}</p>
                        <p className="text-xs text-gray-600 mt-1">Qty: {item.quantity} {item.size ? `• Size: ${item.size}` : ""}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-bold text-gray-900">₹{item.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="border-t border-gray-200 pt-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Subtotal</p>
                    <p className="font-bold text-gray-900">₹{selectedOrderId.totalDiscountedPrice}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Discount</p>
                    <p className="font-bold text-green-600">-₹{selectedOrderId.discounte}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Payment Status</p>
                    <p className="font-semibold text-gray-900">{selectedOrderId.paymentDetails?.paymentStatus || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Total Price</p>
                    <p className="font-bold text-indigo-600 text-lg">₹{selectedOrderId.totalPrice}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}