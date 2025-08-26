'use client'
import { useState } from "react"

const CartItem = ({ item, onQuantityChange, onRemove }) => {

  const [quantity, setQuantity] = useState(item?.quantity || 1)

    if (!item) {
    return (
      <div className="flex items-center justify-center bg-gray-100 rounded-lg p-4 mb-4">
        <p className="text-gray-500">Item not available</p>
      </div>
    )
  }

   const handleDecrease = () => {
    if (quantity > 1) {
      const newQuantity = quantity - 1
      setQuantity(newQuantity)
      onQuantityChange(item.id, newQuantity)
    }
  }

  const handleIncrease = () => {
    const newQuantity = quantity + 1
    setQuantity(newQuantity)
    onQuantityChange(item.id, newQuantity)
  }

  return (
    <div className="flex flex-col md:flex-row items-start justify-between bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-4 transition-all duration-300 hover:shadow-md">
      <div className="flex flex-col md:flex-row items-start md:items-center w-full md:w-auto">
        <div className="mb-4 md:mb-0 md:mr-6 flex-shrink-0">
          <img 
            src={item.image} 
            className="h-40 w-40 object-contain rounded-lg bg-white p-2 border border-gray-100" 
            alt={item.name} 
          />
        </div>
        <div className="flex flex-col gap-2 text-start w-full md:w-auto">
          <p className="font-bold text-gray-900 text-lg">{item.name}</p>
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">Size: {item.size}</span>
            <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">Color: {item.color}</span>
          </div>
          <p className="text-sm text-gray-600">Seller: {item.seller}</p>
          <div className="flex items-center mt-2">
            <p className="text-xl font-bold text-gray-900">₹{item.price}</p>
            <s className="ml-3 text-lg text-gray-500">₹{item.originalPrice}</s>
            <span className="ml-3 text-sm font-bold text-green-600 bg-green-100 px-2 py-1 rounded-full">
              {item.discount}% OFF
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between w-full md:w-auto mt-4 md:mt-0">
        <div className="flex items-center justify-center bg-white rounded-lg border border-gray-200 p-1">
          <button 
            onClick={handleDecrease}
            className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-indigo-600 transition-colors"
            aria-label="Decrease quantity"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </button>
          <p className="mx-3 w-8 text-center font-medium text-gray-900">{quantity}</p>
          <button 
            onClick={handleIncrease}
            className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-indigo-600 transition-colors"
            aria-label="Increase quantity"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
        
        <button 
          onClick={() => onRemove(item.id)}
          className="ml-4 text-red-500 hover:text-red-700 transition-colors p-2"
          aria-label="Remove item"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  )
}
export default CartItem;

// import React from 'react'

// const CartItem = () => {
//   return (
//      <div className='flex flex-col items-start justify-start bg-gray-100 max-h-[250px] m-[20px]  shadow-[0px_2px_8px_0px_gray]'>
//             <div className='flex flex-wrap items-center justify-start'>
//                 <div>
//                     <img src="https://m.media-amazon.com/images/I/61DGAlvxRLL._SY550_.jpg" className='h-[180px] p-[15px] object-left-top  object-cover ' alt="Error Loading" />
//                 </div>
//                 <div className='flex flex-col gap-2 text-start'>
//                     <p className='font-bold'>Men Slim Mid Rise Black Jeans</p>
//                     <p>Size: L , White</p>
//                     <p>Seller: Agrawal Clothes</p>
//                     <div className='flex '>
//                         <p className="text-xl tracking-tight text-gray-900 text-start">
//                             600</p>
//                         <s className='ml-3 text-xl text-gray-500'>₹400</s>
//                         <p className='mx-3 text-xl text-gray-500'>56% OFF</p>
//                     </div>
//                 </div>
//             </div>


//             <div className='flex items-center justify-center m-[10px] mx-[50px] mb-[20px] gap2 '>
//                 <i className="fa-solid fa-circle-minus fa-rotate-180 fa-xl mx-[8px]"></i>
//                 <p className=' bg-gray-100 shadow-[2px_2px_12px_0px_gray] px-[15px] mx-2'>12</p>
//                 <i className="fa-solid fa-circle-plus fa-rotate-90 fa-xl mx-[8px]"></i>
//             </div>
//         </div>
//   )
// }

// export default CartItem
