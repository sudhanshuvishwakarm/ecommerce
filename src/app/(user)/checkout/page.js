'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-toastify';
import DeliveryAddressForm from '../../../components/checkout/DeliveryAddressForm.jsx';
import OrderSummary from '../../../components/checkout/OrderSummary.jsx';

const steps = [
  { label: 'Login', number: 1 },
  { label: 'Delivery Address', number: 2 },
  { label: 'Order Summary', number: 3 },
  { label: 'Payment', number: 4 }
];

export default function Checkout() {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [userAddress, setUserAddress] = useState(null);
  const [addressData, setAddressData] = useState({
    firstName: "",
    lastName: "",
    streetAddress: "",
    city: "",
    state: "",
    zipCode: "",
    mobile: ""
  });

  useEffect(() => {
    checkAuthAndFetchAddress();
  }, []);

  const checkAuthAndFetchAddress = async () => {
    try {
      const response = await axios.get('/api/address');
      if (response.data.address) {
        setUserAddress(response.data.address);
        setAddressData({
          firstName: response.data.address.firstName || "",
          lastName: response.data.address.lastName || "",
          streetAddress: response.data.address.streetAddress || "",
          city: response.data.address.city || "",
          state: response.data.address.state || "",
          zipCode: response.data.address.zipCode || "",
          mobile: response.data.address.mobile || ""
        });
        // If address exists, move to order summary
        setActiveStep(2);
      }
      setLoading(false);
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error("Please login first");
        router.push('/auth/login');
      } else {
        console.error("Error fetching address:", error);
        setLoading(false);
      }
    }
  };

  const handleAddressSubmit = async (data) => {
    try {
      setLoading(true);
      const response = await axios.post('/api/address', data);
      
      if (response.data.address) {
        setUserAddress(response.data.address);
        setAddressData(data);
        setActiveStep(2);
        toast.success(response.data.message);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error("Please login first");
        router.push('/auth/login');
      } else {
        toast.error(error.response?.data?.error || "Failed to save address");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddressUpdate = async (data) => {
    try {
      setLoading(true);
      const response = await axios.post('/api/address', data);
      
      if (response.data.address) {
        setUserAddress(response.data.address);
        setAddressData(data);
        toast.success(response.data.message);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error("Please login first");
        router.push('/auth/login');
      } else {
        toast.error(error.response?.data?.error || "Failed to update address");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddressDelete = async () => {
    try {
      setLoading(true);
      const response = await axios.delete('/api/address');
      
      setUserAddress(null);
      setAddressData({
        firstName: "",
        lastName: "",
        streetAddress: "",
        city: "",
        state: "",
        zipCode: "",
        mobile: ""
      });
      setActiveStep(1);
      toast.success("Address deleted successfully");
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error("Please login first");
        router.push('/auth/login');
      } else {
        toast.error(error.response?.data?.error || "Failed to delete address");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setActiveStep(1);
  };

  const handleEditAddress = () => {
    setActiveStep(1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4f39f6] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          <p className="text-gray-600 mt-2">Complete your purchase</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex justify-between relative">
            <div className="absolute top-4 left-0 right-0 h-1 bg-gray-200 -z-0">
              <div 
                className="h-full bg-[#4f39f6] transition-all duration-300" 
                style={{ width: `${(activeStep / (steps.length - 1)) * 100}%` }}
              ></div>
            </div>

            {steps.map((step, index) => (
              <div key={step.label} className="flex flex-col items-center z-10">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center 
                    ${index <= activeStep ? 'bg-[#4f39f6] text-white' : 'bg-gray-200 text-gray-600'}
                    font-medium text-sm`}
                >
                  {step.number}
                </div>
                <span className={`mt-2 text-xs font-medium ${index <= activeStep ? 'text-[#4f39f6]' : 'text-gray-500'}`}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3">
            {activeStep === 1 ? (
              <DeliveryAddressForm 
                onNext={handleAddressSubmit} 
                initialData={addressData}
                isUpdate={!!userAddress}
                onUpdate={handleAddressUpdate}
                loading={loading}
              />
            ) : activeStep === 2 ? (
              <OrderSummary 
                onBack={handleBack} 
                addressData={addressData}
                userAddress={userAddress}
                onEditAddress={handleEditAddress}
                onDeleteAddress={handleAddressDelete}
                loading={loading}
              />
            ) : null}
          </div>

          <div className="lg:w-1/3">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
              
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Items (3)</span>
                  <span>₹4,697</span>
                </div>
                
                <div className="space-y-2 mt-3 max-h-40 overflow-y-auto">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="flex items-center gap-2 text-sm">
                      <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center">
                        <span className="text-xs text-gray-500">{item}</span>
                      </div>
                      <div className="flex-1 truncate">
                        <p className="truncate">Product Name {item}</p>
                      </div>
                      <span className="text-[#4f39f6] font-medium">₹900</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2 border-t border-gray-200 pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Discount</span>
                  <span className="text-[#4f39f6]">-₹4,697</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Delivery</span>
                  <span className="text-[#4f39f6]">FREE</span>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-4 mt-4">
                <div className="flex justify-between font-semibold">
                  <span>Total Amount</span>
                  <span>₹0</span>
                </div>
              </div>

              <button
                className="w-full bg-[#4f39f6] text-white py-3 px-4 rounded-md hover:bg-[#3d2ed4] disabled:opacity-50 disabled:cursor-not-allowed mt-6 font-medium transition-colors"
                disabled={activeStep < 2}
              >
                Proceed to Payment
              </button>

              <div className="mt-4 p-3 bg-green-50 rounded-lg">
                <p className="text-xs text-[#4f39f6] text-center">
                  You saved ₹4,697 on this order!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
// 'use client';
// import React, { useState } from 'react';
// import DeliveryAddressForm from '../../../components/checkout/DeliveryAddressForm.jsx';
// import OrderSummary from '../../../components/checkout/OrderSummary.jsx';
// import { toast } from 'react-toastify';
// const steps = [
//   { label: 'Login', number: 1 },
//   { label: 'Delivery Address', number: 2 },
//   { label: 'Order Summary', number: 3 },
//   { label: 'Payment', number: 4 }
// ];

// export default function Checkout() {
//   const [activeStep, setActiveStep] = useState(1);
//   const [addressData, setAddressData] = useState({
//     firstname: "",
//     lastname: "",
//     address: "",
//     city: "",
//     state: "",
//     postalcode: "",
//     phonenumber: ""
//   });

//   const handleAddressSubmit = (data) => {
//     setAddressData(data);
//     setActiveStep(2);
//   };

//   const handleBack = () => {
//     setActiveStep(1);
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="container mx-auto px-4 max-w-6xl">
//         <div className="text-center mb-8">
//           <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
//           <p className="text-gray-600 mt-2">Complete your purchase</p>
//         </div>

//         <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
//           <div className="flex justify-between relative">
//             <div className="absolute top-4 left-0 right-0 h-1 bg-gray-200 -z-0">
//               <div 
//                 className="h-full bg-[#4f39f6] transition-all duration-300" 
//                 style={{ width: `${(activeStep / (steps.length - 1)) * 100}%` }}
//               ></div>
//             </div>

//             {steps.map((step, index) => (
//               <div key={step.label} className="flex flex-col items-center z-10">
//                 <div
//                   className={`w-8 h-8 rounded-full flex items-center justify-center 
//                     ${index <= activeStep ? 'bg-[#4f39f6] text-white' : 'bg-gray-200 text-gray-600'}
//                     font-medium text-sm`}
//                 >
//                   {step.number}
//                 </div>
//                 <span className={`mt-2 text-xs font-medium ${index <= activeStep ? 'text-[#4f39f6]' : 'text-gray-500'}`}>
//                   {step.label}
//                 </span>
//               </div>
//             ))}
//           </div>
//         </div>

//         <div className="flex flex-col lg:flex-row gap-8">
//           <div className="lg:w-2/3">
//             {activeStep === 1 ? (
//               <DeliveryAddressForm 
//                 onNext={handleAddressSubmit} 
//                 initialData={addressData}
//               />
//             ) : activeStep === 2 ? (
//               <OrderSummary 
//                 onBack={handleBack} 
//                 addressData={addressData}
//               />
//             ) : null}
//           </div>

//           <div className="lg:w-1/3">
//             <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
//               <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
              
//               <div className="mb-4">
//                 <div className="flex justify-between text-sm mb-2">
//                   <span className="text-gray-600">Items (3)</span>
//                   <span>₹4,697</span>
//                 </div>
                
//                 <div className="space-y-2 mt-3 max-h-40 overflow-y-auto">
//                   {[1, 2, 3].map((item) => (
//                     <div key={item} className="flex items-center gap-2 text-sm">
//                       <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center">
//                         <span className="text-xs text-gray-500">{item}</span>
//                       </div>
//                       <div className="flex-1 truncate">
//                         <p className="truncate">Product Name {item}</p>
//                       </div>
//                       <span className="text-[#4f39f6] font-medium">₹900</span>
//                     </div>
//                   ))}
//                 </div>
//               </div>
              
//               <div className="space-y-2 border-t border-gray-200 pt-4">
//                 <div className="flex justify-between text-sm">
//                   <span className="text-gray-600">Discount</span>
//                   <span className="text-[#4f39f6]">-₹4,697</span>
//                 </div>
//                 <div className="flex justify-between text-sm">
//                   <span className="text-gray-600">Delivery</span>
//                   <span className="text-[#4f39f6]">FREE</span>
//                 </div>
//               </div>
              
//               <div className="border-t border-gray-200 pt-4 mt-4">
//                 <div className="flex justify-between font-semibold">
//                   <span>Total Amount</span>
//                   <span>₹0</span>
//                 </div>
//               </div>

//               <button
//                 className="w-full bg-[#4f39f6] text-white py-3 px-4 rounded-md hover:bg-[#4f39f6] mt-6 font-medium"
//               >
//                 Proceed to Payment
//               </button>

//               <div className="mt-4 p-3 bg-green-50 rounded-lg">
//                 <p className="text-xs text-[#4f39f6] text-center">
//                   You saved ₹4,697 on this order!
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
