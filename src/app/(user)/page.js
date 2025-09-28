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

      <div className="max-w-[88rem] mx-auto px-4 sm:px-6 lg:px-8 pb-12">

        <div className="space-y-12">
          {carousalData.map((data, index) => (
            <Homecarousel key={`${data.category1}-${data.category2}-${data.category3}-${index}`} carousalData={data} />
          ))}
        </div>

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

      </div>
    </div>
  )
}

export default Homepage