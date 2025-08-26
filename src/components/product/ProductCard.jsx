const ProductCard = ({ data }) => {
  return (
    // <div 
    //   className="flex flex-col items-center justify-center w-full max-w-xs m-2 overflow-hidden bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer"
    // >
    //   <div className="relative w-full h-64 overflow-hidden">
    //     <img 
    //       src={data.image} 
    //       className="absolute object-contain w-full h-full p-4" 
    //       alt={data.title} 
    //     />
    //   </div>
    //   <div className="w-full p-4">
    //     <p className="text-sm text-gray-500">{data.category}</p>
    //     <h3 className="py-1 font-semibold text-gray-800 truncate">
    //       {data.title}
    //     </h3>
    //     <div className="flex items-center mt-2">
    //       <p className="text-lg font-bold text-gray-900">${data.price}</p>
    //       <del className="ml-2 text-sm text-gray-500">$999</del>
    //       <span className="ml-2 text-sm font-bold text-green-500">40%</span>
    //     </div>
    //   </div>
    // </div>
    <div className="flex flex-col items-center justify-center w-full h-full max-w-xs overflow-hidden bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer border border-gray-100">
      <div className="relative w-full h-64 overflow-hidden">
        <img 
          src={data.image} 
          className="absolute object-contain w-full h-full p-4" 
          alt={data.title} 
        />
      </div>
      <div className="w-full p-4">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{data.category}</p>
        <h3 className="py-1 text-sm font-semibold text-gray-800 line-clamp-2 h-12">
          {data.title}
        </h3>
        <div className="flex items-center mt-2">
          <p className="text-lg font-bold text-gray-900">${data.price}</p>
          <del className="ml-2 text-sm text-gray-500">${(data.price * 1.4).toFixed(2)}</del>
          <span className="ml-2 text-xs font-bold text-green-500 bg-green-100 px-2 py-1 rounded-full">40% off</span>
        </div>
        <div className="mt-3 flex items-center">
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
  )
}

export default ProductCard