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

// 'use client';
// import React, { useState } from 'react';
// import AddressCard from '../../components/checkout/AddressCard.jsx';

// const DeliveryAddressForm = ({ onNext, initialData }) => {
//   const [addressData, setAddressData] = useState(initialData);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setAddressData({
//       ...addressData,
//       [name]: value
//     });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     onNext(addressData);
//   };

//   return (
//     <div className="bg-white rounded-lg shadow-sm p-6">
//       <h2 className="text-xl font-semibold text-gray-900 mb-6">Delivery Address</h2>
      
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <input
//             type="text"
//             name="firstname"
//             value={addressData.firstname}
//             placeholder="First Name"
//             className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#4f39f6] focus:border-transparent"
//             onChange={handleChange}
//             required
//           />
//           <input
//             type="text"
//             name="lastname"
//             value={addressData.lastname}
//             placeholder="Last Name"
//             className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#4f39f6] focus:border-transparent"
//             onChange={handleChange}
//             required
//           />
//         </div>

//         <textarea
//           name="address"
//           value={addressData.address}
//           placeholder="Full Address"
//           rows={3}
//           className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#4f39f6] focus:border-transparent"
//           onChange={handleChange}
//           required
//         />

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           <input
//             type="text"
//             name="city"
//             value={addressData.city}
//             placeholder="City"
//             className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#4f39f6] focus:border-transparent"
//             onChange={handleChange}
//             required
//           />
//           <input
//             type="text"
//             name="state"
//             value={addressData.state}
//             placeholder="State"
//             className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#4f39f6] focus:border-transparent"
//             onChange={handleChange}
//             required
//           />
//           <input
//             type="text"
//             name="postalcode"
//             value={addressData.postalcode}
//             placeholder="Postal Code"
//             className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#4f39f6] focus:border-transparent"
//             onChange={handleChange}
//             required
//           />
//         </div>

//         <input
//           type="tel"
//           name="phonenumber"
//           value={addressData.phonenumber}
//           placeholder="Phone Number"
//           className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#4f39f6] focus:border-transparent"
//           onChange={handleChange}
//           required
//         />

//         <button 
//           type="submit" 
//           className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 mt-4 font-medium"
//         >
//           Save & Continue
//         </button>
//       </form>
//     </div>
//   );
// };

// export default DeliveryAddressForm;
// 'use client';
// import React, { useState } from 'react';
// import AddressCard from '../../components/checkout/AddressCard.jsx';

// const DeliveryAddressForm = ({ onNext }) => {
//   const [addressData, setAddressData] = useState({
//     firstname: "",
//     lastname: "",
//     address: "",
//     city: "",
//     state: "",
//     postalcode: "",
//     phonenumber: "",
//   });
//   const [getAddress, setGetAddress] = useState(false);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setAddressData({
//       ...addressData,
//       [name]: value
//     });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log(addressData);
//     setGetAddress(true);
//     onNext();
//   };

//   return (
//     <div className="flex flex-col lg:flex-row justify-between w-full border rounded-lg shadow-sm">
//       <div className="w-full lg:w-2/5 p-6 border-r">
//         <AddressCard getAddress={getAddress} addressData={addressData} />
//       </div>

//       <div className="w-full lg:w-3/5 p-6">
//         <h2 className="text-xl font-semibold mb-6">Delivery Address</h2>
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <input
//               type="text"
//               id="firstname"
//               name="firstname"
//               value={addressData.firstname}
//               placeholder="First Name"
//               className="px-4 py-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
//               onChange={handleChange}
//               required
//             />
//             <input
//               type="text"
//               id="lastname"
//               name="lastname"
//               value={addressData.lastname}
//               placeholder="Last Name"
//               className="px-4 py-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
//               onChange={handleChange}
//               required
//             />
//           </div>

//           <textarea
//             id="address"
//             name="address"
//             value={addressData.address}
//             placeholder="Address"
//             rows={3}
//             className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
//             onChange={handleChange}
//             required
//           />

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <input
//               type="text"
//               id="city"
//               name="city"
//               value={addressData.city}
//               placeholder="City"
//               className="px-4 py-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
//               onChange={handleChange}
//               required
//             />
//             <input
//               type="text"
//               id="state"
//               name="state"
//               value={addressData.state}
//               placeholder="State / Region"
//               className="px-4 py-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
//               onChange={handleChange}
//               required
//             />
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <input
//               type="text"
//               id="postalcode"
//               name="postalcode"
//               value={addressData.postalcode}
//               placeholder="Zip / Postal Code"
//               className="px-4 py-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
//               onChange={handleChange}
//               required
//             />
//             <input
//               type="number"
//               id="phonenumber"
//               name="phonenumber"
//               value={addressData.phonenumber}
//               placeholder="Phone Number"
//               className="px-4 py-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
//               onChange={handleChange}
//               required
//             />
//           </div>

//           <button 
//             type="submit" 
//             className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 mt-4"
//           >
//             Deliver Here
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default DeliveryAddressForm;