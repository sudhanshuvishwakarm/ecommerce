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
