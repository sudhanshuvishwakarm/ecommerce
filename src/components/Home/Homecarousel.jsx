'use client'
import axios from 'axios'
import { useEffect, useState, useRef } from 'react'
import Loading from '../../components/loader/Loading.jsx'
import ProductCard from '../product/ProductCard.jsx'
import { toast } from 'react-toastify'

const Homecarousel = ({ carousalData }) => {
  const category = {
    category1: carousalData.category1,
    category2: carousalData.category2,
    category3: carousalData.category3
  }
  
  const [products, setProducts] = useState([])
  const [status, setStatus] = useState('idle')
  const scrollContainerRef = useRef(null)

  useEffect(() => {
    fetchProducts()
  }, [carousalData]) // Added dependency

  const fetchProducts = async () => {
    try {
      setStatus('loading')
      console.log('Fetching products with category:', category)
      
      const response = await axios.post(`/api/product/getProductsByCategory`, category)
      console.log('API Response:', response)
      
      if (response.data && Array.isArray(response.data)) {
        setProducts(response.data)
        setStatus('succeeded')
        console.log('Products loaded successfully:', response.data.length)
      } else {
        throw new Error('Invalid response format')
      }
    } catch (error) {
      console.error('Error fetching products:', error)
      setStatus('failed')
      toast.error('Failed to load products. Please check the console for details.')
    }
  }

  // Debug: Log current status and products
  console.log('Current status:', status)
  console.log('Products:', products)

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' })
    }
  }

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' })
    }
  }

  if (status === 'loading') {
    return (
      <div className="my-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 px-4">
          {carousalData.heading}
        </h2>
        <div className="flex justify-center">
          <Loading />
        </div>
      </div>
    )
  }

  if (status === 'failed') {
    return (
      <div className="my-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 px-4">
          {carousalData.heading}
        </h2>
        <div className="text-center py-8">
          <div className="text-red-600 text-lg font-medium mb-2">
            Failed to load products
          </div>
          <button
            onClick={fetchProducts}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
          <p className="text-sm text-gray-500 mt-2">
            Check browser console for detailed error information
          </p>
        </div>
      </div>
    )
  }

  if (products.length === 0 && status === 'succeeded') {
    return (
      <div className="my-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 px-4">
          {carousalData.heading}
        </h2>
        <div className="text-center py-8 text-gray-500">
          No products found in this category.
        </div>
      </div>
    )
  }

  return (
    <div className="my-8">
      {/* Header with Navigation */}
      <div className="flex items-center justify-between mb-6 px-4">
        <h2 className="text-2xl font-bold text-gray-900">
          {carousalData.heading}
        </h2>
        
        {products.length > 0 && (
          <div className="flex space-x-2">
            <button
              onClick={scrollLeft}
              className="p-2 rounded-full bg-white border border-gray-300 hover:bg-gray-50 transition-colors shadow-sm"
              aria-label="Scroll left"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={scrollRight}
              className="p-2 rounded-full bg-white border border-gray-300 hover:bg-gray-50 transition-colors shadow-sm"
              aria-label="Scroll right"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Carousel Container */}
      <div className="relative">
        {/* Scrollable Products Container */}
        <div
          ref={scrollContainerRef}
          className="flex space-x-6 overflow-x-auto scrollbar-hide px-4 py-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {products.map((product) => (
            <div
              key={product._id}
              className="flex-none w-80 sm:w-72 md:w-80 lg:w-96 transition-transform hover:scale-105"
            >
              <ProductCard data={product} />
            </div>
          ))}
        </div>

        {/* Gradient Overlays for Scroll Indication */}
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-gray-50 to-transparent pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-gray-50 to-transparent pointer-events-none" />
      </div>
    </div>
  )
}

export default Homecarousel