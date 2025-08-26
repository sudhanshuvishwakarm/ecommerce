'use client';
import React, { useState } from 'react';
import DeliveryAddressForm from '../../../components/checkout/DeliveryAddressForm.jsx';
import OrderSummary from '../../../components/checkout/OrderSummary.jsx';

const steps = [
  { label: 'Login', number: 1 },
  { label: 'Delivery Address', number: 2 },
  { label: 'Order Summary', number: 3 },
  { label: 'Payment', number: 4 }
];

export default function Checkout() {
  const [activeStep, setActiveStep] = useState(2);
  const [addressData, setAddressData] = useState({
    firstname: "John",
    lastname: "Doe",
    address: "123 Main St",
    city: "New York",
    state: "NY",
    postalcode: "10001",
    phonenumber: "555-123-4567"
  });

  const handleAddressSubmit = (data) => {
    setAddressData(data);
    setActiveStep(2);
  };

  const handleBack = () => {
    setActiveStep(1);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          <p className="text-gray-600 mt-2">Complete your purchase</p>
        </div>

        {/* Stepper */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex justify-between relative">
            {/* Progress line */}
            <div className="absolute top-4 left-0 right-0 h-1 bg-gray-200 -z-0">
              <div 
                className="h-full bg-[#4f39f6] transition-all duration-300" 
                style={{ width: `${(activeStep / (steps.length - 1)) * 100}%` }}
              ></div>
            </div>

            {/* Steps */}
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

        {/* Content */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content - Left Side */}
          <div className="lg:w-2/3">
            {activeStep === 1 ? (
              <DeliveryAddressForm 
                onNext={handleAddressSubmit} 
                initialData={addressData}
              />
            ) : activeStep === 2 ? (
              <OrderSummary 
                onBack={handleBack} 
                addressData={addressData}
              />
            ) : null}
          </div>

          {/* Order Summary Sidebar - Right Side */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
              
              {/* Order Items Mini View */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Items (3)</span>
                  <span>₹4,697</span>
                </div>
                
                {/* Mini product list */}
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

              {/* Checkout Button - Always Visible */}
              <button
                className="w-full bg-[#4f39f6] text-white py-3 px-4 rounded-md hover:bg-[#4f39f6] mt-6 font-medium"
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

// const steps = [
//   { label: 'Login', number: 1 },
//   { label: 'Delivery Address', number: 2 },
//   { label: 'Order Summary', number: 3 },
//   { label: 'Payment', number: 4 }
// ];

// export default function Checkout() {
//   const [activeStep, setActiveStep] = useState(2);
//   const [addressData, setAddressData] = useState({
//     firstname: "John",
//     lastname: "Doe",
//     address: "123 Main St",
//     city: "New York",
//     state: "NY",
//     postalcode: "10001",
//     phonenumber: "555-123-4567"
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
//       <div className="container mx-auto px-4 max-w-7xl">
//         {/* Header */}
//         <div className="text-center mb-8">
//           <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
//           <p className="text-gray-600 mt-2">Complete your purchase</p>
//         </div>

//         {/* Stepper */}
//         <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
//           <div className="flex justify-between relative">
//             {/* Progress line */}
//             <div className="absolute top-4 left-0 right-0 h-1 bg-gray-200 -z-0">
//               <div 
//                 className="h-full bg-[#4f39f6] transition-all duration-300" 
//                 style={{ width: `${(activeStep / (steps.length - 1)) * 100}%` }}
//               ></div>
//             </div>

//             {/* Steps */}
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

//         {/* Content */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Main Content */}
//           <div className="lg:col-span-2">
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

//           {/* Order Summary Sidebar */}
//           <div className="lg:col-span-1">
//             <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
//               <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
              
//               <div className="space-y-3 mb-4">
//                 <div className="flex justify-between text-sm">
//                   <span className="text-gray-600">Subtotal (3 items)</span>
//                   <span>₹4,697</span>
//                 </div>
//                 <div className="flex justify-between text-sm">
//                   <span className="text-gray-600">Discount</span>
//                   <span className="text-green-600">-₹4,697</span>
//                 </div>
//                 <div className="flex justify-between text-sm">
//                   <span className="text-gray-600">Delivery</span>
//                   <span className="text-green-600">FREE</span>
//                 </div>
//               </div>
              
//               <div className="border-t border-gray-200 pt-4">
//                 <div className="flex justify-between font-semibold">
//                   <span>Total</span>
//                   <span>₹0</span>
//                 </div>
//               </div>

//               <div className="mt-6 p-3 bg-blue-50 rounded-lg">
//                 <p className="text-xs text-blue-600 text-center">
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

// 'use client';
// import React, { useState } from 'react';
// import DeliveryAddressForm from '../../../components/checkout/DeliveryAddressForm.jsx';
// import OrderSummary from '../../../components/checkout/OrderSummary.jsx';

// const steps = ['Login', 'Delivery Address', 'Order Summary', 'Payment'];

// export default function Checkout() {
//   const [activeStep, setActiveStep] = useState(2);

//   return (
//     <div className="w-full px-0 md:px-20 py-8">
//       {/* Stepper */}
//       <div className="flex justify-between my-8 relative">
//         {steps.map((label, index) => (
//           <div key={label} className="flex flex-col items-center z-10">
//             <div
//               className={`w-10 h-10 rounded-full flex items-center justify-center 
//                 ${index <= activeStep ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'}
//                 font-medium`}
//             >
//               {index + 1}
//             </div>
//             <span className={`mt-2 text-sm ${index <= activeStep ? 'text-indigo-600 font-medium' : 'text-gray-500'}`}>
//               {label}
//             </span>
//           </div>
//         ))}
//         {/* Progress line */}
//         <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 -z-0">
//           <div 
//             className="h-full bg-indigo-600 transition-all duration-300" 
//             style={{ width: `${(activeStep / (steps.length - 1)) * 100}%` }}
//           ></div>
//         </div>
//       </div>

//       {/* Content */}
//       {activeStep === steps.length ? (
//         <div className="mt-8 mb-4 text-center">
//           <h3 className="text-xl font-medium">All steps completed - you're finished</h3>
//         </div>
//       ) : (
//         <div className="mt-8">
//           {activeStep === 1 ? (
//             <DeliveryAddressForm onNext={() => setActiveStep(2)} />
//           ) : (
//             <OrderSummary onBack={() => setActiveStep(1)} />
//           )}
//         </div>
//       )}
//     </div>
//   );
// }