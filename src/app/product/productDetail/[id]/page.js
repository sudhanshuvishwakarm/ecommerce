'use client'
import { useState, useEffect } from 'react'
import { RadioGroup } from '@headlessui/react'
import { StarIcon } from '@heroicons/react/20/solid'
import Link from 'next/link'
import ProductCard from '../../../../components/product/ProductCard.jsx'
import ProductReviewCard from '../../../../components/product/ProductReviewCard.jsx'
import { usePathname, useRouter } from 'next/navigation.js'
import axios from 'axios'
import Loading from '../../../../components/loader/Loading.jsx'
import { toast } from 'react-toastify'


function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function ProductDetails() {
  const router = useRouter();
  const [selectedColor, setSelectedColor] = useState(null)
  const [selectedSize, setSelectedSize] = useState(null)
  const [mainImage, setMainImage] = useState('')
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [reviewData, setReviewData] = useState({
    rating: 0,
    comment: '',
    name: '',
    email: ''
  })
  const [quantity, setQuantity] = useState(1)
  const [cartLoading, setCartLoading] = useState(false)
  
  const pathname = usePathname();
  const productId = pathname.split('/').reverse()[0];

  const dummyRating = {
    average: 4.5,
    count: 24,
    reviews: [
      { 
        id: 1, 
        name: 'Rahul Sharma', 
        date: '15 Dec, 2023', 
        rating: 4.5, 
        comment: 'Excellent quality fabric and perfect fit. The colors are vibrant and true to pictures. Would definitely recommend!',
        verified: true
      }
    ]
  }

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
      image: 'https://m.media-amazon.com/images/I/71RfHvqcLlL._SX569_.jpg',
      category: 'Clothing'
    },
    { 
      id: 3, 
      name: 'Sport Tee', 
      price: '₹399', 
      image: 'https://m.media-amazon.com/images/I/71wJjHSED9L._SX569_.jpg',
      category: 'Clothing'
    },
    { 
      id: 4, 
      name: 'Casual Tee', 
      price: '₹349', 
      image: 'https://m.media-amazon.com/images/I/812moQIIO7L._SX569_.jpg',
      category: 'Clothing'
    },
  ]

  useEffect(() => {
    fetchProductDetail()
  }, [productId])

  const fetchProductDetail = async () => {
    try {
      setLoading(true)
      const res = await axios.post('/api/product/productDetail', { productId })
      setProduct(res.data)
      
      if (res.data.imageUrl) {
        setMainImage(res.data.imageUrl)
      }
            if (res.data.sizes && res.data.sizes.length > 0) {
        setSelectedSize(res.data.sizes[0])
      }
      
    } catch (error) {
      console.error('Error fetching product:', error)
    } finally {
      setLoading(false)
    }
  }
