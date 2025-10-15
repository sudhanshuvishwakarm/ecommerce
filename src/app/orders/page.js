'use client';
import React, { useState, useEffect } from 'react';
import OrderCard from '../../components/order/OrderCard.jsx';

import Loading from '../../components/loader/Loading.jsx';
import { toast } from 'react-toastify';
import { fetchOrders, clearError } from '../../redux/slices/orderSlice.js';
import { useDispatch,useSelector } from 'react-redux';

const Order = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recent');

  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector(state => state.orders);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error.message || "Failed to load orders");
      dispatch(clearError());
    }
  }, [error, dispatch]);

  // Calculate order counts by status
  const getOrderCounts = () => {
    const counts = {
      all: orders.length,
      ontheway: 0,
      delivered: 0,
      cancelled: 0,
      returned: 0,
      pending: 0,
      confirmed: 0,
      shipped: 0
    };

    orders.forEach(order => {
      const status = order.orderStatus?.toLowerCase() || 'pending';
      if (counts.hasOwnProperty(status)) {
        counts[status]++;
      }
    });

    return counts;
  };

  const orderCounts = getOrderCounts();

  const orderStatus = [
    { id: "all", value: "All Orders", count: orderCounts.all },
    { id: "pending", value: "Pending", count: orderCounts.pending },
    { id: "confirmed", value: "Confirmed", count: orderCounts.confirmed },
    { id: "shipped", value: "Shipped", count: orderCounts.shipped },
    { id: "ontheway", value: "On The Way", count: orderCounts.ontheway },
    { id: "delivered", value: "Delivered", count: orderCounts.delivered },
    { id: "cancelled", value: "Cancelled", count: orderCounts.cancelled },
    { id: "returned", value: "Returned", count: orderCounts.returned }
  ];

  // Filter orders based on active filter
  const filteredOrders = activeFilter === 'all' 
    ? orders 
    : orders.filter(order => order.orderStatus?.toLowerCase() === activeFilter);

  // Sort orders
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return new Date(b.createdAt) - new Date(a.createdAt);
      case 'oldest':
        return new Date(a.createdAt) - new Date(b.createdAt);
      case 'price-low':
        return a.totalPrice - b.totalPrice;
      case 'price-high':
        return b.totalPrice - a.totalPrice;
      default:
        return 0;
    }
  });

  if (loading && orders.length === 0) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Your Orders</h1>
          <p className="text-gray-600 mt-2">Track, return, or buy things again</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Order Filter */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Filter Orders</h2>
              
              <div className="space-y-1">
                {orderStatus.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveFilter(item.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
                      activeFilter === item.id
                        ? 'bg-indigo-50 text-indigo-700 font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span>{item.value}</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      activeFilter === item.id
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {item.count}
                    </span>
                  </button>
                ))}
              </div>

              {/* Additional Filters */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="font-medium text-gray-900 mb-4">Time Period</h3>
                <div className="space-y-2">
                  {['Last 30 days', 'Past 3 months', '2024', '2023'].map((period) => (
                    <button
                      key={period}
                      className="w-full text-left p-2 text-gray-600 hover:text-indigo-600 transition-colors duration-200"
                    >
                      {period}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Order Cards */}
          <div className="lg:w-3/4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
              <h2 className="text-xl font-semibold text-gray-900">
                {activeFilter === 'all' ? 'All Orders' : orderStatus.find(s => s.id === activeFilter)?.value}
                <span className="text-gray-500 font-normal ml-2">({sortedOrders.length} orders)</span>
              </h2>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Sort by:</span>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="recent">Recent orders</option>
                  <option value="oldest">Order date (oldest first)</option>
                  <option value="price-low">Price (low to high)</option>
                  <option value="price-high">Price (high to low)</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              {loading && orders.length > 0 && (
                <div className="text-center py-4">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
              )}
              
              {sortedOrders.map((order) => (
                <OrderCard key={order._id} order={order} />
              ))}
            </div>

            {sortedOrders.length === 0 && !loading && (
              <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                <div className="w-24 h-24 mx-auto mb-4 text-gray-300">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-16" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
                <p className="text-gray-600 mb-4">
                  {activeFilter === 'all' 
                    ? "You haven't placed any orders yet." 
                    : `No ${orderStatus.find(s => s.id === activeFilter)?.value.toLowerCase()} orders found.`
                  }
                </p>
                {activeFilter !== 'all' && (
                  <button
                    onClick={() => setActiveFilter('all')}
                    className="text-indigo-600 hover:text-indigo-700 font-medium"
                  >
                    View all orders
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Order;
// 'use client';
// import React, { useState } from 'react';
// import OrderCard from '../../components/order/OrderCard.jsx';
// // import { useSelector, useDispatch } from 'react-redux';
// // import Loading from '../../components/loader/Loading.jsx';
// // import { toast } from 'react-toastify';
// const Order = () => {
//   const [selectedStatus, setSelectedStatus] = useState([]);
//   const [activeFilter, setActiveFilter] = useState('all');
//   // const [order, setOrder] = ([])

// //   const dispatch  = useDispatch()
// //   const { orders, loading, error } = useSelector(state => state.orders);
// // useEffect(() => {
// //         dispatch(fetchOrders());
// //     }, [dispatch]);
//   const orderStatus = [
//     { id: "all", value: "All Orders", count: 12 },
//     { id: "ontheway", value: "On The Way", count: 3 },
//     { id: "delivered", value: "Delivered", count: 7 },
//     { id: "cancelled", value: "Cancelled", count: 1 },
//     { id: "returned", value: "Returned", count: 1 }
//   ];

//   const orders = [
//     {
//       id: 1,
//       products: [
//         {
//           id: 101,
//           name: "Men Slim Mid Black Jeans",
//           image: "https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
//           size: "M",
//           quantity: 1,
//           price: 900
//         }
//       ],
//       total: 900,
//       status: "ontheway",
//       orderDate: "2024-03-15",
//       expectedDelivery: "2024-03-23",
//       orderId: "ORD-12345"
//     },
//     {
//       id: 2,
//       products: [
//         {
//           id: 201,
//           name: "Premium Cotton T-Shirt Pack",
//           image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
//           size: "L",
//           quantity: 2,
//           price: 1499
//         },
//         {
//           id: 202,
//           name: "Casual Sneakers",
//           image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
//           size: "42",
//           quantity: 1,
//           price: 2499
//         }
//       ],
//       total: 5497,
//       status: "delivered",
//       orderDate: "2024-03-10",
//       deliveryDate: "2024-03-14",
//       orderId: "ORD-12346"
//     },
//     {
//       id: 3,
//       products: [
//         {
//           id: 301,
//           name: "Wireless Headphones",
//           image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
//           color: "Black",
//           quantity: 1,
//           price: 3999
//         }
//       ],
//       total: 3999,
//       status: "cancelled",
//       orderDate: "2024-03-05",
//       cancellationDate: "2024-03-06",
//       orderId: "ORD-12347"
//     },
//     {
//       id: 4,
//       products: [
//         {
//           id: 401,
//           name: "Smart Watch Series 5",
//           image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
//           color: "Silver",
//           quantity: 1,
//           price: 12999
//         }
//       ],
//       total: 12999,
//       status: "returned",
//       orderDate: "2024-02-28",
//       returnDate: "2024-03-10",
//       orderId: "ORD-12348"
//     }
//   ];

//   const filteredOrders = activeFilter === 'all' 
//     ? orders 
//     : orders.filter(order => order.status === activeFilter);

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       {/* <Loading/> */}
//       <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
//         {/* Header */}
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-gray-900">Your Orders</h1>
//           <p className="text-gray-600 mt-2">Track, return, or buy things again</p>
//         </div>

//         <div className="flex flex-col lg:flex-row gap-6">
//           {/* Order Filter */}
//           <div className="lg:w-1/4">
//             <div className="bg-white rounded-xl shadow-sm p-6 sticky top-6">
//               <h2 className="text-lg font-semibold text-gray-900 mb-6">Filter Orders</h2>
              
//               <div className="space-y-1">
//                 {orderStatus.map((item) => (
//                   <button
//                     key={item.id}
//                     onClick={() => setActiveFilter(item.id)}
//                     className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
//                       activeFilter === item.id
//                         ? 'bg-indigo-50 text-indigo-700 font-medium'
//                         : 'text-gray-700 hover:bg-gray-50'
//                     }`}
//                   >
//                     <span>{item.value}</span>
//                     <span className={`px-2 py-1 rounded-full text-xs ${
//                       activeFilter === item.id
//                         ? 'bg-indigo-100 text-indigo-700'
//                         : 'bg-gray-100 text-gray-600'
//                     }`}>
//                       {item.count}
//                     </span>
//                   </button>
//                 ))}
//               </div>

//               {/* Additional Filters */}
//               <div className="mt-8 pt-6 border-t border-gray-200">
//                 <h3 className="font-medium text-gray-900 mb-4">Time Period</h3>
//                 <div className="space-y-2">
//                   {['Last 30 days', 'Past 3 months', '2024', '2023'].map((period) => (
//                     <button
//                       key={period}
//                       className="w-full text-left p-2 text-gray-600 hover:text-indigo-600 transition-colors duration-200"
//                     >
//                       {period}
//                     </button>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Order Cards */}
//           <div className="lg:w-3/4">
//             <div className="flex items-center justify-between mb-6">
//               <h2 className="text-xl font-semibold text-gray-900">
//                 {activeFilter === 'all' ? 'All Orders' : orderStatus.find(s => s.id === activeFilter)?.value}
//                 <span className="text-gray-500 font-normal ml-2">({filteredOrders.length} orders)</span>
//               </h2>
              
//               <div className="flex items-center gap-2">
//                 <span className="text-sm text-gray-600">Sort by:</span>
//                 <select className="text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500">
//                   <option>Recent orders</option>
//                   <option>Order date (oldest first)</option>
//                   <option>Price (low to high)</option>
//                   <option>Price (high to low)</option>
//                 </select>
//               </div>
//             </div>

//             <div className="space-y-4">
//               {filteredOrders.map((order) => (
//                 <OrderCard key={order.id} order={order} />
//               ))}
//             </div>

//             {filteredOrders.length === 0 && (
//               <div className="text-center py-12 bg-white rounded-xl shadow-sm">
//                 <div className="w-24 h-24 mx-auto mb-4 text-gray-300">
//                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-16" />
//                   </svg>
//                 </div>
//                 <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
//                 <p className="text-gray-600 mb-4"></p>
//                 <button
//                   onClick={() => setActiveFilter('all')}
//                   className="text-indigo-600 hover:text-indigo-700 font-medium"
//                 >
//                   View all orders
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Order;
