'use client'
import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RadioGroup } from '@headlessui/react'
import { StarIcon } from '@heroicons/react/20/solid'
import Link from 'next/link'
import ProductCard from '../../../../components/product/ProductCard.jsx'
import ProductReviewCard from '../../../../components/product/ProductReviewCard.jsx'
import { usePathname, useRouter } from 'next/navigation.js'
import axios from 'axios'
import Loading from '../../../../components/loader/Loading.jsx'
import { toast } from 'react-toastify'
import { 
  fetchProductDetail, 
  fetchSimilarProducts, 
  clearCurrentProduct,
  clearError 
} from '../../../../redux/slices/productSlice.js'
import { fetchCart } from '../../../../redux/slices/cartSlice.js'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function ProductDetails() {
  const router = useRouter();
  const dispatch = useDispatch();
  const pathname = usePathname();
  const productId = pathname.split('/').reverse()[0];

  // ONLY get product from Redux - reviews and ratings come from product object
  const { currentProduct: product, similarProducts, productDetailLoading, similarProductsLoading, error } = useSelector(state => state.products);
  const { updatingItems } = useSelector(state => state.cart);

  const [selectedColor, setSelectedColor] = useState(null)
  const [selectedSize, setSelectedSize] = useState(null)
  const [mainImage, setMainImage] = useState('')
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [reviewData, setReviewData] = useState({
    rating: 0,
    comment: ''
  })
  const [quantity, setQuantity] = useState(1)
  const [imageGallery, setImageGallery] = useState([])
  const [userHasPurchased, setUserHasPurchased] = useState(false)

  useEffect(() => {
    dispatch(fetchProductDetail(productId))
    return () => {
      dispatch(clearCurrentProduct())
    }
  }, [dispatch, productId])

  useEffect(() => {
    if (product) {
      if (product.imageUrl) {
        setMainImage(product.imageUrl)
      }
      if (product.sizes && product.sizes.length > 0) {
        setSelectedSize(product.sizes[0])
      }
      if (product.category) {
        const category = {
          category1: product.category.category1 || '',
          category2: product.category.category2 || '',
          category3: product.category.category3 || '',
        }
        dispatch(fetchSimilarProducts({ category, currentProductId: productId }))
      }
      
      const gallery = [
        { src: product.imageUrl, alt: product.title },
        { src: product.imageUrl, alt: product.title + ' - View 2' },
        { src: product.imageUrl, alt: product.title + ' - View 3' },
        { src: product.imageUrl, alt: product.title + ' - View 4' }
      ]
      setImageGallery(gallery)

      checkUserPurchase(product._id)
    }
  }, [product, dispatch, productId])

  useEffect(() => {
    if (error) {
      console.error('Error loading product:', error)
      dispatch(clearError())
    }
  }, [error, dispatch])

  const checkUserPurchase = async (productId) => {
    try {
      const response = await axios.get(`/api/order/checkPurchase?productId=${productId}`)
      setUserHasPurchased(response.data.hasPurchased || false)
    } catch (error) {
      setUserHasPurchased(false)
    }
  }

  const handleAddToCart = async () => {
    if (!selectedSize) {
        toast.error('Please select a size');
        return;
    }

    if (!product) {
        toast.error('Product information not available');
        return;
    }

    try {
        const cartData = {
            id: product._id || productId,
            size: selectedSize.name,
            quantity: quantity,
            price: product.price,
            discountedPrice: product.discountedPrice
        };

        const response = await axios.post('/api/cart/', cartData);
        dispatch(fetchCart());
        if (response.data && response.data.success) {
            toast.success('Product added to cart successfully!');
        } else {
            toast.success('Product added to cart!');
        }
        
    } catch (error) {
        console.error('Error adding to cart:', error);
        if (error.response?.status === 401) {
            toast.error('Please login first');
            router.push('/auth/login');
        } else {
            toast.error('Failed to add to cart');
        }
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
    if (reviewData.rating === 0) {
      toast.error('Please select a rating')
      return
    }
    setShowReviewModal(false)
    setReviewData({ rating: 0, comment: '' })
  }

  const renderStars = (rating) => {
    return [0, 1, 2, 3, 4].map((star) => (
      <StarIcon
        key={star}
        className={classNames(
          star < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300',
          'h-4 w-4 flex-shrink-0'
        )}
        aria-hidden="true"
      />
    ))
  }

  if (productDetailLoading) {
    return <Loading/>
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

  const isAddingToCart = updatingItems.includes(product._id)

  return (
    <div className="bg-white">
      {showReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Write a Review</h3>
            <form onSubmit={handleReviewSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewData({...reviewData, rating: star})}
                      className="text-3xl transition-transform hover:scale-125"
                    >
                      {star <= reviewData.rating ? (
                        <span className="text-yellow-400">★</span>
                      ) : (
                        <span className="text-gray-300">☆</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Review</label>
                <textarea
                  value={reviewData.comment}
                  onChange={(e) => setReviewData({...reviewData, comment: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Share your experience..."
                  rows={4}
                />
              </div>
              
              <div className="flex gap-3">
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
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="pt-6">
        <nav aria-label="Breadcrumb" className="px-4 sm:px-6 lg:px-8">
          <ol className="flex items-center max-w-7xl mx-auto space-x-2 overflow-x-auto py-2">
            <li>
              <Link 
                href="/" 
                className="text-xs sm:text-sm font-medium text-gray-500 hover:text-indigo-600"
              >
                Home
              </Link>
            </li>
            {product.category && (
              <>
                <span className="text-gray-300">›</span>
                <li>
                  <Link 
                    href={`/product?category1=${product.category.category1}`}
                    className="text-xs sm:text-sm font-medium text-gray-500 hover:text-indigo-600 truncate"
                  >
                    {product.category.category1}
                  </Link>
                </li>
                <span className="text-gray-300">›</span>
                <li>
                  <Link 
                    href={`/product?category1=${product.category.category1}&category2=${product.category.category2}`}
                    className="text-xs sm:text-sm font-medium text-gray-500 hover:text-indigo-600 truncate"
                  >
                    {product.category.category2}
                  </Link>
                </li>
                <span className="text-gray-300">›</span>
                <li>
                  <span className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                    {product.category.category3}
                  </span>
                </li>
              </>
            )}
          </ol>
        </nav>

        <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            <div className="flex gap-3 order-2 md:order-1">
              <div className="flex md:flex-col gap-2 order-2 md:order-1">
                {imageGallery.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setMainImage(image.src)}
                    className={`w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100 border-2 transition-all ${
                      mainImage === image.src ? 'border-indigo-500' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>

              <div className="flex-1 order-1 md:order-2">
                <div className="w-full aspect-square overflow-hidden rounded-lg bg-gray-100 shadow-sm">
                  <img
                    src={mainImage || product.imageUrl}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            <div className="order-1 md:order-2">
              <div className="mb-2">
                <span className="text-xs font-medium text-gray-500 uppercase">
                  {product.category?.category1}
                </span>
              </div>

              <div className="flex items-start justify-between gap-4 mb-3">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{product.title}</h1>
                <button className="p-2 text-gray-400 hover:text-red-500 flex-shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
              </div>
              
              <p className="text-sm sm:text-base text-gray-600 mb-4 leading-relaxed">{product.description}</p>

              <div className="mb-4 flex items-center gap-3 flex-wrap">
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">₹{product.price}</p>
                <s className="text-base sm:text-lg text-gray-400">₹{product.discountedPrice}</s>
                <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-full">
                  {product.discountPercent}% OFF
                </span>
              </div>

              <div className="mb-4 pb-4 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <div className="flex gap-0.5">
                    {renderStars(product.averageRating || 0)}
                  </div>
                  <p className="text-sm font-semibold text-gray-900">{(product.averageRating || 0).toFixed(1)}/5</p>
                  <p className="text-xs text-gray-600">({product.totalRatings || 0})</p>
                </div>
              </div>

              {product.sizes && product.sizes.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium text-gray-900">Size</h3>
                    <a href="#" className="text-xs font-medium text-indigo-600 hover:text-indigo-500">
                      Size guide
                    </a>
                  </div>
                  <RadioGroup value={selectedSize} onChange={setSelectedSize}>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {product.sizes.map((size) => (
                        <RadioGroup.Option
                          key={size._id}
                          value={size}
                          disabled={size.quantity === 0}
                          className={({ checked }) =>
                            classNames(
                              size.quantity > 0 ? 'cursor-pointer' : 'cursor-not-allowed',
                              checked ? 'ring-2 ring-indigo-500 bg-indigo-50' : 'border border-gray-300',
                              'p-2 text-center text-xs font-medium rounded-lg transition-all'
                            )
                          }
                        >
                          <span>{size.name}</span>
                        </RadioGroup.Option>
                      ))}
                    </div>
                  </RadioGroup>
                </div>
              )}

              <div className="flex gap-3 mb-6">
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button 
                    onClick={decreaseQuantity}
                    className="px-3 py-2 text-gray-600 hover:text-indigo-600"
                  >
                    −
                  </button>
                  <span className="px-4 py-2 font-medium">{quantity}</span>
                  <button 
                    onClick={increaseQuantity}
                    className="px-3 py-2 text-gray-600 hover:text-indigo-600"
                  >
                    +
                  </button>
                </div>
                <button 
                  onClick={handleAddToCart}
                  disabled={isAddingToCart || product.quantity === 0}
                  className={`flex-1 px-6 py-2 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2 ${
                    isAddingToCart || product.quantity === 0
                      ? 'bg-gray-400 text-white cursor-not-allowed'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  }`}
                >
                  {isAddingToCart ? (
                    <>
                      <svg className="animate-spin h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" opacity="0.25"></circle>
                        <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" opacity="0.75"></path>
                      </svg>
                      Adding...
                    </>
                  ) : (
                    product.quantity === 0 ? 'Out of Stock' : 'Add to Cart'
                  )}
                </button>
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-2 text-sm">
                <div className="flex gap-4">
                  <span className="font-medium text-gray-900 w-20">Brand</span>
                  <span className="text-gray-600">{product.brand}</span>
                </div>
                <div className="flex gap-4">
                  <span className="font-medium text-gray-900 w-20">Color</span>
                  <span className="text-gray-600">{product.color}</span>
                </div>
                <div className="flex gap-4">
                  <span className="font-medium text-gray-900 w-20">Stock</span>
                  <span className="text-gray-600">{product.quantity > 0 ? 'In Stock' : 'Out of Stock'}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16 py-8 sm:py-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">Customer Reviews</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              {productDetailLoading ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
              ) : product?.reviews && product.reviews.length > 0 ? (
                <div className="space-y-4">
                  {product.reviews.map((review) => {
                    const matchingRating = product.ratings?.find(r => r.user?._id === review.user?._id);
                    return (
                      <ProductReviewCard 
                        key={review._id} 
                        review={{
                          name: review.user?.username || 'User',
                          date: review.createdAt,
                          rating: matchingRating?.rating || 0,
                          comment: review.review,
                          verified: true
                        }}
                      />
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <p className="text-gray-600 text-sm">No reviews yet. Be the first!</p>
                </div>
              )}
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-bold text-gray-900 mb-4">Rating</h3>
              
              {product?.ratings && product.ratings.length > 0 ? (
                <>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="text-3xl font-bold text-gray-900">{(product.averageRating || 0).toFixed(1)}</div>
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={`text-lg ${i < Math.floor(product.averageRating || 0) ? 'text-yellow-400' : 'text-gray-300'}`}>
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 mb-4">{product.totalRatings} rating{product.totalRatings !== 1 ? 's' : ''}</p>
                  <div className="border-t border-gray-200 pt-4 mb-4">
                    {product.ratings && product.ratings.length > 0 && (
                      <div className="space-y-2">
                        {[5, 4, 3, 2, 1].map((star) => {
                          const count = product.ratings.filter(r => r.rating === star).length;
                          const percentage = product.ratings.length > 0 ? (count / product.ratings.length) * 100 : 0;
                          return (
                            <div key={star} className="flex items-center gap-2">
                              <span className="text-xs font-medium text-gray-600 w-8">{star}★</span>
                              <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-yellow-400" 
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                              <span className="text-xs text-gray-600 w-6 text-right">{count}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <p className="text-xs text-gray-600 mb-4">No ratings yet</p>
              )}

              {userHasPurchased ? (
                <button 
                  onClick={() => setShowReviewModal(true)}
                  className="w-full bg-indigo-600 text-white py-2 rounded-lg font-medium text-sm hover:bg-indigo-700"
                >
                  Write Review
                </button>
              ) : (
                <div className="text-center py-2 bg-yellow-50 rounded-lg border border-yellow-200">
                  <p className="text-xs text-yellow-800">Buy this product to leave a review</p>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16 mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">You May Also Like</h2>
          {similarProductsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 aspect-square rounded-lg mb-3"></div>
                  <div className="h-3 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : similarProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {similarProducts.map((p) => (
                <ProductCard key={p._id} data={p} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-gray-500 text-sm">No similar products</p>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}