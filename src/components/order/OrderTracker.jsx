import React from 'react';

const OrderTracker = ({ activeStep = 0, orderStatus }) => {
  const steps = [
    { label: "Placed", icon: "📋" },
    { label: "Order Confirmed", icon: "✅" },
    { label: "Shipped", icon: "📦" },
    { label: "Out For Delivery", icon: "🚚" },
    { label: "Delivered", icon: "🏠" }
  ];

  // Map order status to step index
  const getActiveStepFromStatus = (status) => {
    const statusMap = {
      'PLACED': 0,
      'ORDER_CONFIRMED': 1,
      'SHIPPED': 2,
      'OUT_FOR_DELIVERY': 3,
      'DELIVERED': 4
    };
    
    const normalizedStatus = status?.toUpperCase().replace(/\s+/g, '_');
    return statusMap[normalizedStatus] !== undefined ? statusMap[normalizedStatus] : activeStep;
  };

  const currentStep = orderStatus ? getActiveStepFromStatus(orderStatus) : activeStep;

  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            {/* Step */}
            <div className="flex flex-col items-center flex-1 relative">
              {/* Icon Circle */}
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-lg mb-3 transition-all duration-300 ${
                  index <= currentStep
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-200 text-gray-400'
                }`}
              >
                {index < currentStep ? (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <span className="text-sm">{step.icon}</span>
                )}
              </div>

              {/* Label */}
              <div className="text-center">
                <p
                  className={`text-xs font-medium ${
                    index <= currentStep ? 'text-blue-600' : 'text-gray-500'
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
                    index < currentStep ? 'bg-blue-600' : 'bg-gray-200'
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

export default OrderTracker;