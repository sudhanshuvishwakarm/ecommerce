import { useRouter } from "next/navigation"

const ProductCard = ({ data }) => {
    const router = useRouter()
    const handleProductDetails = () => {
        router.push(`/product/productDetail/${data._id}`)
    }
  return (
    <div onClick={handleProductDetails} className="flex flex-col w-full max-w-sm bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer border border-gray-100 overflow-hidden group">
      {/* Image Container */}
      <div className="relative w-full h-80 overflow-hidden bg-gray-50">
        <img 
          src={data.imageUrl} 
          className="w-full h-full  group-hover:scale-105 transition-transform duration-300" 
          alt={data.title} 
          style={
            {objectFit: 'contain'}
          }
        />
      </div>

      {/* Content Container */}
      <div className="w-full px-5 py-4 flex flex-col flex-1">       
        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 mb-1 leading-tight">
          {data.title}
        </h3>
        
        {/* Description - Single Line */}
        <p className="text-sm text-gray-600 line-clamp-1 mb-1">
          {data.description || "Premium quality product with excellent features and durability."}
        </p>

        {/* Price Section with Discount */}
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center">
            <p className="text-2xl font-bold text-gray-900">₹{data.price}</p>
            <del className="ml-2 text-sm text-gray-500">₹{(data.price * 1.4).toFixed(0)}</del>
          </div>
          {/* Discount Badge - Moved to bottom */}
          <span className="bg-green-100 text-green-700 px-2 py-1 rounded-md text-xs font-medium">
            40% OFF
          </span>
        </div>

        {/* Rating Section */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  className="w-4 h-4 text-yellow-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="ml-2 text-sm text-gray-500">(24)</p>
          </div>
          
        </div>
      </div>
    </div>
  )
}

export default ProductCard

