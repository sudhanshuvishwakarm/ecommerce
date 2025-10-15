'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { fetchOrders } from '../../../redux/slices/orderSlice.js';
import OrderTracker from '../../../components/order/OrderTracker.jsx';
import Loading from '../../../components/loader/Loading.jsx';
import { toast } from 'react-toastify';

const OrderDetail = () => {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id;

  const dispatch = useDispatch();
  const { orders, loading } = useSelector(state => state.orders);
  
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');

  // Find the specific order from Redux state
  const order = orders.find(o => o._id === orderId);

  useEffect(() => {
    // If order not found and we have orders, navigate back
    if (!loading && orders.length > 0 && !order) {
      toast.error("Order not found");
      router.push('/orders');
    }
  }, [order, loading, orders.length, router]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric'
    });
  };

  const handleRateProduct = (product) => {
    setCurrentProduct(product);
    setRating(0);
    setReview('');
    setShowRatingModal(true);
  };

  const handleSubmitRating = () => {
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }
    toast.success("Thank you for your review!");
    setShowRatingModal(false);
  };

  if (loading || !order) {
    return <Loading />;
  }

  const orderItems = order.orderItems || [];
  const shippingAddress = order.shippingAddress || {};
  const orderId_short = order._id?.slice(-8).toUpperCase() || 'N/A';
  const status = order.orderStatus || 'pending';

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
        {/* Back Button */}
        <button
          onClick={() => router.push('/orders')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Orders
        </button>

        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Details</h1>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span>Order ID: <span className="font-medium text-gray-900">#{orderId_short}</span></span>
                <span>•</span>
                <span>Placed on {formatDate(order.createdAt)}</span>
              </div>
            </div>
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium capitalize text-white ${
              status.toLowerCase() === 'delivered' ? 'bg-green-600' :
              status.toLowerCase() === 'cancelled' ? 'bg-red-600' :
              status.toLowerCase() === 'returned' ? 'bg-amber-600' :
              'bg-indigo-600'
            }`}>
              {status}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Tracker */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Status</h2>
              <OrderTracker orderStatus={status} />
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Order Items ({orderItems.length})
              </h2>
              <div className="space-y-4">
                {orderItems.map((item) => (
                  <div key={item._id} className="flex flex-col md:flex-row gap-4 p-4 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors duration-200">
                    {/* Product Image */}
                    <div className="flex-shrink-0">
                      <img 
                        className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-lg border border-gray-200"
                        src={item.product?.imageUrl || item.product?.images?.[0] || '/placeholder.jpg'} 
                        alt={item.product?.title || 'Product'}
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {item.product?.title || 'Product'}
                      </h3>
                      <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
                        {item.product?.color && <span>Color: <span className="font-medium">{item.product.color}</span></span>}
                        {item.size && <span>Size: <span className="font-medium">{item.size}</span></span>}
                        <span>Qty: <span className="font-medium">{item.quantity}</span></span>
                      </div>
                      <p className="text-gray-600 mt-1">
                        Seller: <span className="font-medium">{item.product?.brand || 'Unknown'}</span>
                      </p>
                      <p className="text-lg font-semibold text-gray-900 mt-2">
                        ₹{(item.discountPrice || item.price || 0).toLocaleString()}
                      </p>
                    </div>

                    {/* Rating Button */}
                    {status.toLowerCase() === 'delivered' && (
                      <div className="flex-shrink-0">
                        <button 
                          onClick={() => handleRateProduct(item)}
                          className="flex items-center gap-2 px-4 py-2 text-indigo-600 hover:text-indigo-700 font-medium transition-colors duration-200"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span>Rate</span>
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Delivery Address */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Delivery Address</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-medium text-gray-900 mb-2">
                  {shippingAddress.firstName} {shippingAddress.lastName}
                </p>
                <p className="text-gray-600 mb-1">{shippingAddress.streetAddress}</p>
                <p className="text-gray-600 mb-1">
                  {shippingAddress.city}, {shippingAddress.state} {shippingAddress.zipCode}
                </p>
                <p className="text-gray-600 mb-2">{shippingAddress.country || 'India'}</p>
                {shippingAddress.mobile && (
                  <p className="text-gray-600">
                    <span className="font-medium">Phone:</span> {shippingAddress.mobile}
                  </p>
                )}
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Items ({orderItems.length})</span>
                  <span>₹{orderItems.reduce((total, item) => total + ((item.discountPrice || item.price || 0) * item.quantity), 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery</span>
                  <span className="text-green-600">Free</span>
                </div>
                {order.discount && order.discount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Discount</span>
                    <span className="text-green-600">-₹{order.discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>₹{(order.totalDiscountedPrice || order.totalPrice || 0).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200">
                <h3 className="font-medium text-gray-900 mb-2">Payment</h3>
                <p className="text-gray-600">{order.paymentDetails?.paymentMethod || 'Cash on Delivery'}</p>
                <p className="text-sm text-green-600 mt-1">
                  {order.paymentDetails?.paymentStatus }
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions</h2>
              <div className="space-y-2">
                {status.toLowerCase() === 'delivered' && (
                  <>
                    <button className="w-full p-3 text-left rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                      <span className="font-medium text-gray-900">Return Item</span>
                      <p className="text-sm text-gray-600">Start a return request</p>
                    </button>
                    <button className="w-full p-3 text-left rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                      <span className="font-medium text-gray-900">Buy Again</span>
                      <p className="text-sm text-gray-600">Reorder items</p>
                    </button>
                  </>
                )}
                <button className="w-full p-3 text-left rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                  <span className="font-medium text-gray-900">Contact Support</span>
                  <p className="text-sm text-gray-600">Get help with order</p>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rating Modal */}
      {showRatingModal && currentProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Rate {currentProduct.product?.title || 'Product'}
            </h2>
            
            {/* Star Rating */}
            <div className="flex justify-center mb-4 gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className="text-3xl transition-transform hover:scale-110"
                >
                  {star <= rating ? '★' : '☆'}
                </button>
              ))}
            </div>

            {/* Review Textarea */}
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Share your experience with this product..."
              className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              rows={4}
            />

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowRatingModal(false)}
                className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitRating}
                disabled={rating === 0}
                className="flex-1 py-2 px-4 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                Submit Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetail;// 'use client';
// import { useEffect, useState } from 'react';
// import { useParams, useRouter } from 'next/navigation';
// import { useSelector, useDispatch } from 'react-redux';
// import { fetchOrders } from '../../../redux/slices/orderSlice.js';
// import Loading from '../../../components/loader/Loading.jsx';
// import OrderTracker from '../../../components/order/OrderTracker.jsx';
// import { toast } from 'react-toastify';

// const OrderDetail = () => {
//   const params = useParams();
//   const router = useRouter();
//   const orderId = params.id;

//   const dispatch = useDispatch();
//   const { orders, loading } = useSelector(state => state.orders);
  
//   const [showRatingModal, setShowRatingModal] = useState(false);
//   const [currentProduct, setCurrentProduct] = useState(null);
//   const [rating, setRating] = useState(0);
//   const [review, setReview] = useState('');

//   // Find the specific order
//   const order = orders.find(o => o._id === orderId);

//   useEffect(() => {
//     if (orders.length === 0) {
//       dispatch(fetchOrders());
//     }
//   }, [dispatch, orders.length]);

//   useEffect(() => {
//     if (!loading && orders.length > 0 && !order) {
//       toast.error("Order not found");
//       router.push('/orders');
//     }
//   }, [order, loading, router, orders.length]);

//   const formatDate = (dateString) => {
//     if (!dateString) return 'N/A';
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-US', { 
//       year: 'numeric', 
//       month: 'long', 
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   const formatDateShort = (dateString) => {
//     if (!dateString) return 'N/A';
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-US', { 
//       year: 'numeric', 
//       month: 'short', 
//       day: 'numeric'
//     });
//   };

//   const getStatusColor = (status) => {
//     const statusLower = status?.toLowerCase() || 'pending';
//     switch (statusLower) {
//       case 'ontheway':
//       case 'shipped':
//       case 'confirmed':
//         return 'text-blue-600 bg-blue-50 border-blue-200';
//       case 'delivered':
//         return 'text-green-600 bg-green-50 border-green-200';
//       case 'cancelled':
//         return 'text-red-600 bg-red-50 border-red-200';
//       case 'returned':
//         return 'text-amber-600 bg-amber-50 border-amber-200';
//       case 'pending':
//       case 'placed':
//         return 'text-yellow-600 bg-yellow-50 border-yellow-200';
//       default:
//         return 'text-gray-600 bg-gray-50 border-gray-200';
//     }
//   };

//   const getStatusStep = (status) => {
//     const statusLower = status?.toLowerCase() || 'pending';
//     switch (statusLower) {
//       case 'pending':
//       case 'placed': 
//         return 0;
//       case 'confirmed': 
//         return 1;
//       case 'shipped': 
//         return 2;
//       case 'ontheway':
//       case 'outfordelivery': 
//         return 3;
//       case 'delivered': 
//         return 4;
//       default: 
//         return 0;
//     }
//   };

//   const handleRateProduct = (product) => {
//     setCurrentProduct(product);
//     setRating(0);
//     setReview('');
//     setShowRatingModal(true);
//   };

//   const handleSubmitRating = () => {
//     if (rating === 0) {
//       toast.error("Please select a rating");
//       return;
//     }
//     // Handle rating submission logic here
//     toast.success("Thank you for your review!");
//     setShowRatingModal(false);
//   };

//   if (loading || !order) {
//     return <Loading />;
//   }

//   const orderItems = order.orderItems || [];
//   const shippingAddress = order.shippingAddress || {};
//   const orderId_short = order._id?.slice(-8).toUpperCase() || 'N/A';
//   const orderStatus = order.orderStatus || 'pending';

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
//         {/* Back Button */}
//         <button
//           onClick={() => router.push('/orders')}
//           className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
//         >
//           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
//           </svg>
//           Back to Orders
//         </button>

//         {/* Header */}
//         <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
//           <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//             <div>
//               <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Details</h1>
//               <div className="flex items-center gap-4 text-sm text-gray-600">
//                 <span>Order ID: <span className="font-medium text-gray-900">#{orderId_short}</span></span>
//                 <span>•</span>
//                 <span>Placed on {formatDateShort(order.createdAt)}</span>
//               </div>
//             </div>
//             <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border ${getStatusColor(orderStatus)}`}>
//               <span className="w-2 h-2 rounded-full bg-current"></span>
//               <span className="font-medium capitalize">{orderStatus}</span>
//             </div>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           {/* Main Content */}
//           <div className="lg:col-span-2 space-y-6">
//             {/* Order Tracker */}
//             <div className="bg-white rounded-xl shadow-sm p-6">
//               <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Status</h2>
//               <OrderTracker activeStep={getStatusStep(orderStatus)} />
              
