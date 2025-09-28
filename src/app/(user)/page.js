import Homecarousel from '../../components/Home/Homecarousel.jsx'
import Maincarousel from '../../components/Home/Maincarousel.jsx'
import { Truck, ShieldCheck, RefreshCw, Headphones } from 'lucide-react'
const Homepage = () => {
  let carousalData = [
    {
      category1: 'men',
      category2: 'clothing',
      category3: 'shirts',
      heading: 'Top Deals on Men\'s Shirts'
    },
    {
      category1: 'women',
      category2: 'clothing',
      category3: 'tops',
      heading: 'Top Deals on Women\'s Tops'
    },
    {
      category1: 'men',
      category2: 'accessories',
      category3: 'watches',
      heading: 'Premium Men\'s Watches'
    },
    {
      category1: 'women',
      category2: 'accessories',
      category3: 'bags',
      heading: 'Trendy Women\'s Bags'
    }
  ]
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Hero Carousel Section */}
      <div className="w-full mb-8">
        <Maincarousel />
      </div>

      {/* Welcome Section */}
      <div className="max-w-[88rem] mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Welcome to <span className="text-[#4f39f6]">StyleHub</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover the latest fashion trends and premium quality products. 
            Shop from our carefully curated collection of clothing and accessories.
          </p>
        </div>

        {/* Product Categories Carousels */}
        <div className="space-y-12">
          {carousalData.map((data, index) => (
            <Homecarousel key={`${data.category1}-${data.category2}-${data.category3}-${index}`} carousalData={data} />
          ))}
        </div>

        {/* Features Section */}
        <div className="mt-20 mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose StyleHub?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We're committed to providing you with the best shopping experience
            </p>
          </div>
          
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
  <div className="text-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
    <div className="w-16 h-16 bg-[#4f39f6] bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
      <Truck className="w-8 h-8 text-white" />
    </div>
    <h3 className="text-xl font-semibold text-gray-900 mb-2">Free Shipping</h3>
    <p className="text-gray-600 text-sm">Free delivery on orders over ₹1000. Fast and reliable shipping nationwide.</p>
  </div>

  <div className="text-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
    <div className="w-16 h-16 bg-[#4f39f6] bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
      <ShieldCheck className="w-8 h-8 text-white" />
    </div>
    <h3 className="text-xl font-semibold text-gray-900 mb-2">Quality Assured</h3>
    <p className="text-gray-600 text-sm">Premium quality products from trusted brands with quality guarantee.</p>
  </div>

  <div className="text-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
    <div className="w-16 h-16 bg-[#4f39f6] bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
      <RefreshCw className="w-8 h-8 text-white" />
    </div>
    <h3 className="text-xl font-semibold text-gray-900 mb-2">Easy Returns</h3>
    <p className="text-gray-600 text-sm">30-day hassle-free return policy. Shop with confidence.</p>
  </div>

  <div className="text-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
    <div className="w-16 h-16 bg-[#4f39f6] bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
      <Headphones className="w-8 h-8 text-white" />
    </div>
    <h3 className="text-xl font-semibold text-gray-900 mb-2">24/7 Support</h3>
    <p className="text-gray-600 text-sm">Round-the-clock customer support to help you with any queries.</p>
  </div>
</div>
        </div>

        {/* Newsletter Section */}
        <div className="bg-[#4f39f6] rounded-3xl p-8 md:p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Stay in the Loop</h2>
          <p className="text-lg mb-8 opacity-90">
            Get the latest updates on new arrivals, exclusive deals, and fashion trends
          </p>
          <div className="max-w-md mx-auto flex flex-col sm:flex-row gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 border-1 text-white border-white rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
            />
            <button className="bg-white text-[#4f39f6] px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Homepage// import Homecarousel from '../../components/Home/Homecarousel.jsx'
// import Maincarousel from '../../components/Home/Maincarousel.jsx'

// const Homepage = () => {
//   let carousalData = [
//     {
//       category1: 'men',
//       category2: 'clothing',
//       category3: 'shirts',
//       heading: 'Top Deals on Men\'s Shirts'
//     },
//     {
//       category1: 'women',
//       category2: 'clothing',
//       category3: 'tops',
//       heading: 'Top Deals on Women\'s Tops'
//     },
    
//   ]
  
//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Main Hero Carousel Section */}
//       <div className="w-full mb-8">
//         <Maincarousel />
//       </div>

//       {/* Welcome Section */}
//       <div className="max-w-[88rem] mx-auto px-4 sm:px-6 lg:px-8 pb-12">
//         <div className="text-center mb-16">
//           <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
//             Welcome to <span className="text-[#4f39f6]">StyleHub</span>
//           </h1>
//           <p className="text-xl text-gray-600 max-w-3xl mx-auto">
//             Discover the latest fashion trends and premium quality products. 
//             Shop from our carefully curated collection of clothing and accessories.
//           </p>
//         </div>

//         {/* Product Categories Carousels */}
//         <div className="space-y-12">
//           {carousalData.map((data, index) => (
//             <Homecarousel key={`${data.category1}-${data.category2}-${data.category3}-${index}`} carousalData={data} />
//           ))}
//         </div>

//         {/* Features Section */}
//         <div className="mt-20 mb-16">
//           <div className="text-center mb-12">
//             <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose StyleHub?</h2>
//             <p className="text-gray-600 max-w-2xl mx-auto">
//               We're committed to providing you with the best shopping experience
//             </p>
//           </div>
          
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
//             <div className="text-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
//               <div className="w-16 h-16 bg-[#4f39f6] bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
//                 <svg className="w-8 h-8 text-[#4f39f6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
//                 </svg>
//               </div>
//               <h3 className="text-xl font-semibold text-gray-900 mb-2">Free Shipping</h3>
//               <p className="text-gray-600 text-sm">Free delivery on orders over ₹1000. Fast and reliable shipping nationwide.</p>
//             </div>

//             <div className="text-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
//               <div className="w-16 h-16 bg-[#4f39f6] bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
//                 <svg className="w-8 h-8 text-[#4f39f6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//                 </svg>
//               </div>
//               <h3 className="text-xl font-semibold text-gray-900 mb-2">Quality Assured</h3>
//               <p className="text-gray-600 text-sm">Premium quality products from trusted brands with quality guarantee.</p>
//             </div>

//             <div className="text-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
//               <div className="w-16 h-16 bg-[#4f39f6] bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
//                 <svg className="w-8 h-8 text-[#4f39f6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
//                 </svg>
//               </div>
//               <h3 className="text-xl font-semibold text-gray-900 mb-2">Easy Returns</h3>
//               <p className="text-gray-600 text-sm">30-day hassle-free return policy. Shop with confidence.</p>
//             </div>

//             <div className="text-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
//               <div className="w-16 h-16 bg-[#4f39f6] bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
//                 <svg className="w-8 h-8 text-[#4f39f6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
//                 </svg>
//               </div>
//               <h3 className="text-xl font-semibold text-gray-900 mb-2">24/7 Support</h3>
//               <p className="text-gray-600 text-sm">Round-the-clock customer support to help you with any queries.</p>
//             </div>
//           </div>
//         </div>

//         {/* Newsletter Section */}
//         <div className="bg-gradient-to-r from-[#4f39f6] to-[#6366f1] rounded-3xl p-8 md:p-12 text-center text-white">
//           <h2 className="text-3xl font-bold mb-4">Stay in the Loop</h2>
//           <p className="text-lg mb-8 opacity-90">
//             Get the latest updates on new arrivals, exclusive deals, and fashion trends
//           </p>
//           <div className="max-w-md mx-auto flex flex-col sm:flex-row gap-4">
//             <input
//               type="email"
//               placeholder="Enter your email"
//               className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
//             />
//             <button className="bg-white text-[#4f39f6] px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
//               Subscribe
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Homepage
