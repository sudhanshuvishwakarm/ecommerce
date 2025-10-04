'use client'
import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'
import { ChevronLeft, ChevronRight, AlertCircle, Package } from 'lucide-react'
import Loading from '../../components/loader/Loading.jsx'
import ProductCard from '../product/ProductCard.jsx'
import { fetchProductsByCategory, clearError } from '../../redux/slices/productSlice.js'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

const Homecarousel = ({ carousalData }) => {
  const dispatch = useDispatch()
  const { products, loading, error } = useSelector(state => state.products)

  useEffect(() => {
    const category = {
      category1: carousalData.category1 || '',
      category2: carousalData.category2 || '',
      category3: carousalData.category3 || ''
    }
    dispatch(fetchProductsByCategory(category))
  }, [carousalData, dispatch])

  useEffect(() => {
    if (error) {
      console.error('Error fetching products:', error)
      dispatch(clearError())
    }
  }, [error, dispatch])

  const handleRetry = () => {
    const category = {
      category1: carousalData.category1 || '',
      category2: carousalData.category2 || '',
      category3: carousalData.category3 || ''
    }
    dispatch(fetchProductsByCategory(category))
  }

  if (loading) {
    return (
      <div className="my-12">
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-[#4f39f6] mb-2">
            {carousalData.heading}
          </h2>
          <div className="w-20 h-1 bg-[#4f39f6] rounded-full"></div>
        </div>
        <div className="flex justify-center py-12">
          <Loading />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="my-12">
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            {carousalData.heading}
          </h2>
          <div className="w-20 h-1 bg-[#4f39f6] rounded-full"></div>
        </div>
        <div className="text-center py-12 px-4 bg-white rounded-2xl shadow-sm border">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <div className="text-red-600 text-lg font-semibold mb-4">
            Failed to load products
          </div>
          <button
            onClick={handleRetry}
            className="px-6 py-3 bg-[#4f39f6] text-white rounded-lg hover:bg-[#3d2ed4] transition-colors font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="my-12">
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            {carousalData.heading}
          </h2>
          <div className="w-20 h-1 bg-[#4f39f6] rounded-full"></div>
        </div>
        <div className="text-center py-12 px-4 bg-white rounded-2xl shadow-sm border">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <Package className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500 text-lg">No products found in this category.</p>
        </div>
      </div>
    )
  }

  return (
    <section className="my-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            {carousalData.heading}
          </h2>
          <div className="w-20 h-1 bg-[#4f39f6] rounded-full mb-2"></div>
        </div>
      </div>

      <div className="relative group py-2">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={24}
          slidesPerView={1}
          navigation={{
            prevEl: '.swiper-button-prev-custom',
            nextEl: '.swiper-button-next-custom',
          }}
          pagination={{
            clickable: true,
            dynamicBullets: true,
          }}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          breakpoints={{
            640: {
              slidesPerView: 1,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 2,
              spaceBetween: 24,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 24,
            },
            1280: {
              slidesPerView: 4,
              spaceBetween: 24,
            },
          }}
          className="pb-12 m-2"
        >
          {products.map((product) => (
            <SwiperSlide key={product._id} className='pb-8'>
              <ProductCard data={product} />
            </SwiperSlide>
          ))}
        </Swiper>

        <button
          className="swiper-button-prev-custom border-2 border-[#4f39f6] absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white shadow-lg rounded-full flex items-center justify-center text-gray-600 hover:text-[#4f39f6] hover:shadow-xl transition-all duration-300 opacity-0 opacity-100 -translate-x-2 group-hover:translate-x-0"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        
        <button
          className="swiper-button-next-custom border-2 border-[#4f39f6] absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white shadow-lg rounded-full flex items-center justify-center text-gray-600 hover:text-[#4f39f6] hover:shadow-xl transition-all duration-300 opacity-0 opacity-100 translate-x-2 group-hover:translate-x-0"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      <style jsx global>{`
        .swiper-pagination-bullet {
          background-color: #d1d5db;
          opacity: 1;
        }
        .swiper-pagination-bullet-active {
          background-color: #4f39f6;
        }
        .swiper-pagination {
          bottom: 0 !important;
        }
      `}</style>
    </section>
  )
}

export default Homecarousel