//               {(orderStatus.toLowerCase() === 'ontheway' || orderStatus.toLowerCase() === 'outfordelivery') && order.deliveryDate && (
//                 <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
//                   <div className="flex items-center gap-3">
//                     <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                     </svg>
//                     <div>
//                       <p className="font-medium text-blue-900">Out for delivery</p>
//                       <p className="text-sm text-blue-700">
//                         Expected delivery: {formatDateShort(order.deliveryDate)}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Order Items */}
//             <div className="bg-white rounded-xl shadow-sm p-6">
//               <h2 className="text-xl font-semibold text-gray-900 mb-6">
//                 Order Items ({orderItems.length})
//               </h2>
//               <div className="space-y-4">
//                 {orderItems.map((item) => (
//                   <div key={item._id} className="flex flex-col md:flex-row gap-4 p-4 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors duration-200">
//                     {/* Product Image */}
//                     <div className="flex-shrink-0">
//                       <img 
//                         className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-lg border border-gray-200"
//                         src={item.product?.imageUrl || item.product?.images?.[0] || '/placeholder.jpg'} 
//                         alt={item.product?.title || 'Product'}
//                       />
//                     </div>

//                     {/* Product Info */}
//                     <div className="flex-1 min-w-0">
//                       <h3 className="text-lg font-semibold text-gray-900">
//                         {item.product?.title || 'Product'}
//                       </h3>
//                       <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
//                         {item.product?.color && <span>Color: <span className="font-medium">{item.product.color}</span></span>}
//                         {item.size && <span>Size: <span className="font-medium">{item.size}</span></span>}
//                         <span>Qty: <span className="font-medium">{item.quantity}</span></span>
//                       </div>
//                       <p className="text-gray-600 mt-1">
//                         Seller: <span className="font-medium">{item.product?.brand || 'Unknown'}</span>
//                       </p>
//                       <p className="text-lg font-semibold text-gray-900 mt-2">
//                         ₹{(item.discountedPrice || item.price || 0).toLocaleString()}
//                       </p>
//                     </div>

