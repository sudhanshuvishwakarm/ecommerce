'use client';
import { useState, useEffect } from "react";

const CartItem = ({ item, onQuantityChange, onRemove, onProductClick, isUpdating }) => {
  const [quantity, setQuantity] = useState(item?.quantity || 1);

  useEffect(() => {
    setQuantity(item?.quantity || 1);
  }, [item?.quantity]);

  if (!item) {
    return (
      <div className="bg-white rounded-xl shadow-sm border p-6 animate-pulse">
        <div className="flex space-x-4">
          <div className="w-32 h-32 bg-gray-200 rounded-xl"></div>
          <div className="flex-1 space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          </div>
        </div>
      </div>
    );
  }

  const handleDecrease = () => {
    if (quantity > 1 && !isUpdating) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      onQuantityChange(item.id, newQuantity);
    }
  };

  const handleIncrease = () => {
    if (!isUpdating) {
      const newQuantity = quantity + 1;
      setQuantity(newQuantity);
      onQuantityChange(item.id, newQuantity);
    }
  };

  const handleProductClick = () => {
    if (item.productId && !isUpdating) {
      onProductClick(item.productId);
    }
  };

  const handleRemove = () => {
    if (!isUpdating) {
      onRemove(item.id);
    }
  };

  return (
    <div className={`bg-white rounded-xl shadow-md transition-all duration-200 overflow-hidden ${isUpdating ? 'opacity-70' : 'hover:shadow-lg'}`}>
      <div className="p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-shrink-0">
            <div 
              className={`relative group ${!isUpdating ? 'cursor-pointer' : 'cursor-not-allowed'}`}
              onClick={handleProductClick}
            >
              <img 
                src={item.image} 
                className="w-32 h-32 object-cover rounded-xl bg-gray-50 transition-all duration-300 group-hover:scale-105" 
                alt={item.name}
                onError={(e) => {
                  e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300"><rect width="300" height="300" fill="%23f3f4f6"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" font-family="Arial" font-size="14" fill="%236b7280">No Image</text></svg>';
                }}
              />
              {!isUpdating && (
                <div className="absolute inset-0  bg-opacity-0 group-hover:bg-opacity-20 rounded-xl transition-all duration-300 flex items-center justify-center">
                  <div className="bg-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-col xl:flex-row xl:justify-between xl:items-start h-full">
              <div className="flex-1 mb-4 xl:mb-0 xl:mr-6">
                <h3 
                  className={`font-semibold text-gray-900 text-lg mb-3 line-clamp-2 leading-tight ${!isUpdating ? 'cursor-pointer hover:text-[#4f39f6] transition-colors' : 'cursor-not-allowed'}`}
                  onClick={handleProductClick}
                >
                  {item.name}
                </h3>
                
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {item.size}
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {item.color}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 mb-4">{item.brand}</p>
                
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-gray-900">₹{item.price?.toLocaleString()}</span>
                  {item.originalPrice !== item.price && (
                    <>
                      <span className="text-lg text-gray-500 line-through">₹{item.originalPrice?.toLocaleString()}</span>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold text-green-700 bg-green-100">
                        {item.discount}% OFF
                      </span>
                    </>
                  )}
                </div>
              </div>

              <div className="flex flex-col items-end space-y-4">
                <div className="flex items-center bg-gray-50 rounded-xl p-1 border">
                  <button 
                    onClick={handleDecrease}
                    disabled={quantity <= 1 || isUpdating}
                    className="w-9 h-9 flex items-center justify-center text-gray-600 hover:text-[#4f39f6] disabled:text-gray-400 disabled:cursor-not-allowed transition-colors rounded-lg hover:bg-white"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                    </svg>
                  </button>
                  
                  <div className="px-4 py-2 min-w-[3.5rem] text-center">
                    {isUpdating ? (
                      <div className="w-5 h-5 mx-auto">
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-[#4f39f6] border-t-transparent"></div>
                      </div>
                    ) : (
                      <span className="font-semibold text-gray-900 text-lg">{quantity}</span>
                    )}
                  </div>
                  
                  <button 
                    onClick={handleIncrease}
                    disabled={isUpdating}
                    className="w-9 h-9 flex items-center justify-center text-gray-600 hover:text-[#4f39f6] disabled:text-gray-400 disabled:cursor-not-allowed transition-colors rounded-lg hover:bg-white"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>

                <button 
                  onClick={handleRemove}
                  disabled={isUpdating}
                  className="flex items-center space-x-2 text-red-600 hover:text-red-700 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors px-3 py-2 rounded-lg hover:bg-red-50"
                >
                  {isUpdating ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-red-600 border-t-transparent"></div>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  )}
                  <span className="text-sm font-medium">Remove</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;