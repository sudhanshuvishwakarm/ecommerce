"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { X, Plus } from "lucide-react"
import { createProduct, clearSuccess, clearError, resetProduct } from "@/redux/adminSlices/productSlice"
import { toast } from "react-toastify"

const CATEGORY_OPTIONS = {
  women: {
    clothing: ["Tops", "Dresses", "Pants", "Denim", "Sweaters", "T-Shirts", "Jackets", "Activewear"],
    accessories: ["Watches", "Wallets", "Bags", "Sunglasses", "Hats", "Belts"],
  },
  men: {
    clothing: ["Shirts", "Pants", "Sweaters", "T-Shirts", "Jackets", "Activewear"],
    accessories: ["Watches", "Wallets", "Bags", "Sunglasses", "Hats", "Belts"],
  },
}

export default function AddProductPage() {
  const dispatch = useDispatch()
  const { loading, error, success } = useSelector(state => state.adminProduct)

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    discountedPrice: "",
    discountPercent: "",
    quantity: "",
    brand: "",
    color: "",
    imageUrl: "",
    category1: "women",
    category2: "clothing",
    category3: "",
    sizes: [{ name: "", quantity: "" }],
  })

  const [sizeType, setSizeType] = useState("multiple")
  const [imagePreview, setImagePreview] = useState("")
  const [errors, setErrors] = useState({})

  // Handle success
  useEffect(() => {
    if (success) {
      toast.success("Product added successfully!", {
        position: "top-right",
        autoClose: 2000,
      })
      const timer = setTimeout(() => {
        resetForm()
        dispatch(clearSuccess())
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [success, dispatch])

  // Handle error
  useEffect(() => {
    if (error) {
      toast.error(`❌ ${error}`, {
        position: "top-right",
        autoClose: 3000,
      })
      dispatch(clearError())
    }
  }, [error, dispatch])

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      price: "",
      discountedPrice: "",
      discountPercent: "",
      quantity: "",
      brand: "",
      color: "",
      imageUrl: "",
      category1: "women",
      category2: "clothing",
      category3: "",
      sizes: [{ name: "", quantity: "" }],
    })
    setImagePreview("")
    setErrors({})
    dispatch(resetProduct())
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSizeChange = (index, field, value) => {
    const newSizes = [...formData.sizes]
    newSizes[index][field] = value
    setFormData((prev) => ({
      ...prev,
      sizes: newSizes,
    }))
  }

  const addSize = () => {
    setFormData((prev) => ({
      ...prev,
      sizes: [...prev.sizes, { name: "", quantity: "" }],
    }))
  }

  const removeSize = (index) => {
    setFormData((prev) => ({
      ...prev,
      sizes: prev.sizes.filter((_, i) => i !== index),
    }))
  }

  const handleImageUrlChange = (e) => {
    const url = e.target.value
    setFormData((prev) => ({
      ...prev,
      imageUrl: url,
    }))
    setImagePreview(url)
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.title.trim()) newErrors.title = "Title is required"
    if (!formData.description.trim()) newErrors.description = "Description is required"
    if (!formData.price) newErrors.price = "Price is required"
    if (!formData.discountedPrice) newErrors.discountedPrice = "Discounted price is required"
    if (!formData.discountPercent) newErrors.discountPercent = "Discount percent is required"
    if (!formData.quantity) newErrors.quantity = "Quantity is required"
    if (!formData.brand.trim()) newErrors.brand = "Brand is required"
    if (!formData.color.trim()) newErrors.color = "Color is required"
    if (!formData.imageUrl.trim()) newErrors.imageUrl = "Image URL is required"
    if (!formData.category3) newErrors.category3 = "Category is required"
    if (formData.sizes.some((s) => !s.name || !s.quantity)) {
      newErrors.sizes = "All sizes must have a name and quantity"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      toast.error("❌ Please fill all required fields correctly", {
        position: "top-right",
        autoClose: 3000,
      })
      return
    }

    const productData = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      price: Number.parseFloat(formData.price),
      discountedPrice: Number.parseFloat(formData.discountedPrice),
      discountPercent: Number.parseFloat(formData.discountPercent),
      quantity: Number.parseInt(formData.quantity),
      brand: formData.brand.trim(),
      color: formData.color.trim().toLowerCase(),
      imageUrl: formData.imageUrl.trim(),
      category1: formData.category1.toLowerCase(),
      category2: formData.category2.toLowerCase(),
      category3: formData.category3.toLowerCase(),
      sizes: formData.sizes.map((s) => ({
        name: s.name.trim(),
        quantity: Number.parseInt(s.quantity),
      })),
    }

    console.log("Submitting product data:", productData)
    dispatch(createProduct(productData))
  }

  const category2Options = CATEGORY_OPTIONS[formData.category1] || {}
  const category3Options = category2Options[formData.category2] || []

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Add New Product</h1>
          <p className="text-gray-600">Fill in the details below to add a new product to your store</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Image Section */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Product Image</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                <input
                  type="url"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleImageUrlChange}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 disabled:bg-gray-100"
                  disabled={loading}
                />
                {errors.imageUrl && <p className="text-red-500 text-sm mt-1">{errors.imageUrl}</p>}
              </div>
              {imagePreview && (
                <div className="flex justify-center">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="max-h-64 rounded-lg object-cover"
                    onError={() => setImagePreview("")}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Basic Information */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Product title"
                  disabled={loading}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 text-gray-900 disabled:bg-gray-100"
                />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Brand *</label>
                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                  placeholder="Brand name"
                  disabled={loading}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 text-gray-900 disabled:bg-gray-100"
                />
                {errors.brand && <p className="text-red-500 text-sm mt-1">{errors.brand}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Color *</label>
                <input
                  type="text"
                  name="color"
                  value={formData.color}
                  onChange={handleInputChange}
                  placeholder="e.g., Black, Red, Blue"
                  disabled={loading}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 text-gray-900 disabled:bg-gray-100"
                />
                {errors.color && <p className="text-red-500 text-sm mt-1">{errors.color}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Quantity *</label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  placeholder="0"
                  disabled={loading}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 text-gray-900 disabled:bg-gray-100"
                />
                {errors.quantity && <p className="text-red-500 text-sm mt-1">{errors.quantity}</p>}
              </div>
            </div>
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Product description"
                rows="4"
                disabled={loading}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 text-gray-900 disabled:bg-gray-100"
              />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Pricing</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price *</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  step="0.01"
                  disabled={loading}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 text-gray-900 disabled:bg-gray-100"
                />
                {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Discounted Price *</label>
                <input
                  type="number"
                  name="discountedPrice"
                  value={formData.discountedPrice}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  step="0.01"
                  disabled={loading}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 text-gray-900 disabled:bg-gray-100"
                />
                {errors.discountedPrice && <p className="text-red-500 text-sm mt-1">{errors.discountedPrice}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Discount Percent *</label>
                <input
                  type="number"
                  name="discountPercent"
                  value={formData.discountPercent}
                  onChange={handleInputChange}
                  placeholder="0"
                  step="0.01"
                  disabled={loading}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 text-gray-900 disabled:bg-gray-100"
                />
                {errors.discountPercent && <p className="text-red-500 text-sm mt-1">{errors.discountPercent}</p>}
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Categories</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gender *</label>
                <select
                  name="category1"
                  value={formData.category1}
                  onChange={handleInputChange}
                  disabled={loading}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 text-gray-900 disabled:bg-gray-100"
                >
                  <option value="women">Women</option>
                  <option value="men">Men</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type *</label>
                <select
                  name="category2"
                  value={formData.category2}
                  onChange={handleInputChange}
                  disabled={loading}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 text-gray-900 disabled:bg-gray-100"
                >
                  {Object.keys(category2Options).map((cat) => (
                    <option key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Specific Category *</label>
                <select
                  name="category3"
                  value={formData.category3}
                  onChange={handleInputChange}
                  disabled={loading}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 text-gray-900 disabled:bg-gray-100"
                >
                  <option value="">Select a category</option>
                  {category3Options.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                {errors.category3 && <p className="text-red-500 text-sm mt-1">{errors.category3}</p>}
              </div>
            </div>
          </div>

          {/* Sizes */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Sizes</h2>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="multiple"
                    checked={sizeType === "multiple"}
                    onChange={(e) => setSizeType(e.target.value)}
                    className="w-4 h-4"
                    disabled={loading}
                  />
                  <span className="text-sm text-gray-700">Multiple Sizes (S, M, L)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="single"
                    checked={sizeType === "single"}
                    onChange={(e) => setSizeType(e.target.value)}
                    className="w-4 h-4"
                    disabled={loading}
                  />
                  <span className="text-sm text-gray-700">Single Size (One Size)</span>
                </label>
              </div>
            </div>

            <div className="space-y-3">
              {formData.sizes.map((size, index) => (
                <div key={index} className="flex gap-3 items-end">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Size Name</label>
                    <input
                      type="text"
                      value={size.name}
                      onChange={(e) => handleSizeChange(index, "name", e.target.value)}
                      placeholder={sizeType === "multiple" ? "e.g., S, M, L" : "One Size"}
                      disabled={loading}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 text-gray-900 disabled:bg-gray-100"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                    <input
                      type="number"
                      value={size.quantity}
                      onChange={(e) => handleSizeChange(index, "quantity", e.target.value)}
                      placeholder="0"
                      disabled={loading}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 text-gray-900 disabled:bg-gray-100"
                    />
                  </div>
                  {formData.sizes.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSize(index)}
                      disabled={loading}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                    >
                      <X size={20} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {errors.sizes && <p className="text-red-500 text-sm mt-2">{errors.sizes}</p>}

            <button
              type="button"
              onClick={addSize}
              disabled={loading}
              className="mt-4 flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <Plus size={18} />
              Add Size
            </button>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 rounded-lg font-semibold text-white transition-all duration-200 hover:shadow-lg disabled:opacity-50"
              style={{ backgroundColor: loading ? "#ccc" : "#4f39f6" }}
            >
              {loading ? "Adding Product..." : "Add Product"}
            </button>
            <button
              type="button"
              onClick={resetForm}
              disabled={loading}
              className="flex-1 py-3 rounded-lg font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              Clear Form
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}