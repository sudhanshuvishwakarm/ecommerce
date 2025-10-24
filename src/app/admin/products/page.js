"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchAllProducts, deleteProduct, clearSuccess, clearError } from "@/redux/adminSlices/productSlice"
import { Trash2, Loader } from "lucide-react"
import { toast } from "react-toastify"

export default function ProductsPage() {
  const dispatch = useDispatch()
  const { products, fetchLoading, deleteLoading, error, success } = useSelector(state => state.adminProduct)
  const [selectedProducts, setSelectedProducts] = useState(new Set())

  // Fetch products on mount
  useEffect(() => {
    dispatch(fetchAllProducts())
  }, [dispatch])

  // Handle success
  useEffect(() => {
    if (success) {
      toast.success("Product deleted successfully!")
      dispatch(clearSuccess())
    }
  }, [success, dispatch])

  // Handle error
  useEffect(() => {
    if (error) {
      toast.error(`❌ ${error}`)
      dispatch(clearError())
    }
  }, [error, dispatch])

  const handleDelete = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      dispatch(deleteProduct(productId))
    }
  }

  const getCategoryName = (product) => {
    if (product.category) {
      const cat = product.category
      if (typeof cat === 'object' && cat.category3) {
        return `${cat.category1}_${cat.category3}`
      }
    }
    return "N/A"
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Products Management</h1>
          <p className="text-gray-600">Manage and view all products</p>
        </div>

        {/* Loading State */}
        {fetchLoading ? (
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
              <p className="text-gray-600">Loading products...</p>
            </div>
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white rounded-lg p-8 text-center border border-gray-200">
            <p className="text-gray-600 text-lg">No products found. Start by adding a new product.</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Image</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Title</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Category</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Price</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Quantity</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Action</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                    {/* Image */}
                    <td className="px-6 py-4">
                      <div className="h-12 w-12 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
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
                          <span className="text-gray-400 text-xs">No Image</span>
                        )}
                      </div>
                    </td>

                    {/* Title */}
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-900 max-w-xs truncate">{product.title}</p>
                    </td>

                    {/* Category */}
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                        {getCategoryName(product)}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-gray-900">₹{product.price}</p>
                    </td>

                    {/* Quantity */}
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600">{product.quantity}</p>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleDelete(product._id)}
                        disabled={deleteLoading[product._id]}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                      >
                        {deleteLoading[product._id] ? (
                          <>
                            <Loader size={18} className="animate-spin" />
                            Deleting...
                          </>
                        ) : (
                          <>
                            <Trash2 size={18} />
                            DELETE
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer Info */}
        {!fetchLoading && products.length > 0 && (
          <div className="mt-6 text-sm text-gray-600">
            <p>Total Products: <span className="font-semibold text-gray-900">{products.length}</span></p>
          </div>
        )}
      </div>
    </div>
  )
}