'use client'
import { useState } from "react";
import { useRouter } from "next/navigation.js";
import CartItem from "../../../components/cart/CartItem.jsx";

const Cart = () => {
  const router = useRouter();
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Men Slim Mid Rise Black Jeans",
      image: "https://m.media-amazon.com/images/I/61DGAlvxRLL._SY550_.jpg",
      size: "L",
      color: "Black",
      seller: "Agrawal Clothes",
      price: 600,
      originalPrice: 1200,
      discount: 50,
      quantity: 1
    },
    {
      id: 2,
      name: "Women's Casual T-Shirt",
      image: "https://m.media-amazon.com/images/I/71KgeUtafxL._SY550_.jpg",
      size: "M",
      color: "White",
      seller: "Fashion Hub",
      price: 499,
      originalPrice: 999,
      discount: 50,
      quantity: 2
    },
    {
      id: 3,
      name: "Running Shoes",
      image: "https://m.media-amazon.com/images/I/71KgeUtafxL._SY550_.jpg",
      size: "9",
      color: "Blue",
      seller: "Sports Direct",
      price: 1999,
      originalPrice: 3999,
      discount: 50,
      quantity: 1
    }
  ])

  const handleQuantityChange = (itemId, newQuantity) => {
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    )
  }

  const handleRemoveItem = (itemId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== itemId))
  }

  // Calculate cart totals
  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)
  const discount = cartItems.reduce((total, item) => total + ((item.originalPrice - item.price) * item.quantity), 0)
  const totalAmount = subtotal

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
      {cartItems.length === 0 ? (
        <div className="text-center py-12">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <p className="text-xl text-gray-600 mb-4">Your cart is empty</p>
          <button 
            onClick={() => router.push('/')}
            className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition-colors duration-300"
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3">
            {cartItems.map(item => (
              <CartItem 
                key={item.id} 
                item={item} 
                onQuantityChange={handleQuantityChange}
                onRemove={handleRemoveItem}
              />
            ))}
          </div>
          <div className="lg:w-1/3">
            <div className="bg-gray-50 rounded-lg p-6 shadow-sm border border-gray-100 sticky top-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">Price Details</h2>
              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Price ({cartItems.reduce((total, item) => total + item.quantity, 0)} items)</span>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Discount</span>
                  <span className="text-green-600">-₹{discount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Charges</span>
                  <span className="text-green-600">Free</span>
                </div>
              </div>
              <div className="flex justify-between font-bold text-lg pt-4 border-t border-gray-200">
                <span>Total Amount</span>
                <span>₹{totalAmount.toLocaleString()}</span>
              </div>
              <button 
                className="w-full bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700 transition-colors duration-300 mt-6 font-medium"
                onClick={() => router.push('/checkout')}
              >
                Proceed to Checkout
              </button>
              <button 
                onClick={() => router.push('/')}
                className="w-full border border-indigo-600 text-indigo-600 py-3 rounded-md hover:bg-indigo-50 transition-colors duration-300 mt-3 font-medium"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Cart