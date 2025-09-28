'use client';
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import CartItem from "../../../components/cart/CartItem.jsx";
import Loading from "../../../components/loader/Loading.jsx";
import { toast } from 'react-toastify';
import axios from "axios";

const Cart = () => {
  const router = useRouter();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartData, setCartData] = useState(null);
  const [updatingItems, setUpdatingItems] = useState(new Set());

  const fetchCartItems = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/cart');
      
      if (response.data.cart && response.data.cart.cartItems) {
        setCartData(response.data.cart);
        
        const items = response.data.cart.cartItems.map(item => ({
          id: item._id,
          productId: item.product?._id,
          name: item.product?.title || 'Product',
          image: item.product?.imageUrl || '/placeholder.jpg',
          size: item.size,
          color: item.product?.color || 'Default',
          brand: item.product?.brand || 'Brand',
          price: item.discountedPrice,
          originalPrice: item.price,
          discount: item.price > 0 ? Math.round(((item.price - item.discountedPrice) / item.price) * 100) : 0,
          quantity: item.quantity
        }));
        
        setCartItems(items);
      } else {
        setCartItems([]);
        setCartData({ totalPrice: 0, totalItem: 0, totalDiscountPrice: 0, discounte: 0 });
      }
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error("Please login to view your cart");
      } else {
        console.error('Error fetching cart:', error);
        toast.error("Failed to load cart");
        setCartItems([]);
        setCartData({ totalPrice: 0, totalItem: 0, totalDiscountPrice: 0, discounte: 0 });
      }
    } finally {
      setLoading(false);
    }
  }, [router]);

  const handleQuantityChange = useCallback(async (itemId, newQuantity) => {
    if (newQuantity < 1 || updatingItems.has(itemId)) return;
    
    setUpdatingItems(prev => new Set(prev).add(itemId));
    
    try {
      const response = await axios.put('/api/cart', {
        cartItemId: itemId,
        quantity: newQuantity
      });

      if (response.status === 200) {
        setCartItems(prevItems => 
          prevItems.map(item => 
            item.id === itemId ? { ...item, quantity: newQuantity } : item
          )
        );
        await fetchCartItems();
        toast.success("Quantity updated");
      }
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error("Please login first");
        router.push('/auth/login');
      } else {
        toast.error("Failed to update quantity");
      }
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  }, [updatingItems, fetchCartItems, router]);

  const handleRemoveItem = useCallback(async (itemId) => {
    if (updatingItems.has(itemId)) return;
    
    setUpdatingItems(prev => new Set(prev).add(itemId));
    
    try {
      const response = await axios.delete(`/api/cart?cartItemId=${itemId}`);

      if (response.status === 200) {
        setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
        await fetchCartItems();
        toast.success("Item removed from cart");
      }
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error("Please login first");
        router.push('/auth/login');
      } else {
        toast.error("Failed to remove item");
      }
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  }, [updatingItems, fetchCartItems, router]);

  const handleProductClick = useCallback((productId) => {
    if (productId) {
      router.push(`/product/productDetail/${productId}`);
    }
  }, [router]);

  useEffect(() => {
    fetchCartItems();
  }, [fetchCartItems]);

  const subtotal = cartData?.totalPrice || 0;
  const discount = cartData?.discounte || 0;
  const totalAmount = cartData?.totalDiscountPrice || 0;
  const totalItems = cartData?.totalItem || 0;
  const hasUpdatingItems = updatingItems.size > 0;

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Shopping Cart</h1>
          <p className="text-gray-600">{totalItems} {totalItems === 1 ? 'item' : 'items'} in your cart</p>
        </div>
        
        {cartItems.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">Start shopping to add items to your cart</p>
            <button 
              onClick={() => router.push('/')}
              className="bg-[#4f39f6] text-white px-8 py-3 rounded-lg hover:bg-[#3d2ed4] transition-colors font-medium"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            <div className="xl:col-span-3 space-y-4">
              {cartItems.map(item => (
                <CartItem 
                  key={item.id} 
                  item={item} 
                  onQuantityChange={handleQuantityChange}
                  onRemove={handleRemoveItem}
                  onProductClick={handleProductClick}
                  isUpdating={updatingItems.has(item.id)}
                />
              ))}
            </div>
            
            <div className="xl:col-span-1">
              <div className="bg-white rounded-xl shadow-sm p-6 sticky top-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal ({totalItems} items)</span>
                    <span className="font-semibold">₹{subtotal.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Discount</span>
                    <span className="text-green-600 font-semibold">-₹{discount.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="text-green-600 font-semibold">Free</span>
                  </div>
                  
                  <div className="border-t pt-4">
                    <div className="flex justify-between">
                      <span className="text-lg font-bold text-gray-900">Total</span>
                      <span className="text-xl font-bold text-gray-900">₹{totalAmount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <button 
                    className="w-full bg-[#4f39f6] text-white py-3 rounded-lg hover:bg-[#3d2ed4] transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
                    onClick={() => router.push('/checkout')}
                    disabled={hasUpdatingItems || cartItems.length === 0}
                  >
                    {hasUpdatingItems ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Updating...
                      </>
                    ) : (
                      'Proceed to Checkout'
                    )}
                  </button>
                  
                  <button 
                    onClick={() => router.push('/')}
                    className="w-full border-2 border-[#4f39f6] text-[#4f39f6] py-3 rounded-lg hover:bg-[#4f39f6] hover:text-white transition-colors font-medium disabled:border-gray-400 disabled:text-gray-400 disabled:cursor-not-allowed"
                    disabled={hasUpdatingItems}
                  >
                    Continue Shopping
                  </button>
                </div>

                {discount > 0 && (
                  <div className="mt-4 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                    <p className="text-sm text-green-700 font-medium text-center">
                      You are saving ₹{discount.toLocaleString()} on this order!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;