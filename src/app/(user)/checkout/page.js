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
  const [isEditing, setIsEditing] = useState(false);
  const [addressData, setAddressData] = useState({
    firstName: "",
    lastName: "",
    streetAddress: "",
    city: "",
    state: "",
    zipCode: "",
    mobile: ""
  });

  const [cartData, setCartData] = useState(null);
  const [cartLoading, setCartLoading] = useState(false);

  // Check authentication and fetch existing address
  useEffect(() => {
    checkAuthAndFetchAddress();
    fetchCartData();
  }, [addressData]);

  const fetchCartData = async () => {
    try {
      setCartLoading(true);
      const response = await axios.get('/api/cart');
      if (response.data.cart) {
        setCartData(response.data.cart);
      } else {
        setCartData({ totalPrice: 0, totalItem: 0, totalDiscountPrice: 0, discounte: 0, cartItems: [] });
      }
    } catch (error) {
      console.error('Error fetching cart data:', error);
      setCartData({ totalPrice: 0, totalItem: 0, totalDiscountPrice: 0, discounte: 0, cartItems: [] });
    } finally {
      setCartLoading(false);
    }
  };

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
        setIsEditing(false);
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
        // Stay on order summary after update
        setActiveStep(2);
        setIsEditing(false);
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
      setIsEditing(false);
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
    setIsEditing(false);
  };

  const handleEditAddress = () => {
    setActiveStep(1);
    setIsEditing(true);
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

        {/* Progress Steps */}
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
          {/* Main Content */}
          <div className="lg:w-2/3">
            {activeStep === 1 ? (
              <DeliveryAddressForm 
                onNext={isEditing ? handleAddressUpdate : handleAddressSubmit}
                initialData={addressData}
                isUpdate={!!userAddress && isEditing}
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

          {/* Side Panel Order Summary */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h3>
              
              {cartLoading ? (
                <div className="animate-pulse space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              ) : cartData && cartData.cartItems && cartData.cartItems.length > 0 ? (
                <>
                  <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                    {cartData.cartItems.map((item, index) => (
                      <div key={item._id || index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                            <img 
                              src={item.product?.imageUrl || '/api/placeholder/50/50'} 
                              alt={item.product?.title || 'Product'}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {item.product?.title || 'Product'}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                              <span>Qty: {item.quantity}</span>
                              <span>•</span>
                              <span>{item.size}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-sm font-semibold text-gray-900">₹{item.discountedPrice?.toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3 pt-4 border-t border-gray-200">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal ({cartData.totalItem} items)</span>
                      <span className="font-medium">₹{cartData.totalPrice?.toLocaleString()}</span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Discount</span>
                      <span className="text-green-600 font-medium">-₹{cartData.discounte?.toLocaleString()}</span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Shipping</span>
                      <span className="text-green-600 font-medium">FREE</span>
                    </div>
                    
                    <div className="flex justify-between text-lg font-bold text-gray-900 pt-3 border-t border-gray-200">
                      <span>Total</span>
                      <span>₹{cartData.totalDiscountPrice?.toLocaleString()}</span>
                    </div>
                  </div>

                  <button
                    className="w-full bg-[#4f39f6] text-white py-3 px-4 rounded-lg hover:bg-[#3d2ed4] disabled:opacity-50 disabled:cursor-not-allowed mt-6 font-medium transition-colors"
                    onClick={() => router.push('/payment')}
                    disabled={activeStep < 2 || cartLoading}
                  >
                    Proceed to Payment
                  </button>

                  {cartData.discounte > 0 && (
                    <div className="mt-4 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                      <p className="text-sm text-green-700 font-medium text-center">
                        You are saving ₹{cartData.discounte?.toLocaleString()} on this order!
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <p className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</p>
                  <p className="text-gray-500 mb-6">Add some items to proceed with checkout</p>
                  <button
                    onClick={() => router.push('/')}
                    className="bg-[#4f39f6] text-white px-6 py-3 rounded-lg hover:bg-[#3d2ed4] transition-colors font-medium"
                  >
                    Continue Shopping
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}