//                     {/* Rating Button */}
//                     {orderStatus.toLowerCase() === 'delivered' && (
//                       <div className="flex-shrink-0">
//                         <button 
//                           onClick={() => handleRateProduct(item)}
//                           className="flex items-center gap-2 px-4 py-2 text-indigo-600 hover:text-indigo-700 font-medium transition-colors duration-200"
//                         >
//                           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//                             <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
//                           </svg>
//                           <span>Rate Product</span>
//                         </button>
//                       </div>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* Sidebar */}
//           <div className="space-y-6">
//             {/* Delivery Address */}
//             <div className="bg-white rounded-xl shadow-sm p-6">
//               <h2 className="text-xl font-semibold text-gray-900 mb-4">Delivery Address</h2>
//               <div className="bg-gray-50 p-4 rounded-lg">
//                 <p className="font-medium text-gray-900 mb-2">
//                   {shippingAddress.firstName} {shippingAddress.lastName}
//                 </p>
//                 <p className="text-gray-600 mb-1">{shippingAddress.streetAddress}</p>
//                 <p className="text-gray-600 mb-1">
//                   {shippingAddress.city}, {shippingAddress.state} {shippingAddress.zipCode}
//                 </p>
//                 <p className="text-gray-600 mb-2">{shippingAddress.country || 'India'}</p>
//                 {shippingAddress.mobile && (
//                   <p className="text-gray-600">
//                     <span className="font-medium">Phone:</span> {shippingAddress.mobile}
//                   </p>
//                 )}
//               </div>
//             </div>

