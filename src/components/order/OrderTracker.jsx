import React from 'react';

const OrderTracker = ({ activeStep = 0 }) => {
  const steps = [
    { label: "Placed", icon: "📋" },
    { label: "Order Confirmed", icon: "✅" },
    { label: "Shipped", icon: "📦" },
    { label: "Out For Delivery", icon: "🚚" },
    { label: "Delivered", icon: "🏠" }
  ];

  return (
    <div className="w-full py-4">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            {/* Step */}
            <div className="flex flex-col items-center flex-1">
              {/* Icon Circle */}
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center text-xl mb-2 transition-all duration-300 ${
                  index <= activeStep
                    ? 'bg-indigo-600 text-white shadow-lg'
                    : 'bg-gray-200 text-gray-400'
                }`}
              >
                {index < activeStep ? (
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <span>{step.icon}</span>
                )}
              </div>

              {/* Label */}
              <div className="text-center">
                <p
                  className={`text-sm font-medium ${
                    index <= activeStep ? 'text-indigo-600' : 'text-gray-500'
                  }`}
                >
                  {step.label}
                </p>
              </div>
            </div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div className="flex-1 h-1 mx-2 mb-8">
                <div
                  className={`h-full rounded transition-all duration-300 ${
                    index < activeStep ? 'bg-indigo-600' : 'bg-gray-200'
                  }`}
                />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default OrderTracker;// 'use client';
// import React from 'react';

// const OrderTracker = ({ activeStep }) => {
//   const steps = [
//     { label: "Placed", icon: "📦" },
//     { label: "Order Confirmed", icon: "✅" },
//     { label: "Shipped", icon: "🚚" },
//     { label: "Out For Delivery", icon: "📦" },
//     { label: "Delivered", icon: "🎉" }
//   ];

//   return (
//     <div className="w-full">
//       {/* Stepper */}
//       <div className="flex justify-between relative mb-8">
//         {/* Progress line */}
//         <div className="absolute top-5 left-0 right-0 h-1.5 bg-gray-200 -z-0">
//           <div 
//             className="h-full bg-indigo-600 transition-all duration-500 ease-in-out" 
//             style={{ width: `${(activeStep / (steps.length - 1)) * 100}%` }}
//           ></div>
//         </div>

//         {/* Steps */}
//         {steps.map((step, index) => (
//           <div key={step.label} className="flex flex-col items-center z-10">
//             <div
//               className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
//                 index <= activeStep 
//                   ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' 
//                   : 'bg-gray-100 text-gray-400'
//               }`}
//             >
//               <span className="text-lg">{step.icon}</span>
//             </div>
//             <span className={`mt-3 text-xs font-medium text-center max-w-20 ${
//               index <= activeStep ? 'text-indigo-600' : 'text-gray-500'
//             }`}>
//               {step.label}
//             </span>
//             {index <= activeStep && (
//               <div className="absolute -bottom-8">
//                 <span className="text-xs text-indigo-600 font-medium">
//                   {index === activeStep && 'Current'}
//                 </span>
//               </div>
//             )}
//           </div>
//         ))}
//       </div>

//       {/* Status Description */}
//       {activeStep < steps.length - 1 && (
//         <div className="text-center p-4 bg-indigo-50 rounded-lg border border-indigo-100">
//           <p className="text-indigo-700 font-medium">
//             {activeStep === 0 && 'Your order has been placed and is being processed.'}
//             {activeStep === 1 && 'Your order has been confirmed and is being prepared for shipment.'}
//             {activeStep === 2 && 'Your order has been shipped and is on its way.'}
//             {activeStep === 3 && 'Your order is out for delivery today!'}
//           </p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default OrderTracker;// 'use client';
