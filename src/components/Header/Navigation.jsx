'use client'

import { Fragment, useEffect, useState, useCallback, useRef } from 'react'
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Popover,
  PopoverButton,
  PopoverGroup,
  PopoverPanel,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
} from '@headlessui/react'
import { Bars3Icon, MagnifyingGlassIcon, ShoppingBagIcon, XMarkIcon, UserCircleIcon } from '@heroicons/react/24/outline'
import axios from 'axios'
import { toast } from 'react-toastify'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Loading from '../loader/Loading.jsx'

const navigation = {
  categories: [
    {
      id: 'women',
      name: 'Women',
      featured: [
        {
          name: 'New Arrivals',
          href: '/product/women/new-arrivals',
          imageSrc: 'https://tailwindcss.com/plus-assets/img/ecommerce-images/mega-menu-category-01.jpg',
          imageAlt: 'Models sitting back to back, wearing Basic Tee in black and bone.',
        },
        {
          name: 'Basic Tees',
          href: '/product/women/basic-tees',
          imageSrc: 'https://tailwindcss.com/plus-assets/img/ecommerce-images/mega-menu-category-02.jpg',
          imageAlt: 'Close up of Basic Tee fall bundle with off-white, ochre, olive, and black tees.',
        },
      ],
      sections: [
        {
          id: 'clothing',
          name: 'Clothing',
          items: [
            { name: 'Tops', href: '/product/women/clothing/tops' },
            { name: 'Dresses', href: '/product/women/clothing/dresses' },
            { name: 'Pants', href: '/product/women/clothing/pants' },
            { name: 'Denim', href: '/product/women/clothing/denim' },
            { name: 'Sweaters', href: '/product/women/clothing/sweaters' },
            { name: 'T-Shirts', href: '/product/women/clothing/tshirts' },
            { name: 'Jackets', href: '/product/women/clothing/jackets' },
            { name: 'Activewear', href: '/product/women/clothing/activewear' },
          ],
        },
        {
          id: 'accessories',
          name: 'Accessories',
          items: [
            { name: 'Watches', href: '/product/women/accessories/watches' },
            { name: 'Wallets', href: '/product/women/accessories/wallets' },
            { name: 'Bags', href: '/product/women/accessories/bags' },
            { name: 'Sunglasses', href: '/product/women/accessories/sunglasses' },
            { name: 'Hats', href: '/product/women/accessories/hats' },
            { name: 'Belts', href: '/product/women/accessories/belts' },
          ],
        },
      ],
    },
    {
      id: 'men',
      name: 'Men',
      featured: [
        {
          name: 'New Arrivals',
          href: '/product/men/new-arrivals',
          imageSrc: 'https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-04-detail-product-shot-01.jpg',
          imageAlt: 'Drawstring top with elastic loop closure and textured interior padding.',
        },
        {
          name: 'Artwork Tees',
          href: '/product/men/artwork-tees',
          imageSrc: 'https://tailwindcss.com/plus-assets/img/ecommerce-images/category-page-02-image-card-06.jpg',
          imageAlt: 'Three shirts in gray, white, and blue arranged on table with same line drawing of hands and shapes overlapping on front of shirt.',
        },
      ],
      sections: [
        {
          id: 'clothing',
          name: 'Clothing',
          items: [
            { name: 'Shirts', href: '/product/men/clothing/shirts' },
            { name: 'Pants', href: '/product/men/clothing/pants' },
            { name: 'Sweaters', href: '/product/men/clothing/sweaters' },
            { name: 'T-Shirts', href: '/product/men/clothing/tshirts' },
            { name: 'Jackets', href: '/product/men/clothing/jackets' },
            { name: 'Activewear', href: '/product/men/clothing/activewear' },
          ],
        },
        {
          id: 'accessories',
          name: 'Accessories',
          items: [
            { name: 'Watches', href: '/product/men/accessories/watches' },
            { name: 'Wallets', href: '/product/men/accessories/wallets' },
            { name: 'Bags', href: '/product/men/accessories/bags' },
            { name: 'Sunglasses', href: '/product/men/accessories/sunglasses' },
            { name: 'Hats', href: '/product/men/accessories/hats' },
            { name: 'Belts', href: '/product/men/accessories/belts' },
          ],
        },
      ],
    },
  ],
}

