'use client';
import { useRouter } from 'next/navigation';

const OrderCard = ({ order }) => {
  const router = useRouter();

  const handleOrderDetail = () => {
    router.push(`/orders/${order.orderId}`);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ontheway':
        return 'text-blue-600 bg-blue-50';
      case 'delivered':
        return 'text-green-600 bg-green-50';
      case 'cancelled':
        return 'text-red-600 bg-red-50';
      case 'returned':
        return 'text-amber-600 bg-amber-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'ontheway':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'delivered':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'cancelled':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      case 'returned':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        );
      default:
        return null;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'ontheway':
        return 'On the way';
      case 'delivered':
        return 'Delivered';
      case 'cancelled':
        return 'Cancelled';
      case 'returned':
        return 'Returned';
      default:
        return 'Processing';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md border border-gray-100">
      {/* Order Header */}
      <div className="p-4 md:p-6 border-b border-gray-100 bg-gray-50">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">Order ID:</span>
            <span className="font-medium text-gray-900">{order.orderId}</span>
            <span className="text-sm text-gray-500">Placed on {new Date(order.orderDate).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
              {getStatusIcon(order.status)}
              {getStatusText(order.status)}
            </span>
          </div>
        </div>
      </div>

      {/* Order Content */}
      <div className="p-4 md:p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Products */}
          <div className="flex-1 space-y-4">
            {order.products.map((product) => (
              <div key={product.id} className="flex items-start gap-4">
                <img 
                  className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-lg border border-gray-200"
                  src={product.image} 
                  alt={product.name}
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 line-clamp-2">{product.name}</h3>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                    {product.size && <span>Size: {product.size}</span>}
                    {product.color && <span>Color: {product.color}</span>}
                    <span>Qty: {product.quantity}</span>
                  </div>
                  <p className="text-lg font-semibold text-gray-900 mt-2">₹{product.price.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Order Actions */}
          <div className="lg:w-48 space-y-4">
            <div className="text-right">
              <p className="text-sm text-gray-600">Total: ₹{order.total.toLocaleString()}</p>
            </div>
            
            <div className="flex flex-col gap-2">
              <button
                onClick={handleOrderDetail}
                className="w-full py-2 px-4 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors duration-200"
              >
                View Details
              </button>
              
              {order.status === 'delivered' && (
                <button className="w-full py-2 px-4 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200">
                  Buy Again
                </button>
              )}
              
              {order.status === 'delivered' && (
                <button className="w-full py-2 px-4 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200">
                  Return Item
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delivery Info */}
      {order.status === 'ontheway' && order.expectedDelivery && (
        <div className="px-4 md:px-6 py-3 bg-blue-50 border-t border-blue-100">
          <div className="flex items-center gap-2 text-blue-700">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm">Expected delivery: {new Date(order.expectedDelivery).toLocaleDateString()}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderCard;