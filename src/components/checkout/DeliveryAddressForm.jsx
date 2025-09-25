'use client';
import React, { useState } from 'react';
import AddressCard from '../../components/checkout/AddressCard.jsx';

const DeliveryAddressForm = ({ onNext, initialData }) => {
  const [addressData, setAddressData] = useState(initialData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddressData({
      ...addressData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext(addressData);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Delivery Address</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="firstname"
            value={addressData.firstname}
            placeholder="First Name"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#4f39f6] focus:border-transparent"
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="lastname"
            value={addressData.lastname}
            placeholder="Last Name"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#4f39f6] focus:border-transparent"
            onChange={handleChange}
            required
          />
        </div>

        <textarea
          name="address"
          value={addressData.address}
          placeholder="Full Address"
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#4f39f6] focus:border-transparent"
          onChange={handleChange}
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            name="city"
            value={addressData.city}
            placeholder="City"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#4f39f6] focus:border-transparent"
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="state"
            value={addressData.state}
            placeholder="State"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#4f39f6] focus:border-transparent"
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="postalcode"
            value={addressData.postalcode}
            placeholder="Postal Code"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#4f39f6] focus:border-transparent"
            onChange={handleChange}
            required
          />
        </div>

        <input
          type="tel"
          name="phonenumber"
          value={addressData.phonenumber}
          placeholder="Phone Number"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#4f39f6] focus:border-transparent"
          onChange={handleChange}
          required
        />

        <button 
          type="submit" 
          className="w-full bg-[#4f39f6] text-white py-3 px-4 rounded-md  mt-4 font-medium"
        >
          Save & Continue
        </button>
      </form>
    </div>
  );
};

export default DeliveryAddressForm;
