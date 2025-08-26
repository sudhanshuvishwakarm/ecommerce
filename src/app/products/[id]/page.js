'use client'
import { useState } from 'react'
import { RadioGroup } from '@headlessui/react'
import { StarIcon } from '@heroicons/react/20/solid'
import Link from 'next/link'
import ProductCard from '../../../components/product/ProductCard.jsx'
import ProductReviewCard from '../../../components/product/ProductReviewCard.jsx'

const product = {
    name: 'Basic Tee 6-Pack',
    price: '₹192',
    href: '#',
    breadcrumbs: [
        { id: 1, name: 'Men', href: '#' },
        { id: 2, name: 'Clothing', href: '#' },
    ],
    images: [
        {
            src: 'https://m.media-amazon.com/images/I/71pzB-Rhc9L._AC_UL480_FMwebp_QL65_.jpg',
            alt: 'Two each of gray, white, and black shirts laying flat.',
        },
        {
            src: 'https://m.media-amazon.com/images/I/71RfHvqcLlL._SX569_.jpg',
            alt: 'Model wearing plain black basic tee.',
        },
        {
            src: 'https://m.media-amazon.com/images/I/71wJjHSED9L._SX569_.jpg',
            alt: 'Model wearing plain gray basic tee.',
        },
        {
            src: 'https://m.media-amazon.com/images/I/812moQIIO7L._SX569_.jpg',
            alt: 'Model wearing plain white basic tee.',
        },
    ],
    colors: [
        { name: 'White', class: 'bg-white', selectedClass: 'ring-gray-400' },
        { name: 'Gray', class: 'bg-gray-200', selectedClass: 'ring-gray-400' },
        { name: 'Black', class: 'bg-gray-900', selectedClass: 'ring-gray-900' },
    ],
    sizes: [

        { name: 'S', inStock: true },
        { name: 'M', inStock: true },
        { name: 'L', inStock: true },
        { name: 'XL', inStock: true },

    ],
    description:
        'The Basic Tee 6-Pack allows you to fully express your vibrant personality with three grayscale options. Feeling adventurous? Put on a heather gray tee. Want to be a trendsetter? Try our exclusive colorway: "Black". Need to add an extra pop of color to your outfit? Our white tee has you covered.',
    highlights: [
        'Hand cut and sewn locally',
        'Dyed with our proprietary colors',
        'Pre-washed & pre-shrunk',
        'Ultra-soft 100% cotton',
    ],
    details:
        'The 6-Pack includes two black, two white, and two heather gray Basic Tees. Sign up for our subscription service and be the first to get new, exciting colors, like our upcoming "Charcoal Gray" limited release.',
}
const reviews = [
  { 
    id: 1, 
    name: 'Rahul Sharma', 
    date: '15 Dec, 2023', 
    rating: 4.5, 
    comment: 'Excellent quality fabric and perfect fit. The colors are vibrant and true to pictures. Would definitely recommend!',
    verified: true
  },
  { 
    id: 2, 
    name: 'Priya Patel', 
    date: '28 Nov, 2023', 
    rating: 5, 
    comment: 'Absolutely love these t-shirts! The fabric is so soft and comfortable. Great value for money.',
    verified: true
  },
  { 
    id: 3, 
    name: 'Amit Kumar', 
    date: '10 Jan, 2024', 
    rating: 4, 
    comment: 'Good quality and comfortable fit. The package arrived quickly and well-packed.',
    verified: true
  },
  { 
    id: 4, 
    name: 'Neha Gupta', 
    date: '05 Jan, 2024', 
    rating: 4.5, 
    comment: 'The colors are beautiful and the fabric feels premium. Would buy again!',
    verified: false
  },
]
const similarProducts = [
  { 
    id: 1, 
    name: 'Basic Tee', 
    price: '₹299', 
    image: 'https://m.media-amazon.com/images/I/61DGAlvxRLL._SY550_.jpg',
    category: 'Clothing'
  },
  { 
    id: 2, 
    name: 'Premium Tee', 
    price: '₹499', 
    image: product.images[1].src,
    category: 'Clothing'
  },
  { 
    id: 3, 
    name: 'Sport Tee', 
    price: '₹399', 
    image: product.images[2].src,
    category: 'Clothing'
  },
  { 
    id: 4, 
    name: 'Casual Tee', 
    price: '₹349', 
    image: product.images[3].src,
    category: 'Clothing'
  },
  { 
    id: 5, 
    name: 'Basic Tee', 
    price: '₹299', 
    image: product.images[0].src,
    category: 'Clothing'
  },
  { 
    id: 6, 
    name: 'Premium Tee', 
    price: '₹499', 
    image: product.images[1].src,
    category: 'Clothing'
  },
  { 
    id: 7, 
    name: 'Sport Tee', 
    price: '₹399', 
    image: product.images[2].src,
    category: 'Clothing'
  },
  { 
    id: 8, 
    name: 'Casual Tee', 
    price: '₹349', 
    image: product.images[3].src,
    category: 'Clothing'
  },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function ProductDetails({ params }) {
  const [selectedColor, setSelectedColor] = useState(product.colors[0])
  const [selectedSize, setSelectedSize] = useState(product.sizes[2])
 const [mainImage, setMainImage] = useState(product.images[2])
  return (
    <div className="bg-white">
      <div className="pt-6">
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="px-4 sm:px-6 lg:px-8">
          <ol className="flex items-center max-w-7xl mx-auto space-x-2 overflow-x-auto py-2">
            {product.breadcrumbs.map((breadcrumb, index) => (
              <li key={breadcrumb.id} className="flex items-center">
                <div className="flex items-center">
                  <Link 
                    href={breadcrumb.href} 
                    className="text-sm font-medium text-gray-500 hover:text-indigo-600 transition-colors duration-200"
                  >
                    {breadcrumb.name}
                  </Link>
                  {index < product.breadcrumbs.length - 1 && (
                    <svg
                      className="w-4 h-5 text-gray-300 mx-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                    >
                      <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
                    </svg>
                  )}
                </div>
              </li>
            ))}
            <li className="text-sm">
              <span className="font-medium text-gray-900 truncate">{product.name}</span>
            </li>
          </ol>
        </nav>

        {/* Product Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mt-6">
          {/* Image Gallery */}
          <div className="lg:pr-8">
            <div className="aspect-h-4 aspect-w-3 overflow-hidden rounded-xl bg-gray-100 shadow-sm">
              <img
                src={mainImage.src}
                alt={mainImage.alt}
                className="h-full w-full object-cover object-center "
              />
            </div>
            <div className="grid grid-cols-4 gap-3 mt-4">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setMainImage(image)}
                  className={`aspect-h-1 aspect-w-1 overflow-hidden rounded-lg bg-gray-100 shadow-sm transition-all duration-200 ${
                    mainImage.src === image.src ? 'ring-2 ring-indigo-500' : 'hover:ring-2 hover:ring-gray-300'
                  }`}
                >
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="h-full w-full object-cover object-center p-2"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="lg:pt-8">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">{product.name}</h1>
              <button className="p-2 text-gray-400 hover:text-red-500 transition-colors duration-200">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>
            
            <p className="text-lg text-gray-600 mt-2 leading-relaxed">{product.description}</p>

            {/* Price */}
            <div className="mt-6 flex items-center">
              <p className="text-3xl font-bold text-gray-900">{product.price}</p>
              <s className="ml-3 text-xl text-gray-500">₹999</s>
              <span className="ml-3 text-sm font-bold text-green-600 bg-green-100 px-2 py-1 rounded-full">40% OFF</span>
            </div>

            {/* Reviews */}
            <div className="mt-6">
              <div className="flex items-center">
                <div className="flex">
                  {[0, 1, 2, 3, 4].map((rating) => (
                    <StarIcon
                      key={rating}
                      className={classNames(
                        4.5 > rating ? 'text-yellow-400' : 'text-gray-200',
                        'h-5 w-5 flex-shrink-0'
                      )}
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <p className="ml-2 text-sm text-gray-600">4.5/5</p>
                <div className="ml-4 flex space-x-1">
                  <p className="text-sm text-gray-600">562 Ratings</p>
                  <span className="text-gray-300">•</span>
                  <p className="text-sm text-gray-600">258 Reviews</p>
                </div>
              </div>
            </div>

            {/* Color Selector */}
            <div className="mt-8">
              <h3 className="text-sm font-medium text-gray-900">Color</h3>
              <RadioGroup value={selectedColor} onChange={setSelectedColor} className="mt-4">
                <div className="flex items-center space-x-3">
                  {product.colors.map((color) => (
                    <RadioGroup.Option
                      key={color.name}
                      value={color}
                      className={({ active, checked }) =>
                        classNames(
                          color.selectedClass,
                          active && checked ? 'ring-2 ring-offset-2' : '',
                          !active && checked ? 'ring-2' : '',
                          'relative -m-0.5 flex cursor-pointer items-center justify-center rounded-full p-0.5 focus:outline-none transition-all duration-200'
                        )
                      }
                    >
                      <RadioGroup.Label as="span" className="sr-only">
                        {color.name}
                      </RadioGroup.Label>
                      <span
                        aria-hidden="true"
                        className={classNames(
                          color.class,
                          'h-8 w-8 rounded-full border border-black border-opacity-10 shadow-md'
                        )}
                      />
                    </RadioGroup.Option>
                  ))}
                </div>
              </RadioGroup>
            </div>

            {/* Size Selector */}
            <div className="mt-8">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-900">Size</h3>
                <a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200">
                  Size guide
                </a>
              </div>
              <RadioGroup
                value={selectedSize}
                onChange={setSelectedSize}
                className="mt-4"
              >
                <div className="grid grid-cols-4 gap-3">
                  {product.sizes.map((size) => (
                    <RadioGroup.Option
                      key={size.name}
                      value={size}
                      disabled={!size.inStock}
                      className={({ active }) =>
                        classNames(
                          size.inStock
                            ? 'cursor-pointer bg-white text-gray-900 shadow-sm hover:shadow-md'
                            : 'cursor-not-allowed bg-gray-50 text-gray-300',
                          active ? 'ring-2 ring-indigo-500' : '',
                          'group relative flex items-center justify-center rounded-lg border py-3 px-4 text-sm font-medium uppercase transition-all duration-200 focus:outline-none'
                        )
                      }
                    >
                      {({ active, checked }) => (
                        <>
                          <RadioGroup.Label as="span">{size.name}</RadioGroup.Label>
                          {size.inStock ? (
                            <span
                              className={classNames(
                                active ? 'border' : 'border-2',
                                checked ? 'border-indigo-500' : 'border-transparent',
                                'pointer-events-none absolute -inset-px rounded-lg'
                              )}
                              aria-hidden="true"
                            />
                          ) : (
                            <span
                              aria-hidden="true"
                              className="pointer-events-none absolute -inset-px rounded-lg border-2 border-gray-200"
                            >
                              <svg
                                className="absolute inset-0 h-full w-full stroke-2 text-gray-200"
                                viewBox="0 0 100 100"
                                preserveAspectRatio="none"
                                stroke="currentColor"
                              >
                                <line x1={0} y1={100} x2={100} y2={0} vectorEffect="non-scaling-stroke" />
                              </svg>
                            </span>
                          )}
                        </>
                      )}
                    </RadioGroup.Option>
                  ))}
                </div>
              </RadioGroup>
            </div>

            {/* Add to Cart */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button className="px-4 py-3 text-gray-600 hover:text-indigo-600 transition-colors duration-200">-</button>
                <span className="px-4 py-3 font-medium">1</span>
                <button className="px-4 py-3 text-gray-600 hover:text-indigo-600 transition-colors duration-200">+</button>
              </div>
              <button className="flex-1 bg-indigo-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors duration-200 shadow-sm hover:shadow-md flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Add to cart
              </button>
            </div>

            {/* Product Details */}
            <div className="mt-10 border-t border-gray-200 pt-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Product Details</h3>
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Description</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Highlights</h4>
                  <ul role="list" className="list-disc pl-5 space-y-2 text-sm">
                    {product.highlights.map((highlight, index) => (
                      <li key={index} className="text-gray-600">
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Additional Information</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">{product.details}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Ratings and Reviews */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-12">Customer Reviews</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {reviews.map((review) => (
                <ProductReviewCard key={review.id} review={review} />
              ))}
            </div>
            <div className="bg-gray-50 rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Overall Rating</h3>
              <div className="flex items-center mb-4">
                <div className="flex">
                  {[0, 1, 2, 3, 4].map((rating) => (
                    <StarIcon
                      key={rating}
                      className={classNames(
                        4.5 > rating ? 'text-yellow-400' : 'text-gray-300',
                        'h-6 w-6 flex-shrink-0'
                      )}
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <p className="ml-2 text-2xl font-bold text-gray-900">4.5/5</p>
              </div>
              <p className="text-gray-600 mb-6">Based on 258 reviews</p>
              
              <div className="space-y-3 mb-6">
                {[5, 4, 3, 2, 1].map((stars) => (
                  <div key={stars} className="flex items-center">
                    <span className="w-12 text-sm text-gray-600">{stars} star</span>
                    <div className="flex-1 h-2 bg-gray-200 rounded-full mx-2">
                      <div
                        className="h-2 bg-yellow-400 rounded-full"
                        style={{ width: `${(6 - stars) * 20}%` }}
                      />
                    </div>
                    <span className="w-12 text-sm text-gray-600">{((6 - stars) * 20).toFixed(0)}%</span>
                  </div>
                ))}
              </div>
              
              <button className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors duration-200">
                Write a Review
              </button>
            </div>
          </div>
        </section>

        {/* Similar Products */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-12">You May Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {similarProducts.map((product) => (
              <ProductCard key={product.id} data={product} />
            ))}
          </div>
        </section>
      </div>
    </div>
    // <div className="bg-white">
    //   <div className="pt-6">
    //     {/* Breadcrumbs */}
    //     <nav aria-label="Breadcrumb">
    //       <ol className="flex items-center max-w-2xl px-4 mx-auto space-x-2 sm:px-6 lg:max-w-7xl lg:px-8">
    //         {product.breadcrumbs.map((breadcrumb) => (
    //           <li key={breadcrumb.id}>
    //             <div className="flex items-center">
    //               <Link href={breadcrumb.href} className="mr-2 text-sm font-medium text-gray-900">
    //                 {breadcrumb.name}
    //               </Link>
    //               <svg
    //                 className="w-4 h-5 text-gray-300"
    //                 fill="currentColor"
    //                 viewBox="0 0 20 20"
    //                 aria-hidden="true"
    //               >
    //                 <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
    //               </svg>
    //             </div>
    //           </li>
    //         ))}
    //         <li className="text-sm">
    //           <span className="font-medium text-gray-500">{product.name}</span>
    //         </li>
    //       </ol>
    //     </nav>
    //     {/* Product Section */}
    //     <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mt-6">
    //       {/* Image Gallery */}
    //       <div className="lg:pr-8">
    //         <div className="aspect-h-3 aspect-w-4 overflow-hidden rounded-lg">
    //           <img
    //             src={product.images[0].src}
    //             alt={product.images[0].alt}
    //             className="h-full w-full object-cover object-center"
    //           />
    //         </div>
    //         <div className="grid grid-cols-4 gap-4 mt-4">
    //           {product.images.map((image, index) => (
    //             <div key={index} className="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg">
    //               <img
    //                 src={image.src}
    //                 alt={image.alt}
    //                 className="h-full w-full object-cover object-center"
    //               />
    //             </div>
    //           ))}
    //         </div>
    //       </div>
    //       {/* Product Info */}
    //       <div className="lg:pt-8">
    //         <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Men's T-shirt</h1>
    //         <p className="text-xl text-gray-600 mt-2">Two each of gray, white, and black shirts laying flat.</p>
    //         {/* Price */}
    //         <div className="mt-6 flex items-center">
    //           <p className="text-3xl text-gray-900">{product.price}</p>
    //           <s className="ml-3 text-2xl text-gray-500">₹400</s>
    //           <span className="ml-3 text-xl text-green-600">56% OFF</span>
    //         </div>
    //         {/* Reviews */}
    //         <div className="mt-6">
    //           <div className="flex items-center">
    //             <div className="flex">
    //               {[0, 1, 2, 3, 4].map((rating) => (
    //                 <StarIcon
    //                   key={rating}
    //                   className={classNames(
    //                     3.5 > rating ? 'text-yellow-400' : 'text-gray-200',
    //                     'h-5 w-5 flex-shrink-0'
    //                   )}
    //                   aria-hidden="true"
    //                 />
    //               ))}
    //             </div>
    //             <p className="ml-3 text-sm text-gray-600">562 Ratings</p>
    //             <p className="ml-3 text-sm text-gray-600">258 Reviews</p>
    //           </div>
    //         </div>
    //         {/* Color Selector */}
    //         <div className="mt-10">
    //           <h3 className="text-sm font-medium text-gray-900">Color</h3>
    //           <RadioGroup value={selectedColor} onChange={setSelectedColor} className="mt-4">
    //             <div className="flex items-center space-x-3">
    //               {product.colors.map((color) => (
    //                 <RadioGroup.Option
    //                   key={color.name}
    //                   value={color}
    //                   className={({ active, checked }) =>
    //                     classNames(
    //                       color.selectedClass,
    //                       active && checked ? 'ring ring-offset-1' : '',
    //                       !active && checked ? 'ring-2' : '',
    //                       'relative -m-0.5 flex cursor-pointer items-center justify-center rounded-full p-0.5 focus:outline-none'
    //                     )
    //                   }
    //                 >
    //                   <span
    //                     aria-hidden="true"
    //                     className={classNames(
    //                       color.class,
    //                       'h-8 w-8 rounded-full border border-black border-opacity-10 shadow-md'
    //                     )}
    //                   />
    //                 </RadioGroup.Option>
    //               ))}
    //             </div>
    //           </RadioGroup>
    //         </div>
    //         {/* Size Selector */}
    //         <div className="mt-10">
    //           <div className="flex items-center justify-between">
    //             <h3 className="text-sm font-medium text-gray-900">Size</h3>
    //             <a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
    //               Size guide
    //             </a>
    //           </div>
    //           <RadioGroup
    //             value={selectedSize}
    //             onChange={setSelectedSize}
    //             className="mt-4"
    //           >
    //             <div className="grid grid-cols-4 gap-4">
    //               {product.sizes.map((size) => (
    //                 <RadioGroup.Option
    //                   key={size.name}
    //                   value={size}
    //                   disabled={!size.inStock}
    //                   className={({ active }) =>
    //                     classNames(
    //                       size.inStock
    //                         ? 'cursor-pointer bg-white text-gray-900 shadow-sm'
    //                         : 'cursor-not-allowed bg-gray-50 text-gray-200',
    //                       active ? 'ring-2 ring-indigo-500' : '',
    //                       'group relative flex items-center justify-center rounded-md border py-3 px-4 text-sm font-medium uppercase hover:bg-gray-50 focus:outline-none sm:flex-1'
    //                     )
    //                   }
    //                 >
    //                   {({ active, checked }) => (
    //                     <>
    //                       <RadioGroup.Label as="span">{size.name}</RadioGroup.Label>
    //                       {size.inStock ? (
    //                         <span
    //                           className={classNames(
    //                             active ? 'border' : 'border-2',
    //                             checked ? 'border-indigo-500' : 'border-transparent',
    //                             'pointer-events-none absolute -inset-px rounded-md'
    //                           )}
    //                           aria-hidden="true"
    //                         />
    //                       ) : (
    //                         <span
    //                           aria-hidden="true"
    //                           className="pointer-events-none absolute -inset-px rounded-md border-2 border-gray-200"
    //                         >
    //                           <svg
    //                             className="absolute inset-0 h-full w-full stroke-2 text-gray-200"
    //                             viewBox="0 0 100 100"
    //                             preserveAspectRatio="none"
    //                             stroke="currentColor"
    //                           >
    //                             <line x1={0} y1={100} x2={100} y2={0} vectorEffect="non-scaling-stroke" />
    //                           </svg>
    //                         </span>
    //                       )}
    //                     </>
    //                   )}
    //                 </RadioGroup.Option>
    //               ))}
    //             </div>
    //           </RadioGroup>
    //         </div>
    //         {/* Add to Cart */}
    //         <button
    //           type="submit"
    //           className="mt-10 flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
    //         >
    //           Add to cart
    //         </button>
    //         {/* Product Details */}
    //         <div className="mt-10">
    //           <h3 className="text-sm font-medium text-gray-900">Description</h3>
    //           <div className="mt-4 space-y-6">
    //             <p className="text-sm text-gray-600">{product.description}</p>
    //           </div>
    //         </div>
    //         <div className="mt-10">
    //           <h3 className="text-sm font-medium text-gray-900">Highlights</h3>
    //           <div className="mt-4">
    //             <ul role="list" className="list-disc pl-4 space-y-2 text-sm">
    //               {product.highlights.map((highlight) => (
    //                 <li key={highlight} className="text-gray-600">
    //                   <span className="text-gray-600">{highlight}</span>
    //                 </li>
    //               ))}
    //             </ul>
    //           </div>
    //         </div>
    //         <div className="mt-10">
    //           <h2 className="text-sm font-medium text-gray-900">Details</h2>
    //           <div className="mt-4 space-y-6">
    //             <p className="text-sm text-gray-600">{product.details}</p>
    //           </div>
    //         </div>
    //       </div>
    //     </section>

    //     {/* Ratings and Reviews */}
    //     <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
    //       <h2 className="text-2xl font-medium text-gray-900 text-center">Rating and Reviews</h2>
    //       <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
    //         <div>
    //           {reviews.map((review) => (
    //             <ProductReviewCard key={review.id} review={review} />
    //           ))}
    //         </div>
    //         <div className="space-y-4">
    //           <h3 className="text-xl font-medium text-gray-900">Product Ratings</h3>
    //           <div className="flex items-center">
    //             {[0, 1, 2, 3, 4].map((rating) => (
    //               <StarIcon
    //                 key={rating}
    //                 className={classNames(
    //                   4.5 > rating ? 'text-yellow-400' : 'text-gray-200',
    //                   'h-5 w-5 flex-shrink-0'
    //                 )}
    //                 aria-hidden="true"
    //               />
    //             ))}
    //             <p className="ml-2 text-sm text-gray-600">250 Ratings</p>
    //           </div>
    //           <div className="space-y-2">
    //             {[5, 4, 3, 2, 1].map((stars) => (
    //               <div key={stars} className="flex items-center">
    //                 <span className="w-12 text-sm text-gray-600">{stars} star</span>
    //                 <div className="flex-1 h-4 bg-gray-200 rounded-full mx-2">
    //                   <div
    //                     className="h-4 bg-yellow-400 rounded-full"
    //                     style={{ width: `${stars * 20}%` }}
    //                   />
    //                 </div>
    //                 <span className="w-12 text-sm text-gray-600">{(stars * 50).toFixed(0)}</span>
    //               </div>
    //             ))}
    //           </div>
    //         </div>
    //       </div>
    //     </section>

    //     {/* Similar Products */}
    //     <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
    //       <h2 className="text-2xl font-medium text-gray-900 text-center">Similar Products</h2>
    //       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
    //         {similarProducts.map((product) => (
    //           <ProductCard key={product.id} data={product} />
    //         ))}
    //       </div>
    //     </section>
    //   </div>
    // </div>
  )
}