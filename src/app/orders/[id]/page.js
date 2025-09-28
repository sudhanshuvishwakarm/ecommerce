// 'use client';
// import React, { useState } from 'react';
// import AddressCard from '../../../components/checkout/AddressCard.jsx';
// import OrderTracker from '../../../components/order/OrderTracker.jsx';

const OrderDetail = () => {
  // const [orderData] = useState({
  //   orderId: 'ORD-123456',
  //   orderDate: '2024-03-15',
  //   deliveryDate: '2024-03-23',
  //   status: 'outfordelivery',
  //   totalAmount: 5497,
  //   paymentMethod: 'Credit Card',
  //   items: [
  //     {
  //       id: 1,
  //       name: 'Men Slim Mid Black Jeans',
  //       image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
  //       color: 'Black',
  //       size: 'M',
  //       price: 900,
  //       quantity: 1,
  //       seller: 'Tokyo Fashion',
  //       rating: 0
  //     },
  //     {
  //       id: 2,
  //       name: 'Premium Cotton T-Shirt',
  //       image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
  //       color: 'White',
  //       size: 'L',
  //       price: 599,
  //       quantity: 2,
  //       seller: 'Urban Threads',
  //       rating: 0
  //     },
  //     {
  //       id: 3,
  //       name: 'Casual Sneakers',
  //       image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
  //       color: 'Gray',
  //       size: '42',
  //       price: 2499,
  //       quantity: 1,
  //       seller: 'Footwear Express',
  //       rating: 0
  //     }
  //   ],
  //   address: {
  //     firstname: 'John',
  //     lastname: 'Doe',
  //     address: '123 Main Street, Apartment 4B',
  //     city: 'Mumbai',
  //     state: 'Maharashtra',
  //     postalcode: '400001',
  //     phonenumber: '+91 9876543210'
  //   }
  // });

  // const [showRatingModal, setShowRatingModal] = useState(false);
  // const [currentProduct, setCurrentProduct] = useState(null);
  // const [rating, setRating] = useState(0);
  // const [review, setReview] = useState('');

  // const handleRateProduct = (product) => {
  //   setCurrentProduct(product);
  //   setRating(0);
  //   setReview('');
  //   setShowRatingModal(true);
  // };

  // const handleSubmitRating = () => {
  //   // Handle rating submission logic here
  //   setShowRatingModal(false);
  // };

  // const getStatusStep = (status) => {
  //   switch (status) {
  //     case 'placed': return 0;
  //     case 'confirmed': return 1;
  //     case 'shipped': return 2;
  //     case 'outfordelivery': return 3;
  //     case 'delivered': return 4;
  //     default: return 0;
  //   }
  // };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 p-8">Order Details Page Under Construction</h1>
    </div>
    // <div className="min-h-screen bg-gray-50 py-8">
    //   <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
    //     {/* Header */}
    //     <div className="mb-8">
    //       <h1 className="text-3xl font-bold text-gray-900">Order Details</h1>
    //       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-2">
    //         <p className="text-gray-600">Order ID: <span className="font-medium">{orderData.orderId}</span></p>
    //         <p className="text-gray-600">Placed on: <span className="font-medium">{new Date(orderData.orderDate).toLocaleDateString()}</span></p>
    //       </div>
    //     </div>

    //     <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
    //       {/* Main Content */}
    //       <div className="lg:col-span-2 space-y-6">
    //         {/* Order Tracker */}
    //         <div className="bg-white rounded-xl shadow-sm p-6">
    //           <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Status</h2>
    //           <OrderTracker activeStep={getStatusStep(orderData.status)} />
              
    //           {orderData.status === 'outfordelivery' && orderData.deliveryDate && (
    //             <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
    //               <div className="flex items-center gap-3">
    //                 <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    //                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    //                 </svg>
    //                 <div>
    //                   <p className="font-medium text-blue-900">Out for delivery</p>
    //                   <p className="text-sm text-blue-700">
    //                     Expected delivery: {new Date(orderData.deliveryDate).toLocaleDateString()}
    //                   </p>
    //                 </div>
    //               </div>
    //             </div>
    //           )}
    //         </div>

    //         {/* Order Items */}
    //         <div className="bg-white rounded-xl shadow-sm p-6">
    //           <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Items ({orderData.items.length})</h2>
    //           <div className="space-y-4">
    //             {orderData.items.map((item) => (
    //               <div key={item.id} className="flex flex-col md:flex-row gap-4 p-4 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors duration-200">
    //                 {/* Product Image */}
    //                 <div className="flex-shrink-0">
    //                   <img 
    //                     className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-lg border border-gray-200"
    //                     src={item.image} 
    //                     alt={item.name}
    //                   />
    //                 </div>

    //                 {/* Product Info */}
    //                 <div className="flex-1 min-w-0">
    //                   <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
    //                   <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
    //                     {item.color && <span>Color: <span className="font-medium">{item.color}</span></span>}
    //                     {item.size && <span>Size: <span className="font-medium">{item.size}</span></span>}
    //                     <span>Qty: <span className="font-medium">{item.quantity}</span></span>
    //                   </div>
    //                   <p className="text-gray-600 mt-1">Seller: <span className="font-medium">{item.seller}</span></p>
    //                   <p className="text-lg font-semibold text-gray-900 mt-2">₹{item.price.toLocaleString()}</p>
    //                 </div>

    //                 {/* Rating Button */}
    //                 <div className="flex-shrink-0">
    //                   <button 
    //                     onClick={() => handleRateProduct(item)}
    //                     className="flex items-center gap-2 px-4 py-2 text-indigo-600 hover:text-indigo-700 font-medium transition-colors duration-200"
    //                   >
    //                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    //                       <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    //                     </svg>
    //                     <span>Rate Product</span>
    //                   </button>
    //                 </div>
    //               </div>
    //             ))}
    //           </div>
    //         </div>
    //       </div>

    //       {/* Sidebar */}
    //       <div className="space-y-6">
    //         {/* Delivery Address */}
    //         <div className="bg-white rounded-xl shadow-sm p-6">
    //           <h2 className="text-xl font-semibold text-gray-900 mb-4">Delivery Address</h2>
    //           <AddressCard getAddress={true} addressData={orderData.address} />
    //         </div>

    //         {/* Order Summary */}
    //         <div className="bg-white rounded-xl shadow-sm p-6">
    //           <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
    //           <div className="space-y-3">
    //             <div className="flex justify-between">
    //               <span className="text-gray-600">Items ({orderData.items.length})</span>
    //               <span>₹{orderData.items.reduce((total, item) => total + (item.price * item.quantity), 0).toLocaleString()}</span>
    //             </div>
    //             <div className="flex justify-between">
    //               <span className="text-gray-600">Delivery</span>
    //               <span className="text-green-600">Free</span>
    //             </div>
    //             <div className="flex justify-between">
    //               <span className="text-gray-600">Tax</span>
    //               <span>₹{(orderData.totalAmount * 0.18).toLocaleString()}</span>
    //             </div>
    //             <div className="border-t border-gray-200 pt-3">
    //               <div className="flex justify-between text-lg font-semibold">
    //                 <span>Total</span>
    //                 <span>₹{orderData.totalAmount.toLocaleString()}</span>
    //               </div>
    //             </div>
    //           </div>

    //           <div className="mt-6 pt-4 border-t border-gray-200">
    //             <h3 className="font-medium text-gray-900 mb-2">Payment Method</h3>
    //             <p className="text-gray-600">{orderData.paymentMethod}</p>
    //             <p className="text-sm text-green-600 mt-1">Paid on {new Date(orderData.orderDate).toLocaleDateString()}</p>
    //           </div>
    //         </div>

    //         {/* Support */}
    //         <div className="bg-white rounded-xl shadow-sm p-6">
    //           <h2 className="text-xl font-semibold text-gray-900 mb-4">Need Help?</h2>
    //           <div className="space-y-3">
    //             <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-colors duration-200">
    //               <span className="font-medium text-gray-900">Contact Seller</span>
    //               <p className="text-sm text-gray-600 mt-1">Get help with this order</p>
    //             </button>
    //             <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-colors duration-200">
    //               <span className="font-medium text-gray-900">Return Item</span>
    //               <p className="text-sm text-gray-600 mt-1">Start a return request</p>
    //             </button>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   </div>

    //   {/* Rating Modal */}
    //   {showRatingModal && (
    //     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    //       <div className="bg-white rounded-xl p-6 max-w-md w-full">
    //         <h2 className="text-xl font-semibold text-gray-900 mb-4">Rate {currentProduct?.name}</h2>
            
    //         {/* Star Rating */}
    //         <div className="flex justify-center mb-4">
    //           {[1, 2, 3, 4, 5].map((star) => (
    //             <button
    //               key={star}
    //               onClick={() => setRating(star)}
    //               className="text-2xl mx-1"
    //             >
    //               {star <= rating ? '⭐' : '☆'}
    //             </button>
    //           ))}
    //         </div>

    //         {/* Review Textarea */}
    //         <textarea
    //           value={review}
    //           onChange={(e) => setReview(e.target.value)}
    //           placeholder="Share your experience with this product..."
    //           className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
    //           rows={4}
    //         />

    //         <div className="flex gap-3 mt-6">
    //           <button
    //             onClick={() => setShowRatingModal(false)}
    //             className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200"
    //           >
    //             Cancel
    //           </button>
    //           <button
    //             onClick={handleSubmitRating}
    //             disabled={rating === 0}
    //             className="flex-1 py-2 px-4 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
    //           >
    //             Submit Review
    //           </button>
    //         </div>
    //       </div>
    //     </div>
    //   )}
    // </div>
  );
};

export default OrderDetail;// 'use client';
