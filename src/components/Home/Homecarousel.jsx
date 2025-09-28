'use client'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'
import { ChevronLeft, ChevronRight, AlertCircle, Package } from 'lucide-react'
import Loading from '../../components/loader/Loading.jsx'
import ProductCard from '../product/ProductCard.jsx'
import { toast } from 'react-toastify'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

const Homecarousel = ({ carousalData }) => {
  const category = {
    category1: carousalData.category1,
    category2: carousalData.category2,
    category3: carousalData.category3
  }
  
  const [products, setProducts] = useState([])
  const [status, setStatus] = useState('idle')

  useEffect(() => {
    fetchProducts()
  }, [carousalData])

  const fetchProducts = async () => {
    try {
      setStatus('loading')
      
      const response = await axios.post(`/api/product/getProductsByCategory`, category)
      
      if (response.data && Array.isArray(response.data)) {
        setProducts(response.data)
        setStatus('succeeded')
      } else {
        throw new Error('Invalid response format')
      }
    } catch (error) {
      console.error('Error fetching products:', error)
      setStatus('failed')
      toast.error('Failed to load products')
    }
  }

  if (status === 'loading') {
    return (
      <div className="my-12">
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
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

  if (status === 'failed') {
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
            onClick={fetchProducts}
            className="px-6 py-3 bg-[#4f39f6] text-white rounded-lg hover:bg-[#3d2ed4] transition-colors font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (products.length === 0 && status === 'succeeded') {
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

        {/* Custom Navigation Buttons */}
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

export default Homecarousel// 'use client'
// import axios from 'axios'
// import { useEffect, useState, useRef } from 'react'
// import Loading from '../../components/loader/Loading.jsx'
// import ProductCard from '../product/ProductCard.jsx'
// import { toast } from 'react-toastify'

// const Homecarousel = ({ carousalData }) => {
//   const category = {
//     category1: carousalData.category1,
//     category2: carousalData.category2,
//     category3: carousalData.category3
//   }
  
//   const [products, setProducts] = useState([])
//   const [status, setStatus] = useState('idle')
//   const [canScrollLeft, setCanScrollLeft] = useState(false)
//   const [canScrollRight, setCanScrollRight] = useState(true)
//   const scrollContainerRef = useRef(null)

//   useEffect(() => {
//     fetchProducts()
//   }, [carousalData])

//   const fetchProducts = async () => {
//     try {
//       setStatus('loading')
      
//       const response = await axios.post(`/api/product/getProductsByCategory`, category)
      
//       if (response.data && Array.isArray(response.data)) {
//         setProducts(response.data)
//         setStatus('succeeded')
//       } else {
//         throw new Error('Invalid response format')
//       }
//     } catch (error) {
//       console.error('Error fetching products:', error)
//       setStatus('failed')
//       toast.error('Failed to load products')
//     }
//   }

//   const updateScrollButtons = () => {
//     if (scrollContainerRef.current) {
//       const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
//       setCanScrollLeft(scrollLeft > 10)
//       setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
//     }
//   }

//   useEffect(() => {
//     const scrollContainer = scrollContainerRef.current
//     if (scrollContainer) {
//       const handleScroll = () => updateScrollButtons()
//       scrollContainer.addEventListener('scroll', handleScroll)
//       updateScrollButtons()
      
//       return () => scrollContainer.removeEventListener('scroll', handleScroll)
//     }
//   }, [products])

//   const scrollLeft = () => {
//     if (scrollContainerRef.current && canScrollLeft) {
//       const container = scrollContainerRef.current
//       const scrollAmount = container.clientWidth * 0.8
//       container.scrollTo({
//         left: container.scrollLeft - scrollAmount,
//         behavior: 'smooth'
//       })
//     }
//   }

//   const scrollRight = () => {
//     if (scrollContainerRef.current && canScrollRight) {
//       const container = scrollContainerRef.current
//       const scrollAmount = container.clientWidth * 0.8
//       container.scrollTo({
//         left: container.scrollLeft + scrollAmount,
//         behavior: 'smooth'
//       })
//     }
//   }

//   if (status === 'loading') {
//     return (
//       <div className="my-12">
//         <div className="bg-gradient-to-r from-[#4f39f6] to-[#6366f1] text-white rounded-2xl p-6 mb-8">
//           <h2 className="text-2xl md:text-3xl font-bold">
//             {carousalData.heading}
//           </h2>
//         </div>
//         <div className="flex justify-center py-12">
//           <Loading />
//         </div>
//       </div>
//     )
//   }

//   if (status === 'failed') {
//     return (
//       <div className="my-12">
//         <div className="bg-gradient-to-r from-[#4f39f6] to-[#6366f1] text-white rounded-2xl p-6 mb-8">
//           <h2 className="text-2xl md:text-3xl font-bold">
//             {carousalData.heading}
//           </h2>
//         </div>
//         <div className="text-center py-12 px-4 bg-white rounded-2xl shadow-sm">
//           <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
//             <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
//             </svg>
//           </div>
//           <div className="text-red-600 text-lg font-semibold mb-4">
//             Failed to load products
//           </div>
//           <button
//             onClick={fetchProducts}
//             className="px-6 py-3 bg-[#4f39f6] text-white rounded-lg hover:bg-[#3d2ed4] transition-colors font-medium"
//           >
//             Try Again
//           </button>
//         </div>
//       </div>
//     )
//   }

//   if (products.length === 0 && status === 'succeeded') {
//     return (
//       <div className="my-12">
//         <div className="bg-gradient-to-r from-[#4f39f6] to-[#6366f1] text-white rounded-2xl p-6 mb-8">
//           <h2 className="text-2xl md:text-3xl font-bold">
//             {carousalData.heading}
//           </h2>
//         </div>
//         <div className="text-center py-12 px-4 bg-white rounded-2xl shadow-sm">
//           <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
//             <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
//             </svg>
//           </div>
//           <p className="text-gray-500 text-lg">No products found in this category.</p>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <section className="my-12">
//       {/* Purple Header */}
//       <div className="bg-gradient-to-r from-[#4f39f6] to-[#6366f1] text-white rounded-t-2xl p-6 md:p-8">
//         <div className="flex items-center justify-between">
//           <div>
//             <h2 className="text-2xl md:text-3xl font-bold mb-2">
//               {carousalData.heading}
//             </h2>
//             <p className="text-white text-opacity-90">
//               {products.length} {products.length === 1 ? 'product' : 'products'} available
//             </p>
//           </div>
          
//           <div className="hidden md:flex space-x-3">
//             <button
//               onClick={scrollLeft}
//               disabled={!canScrollLeft}
//               className={`p-3 rounded-full transition-all duration-300 ${
//                 canScrollLeft
//                   ? 'bg-white bg-opacity-20 hover:bg-opacity-30 text-white border-2 border-white border-opacity-30 hover:border-opacity-50'
//                   : 'bg-white bg-opacity-10 text-white text-opacity-50 cursor-not-allowed border-2 border-white border-opacity-20'
//               }`}
//               aria-label="Scroll left"
//             >
//               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
//               </svg>
//             </button>
//             <button
//               onClick={scrollRight}
//               disabled={!canScrollRight}
//               className={`p-3 rounded-full transition-all duration-300 ${
//                 canScrollRight
//                   ? 'bg-white bg-opacity-20 hover:bg-opacity-30 text-white border-2 border-white border-opacity-30 hover:border-opacity-50'
//                   : 'bg-white bg-opacity-10 text-white text-opacity-50 cursor-not-allowed border-2 border-white border-opacity-20'
//               }`}
//               aria-label="Scroll right"
//             >
//               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
//               </svg>
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Products Container */}
//       <div className="bg-white rounded-b-2xl shadow-sm border border-gray-100 p-6 md:p-8">
//         <div className="relative">
//           <div
//             ref={scrollContainerRef}
//             className="flex gap-6 overflow-x-hidden hover:overflow-x-auto transition-all duration-300"
//             style={{
//               scrollbarWidth: 'thin',
//               scrollbarColor: '#4f39f6 #f1f5f9'
//             }}
//           >
//             {products.map((product) => (
//               <div
//                 key={product._id}
//                 className="flex-none w-[280px] md:w-72 lg:w-80 xl:w-72"
//               >
//                 <ProductCard data={product} />
//               </div>
//             ))}
//           </div>

//           {/* Mobile Navigation */}
//           <div className="md:hidden flex justify-center space-x-4 mt-6">
//             <button
//               onClick={scrollLeft}
//               disabled={!canScrollLeft}
//               className={`p-3 rounded-full transition-all duration-300 ${
//                 canScrollLeft
//                   ? 'bg-[#4f39f6] text-white hover:bg-[#3d2ed4] shadow-lg'
//                   : 'bg-gray-200 text-gray-400 cursor-not-allowed'
//               }`}
//             >
//               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
//               </svg>
//             </button>
//             <button
//               onClick={scrollRight}
//               disabled={!canScrollRight}
//               className={`p-3 rounded-full transition-all duration-300 ${
//                 canScrollRight
//                   ? 'bg-[#4f39f6] text-white hover:bg-[#3d2ed4] shadow-lg'
//                   : 'bg-gray-200 text-gray-400 cursor-not-allowed'
//               }`}
//             >
//               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
//               </svg>
//             </button>
//           </div>

//           {/* Scroll Indicators */}
//           {products.length > 4 && (
//             <div className="flex justify-center mt-4 space-x-2">
//               {Array.from({ length: Math.ceil(products.length / 4) }, (_, i) => (
//                 <div
//                   key={i}
//                   className="w-2 h-2 rounded-full bg-gray-300 transition-colors duration-300"
//                 />
//               ))}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Custom Scrollbar Styles */}
//       <style jsx>{`
//         .flex::-webkit-scrollbar {
//           height: 8px;
//         }
//         .flex::-webkit-scrollbar-track {
//           background: #f1f5f9;
//           border-radius: 4px;
//         }
//         .flex::-webkit-scrollbar-thumb {
//           background: #4f39f6;
//           border-radius: 4px;
//         }
//         .flex::-webkit-scrollbar-thumb:hover {
//           background: #3d2ed4;
//         }
//       `}</style>
//     </section>
//   )
// }

// export default Homecarousel