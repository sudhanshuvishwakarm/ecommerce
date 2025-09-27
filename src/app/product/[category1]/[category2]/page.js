'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-toastify';
import ProductCard from '../../../../../components/product/ProductCard.jsx';
import Loading from '../../../../../components/loader/Loading.jsx';

export default function ProductListingPage() {
  const params = useParams();
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('newest');
  const [filterPrice, setFilterPrice] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

  const category1 = params.category1;
  const category2 = params.category2;
  const category3 = params.category3;

  const getBreadcrumbs = () => {
    const breadcrumbs = [
      { name: 'Home', href: '/' }
    ];
    
    if (category1) {
      breadcrumbs.push({ 
        name: category1.charAt(0).toUpperCase() + category1.slice(1), 
        href: `/product/${category1}` 
      });
    }
    
    if (category2) {
      breadcrumbs.push({ 
        name: category2.charAt(0).toUpperCase() + category2.slice(1), 
        href: `/product/${category1}/${category2}` 
      });
    }
    
    if (category3) {
      breadcrumbs.push({ 
        name: category3.charAt(0).toUpperCase() + category3.slice(1), 
        href: `/product/${category1}/${category2}/${category3}` 
      });
    }
    
    return breadcrumbs;
  };

  const getPageTitle = () => {
    if (category3) return category3.charAt(0).toUpperCase() + category3.slice(1);
    if (category2) return category2.charAt(0).toUpperCase() + category2.slice(1);
    if (category1) return category1.charAt(0).toUpperCase() + category1.slice(1);
    return 'Products';
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.post('/api/products/category', {
        category1,
        category2: category2 || undefined,
        category3: category3 || undefined
      });
      
      if (response.data && Array.isArray(response.data)) {
        setProducts(response.data);
      } else {
        setProducts([]);
        toast.info('No products found in this category');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      if (error.response?.status === 404) {
        toast.error('Category not found');
      } else {
        toast.error('Failed to load products');
      }
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [category1, category2, category3]);

  const sortProducts = (products) => {
    const sorted = [...products];
    switch (sortBy) {
      case 'price-low':
        return sorted.sort((a, b) => a.discountedPrice - b.discountedPrice);
      case 'price-high':
        return sorted.sort((a, b) => b.discountedPrice - a.discountedPrice);
      case 'name':
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      case 'discount':
        return sorted.sort((a, b) => b.discountPercent - a.discountPercent);
      default:
        return sorted;
    }
  };

  const filterProducts = (products) => {
    if (filterPrice === 'all') return products;
    
    return products.filter(product => {
      const price = product.discountedPrice;
      switch (filterPrice) {
        case 'under-500':
          return price < 500;
        case '500-1000':
          return price >= 500 && price <= 1000;
        case '1000-2000':
          return price >= 1000 && price <= 2000;
        case 'above-2000':
          return price > 2000;
        default:
          return true;
      }
    });
  };

  const processedProducts = sortProducts(filterProducts(products));
  const totalProducts = processedProducts.length;
  const totalPages = Math.ceil(totalProducts / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const currentProducts = processedProducts.slice(startIndex, endIndex);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <nav className="flex mb-6" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            {getBreadcrumbs().map((breadcrumb, index) => (
              <li key={index} className="inline-flex items-center">
                {index > 0 && (
                  <svg className="w-6 h-6 text-gray-400 mx-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                )}
                {index === getBreadcrumbs().length - 1 ? (
                  <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">{breadcrumb.name}</span>
                ) : (
                  <button
                    onClick={() => router.push(breadcrumb.href)}
                    className="ml-1 text-sm font-medium text-gray-700 hover:text-[#4f39f6] md:ml-2 transition-colors"
                  >
                    {breadcrumb.name}
                  </button>
                )}
              </li>
            ))}
          </ol>
        </nav>

        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{getPageTitle()}</h1>
            <p className="text-gray-600">
              {totalProducts > 0 
                ? `Showing ${startIndex + 1}-${Math.min(endIndex, totalProducts)} of ${totalProducts} products`
                : 'No products found'
              }
            </p>
          </div>

          {totalProducts > 0 && (
            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
              <div className="flex flex-col">
                <label htmlFor="price-filter" className="text-sm font-medium text-gray-700 mb-1">Price Range</label>
                <select
                  id="price-filter"
                  value={filterPrice}
                  onChange={(e) => {
                    setFilterPrice(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4f39f6] focus:border-transparent bg-white text-sm min-w-[150px]"
                >
                  <option value="all">All Prices</option>
                  <option value="under-500">Under ₹500</option>
                  <option value="500-1000">₹500 - ₹1000</option>
                  <option value="1000-2000">₹1000 - ₹2000</option>
                  <option value="above-2000">Above ₹2000</option>
                </select>
              </div>

              <div className="flex flex-col">
                <label htmlFor="sort-select" className="text-sm font-medium text-gray-700 mb-1">Sort By</label>
                <select
                  id="sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4f39f6] focus:border-transparent bg-white text-sm min-w-[150px]"
                >
                  <option value="newest">Newest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Name: A to Z</option>
                  <option value="discount">Highest Discount</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {totalProducts === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">No products found</h2>
            <p className="text-gray-600 mb-6">
              We couldn't find any products in this category. Try browsing other categories or adjusting your filters.
            </p>
            <button
              onClick={() => router.push('/')}
              className="bg-[#4f39f6] text-white px-6 py-3 rounded-lg hover:bg-[#3d2ed4] transition-colors font-medium"
            >
              Browse All Products
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {currentProducts.map(product => (
                <ProductCard key={product._id} data={product} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2 mt-12">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                
                {[...Array(totalPages)].map((_, index) => {
                  const page = index + 1;
                  const isCurrentPage = page === currentPage;
                  const shouldShow = page === 1 || page === totalPages || Math.abs(page - currentPage) <= 2;
                  
                  if (!shouldShow) {
                    if (page === currentPage - 3 || page === currentPage + 3) {
                      return (
                        <span key={page} className="px-2 py-2 text-gray-500">
                          ...
                        </span>
                      );
                    }
                    return null;
                  }
                  
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isCurrentPage
                          ? 'bg-[#4f39f6] text-white'
                          : 'border border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}