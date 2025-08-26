'use client';
import React from 'react';
import AddressCard from '../../components/checkout/AddressCard.jsx';

const OrderSummary = ({ onBack, addressData }) => {
  const cartItems = [1, 2, 3, 4, 5];

  return (
    <div className="space-y-6">
      {/* Delivery Address */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Delivery Address</h2>
          <button onClick={onBack} className="text-[#4f39f6]  text-sm font-medium">
            Change
          </button>
        </div>
        <AddressCard getAddress={true} addressData={addressData} />
      </div>

      {/* Order Items - Full View */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Order ({cartItems.length} items)</h2>
        <div className="space-y-4">
          {cartItems.map((item) => (
            <div key={item} className="flex items-center gap-4 p-4 border border-gray-100 rounded-md">
              <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center">
                <span className="text-gray-400">Item</span>
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">Product Name</h3>
                <p className="text-gray-600 text-sm">Size: M, Color: Black</p>
                <p className="text-[#4f39f6] font-medium mt-1">₹900</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Additional Order Details (optional) */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Details</h2>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Order Date</span>
            <span>March 15, 2024</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Estimated Delivery</span>
            <span>March 20, 2024</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Order ID</span>
            <span>#ORD-123456</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;

// 'use client';
// import React from 'react';
// import AddressCard from '../../components/checkout/AddressCard.jsx';

// const OrderSummary = ({ onBack, addressData }) => {
//   const cartItems = [1, 2, 3, 4, 5];

//   return (
//     <div className="space-y-6">
//       {/* Delivery Address */}
//       <div className="bg-white rounded-lg shadow-sm p-6">
//         <div className="flex items-center justify-between mb-4">
//           <h2 className="text-xl font-semibold text-gray-900">Delivery Address</h2>
//           <button onClick={onBack} className="text-[#4f39f6] hover:text-green-700 text-sm font-medium">
//             Change
//           </button>
//         </div>
//         <AddressCard getAddress={true} addressData={addressData} />
//       </div>

//       {/* Order Items */}
//       <div className="bg-white rounded-lg shadow-sm p-6">
//         <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Order ({cartItems.length} items)</h2>
//         <div className="space-y-4">
//           {cartItems.map((item) => (
//             <div key={item} className="flex items-center gap-4 p-4 border border-gray-100 rounded-md">
//               <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center">
//                 <span className="text-gray-400">Item</span>
//               </div>
//               <div className="flex-1">
//                 <h3 className="font-medium text-gray-900">Product Name</h3>
//                 <p className="text-gray-600 text-sm">Size: M, Color: Black</p>
//                 <p className="text-[#4f39f6] font-medium mt-1">₹900</p>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Price Details */}
//       <div className="bg-white rounded-lg shadow-sm p-6">
//         <h2 className="text-xl font-semibold text-gray-900 mb-4">Price Details</h2>
//         <div className="space-y-3">
//           <div className="flex justify-between">
//             <span className="text-gray-600">Price (3 items)</span>
//             <span>₹4,697</span>
//           </div>
//           <div className="flex justify-between">
//             <span className="text-gray-600">Discount</span>
//             <span className="text-[#4f39f6]">-₹4,697</span>
//           </div>
//           <div className="flex justify-between">
//             <span className="text-gray-600">Delivery Charges</span>
//             <span className="text-[#4f39f6]">FREE</span>
//           </div>
//           <div className="border-t border-gray-200 pt-3">
//             <div className="flex justify-between font-semibold text-lg">
//               <span>Total Amount</span>
//               <span>₹0</span>
//             </div>
//           </div>
//         </div>

//         <div className="mt-6 flex space-x-4">
//           <button
//             onClick={onBack}
//             className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 font-medium"
//           >
//             Back
//           </button>
//           <button
//             className="flex-1 bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 font-medium"
//           >
//             Check Out
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default OrderSummary;
// 'use client';
// import React from 'react';
// import AddressCard from '../../components/checkout/AddressCard.jsx';
// import CartItem from '../cart/CartItem.jsx'

// const OrderSummary = ({ onBack }) => {
//   return (
//     <div className="space-y-8">
//       <div className="bg-white rounded-lg shadow-sm p-6">
//         <h2 className="text-xl font-semibold mb-4">Delivery Address</h2>
//         <AddressCard getAddress={true} addressData={{
//           firstname: "John",
//           lastname: "Doe",
//           address: "123 Main St",
//           city: "New York",
//           state: "NY",
//           postalcode: "10001",
//           phonenumber: "555-123-4567"
//         }} />
//       </div>

//       <div className="bg-white rounded-lg shadow-sm p-6">
//         <h2 className="text-xl font-semibold mb-4">Your Order</h2>
//         <div className="space-y-4">
//           {[1, 2, 3, 4, 5].map((item) => (
//             <CartItem key={item} />
//           ))}
//         </div>
//       </div>

//       <div className="bg-white rounded-lg shadow-sm p-6">
//         <h2 className="text-xl font-semibold mb-4">Price Details</h2>
//         <div className="space-y-3">
//           <div className="flex justify-between">
//             <span className="text-gray-600">Price (3 items)</span>
//             <span>₹4,697</span>
//           </div>
//           <div className="flex justify-between">
//             <span className="text-gray-600">Discount</span>
//             <span className="text-[#4f39f6]">-₹4,697</span>
//           </div>
//           <div className="flex justify-between">
//             <span className="text-gray-600">Delivery Charges</span>
//             <span className="text-[#4f39f6]">FREE</span>
//           </div>
//           <div className="border-t border-gray-200 pt-3 mt-3">
//             <div className="flex justify-between font-semibold text-lg">
//               <span>Total Amount</span>
//               <span>₹0</span>
//             </div>
//           </div>
//         </div>

//         <div className="mt-6 flex space-x-4">
//           <button
//             onClick={onBack}
//             className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300"
//           >
//             Back
//           </button>
//           <button
//             className="flex-1 bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800"
//           >
//             Check Out
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default OrderSummary;