export default function Navigation() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [showProfileDropdown, setShowProfileDropdown] = useState(false)
  const [cartItems, setCartItems] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [showMobileSearch, setShowMobileSearch] = useState(false)
  const [searchResults, setSearchResults] = useState([])
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [searchLoading, setSearchLoading] = useState(false)
  
  const searchTimeoutRef = useRef(null)
  const searchContainerRef = useRef(null)

  const handleLogout = useCallback(async () => {
    setLoading(true)
    setShowProfileDropdown(false)
    try {
      await axios.post('/api/users/logout')
      setUser(null)
      setCartItems(0)
      toast.success('Logout successful')
      router.push('/')
    } catch (error) {
      console.error("Logout error:", error)
      toast.error("Something went wrong while logging out")
    } finally {
      setLoading(false)
    }
  }, [router])

  const performSearch = useCallback(async (query) => {
    if (!query.trim()) {
      setSearchResults([])
      setShowSearchResults(false)
      return
    }

    setSearchLoading(true)
    try {
      const response = await axios.post('/api/products/search', {
        query: query.trim()
      })
      
      setSearchResults(response.data.slice(0, 8))
      setShowSearchResults(true)
    } catch (error) {
      console.error('Search error:', error)
      setSearchResults([])
    } finally {
      setSearchLoading(false)
    }
  }, [])

  const handleSearchInputChange = useCallback((e) => {
    const query = e.target.value
    setSearchQuery(query)

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    searchTimeoutRef.current = setTimeout(() => {
      performSearch(query)
    }, 300)
  }, [performSearch])

  const handleSearch = useCallback((e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
      setShowMobileSearch(false)
      setShowSearchResults(false)
    }
  }, [searchQuery, router])

  const handleSearchResultClick = useCallback((productId) => {
    router.push(`/product/productDetail/${productId}`)
    setShowSearchResults(false)
    setSearchQuery('')
    setShowMobileSearch(false)
  }, [router])

  const handleMobileLinkClick = useCallback(() => {
    setOpen(false)
  }, [])

  const fetchUserAndCartData = useCallback(async () => {
    try {
      setLoading(true)
      const [userRes, cartRes] = await Promise.all([
        axios.post('/api/users/me').catch(() => null),
        axios.get('/api/cart').catch(() => ({ data: { cart: { totalItem: 0 } } }))
      ])
      
      if (userRes?.data) {
        setUser(userRes.data)
        setCartItems(cartRes.data.cart?.totalItem || 0)
      } else {
        setUser(null)
        setCartItems(0)
      }
    } catch (error) {
      console.error("Failed to fetch data:", error)
      setUser(null)
      setCartItems(0)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchUserAndCartData()
  }, [fetchUserAndCartData])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showProfileDropdown && !event.target.closest('.profile-dropdown')) {
        setShowProfileDropdown(false)
      }
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setShowSearchResults(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showProfileDropdown])

  return (
    <div className="bg-white">
      <Dialog open={open} onClose={setOpen} className="relative z-40 lg:hidden">
        <DialogBackdrop className="fixed inset-0 bg-black/25 transition-opacity duration-300" />
        <div className="fixed inset-0 z-40 flex">
          <DialogPanel className="relative flex w-full max-w-xs transform flex-col overflow-y-auto bg-white pb-12 shadow-xl transition duration-300">
            <div className="flex px-4 pt-5 pb-2 justify-between items-center border-b border-gray-200">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="relative -m-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-colors"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
              <button
                type="button"
                onClick={() => setShowMobileSearch(!showMobileSearch)}
                className="relative -m-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-colors"
              >
                <MagnifyingGlassIcon className="h-6 w-6" />
              </button>
            </div>

            {showMobileSearch && (
              <div className="px-4 py-4 border-b border-gray-200">
                <form onSubmit={handleSearch}>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={handleSearchInputChange}
                      className="w-full px-4 py-3 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4f39f6] focus:border-transparent text-sm"
                    />
                    <MagnifyingGlassIcon className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                  </div>
                </form>
              </div>
            )}

            <TabGroup className="mt-2">
              <div className="border-b border-gray-200">
                <TabList className="-mb-px flex space-x-8 px-4">
                  {navigation.categories.map((category) => (
                    <Tab
                      key={category.name}
                      className="flex-1 border-b-2 border-transparent px-1 py-4 text-base font-medium text-gray-900 data-selected:border-[#4f39f6] data-selected:text-[#4f39f6] transition-colors"
                    >
                      {category.name}
                    </Tab>
                  ))}
                </TabList>
              </div>
              <TabPanels>
                {navigation.categories.map((category) => (
                  <TabPanel key={category.name} className="space-y-10 px-4 pt-10 pb-8">
                    <div className="grid grid-cols-2 gap-x-4">
                      {category.featured.map((item) => (
                        <div key={item.name} className="group relative text-sm">
                          <img
                            alt={item.imageAlt}
                            src={item.imageSrc}
                            className="aspect-square w-full rounded-lg bg-gray-100 object-cover group-hover:opacity-75 transition-opacity"
                          />
                          <Link 
                            href={item.href} 
                            onClick={handleMobileLinkClick}
                            className="mt-6 block font-medium text-gray-900"
                          >
                            <span className="absolute inset-0 z-10" />
                            {item.name}
                          </Link>
                          <p className="mt-1 text-gray-500">Shop now</p>
                        </div>
                      ))}
                    </div>
                    {category.sections.map((section) => (
                      <div key={section.name}>
                        <p className="font-medium text-gray-900">{section.name}</p>
                        <ul className="mt-6 flex flex-col space-y-6">
                          {section.items.map((item) => (
                            <li key={item.name} className="flow-root">
                              <Link 
                                href={item.href} 
                                onClick={handleMobileLinkClick}
                                className="-m-2 block p-2 text-gray-500 hover:text-gray-700 transition-colors"
                              >
                                {item.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </TabPanel>
                ))}
              </TabPanels>
            </TabGroup>

            <div className="space-y-6 border-t border-gray-200 px-4 py-6">
              {user ? (
                <>
                  <div className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
                    <UserCircleIcon className="h-8 w-8 text-[#4f39f6]" />
                    <span className="font-medium text-gray-900">Welcome back!</span>
                  </div>
                  <div className="space-y-2">
                    <Link href="/account" onClick={handleMobileLinkClick} className="block py-2 text-gray-700 hover:text-[#4f39f6] transition-colors">My Profile</Link>
                    <Link href="/orders" onClick={handleMobileLinkClick} className="block py-2 text-gray-700 hover:text-[#4f39f6] transition-colors">My Orders</Link>
                    <Link href="/cart" onClick={handleMobileLinkClick} className="block py-2 text-gray-700 hover:text-[#4f39f6] transition-colors">My Cart ({cartItems})</Link>
                    <Link href="/wishlist" onClick={handleMobileLinkClick} className="block py-2 text-gray-700 hover:text-[#4f39f6] transition-colors">Wishlist</Link>
                    <button onClick={handleLogout} className="block w-full text-left py-2 text-gray-700 hover:text-[#4f39f6] transition-colors">
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Link href="/auth/login" onClick={handleMobileLinkClick} className="block py-2 font-medium text-gray-900 hover:text-[#4f39f6] transition-colors">
                    Sign in
                  </Link>
                  <Link href="/auth/signup" onClick={handleMobileLinkClick} className="block py-2 font-medium text-gray-900 hover:text-[#4f39f6] transition-colors">
                    Create account
                  </Link>
                </>
              )}
            </div>
          </DialogPanel>
        </div>
      </Dialog>

      {loading && <Loading />}

      <header className="relative bg-white shadow-sm">
        <div className="bg-gradient-to-r from-[#4f39f6] to-[#6366f1] text-white">
          <p className="flex h-10 items-center justify-center px-4 text-sm font-medium">
            Free shipping on orders over ₹1000 🚚
          </p>
        </div>

        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="border-b border-gray-200">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center">
                <button
                  type="button"
                  onClick={() => setOpen(true)}
                  className="relative rounded-md bg-white p-2 text-gray-400 lg:hidden hover:text-gray-500 hover:bg-gray-100 transition-colors shadow-sm border border-gray-200"
                >
                  <Bars3Icon className="h-6 w-6" />
                </button>

                <div className="ml-4 flex lg:ml-0">
                  <Link href="/" className="flex items-center space-x-2">
                    <img
                      alt="Logo"
                      src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
                      className="h-8 w-auto"
                    />
                    <span className="hidden sm:block text-xl font-bold text-gray-900">StyleHub</span>
                  </Link>
                </div>
              </div>

              <div className="hidden md:flex flex-1 max-w-2xl mx-8" ref={searchContainerRef}>
                <form onSubmit={handleSearch} className="w-full relative">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search for products, brands, categories..."
                      value={searchQuery}
                      onChange={handleSearchInputChange}
                      className="w-full px-4 py-3 pl-12 pr-16 border-2 border-gray-200 rounded-full focus:ring-2 focus:ring-[#4f39f6]  transition-all shadow-sm hover:shadow-md text-sm"
                    />
                    <MagnifyingGlassIcon className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                    <button
                      type="submit"
                      className="absolute right-2 top-1.5 bg-[#4f39f6] text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-[#3d2ed4] transition-colors shadow-sm"
                    >
                      Search
                    </button>
                  </div>

                  {showSearchResults && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-96 overflow-y-auto">
                      {searchLoading ? (
                        <div className="p-4 text-center">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#4f39f6] mx-auto"></div>
                          <p className="text-sm text-gray-500 mt-2">Searching...</p>
                        </div>
                      ) : searchResults.length > 0 ? (
                        <>
                          {searchResults.map((product) => (
                            <div
                              key={product._id}
                              onClick={() => handleSearchResultClick(product._id)}
                              className="flex items-center p-3 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0"
                            >
                              <img
                                src={product.imageUrl}
                                alt={product.title}
                                className="w-12 h-12 object-cover rounded-lg mr-3"
                              />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">{product.title}</p>
                                <p className="text-sm text-gray-500">₹{product.discountedPrice}</p>
                              </div>
                            </div>
                          ))}
                          {searchQuery && (
                            <div className="p-3 border-t border-gray-200 bg-gray-50">
                              <button
                                onClick={handleSearch}
                                className="text-sm text-[#4f39f6] hover:text-[#3d2ed4] font-medium"
                              >
                                View all results for "{searchQuery}" →
                              </button>
                            </div>
                          )}
                        </>
                      ) : searchQuery && (
                        <div className="p-4 text-center">
                          <p className="text-sm text-gray-500">No products found for "{searchQuery}"</p>
                        </div>
                      )}
                    </div>
                  )}
                </form>
              </div>

              <PopoverGroup className="hidden lg:ml-8 lg:block lg:self-stretch">
                <div className="flex h-full space-x-8">
                  {navigation.categories.map((category) => (
                    <Popover key={category.name} className="flex">
                      {({ close }) => (
                        <>
                          <PopoverButton className="group relative flex items-center justify-center text-sm font-medium text-gray-700 transition-colors duration-200 hover:text-gray-800 data-open:text-[#4f39f6] px-3 py-2 rounded-lg hover:bg-gray-50">
                            {category.name}
                            <span className="absolute inset-x-0 -bottom-px h-0.5 transition duration-200 group-data-open:bg-[#4f39f6]" />
                          </PopoverButton>
                          <PopoverPanel className="absolute inset-x-0 top-full z-20 bg-white shadow-2xl transition duration-200 border-t border-gray-200">
                            <div className="relative bg-white">
                              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                                <div className="grid grid-cols-2 gap-x-8 gap-y-10 py-16">
                                  <div className="col-start-2 grid grid-cols-2 gap-x-8">
                                    {category.featured.map((item) => (
                                      <div key={item.name} className="group relative text-base">
                                        <img
                                          alt={item.imageAlt}
                                          src={item.imageSrc}
                                          className="aspect-square w-full rounded-xl bg-gray-100 object-cover group-hover:opacity-75 transition-opacity shadow-sm"
                                        />
                                        <Link 
                                          href={item.href} 
                                          onClick={() => close()}
                                          className="mt-6 block font-medium text-gray-900 hover:text-[#4f39f6] transition-colors"
                                        >
                                          <span className="absolute inset-0 z-10" />
                                          {item.name}
                                        </Link>
                                        <p className="mt-1 text-gray-500">Shop now</p>
                                      </div>
                                    ))}
                                  </div>
                                  <div className="row-start-1 grid grid-cols-3 gap-x-8 gap-y-10 text-sm">
                                    {category.sections.map((section) => (
                                      <div key={section.name}>
                                        <p className="font-semibold text-gray-900 mb-4">{section.name}</p>
                                        <ul className="space-y-4">
                                          {section.items.map((item) => (
                                            <li key={item.name}>
                                              <Link 
                                                href={item.href} 
                                                onClick={() => close()}
                                                className="hover:text-[#4f39f6] transition-colors py-1 block"
                                              >
                                                {item.name}
                                              </Link>
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </PopoverPanel>
                        </>
                      )}
                    </Popover>
                  ))}
                </div>
              </PopoverGroup>

              <div className="flex items-center space-x-4">
                <button
                  type="button"
                  onClick={() => setShowMobileSearch(!showMobileSearch)}
                  className="md:hidden p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <MagnifyingGlassIcon className="h-6 w-6" />
                </button>

                {user ? (
                  <div className="relative profile-dropdown">
                    <button
                      onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                      className="flex items-center space-x-1 p-2 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200 hover:border-gray-300 shadow-sm"
                    >
                      <UserCircleIcon className="h-8 w-8 text-[#4f39f6]" />
                    </button>
                    {showProfileDropdown && (
                      <div className="absolute right-0 mt-2 w-64 rounded-xl shadow-2xl bg-white ring-1 ring-black ring-opacity-5 z-50 border border-gray-200">
                        <div className="py-2">
                          <div className="px-4 py-4 border-b border-gray-200 bg-gradient-to-r from-[#4f39f6] to-[#6366f1] text-white rounded-t-xl">
                            <p className="text-sm font-semibold">Welcome back!</p>
                            <p className="text-xs opacity-90">{user.email}</p>
                          </div>
                          <Link href="/account" className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#4f39f6] transition-colors">
                            <UserCircleIcon className="inline w-4 h-4 mr-3" />
                            My Profile
                          </Link>
                          <Link href="/orders" className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#4f39f6] transition-colors">
                            <svg className="inline w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                            My Orders
                          </Link>
                          <Link href="/cart" className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#4f39f6] transition-colors">
                            <ShoppingBagIcon className="inline w-4 h-4 mr-3" />
                            My Cart ({cartItems})
                          </Link>
                          <Link href="/wishlist" className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#4f39f6] transition-colors">
                            <svg className="inline w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                            Wishlist
                          </Link>
                          <div className="border-t border-gray-200 mt-2 pt-2">
                            <button
                              onClick={handleLogout}
                              className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                            >
                              <svg className="inline w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                              </svg>
                              Logout
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="hidden lg:flex items-center space-x-4">
                    <Link href="/auth/login" className="text-sm font-medium text-gray-700 hover:text-[#4f39f6] transition-colors px-3 py-2 rounded-lg hover:bg-gray-50">
                      Sign in
                    </Link>
                    <span className="h-6 w-px bg-gray-200" />
                    <Link href="/auth/signup" className="text-sm font-medium bg-[#4f39f6] text-white px-4 py-2 rounded-lg hover:bg-[#3d2ed4] transition-colors shadow-sm">
                      Create account
                    </Link>
                  </div>
                )}

                <Link href="/cart" className="group flex items-center p-2 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200 hover:border-gray-300 shadow-sm">
                  <ShoppingBagIcon className="h-6 w-6 text-gray-400 group-hover:text-[#4f39f6]" />
                  <span className="ml-2 text-sm font-bold text-gray-700 group-hover:text-[#4f39f6] min-w-[1.5rem] text-center bg-[#4f39f6] text-white px-2 py-1 rounded-full text-xs">
                    {cartItems}
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {showMobileSearch && (
          <div className="md:hidden border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100 px-4 py-4 shadow-inner">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products, brands, categories..."
                  value={searchQuery}
                  onChange={handleSearchInputChange}
                  className="w-full px-4 py-3 pl-12 pr-16 border-2 border-gray-200 rounded-full focus:ring-2 focus:ring-[#4f39f6] focus:border-[#4f39f6] transition-all shadow-sm"
                />
                <MagnifyingGlassIcon className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                <button
                  type="submit"
                  className="absolute right-2 top-1.5 bg-[#4f39f6] text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-[#3d2ed4] transition-colors shadow-sm"
                >
                  Search
                </button>
              </div>
            </form>
          </div>
        )}
      </header>
    </div>
  )
}
// 'use client'

// import { Fragment, useEffect, useState } from 'react'
// import {
//   Dialog,
//   DialogBackdrop,
//   DialogPanel,
//   Popover,
//   PopoverButton,
//   PopoverGroup,
//   PopoverPanel,
//   Tab,
//   TabGroup,
//   TabList,
//   TabPanel,
//   TabPanels,
// } from '@headlessui/react'
// import { Bars3Icon, MagnifyingGlassIcon, ShoppingBagIcon, XMarkIcon } from '@heroicons/react/24/outline'
// import axios from 'axios'
// import { toast } from 'react-toastify'
// import Link from 'next/link'
// import Loading from '../loader/Loading.jsx'
// const navigation = {
//   categories: [
//     {
//       id: 'women',
//       name: 'Women',
//       featured: [
//         {
//           name: 'New Arrivals',
//           href: '#',
//           imageSrc: 'https://tailwindcss.com/plus-assets/img/ecommerce-images/mega-menu-category-01.jpg',
//           imageAlt: 'Models sitting back to back, wearing Basic Tee in black and bone.',
//         },
//         {
//           name: 'Basic Tees',
//           href: '#',
//           imageSrc: 'https://tailwindcss.com/plus-assets/img/ecommerce-images/mega-menu-category-02.jpg',
//           imageAlt: 'Close up of Basic Tee fall bundle with off-white, ochre, olive, and black tees.',
//         },
//       ],
//       sections: [
//         {
//           id: 'clothing',
//           name: 'Clothing',
//           items: [
//             { name: 'Tops', href: '/product/women/clothing/tops' },
//             { name: 'Dresses', href: '/product/women/clothing/dressses' },
//             { name: 'Pants', href: '/product/women/clothing/pants' },
//             { name: 'Denim', href: '/product/women/clothing/denim' },
//             { name: 'Sweaters', href: '/product/women/clothing/sweaters' },
//             { name: 'T-Shirts', href: '/product/women/clothing/tshirts' },
//             { name: 'Jackets', href: '/product/women/clothing/jackets' },
//             { name: 'Activewear', href: '/product/women/clothing/activewear' },
//             { name: 'Browse All', href: '/product/women/clothing/browseall' },
//           ],
//         },
//         {
//           id: 'accessories',
//           name: 'Accessories',
//           items: [
//             { name: 'Watches', href: '/product/women/accessories/watches' },
//             { name: 'Wallets', href: '/product/women/accessories/wallets' },
//             { name: 'Bags', href: '/product/women/accessories/bags' },
//             { name: 'Sunglasses', href: '/product/women/accessories/sunglasses' },
//             { name: 'Hats', href: '/product/women/accessories/hats' },
//             { name: 'Belts', href: '/product/women/accessories/belts' },
//           ],
//         },
//       ],
//     },
//     {
//       id: 'men',
//       name: 'Men',
//       featured: [
//         {
//           name: 'New Arrivals',
//           href: '#',
//           imageSrc:
//             'https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-04-detail-product-shot-01.jpg',
//           imageAlt: 'Drawstring top with elastic loop closure and textured interior padding.',
//         },
//         {
//           name: 'Artwork Tees',
//           href: '#',
//           imageSrc: 'https://tailwindcss.com/plus-assets/img/ecommerce-images/category-page-02-image-card-06.jpg',
//           imageAlt:
//             'Three shirts in gray, white, and blue arranged on table with same line drawing of hands and shapes overlapping on front of shirt.',
//         },
//       ],
//       sections: [
//         {
//           id: 'clothing',
//           name: 'Clothing',
//           items: [
//             { name: 'Shirts', href: '/product/men/clothing/shirts' },
//             { name: 'Pants', href: '/product/men/clothing/pants' },
//             { name: 'Sweaters', href: '/product/men/clothing/sweaters' },
//             { name: 'T-Shirts', href: '/product/men/clothing/tshirts' },
//             { name: 'Jackets', href: '/product/men/clothing/jackets' },
//             { name: 'Activewear', href: '/product/men/clothing/activewear' },
//             { name: 'Browse All', href: '/product/men/clothing/browseall' },
//           ],
//         },
//         {
//           id: 'accessories',
//           name: 'Accessories',
//           items: [
//             { name: 'Watches', href: '/product/men/accessories/watches' },
//             { name: 'Wallets', href: '/product/men/accessories/wallets' },
//             { name: 'Bags', href: '/product/men/accessories/bags' },
//             { name: 'Sunglasses', href: '/product/men/accessories/sunglasses' },
//             { name: 'Hats', href: '/product/men/accessories/hats' },
//             { name: 'Belts', href: '/product/men/accessories/belts' },
//           ],
//         },
//       ],
//     },
//   ],
//   pages: [
//     { name: 'Company', href: '#' },
//     { name: 'Stores', href: '#' },
//   ],
// }

// export default function Navigation() {
//   const [open, setOpen] = useState(false)
//   const [me, setMe] = useState(false)
//   const [loading, setLoading] = useState(false);
//   const [showProfileDropdown, setShowProfileDropdown] = useState(false);
//   const [cartItems, setCartItems] = useState(0);
//   const onLogout = async() => {
//     setLoading(true);
//     setShowProfileDropdown(false);
//     try {
//       const res = axios.post('/api/users/logout');
//       setMe(false);
//       setLoading(false);
//       toast.success('Logout successful');
//     } catch (error) {
//       console.error("Logout error:", error);
//       toast.error("Something went wrong while logging out.");
//     }
//   }




//   useEffect(() => {
//     let isMounted = true;
//     const fetchUserData = async () => {
//       try {
//         setLoading(true);
//         const res = await axios.post('/api/users/me');
//         const response = await axios.get('/api/cart');
//         setCartItems(response.data.cart.totalItem);
//         if (isMounted) {
//           setMe(res.data);
//         }
//       } catch (error) {
//         console.error("Failed to fetch user data:", error);
//         if (isMounted) {
//           setMe(false);
//         }
//       } finally {
//         if (isMounted) {
//           setLoading(false);
//         }
//       }
//     };

//     fetchUserData();
//     return () => {
//       isMounted = false;
//     };
//   }, []);

//   return (
//     <div className="bg-white">
//       {/* Mobile menu */}
//       <Dialog open={open} onClose={setOpen} className="relative z-40 lg:hidden">
//         <DialogBackdrop
//           transition
//           className="fixed inset-0 bg-black/25 transition-opacity duration-300 ease-linear data-closed:opacity-0"
//         />
//         <div className="fixed inset-0 z-40 flex">
//           <DialogPanel
//             transition
//             className="relative flex w-full max-w-xs transform flex-col overflow-y-auto bg-white pb-12 shadow-xl transition duration-300 ease-in-out data-closed:-translate-x-full"
//           >
//             <div className="flex px-4 pt-5 pb-2">
//               <button
//                 type="button"
//                 onClick={() => setOpen(false)}
//                 className="relative -m-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400"
//               >
//                 <span className="absolute -inset-0.5" />
//                 <span className="sr-only">Close menu</span>
//                 <XMarkIcon aria-hidden="true" className="size-6" />
//               </button>
//             </div>
//             <TabGroup className="mt-2">
//               <div className="border-b border-gray-200">
//                 <TabList className="-mb-px flex space-x-8 px-4">
//                   {navigation.categories.map((category) => (
//                     <Tab
//                       key={category.name}
//                       className="flex-1 border-b-2 border-transparent px-1 py-4 text-base font-medium whitespace-nowrap text-gray-900 data-selected:border-indigo-600 data-selected:text-indigo-600"
//                     >
//                       {category.name}
//                     </Tab>
//                   ))}
//                 </TabList>
//               </div>
//               <TabPanels as={Fragment}>
//                 {navigation.categories.map((category) => (
//                   <TabPanel key={category.name} className="space-y-10 px-4 pt-10 pb-8">
//                     <div className="grid grid-cols-2 gap-x-4">
//                       {category.featured.map((item) => (
//                         <div key={item.name} className="group relative text-sm">
//                           <img
//                             alt={item.imageAlt}
//                             src={item.imageSrc}
//                             className="aspect-square w-full rounded-lg bg-gray-100 object-cover group-hover:opacity-75"
//                           />
//                           <a href={item.href} className="mt-6 block font-medium text-gray-900">
//                             <span aria-hidden="true" className="absolute inset-0 z-10" />
//                             {item.name}
//                           </a>
//                           <p aria-hidden="true" className="mt-1">
//                             Shop now
//                           </p>
//                         </div>
//                       ))}
//                     </div>
//                     {category.sections.map((section) => (
//                       <div key={section.name}>
//                         <p id={`${category.id}-${section.id}-heading-mobile`} className="font-medium text-gray-900">
//                           {section.name}
//                         </p>
//                         <ul
//                           role="list"
//                           aria-labelledby={`${category.id}-${section.id}-heading-mobile`}
//                           className="mt-6 flex flex-col space-y-6"
//                         >
//                           {section.items.map((item) => (
//                             <li key={item.name} className="flow-root">
//                               <Link href={item.href} className="-m-2 block p-2 text-gray-500">
//                                 {item.name}
//                               </Link>
//                             </li>
//                           ))}
//                         </ul>
//                       </div>
//                     ))}
//                   </TabPanel>
//                 ))}
//               </TabPanels>
//             </TabGroup>

//             {/* <div className="space-y-6 border-t border-gray-200 px-4 py-6">
//               {navigation.pages.map((page) => (
//                 <div key={page.name} className="flow-root">
//                   <a href={page.href} className="-m-2 block p-2 font-medium text-gray-900">
//                     {page.name}
//                   </a>
//                 </div>
//               ))}
//             </div> */}

//             <div className="space-y-6 border-t border-gray-200 px-4 py-6">
//               <div className="flow-root">
//                 <a href="/auth/login" className="-m-2 block p-2 font-medium text-gray-900">
//                   Sign in
//                 </a>
//               </div>
//               <div className="flow-root">
//                 <a href="/auth/signup" className="-m-2 block p-2 font-medium text-gray-900">
//                   Create account
//                 </a>
//               </div>
//             </div>

//             {/* <div className="border-t border-gray-200 px-4 py-6">
//               <a href="#" className="-m-2 flex items-center p-2">
//                 <img
//                   alt=""
//                   src="https://tailwindcss.com/plus-assets/img/flags/flag-canada.svg"
//                   className="block h-auto w-5 shrink-0"
//                 />
//                 <span className="ml-3 block text-base font-medium text-gray-900">CAD</span>
//                 <span className="sr-only">, change currency</span>
//               </a>
//             </div> */}
//           </DialogPanel>
//         </div>
//       </Dialog>
//       {loading && (
//         <Loading />
//       )}
//       <header className="relative bg-white">
//         <p className="flex h-10 items-center justify-center bg-indigo-600 px-4 text-sm font-medium text-white sm:px-6 lg:px-8">
//           Get free delivery on orders over $100
//         </p>

//         <nav aria-label="Top" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
//           <div className="border-b border-gray-200">
//             <div className="flex h-16 items-center">
//               <button
//                 type="button"
//                 onClick={() => setOpen(true)}
//                 className="relative rounded-md bg-white p-2 text-gray-400 lg:hidden"
//               >
//                 <span className="absolute -inset-0.5" />
//                 <span className="sr-only">Open menu</span>
//                 <Bars3Icon aria-hidden="true" className="size-6" />
//               </button>

//               {/* Logo */}
//               <div className="ml-4 flex lg:ml-0">
//                 <Link href="/">
//                   <span className="sr-only">Your Company</span>
//                   <img
//                     alt=""
//                     src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
//                     className="h-8 w-auto"
//                   />
//                 </Link>
//               </div>

//               {/* Flyout menus */}
//               <PopoverGroup className="hidden lg:ml-8 lg:block lg:self-stretch">
//                 <div className="flex h-full space-x-8">
//                   {navigation.categories.map((category) => (
//                     <Popover key={category.name} className="flex">
//                       <div className="relative flex">
//                         <PopoverButton className="group relative flex items-center justify-center text-sm font-medium text-gray-700 transition-colors duration-200 ease-out hover:text-gray-800 data-open:text-indigo-600">
//                           {category.name}
//                           <span
//                             aria-hidden="true"
//                             className="absolute inset-x-0 -bottom-px z-30 h-0.5 transition duration-200 ease-out group-data-open:bg-indigo-600"
//                           />
//                         </PopoverButton>
//                       </div>
//                       <PopoverPanel
//                         transition
//                         className="absolute inset-x-0 top-full z-20 w-full bg-white text-sm text-gray-500 transition data-closed:opacity-0 data-enter:duration-200 data-enter:ease-out data-leave:duration-150 data-leave:ease-in"
//                       >
//                         {/* Presentational element used to render the bottom shadow, if we put the shadow on the actual panel it pokes out the top, so we use this shorter element to hide the top of the shadow */}
//                         <div aria-hidden="true" className="absolute inset-0 top-1/2 bg-white shadow-sm" />
//                         <div className="relative bg-white">
//                           <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
//                             <div className="grid grid-cols-2 gap-x-8 gap-y-10 py-16">
//                               <div className="col-start-2 grid grid-cols-2 gap-x-8">
//                                 {category.featured.map((item) => (
//                                   <div key={item.name} className="group relative text-base sm:text-sm">
//                                     <img
//                                       alt={item.imageAlt}
//                                       src={item.imageSrc}
//                                       className="aspect-square w-full rounded-lg bg-gray-100 object-cover group-hover:opacity-75"
//                                     />
//                                     <a href={item.href} className="mt-6 block font-medium text-gray-900">
//                                       <span aria-hidden="true" className="absolute inset-0 z-10" />
//                                       {item.name}
//                                     </a>
//                                     <p aria-hidden="true" className="mt-1">
//                                       Shop now
//                                     </p>
//                                   </div>
//                                 ))}
//                               </div>
//                               <div className="row-start-1 grid grid-cols-3 gap-x-8 gap-y-10 text-sm">
//                                 {category.sections.map((section) => (
//                                   <div key={section.name}>
//                                     <p id={`${section.name}-heading`} className="font-medium text-gray-900">
//                                       {section.name}
//                                     </p>
//                                     <ul
//                                       role="list"
//                                       aria-labelledby={`${section.name}-heading`}
//                                       className="mt-6 space-y-6 sm:mt-4 sm:space-y-4"
//                                     >
//                                       {section.items.map((item) => (
//                                         <li key={item.name} className="flex">
//                                           <Link href={item.href} className="hover:text-gray-800">
//                                             {item.name}
//                                           </Link>
//                                         </li>
//                                       ))}
//                                     </ul>
//                                   </div>
//                                 ))}
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       </PopoverPanel>
//                     </Popover>
//                   ))}
//                   {/* {navigation.pages.map((page) => (
//                     <a
//                       key={page.name}
//                       href={page.href}
//                       className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-800"
//                     >
//                       {page.name}
//                     </a>
//                   ))} */}
//                 </div>
//               </PopoverGroup>

//               <div className="ml-auto flex items-center">
//                 {me ? (
//                   <div className="relative">
//                     <button
//                       className="flex items-center space-x-1 focus:outline-none"
//                       onClick={() => setShowProfileDropdown(!showProfileDropdown)}
//                     >
//                       <i className="fa-solid fa-circle-user text-2xl text-indigo-600 hover:text-indigo-700"></i>

//                     </button>
//                     {/* desktop profile dropdown  */}
//                     {showProfileDropdown && (
//                       <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
//                         <div className="py-1">
//                           <Link
//                             href="/account"
//                             className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                           >
//                             <i className="fa-solid fa-user mr-2 text-indigo-500"></i>
//                             My Profile
//                           </Link>
//                           <Link
//                             href="/orders"
//                             className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                           >
//                             <i className="fa-solid fa-box-open mr-2 text-indigo-500"></i>
//                             My Orders
//                           </Link>
//                           <Link
//                             href="/cart"
//                             className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                           >
//                             <i className="fa-solid fa-cart-shopping mr-2 text-indigo-500"></i>
//                             My Cart
//                           </Link>
//                           <Link
//                             href="/wishlist"
//                             className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                           >
//                             <i className="fa-solid fa-heart mr-2 text-indigo-500"></i>
//                             Wishlist
//                           </Link>
//                           <div className="border-t border-gray-200"></div>
//                           <button
//                             onClick={onLogout}
//                             className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                           >
//                             <i className="fa-solid fa-arrow-right-from-bracket mr-2 text-indigo-500"></i>
//                             logout
//                           </button>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 ) : (
//                   <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:space-x-6">
//                     <a href="/auth/login" className="text-sm font-medium text-gray-700 hover:text-gray-800">
//                       Sign in
//                     </a>
//                     <span aria-hidden="true" className="h-6 w-px bg-gray-200" />
//                     <a href="/auth/signup" className="text-sm font-medium text-gray-700 hover:text-gray-800">
//                       Create account
//                     </a>
//                   </div>
//                 )}
//                 {/* Search */}
//                 <div className="flex lg:ml-6">
//                   <a href="#" className="p-2 text-gray-400 hover:text-gray-500">
//                     <span className="sr-only">Search</span>
//                     <MagnifyingGlassIcon aria-hidden="true" className="size-6" />
//                   </a>
//                 </div>

//                 {/* Cart */}
//                 <div className="ml-4 flow-root lg:ml-6">
//                   <Link href="/cart" className="group -m-2 flex items-center p-2">
//                     <ShoppingBagIcon
//                       aria-hidden="true"
//                       className="size-6 shrink-0 text-gray-400 group-hover:text-gray-500"
//                     />
//                     <span className="ml-2 text-md font-medium text-gray-700 font-bold group-hover:text-gray-800">{cartItems}</span>
//                     <span className="sr-only">items in cart, view bag</span>
//                   </Link>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </nav>
//       </header>
//     </div>
//   )
// }