const handleAddToCart = async () => {
    if (!selectedSize) {
        alert('Please select a size');
        return;
    }

    if (!product) {
        alert('Product information not available');
        return;
    }

    try {
        setCartLoading(true);
        
        const cartData = {
            id: product._id || productId,
            size: selectedSize.name,
            quantity: quantity,
            price: product.price,
            discountedPrice: product.discountedPrice
        };


        const response = await axios.post('/api/cart/', cartData);
        
        if (response.data && response.data.success) {
            toast.success('Product added to cart successfully!');
        } else {
            toast.success('Product added to cart!');
        }
        
    } catch (error) {
        console.error('Error adding to cart:', error);
        router.push('/auth/login');
        if (error.response) {
            const errorMessage = error.response.data?.message || 'Failed to add to cart';
            console.error('Server error response:', error.response.data);
        } else if (error.request) {
            console.error('No response received:', error.request);
        } else {
            console.error('Error message:', error.message);
        }
    } finally {
        setCartLoading(false);
    }
};

  const increaseQuantity = () => {
    setQuantity(prev => prev + 1)
  }

  const decreaseQuantity = () => {
    setQuantity(prev => prev > 1 ? prev - 1 : 1)
  }

  const handleReviewSubmit = async (e) => {
    e.preventDefault()
    // Here you would typically send the review to your API
    setShowReviewModal(false)
    setReviewData({ rating: 0, comment: '', name: '', email: '' })
  }

  if (loading) {
    return (
      <Loading/>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Product not found</h2>
          <p className="text-gray-600 mt-2">The product you are looking for does not exist.</p>
        </div>
      </div>
    )
  }

  // Create image gallery array from single imageUrl
  const imageGallery = [
    { src: product.imageUrl, alt: product.title },
    { src: "1", alt: product.title + ' - View 2' },
    { src: "2", alt: product.title + ' - View 3' },
    { src: "3", alt: product.title + ' - View 4' }
  ]

  return (
    <div className="bg-white">
      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent border-2 border-[#4f39f6] shadow-md bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4  ">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Write a Review</h3>
            <form onSubmit={handleReviewSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewData({...reviewData, rating: star})}
                      className="text-2xl"
                    >
                      {star <= reviewData.rating ? '⭐' : '☆'}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
                <input
                  type="text"
                  required
                  value={reviewData.name}
                  onChange={(e) => setReviewData({...reviewData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Email</label>
                <input
                  type="email"
                  required
                  value={reviewData.email}
                  onChange={(e) => setReviewData({...reviewData, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Review</label>
                <textarea
                  required
                  rows={4}
                  value={reviewData.comment}
                  onChange={(e) => setReviewData({...reviewData, comment: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Share your experience with this product..."
                />
              </div>
              
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowReviewModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="pt-6">
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="px-4 sm:px-6 lg:px-8">
          <ol className="flex items-center max-w-7xl mx-auto space-x-2 overflow-x-auto py-2">
            <li className="flex items-center">
              <Link 
                href="/" 
                className="text-sm font-medium text-gray-500 hover:text-indigo-600 transition-colors duration-200"
              >
                Home
              </Link>
            </li>
            {product.category && (
              <>
                <svg className="w-4 h-5 text-gray-300 mx-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
                </svg>
                <li>
                  <Link 
                    href={`/product?category1=${product.category.category1}`}
                    className="text-sm font-medium text-gray-500 hover:text-indigo-600 transition-colors duration-200"
                  >
                    {product.category.category1}
                  </Link>
                </li>
                <svg className="w-4 h-5 text-gray-300 mx-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
                </svg>
                <li>
                  <Link 
                    href={`/product?category1=${product.category.category1}&category2=${product.category.category2}`}
                    className="text-sm font-medium text-gray-500 hover:text-indigo-600 transition-colors duration-200"
                  >
                    {product.category.category2}
                  </Link>
                </li>
                <svg className="w-4 h-5 text-gray-300 mx-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
                </svg>
                <li>
                  <span className="text-sm font-medium text-gray-900 truncate">
                    {product.category.category3}
                  </span>
                </li>
              </>
            )}
          </ol>
        </nav>

        {/* Product Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mt-6">
          {/* Image Gallery */}
          <div className="lg:pr-8">
            <div className="aspect-h-4 aspect-w-3 overflow-hidden rounded-xl bg-gray-100 shadow-sm">
              <img
                src={mainImage || product.imageUrl}
                alt={product.title}
                className="h-full w-full object-cover object-center"
              />
            </div>
            <div className="grid grid-cols-4 gap-3 mt-4">
              {imageGallery.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setMainImage(image.src)}
                  className={`aspect-h-1 aspect-w-1 overflow-hidden rounded-lg bg-gray-100 shadow-sm transition-all duration-200 ${
                    mainImage === image.src ? 'ring-2 ring-indigo-500' : 'hover:ring-2 hover:ring-gray-300'
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
            {/* Category */}
            <div className="mb-2">
              <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                {product.category?.category1} › {product.category?.category2} › {product.category?.category3}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">{product.title}</h1>
              <button className="p-2 text-gray-400 hover:text-red-500 transition-colors duration-200">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>
            
            <p className="text-lg text-gray-600 mt-2 leading-relaxed">{product.description}</p>

            {/* Price */}
            <div className="mt-6 flex items-center">
              <p className="text-3xl font-bold text-gray-900">₹{product.price}</p>
              <s className="ml-3 text-xl text-gray-500">₹{product.discountedPrice}</s>
              <span className="ml-3 text-sm font-bold text-green-600 bg-green-100 px-2 py-1 rounded-full">
                {product.discountPercent}% OFF
              </span>
            </div>

            {/* Reviews */}
            <div className="mt-6">
              <div className="flex items-center">
                <div className="flex">
                  {[0, 1, 2, 3, 4].map((rating) => (
                    <StarIcon
                      key={rating}
                      className={classNames(
                        dummyRating.average > rating ? 'text-yellow-400' : 'text-gray-200',
                        'h-5 w-5 flex-shrink-0'
                      )}
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <p className="ml-2 text-sm text-gray-600">{dummyRating.average}/5</p>
                <div className="ml-4 flex space-x-1">
                  <p className="text-sm text-gray-600">{dummyRating.count} Ratings</p>
                </div>
              </div>
            </div>

            {/* Size Selector */}
            {product.sizes && product.sizes.length > 0 && (
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
                        key={size._id}
                        value={size}
                        disabled={size.quantity === 0}
                        className={({ active }) =>
                          classNames(
                            size.quantity > 0
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
                            {size.quantity > 0 ? (
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
            )}

            {/* Quantity and Add to Cart */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button 
                  onClick={decreaseQuantity}
                  className="px-4 py-3 text-gray-600 hover:text-indigo-600 transition-colors duration-200"
                >
                  -
                </button>
                <span className="px-4 py-3 font-medium">{quantity}</span>
                <button 
                  onClick={increaseQuantity}
                  className="px-4 py-3 text-gray-600 hover:text-indigo-600 transition-colors duration-200"
                >
                  +
                </button>
              </div>
              <button 
                onClick={handleAddToCart}
                disabled={cartLoading || product.quantity === 0}
                className={`flex-1 px-8 py-3 rounded-lg font-medium transition-colors duration-200 shadow-sm hover:shadow-md flex items-center justify-center ${
                  cartLoading || product.quantity === 0
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
              >
                {cartLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Adding...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    {product.quantity === 0 ? 'Out of Stock' : 'Add to cart'}
                  </>
                )}
              </button>
            </div>

            {/* Product Details */}
            <div className="mt-10 border-t border-gray-200 pt-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Product Details</h3>
              <div className="space-y-4">
                <div className="flex">
                  <span className="text-sm font-medium text-gray-900 w-32">Brand</span>
                  <span className="text-sm text-gray-600">{product.brand}</span>
                </div>
                <div className="flex">
                  <span className="text-sm font-medium text-gray-900 w-32">Color</span>
                  <span className="text-sm text-gray-600">{product.color}</span>
                </div>
                <div className="flex">
                  <span className="text-sm font-medium text-gray-900 w-32">Availability</span>
                  <span className="text-sm text-gray-600">{product.quantity > 0 ? 'In Stock' : 'Out of Stock'}</span>
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
              {dummyRating.reviews.map((review) => (
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
                        dummyRating.average > rating ? 'text-yellow-400' : 'text-gray-300',
                        'h-6 w-6 flex-shrink-0'
                      )}
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <p className="ml-2 text-2xl font-bold text-gray-900">{dummyRating.average}/5</p>
              </div>
              <p className="text-gray-600 mb-6">Based on {dummyRating.count} reviews</p>
              
              <button 
                onClick={() => setShowReviewModal(true)}
                className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors duration-200"
              >
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
  )
}
