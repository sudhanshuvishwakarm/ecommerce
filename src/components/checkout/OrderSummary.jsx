'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function OrderSummary({ onBack, addressData, userAddress, onEditAddress, onDeleteAddress, loading }) {
  const router = useRouter();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [cartData, setCartData] = useState(null);
  const [cartLoading, setCartLoading] = useState(true);

  const displayAddress = userAddress || addressData;

  useEffect(() => {
    fetchCartData();
  }, []);

  const fetchCartData = async () => {
    try {
      setCartLoading(true);
      const response = await axios.get('/api/cart');
      setCartData(response.data.cart);
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error("Please login first");
        router.push('/auth/login');
      } else {
        toast.error("Failed to fetch cart data");
      }
    } finally {
      setCartLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      await onDeleteAddress();
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error("Error deleting address:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleProductClick = (productId) => {
    router.push(`/product/productDetail/${productId}`);
  };

  if (!displayAddress) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="text-center py-8">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <p className="text-gray-500">No address found. Please add an address first.</p>
          <button
            onClick={onBack}
            className="mt-4 bg-[#4f39f6] text-white px-6 py-2 rounded-md hover:bg-[#3d2ed4] transition-colors"
          >
            Add Address
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Order Summary</h2>
      </div>

      {/* Delivery Address Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <svg className="w-5 h-5 mr-2 text-[#4f39f6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Delivery Address
          </h3>
          <div className="flex space-x-2">
            <button
              onClick={onEditAddress}
              disabled={loading}
              className="text-[#4f39f6] hover:text-[#3d2ed4] text-sm font-medium flex items-center disabled:opacity-50"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              disabled={loading}
              className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center disabled:opacity-50"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete
            </button>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-lg font-semibold text-gray-900">
                {displayAddress.firstName} {displayAddress.lastName}
              </p>
              <p className="mt-2 text-gray-700">{displayAddress.streetAddress}</p>
              <p className="text-gray-700">
                {displayAddress.city}, {displayAddress.state} {displayAddress.zipCode}
              </p>
              <div className="mt-3 flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="font-medium text-gray-700">{displayAddress.mobile}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cart Items Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <svg className="w-5 h-5 mr-2 text-[#4f39f6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          Your Order ({cartLoading ? '...' : cartData?.totalItem || 0} items)
        </h3>
        
        {cartLoading ? (
          <div className="space-y-4">
            {[1, 2].map((item) => (
              <div key={item} className="animate-pulse flex items-center gap-4 p-4 border border-gray-100 rounded-md">
                <div className="w-16 h-16 bg-gray-200 rounded-md"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : cartData && cartData.cartItems && cartData.cartItems.length > 0 ? (
          <div className="space-y-4">
            {cartData.cartItems.map((item) => (
              <div 
                key={item._id} 
                className="flex items-center gap-4 p-4 border border-gray-100 rounded-md hover:border-[#4f39f6] cursor-pointer transition-colors"
                onClick={() => handleProductClick(item.product._id)}
              >
                <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                  {item.product.imageUrl ? (
                    <img 
                      src={item.product.imageUrl} 
                      alt={item.product.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-400 text-xs">No Image</span>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 truncate">{item.product.title}</h4>
                  <p className="text-gray-600 text-sm">
                    Size: {item.size}, Color: {item.product.color}
                  </p>
                  <p className="text-gray-600 text-sm">Quantity: {item.quantity}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[#4f39f6] font-medium">₹{item.discountedPrice}</span>
                    {item.price !== item.discountedPrice && (
                      <span className="text-gray-500 line-through text-sm">₹{item.price}</span>
                    )}
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <p className="text-gray-500">Your cart is empty</p>
          </div>
        )}
      </div>

      {/* Order Details Section */}
      {cartData && cartData.cartItems && cartData.cartItems.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2 text-[#4f39f6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Price Details
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Price ({cartData.totalItem} items)</span>
              <span>₹{cartData.totalPrice}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Discount</span>
              <span className="text-green-600">-₹{cartData.discounte}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Delivery Charges</span>
              <span className="text-green-600">FREE</span>
            </div>
            <div className="border-t border-gray-200 pt-3">
              <div className="flex justify-between font-semibold text-lg">
                <span>Total Amount</span>
                <span>₹{cartData.totalDiscountPrice}</span>
              </div>
            </div>
            {cartData.discounte > 0 && (
              <div className="text-green-600 text-sm">
                You will save ₹{cartData.discounte} on this order
              </div>
            )}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Delete Address</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this address? This action cannot be undone.
            </p>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 flex items-center justify-center"
              >
                {isDeleting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Deleting...
                  </>
                ) : (
                  'Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}// 'use client';
// import React, { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import axios from 'axios';
// import { toast } from 'react-toastify';

// export default function OrderSummary({ onBack, addressData, userAddress, onEditAddress, onDeleteAddress, loading }) {
//   const router = useRouter();
//   const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
//   const [isDeleting, setIsDeleting] = useState(false);
//   const [cartData, setCartData] = useState(null);
//   const [cartLoading, setCartLoading] = useState(true);

//   const displayAddress = userAddress || addressData;

//   useEffect(() => {
//     fetchCartData();
//   }, []);

//  const fetchCartData = async () => {
//   try {
//     setCartLoading(true);
//     const response = await axios.get('/api/cart');
//     setCartData(response.data.cart); 
//     console.log("cart datatatat", response.data.cart); 
//   } catch (error) {
//     if (error.response?.status === 401) {
//       toast.error("Please login first");
//       router.push('/auth/login');
//     } else {
//       toast.error("Failed to fetch cart data");
//     }
//   } finally {
//     setCartLoading(false);
//   }
// };

//   const handleDeleteConfirm = async () => {
//     setIsDeleting(true);
//     try {
//       await onDeleteAddress();
//       setShowDeleteConfirm(false);
//     } catch (error) {
//       console.error("Error deleting address:", error);
//     } finally {
//       setIsDeleting(false);
//     }
//   };

//   const handleProductClick = (productId) => {
//     router.push(`/product/productDetail/${productId}`);
//   };

//   if (!displayAddress) {
//     return (
//       <div className="bg-white rounded-lg shadow-sm p-6">
//         <div className="text-center py-8">
//           <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
//           </svg>
//           <p className="text-gray-500">No address found. Please add an address first.</p>
//           <button
//             onClick={onBack}
//             className="mt-4 bg-[#4f39f6] text-white px-6 py-2 rounded-md hover:bg-[#3d2ed4] transition-colors"
//           >
//             Add Address
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between mb-6">
//         <h2 className="text-xl font-semibold text-gray-900">Order Summary</h2>
//         <div className="flex items-center text-sm text-gray-500">
//           <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//           </svg>
//           Step 2 of 4
//         </div>
//       </div>

//       {/* Delivery Address Section */}
//       <div className="bg-white rounded-lg shadow-sm p-6">
//         <div className="flex items-center justify-between mb-4">
//           <h3 className="text-lg font-medium text-gray-900 flex items-center">
//             <svg className="w-5 h-5 mr-2 text-[#4f39f6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
//             </svg>
//             Delivery Address
//           </h3>
//           <div className="flex space-x-2">
//             <button
//               onClick={onEditAddress}
//               disabled={loading}
//               className="text-[#4f39f6] hover:text-[#3d2ed4] text-sm font-medium flex items-center disabled:opacity-50"
//             >
//               <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
//               </svg>
//               Edit
//             </button>
//             <button
//               onClick={() => setShowDeleteConfirm(true)}
//               disabled={loading}
//               className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center disabled:opacity-50"
//             >
//               <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//               </svg>
//               Delete
//             </button>
//           </div>
//         </div>

//         <div className="bg-gray-50 rounded-lg p-4">
//           <div className="flex items-start justify-between">
//             <div className="flex-1">
//               <p className="text-lg font-semibold text-gray-900">
//                 {displayAddress.firstName} {displayAddress.lastName}
//               </p>
//               <p className="mt-2 text-gray-700">{displayAddress.streetAddress}</p>
//               <p className="text-gray-700">
//                 {displayAddress.city}, {displayAddress.state} {displayAddress.zipCode}
//               </p>
//               <div className="mt-3 flex items-center gap-2">
//                 <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
//                 </svg>
//                 <span className="font-medium text-gray-700">{displayAddress.mobile}</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

      

//       {/* Delete Confirmation Modal */}
//       {showDeleteConfirm && (
//         <div className="fixed inset-0 bg-transparent bg-blur shadow-lg bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
//             <h3 className="text-lg font-semibold text-gray-900 mb-4">Delete Address</h3>
//             <p className="text-gray-600 mb-6">
//               Are you sure you want to delete this address? This action cannot be undone.
//             </p>
//             <div className="flex space-x-4">
//               <button
//                 onClick={() => setShowDeleteConfirm(false)}
//                 disabled={isDeleting}
//                 className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleDeleteConfirm}
//                 disabled={isDeleting}
//                 className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 flex items-center justify-center"
//               >
//                 {isDeleting ? (
//                   <>
//                     <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
//                     Deleting...
//                   </>
//                 ) : (
//                   'Delete'
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }