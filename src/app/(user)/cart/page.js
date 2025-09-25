'use client'
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation.js";
import CartItem from "../../../components/cart/CartItem.jsx";
import Loading from "../../../components/loader/Loading.jsx";
import axios from "axios";

const Cart = () => {
  const router = useRouter();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartData, setCartData] = useState(null);
  const [updating, setUpdating] = useState(false);

  const fetchCartItems = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/cart');
      
      console.log('Cart API Response:', response.data);
      
      if (response.data.cart) {
        setCartData(response.data.cart);
        
        const items = response.data.cart.cartItems.map(item => ({
          id: item._id,
          productId: item.product?._id,
          name: item.product?.title || 'Product',
          image: item.product?.imageUrl || 'https://via.placeholder.com/150',
          size: item.size,
          color: item.product?.color || 'Default Color',
          seller: item.product?.brand || 'Seller',
          price: item.discountedPrice || item.price,
          originalPrice: item.price,
          discount: item.price > 0 ? Math.round(((item.price - item.discountedPrice) / item.price) * 100) : 0,
          quantity: item.quantity,
          product: item.product // Keep full product data
        }));
        
        setCartItems(items);
        console.log('Transformed cart items:', items);
      } else {
        setCartItems([]);
      }
    } catch (error) {
      console.error('Error fetching cart items:', error);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  }

  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    try {
      setUpdating(true);
      
      // Update quantity via API
      const response = await axios.put('/api/cart', {
        cartItemId: itemId,
        quantity: newQuantity
      });

      if (response.data.message === "Cart updated successfully") {
        // Update local state
        setCartItems(prevItems => 
          prevItems.map(item => 
            item.id === itemId ? { ...item, quantity: newQuantity } : item
          )
        );
        // Refresh cart data to get updated totals
        await fetchCartItems();
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
      alert('Failed to update quantity: ' + (error.response?.data?.message || error.message));
    } finally {
      setUpdating(false);
    }
  }

  const handleRemoveItem = async (itemId) => {
    try {
      setUpdating(true);
      
      const response = await axios.delete(`/api/cart?cartItemId=${itemId}`);

      if (response.data.message === "Item removed from cart") {
        setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
        await fetchCartItems();
        alert('Item removed from cart successfully!');
      }
    } catch (error) {
      console.error('Error removing item:', error);
      alert('Failed to remove item from cart: ' + (error.response?.data?.message || error.message));
    } finally {
      setUpdating(false);
    }
  }

  useEffect(() => {
    fetchCartItems();
  }, []);

  // Calculate cart totals from API data
  const subtotal = cartData?.totalPrice || 0;
  const discount = cartData?.discounte || 0;
  const totalAmount = cartData?.totalDiscountPrice || 0;
  const totalItems = cartData?.totalItem || 0;

  if (loading) {
    return <Loading />;
  }

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
            {updating && (
              <div className="mb-4 p-3 bg-blue-50 text-blue-700 rounded-lg flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Updating cart...
              </div>
            )}
            
            {cartItems.map(item => (
              <CartItem 
                key={item.id} 
                item={item} 
                onQuantityChange={handleQuantityChange}
                onRemove={handleRemoveItem}
                disabled={updating}
              />
            ))}
          </div>
          
          <div className="lg:w-1/3">
            <div className="bg-gray-50 rounded-lg p-6 shadow-sm border border-gray-100 sticky top-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">Price Details</h2>
              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Price ({totalItems} items)</span>
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
                className="w-full bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700 transition-colors duration-300 mt-6 font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
                onClick={() => router.push('/checkout')}
                disabled={updating || cartItems.length === 0}
              >
                {updating ? 'Updating...' : 'Proceed to Checkout'}
              </button>
              
              <button 
                onClick={() => router.push('/')}
                className="w-full border border-indigo-600 text-indigo-600 py-3 rounded-md hover:bg-indigo-50 transition-colors duration-300 mt-3 font-medium disabled:border-gray-400 disabled:text-gray-400 disabled:cursor-not-allowed"
                disabled={updating}
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

export default Cart;
// 'use client'
// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation.js";
// import CartItem from "../../../components/cart/CartItem.jsx";
// import Loading from "../../../components/loader/Loading.jsx";