//             {/* Order Summary */}
//             <div className="bg-white rounded-xl shadow-sm p-6">
//               <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
//               <div className="space-y-3">
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Items ({orderItems.length})</span>
//                   <span>₹{orderItems.reduce((total, item) => total + ((item.discountedPrice || item.price || 0) * item.quantity), 0).toLocaleString()}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Delivery</span>
//                   <span className="text-green-600">Free</span>
//                 </div>
//                 {order.discount && order.discount > 0 && (
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">Discount</span>
//                     <span className="text-green-600">-₹{order.discount.toLocaleString()}</span>
//                   </div>
//                 )}
//                 <div className="border-t border-gray-200 pt-3">
//                   <div className="flex justify-between text-lg font-semibold">
//                     <span>Total</span>
//                     <span>₹{(order.totalPrice || order.totalDiscountedPrice || 0).toLocaleString()}</span>
//                   </div>
//                 </div>
//               </div>

//               <div className="mt-6 pt-4 border-t border-gray-200">
//                 <h3 className="font-medium text-gray-900 mb-2">Payment Method</h3>
//                 <p className="text-gray-600">{order.paymentMethod || 'Cash on Delivery'}</p>
//                 <p className="text-sm text-green-600 mt-1">
//                   {order.paymentStatus === 'paid' ? 'Paid' : 'Payment on Delivery'}
//                 </p>
//               </div>
//             </div>

//             {/* Support */}
//             <div className="bg-white rounded-xl shadow-sm p-6">
//               <h2 className="text-xl font-semibold text-gray-900 mb-4">Need Help?</h2>
//               <div className="space-y-3">
//                 <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-colors duration-200">
//                   <span className="font-medium text-gray-900">Contact Support</span>
//                   <p className="text-sm text-gray-600 mt-1">Get help with this order</p>
//                 </button>
//                 {orderStatus.toLowerCase() === 'delivered' && (
//                   <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-colors duration-200">
//                     <span className="font-medium text-gray-900">Return Item</span>
//                     <p className="text-sm text-gray-600 mt-1">Start a return request</p>
//                   </button>
//                 )}
//                 {(orderStatus.toLowerCase() === 'pending' || orderStatus.toLowerCase() === 'confirmed') && (
//                   <button className="w-full text-left p-3 rounded-lg border border-red-200 hover:border-red-300 hover:bg-red-50 transition-colors duration-200">
//                     <span className="font-medium text-red-700">Cancel Order</span>
//                     <p className="text-sm text-red-600 mt-1">Cancel this order</p>
//                   </button>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Rating Modal */}
//       {showRatingModal && currentProduct && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-xl p-6 max-w-md w-full">
//             <h2 className="text-xl font-semibold text-gray-900 mb-4">
//               Rate {currentProduct.product?.title || 'Product'}
//             </h2>
            
//             {/* Star Rating */}
//             <div className="flex justify-center mb-4">
//               {[1, 2, 3, 4, 5].map((star) => (
//                 <button
//                   key={star}
//                   onClick={() => setRating(star)}
//                   className="text-3xl mx-1 transition-transform hover:scale-110"
//                 >
//                   {star <= rating ? (
//                     <span className="text-yellow-400">⭐</span>
//                   ) : (
//                     <span className="text-gray-300">☆</span>
//                   )}
//                 </button>
//               ))}
//             </div>

//             {/* Review Textarea */}
//             <textarea
//               value={review}
//               onChange={(e) => setReview(e.target.value)}
//               placeholder="Share your experience with this product..."
//               className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//               rows={4}
//             />

//             <div className="flex gap-3 mt-6">
//               <button
//                 onClick={() => setShowRatingModal(false)}
//                 className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleSubmitRating}
//                 disabled={rating === 0}
//                 className="flex-1 py-2 px-4 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
//               >
//                 Submit Review
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default OrderDetail;