// import axios from "axios";

// const Cart = () => {

//   const fetchCartItems = async () => {
//     try {
//       const response = await axios.get('/api/cart');
//       setCartItems(response.data);
//     } catch (error) {
      
//     }
//   }

//   useEffect(() => {
//     fetchCartItems();
//   },[])


//   const router = useRouter();
//   const [cartItems, setCartItems] = useState([
//     {
//       id: 1,
//       name: "Men Slim Mid Rise Black Jeans",
//       image: "https://m.media-amazon.com/images/I/61DGAlvxRLL._SY550_.jpg",
//       size: "L",
//       color: "Black",
//       seller: "Agrawal Clothes",
//       price: 600,
//       originalPrice: 1200,
//       discount: 50,
//       quantity: 1
//     },
//     {
//       id: 2,
//       name: "Women's Casual T-Shirt",
//       image: "https://m.media-amazon.com/images/I/71KgeUtafxL._SY550_.jpg",
//       size: "M",
//       color: "White",
//       seller: "Fashion Hub",
//       price: 499,
//       originalPrice: 999,
//       discount: 50,
//       quantity: 2
//     },
//     {
//       id: 3,
//       name: "Running Shoes",
//       image: "https://m.media-amazon.com/images/I/71KgeUtafxL._SY550_.jpg",
//       size: "9",
//       color: "Blue",
//       seller: "Sports Direct",
//       price: 1999,
//       originalPrice: 3999,
//       discount: 50,
//       quantity: 1
//     }
//   ])

//   const handleQuantityChange = (itemId, newQuantity) => {
//     setCartItems(prevItems => 
//       prevItems.map(item => 
//         item.id === itemId ? { ...item, quantity: newQuantity } : item
//       )
//     )
//   }

//   const handleRemoveItem = (itemId) => {
//     setCartItems(prevItems => prevItems.filter(item => item.id !== itemId))
//   }

//   // Calculate cart totals
//   const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)
//   const discount = cartItems.reduce((total, item) => total + ((item.originalPrice - item.price) * item.quantity), 0)
//   const totalAmount = subtotal

//   return (
//     <div className="container mx-auto px-4 py-8 max-w-7xl">
//       <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
//       {cartItems.length === 0 ? (
//         <div className="text-center py-12">
//           <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
//           </svg>
//           <p className="text-xl text-gray-600 mb-4">Your cart is empty</p>
//           <button 
//             onClick={() => router.push('/')}
//             className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition-colors duration-300"
//           >
//             Continue Shopping
//           </button>
//         </div>
//       ) : (
//         <div className="flex flex-col lg:flex-row gap-8">
//           <div className="lg:w-2/3">
//             {cartItems.map(item => (
//               <CartItem 
//                 key={item.id} 
//                 item={item} 
//                 onQuantityChange={handleQuantityChange}
//                 onRemove={handleRemoveItem}
//               />
//             ))}
//           </div>
//           <div className="lg:w-1/3">
//             <div className="bg-gray-50 rounded-lg p-6 shadow-sm border border-gray-100 sticky top-8">
//               <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">Price Details</h2>
//               <div className="space-y-3 mb-4">
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Price ({cartItems.reduce((total, item) => total + item.quantity, 0)} items)</span>
//                   <span>₹{subtotal.toLocaleString()}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Discount</span>
//                   <span className="text-green-600">-₹{discount.toLocaleString()}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Delivery Charges</span>
//                   <span className="text-green-600">Free</span>
//                 </div>
//               </div>
//               <div className="flex justify-between font-bold text-lg pt-4 border-t border-gray-200">
//                 <span>Total Amount</span>
//                 <span>₹{totalAmount.toLocaleString()}</span>
//               </div>
//               <button 
//                 className="w-full bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700 transition-colors duration-300 mt-6 font-medium"
//                 onClick={() => router.push('/checkout')}
//               >
//                 Proceed to Checkout
//               </button>
//               <button 
//                 onClick={() => router.push('/')}
//                 className="w-full border border-indigo-600 text-indigo-600 py-3 rounded-md hover:bg-indigo-50 transition-colors duration-300 mt-3 font-medium"
//               >
//                 Continue Shopping
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }

// export default Cart