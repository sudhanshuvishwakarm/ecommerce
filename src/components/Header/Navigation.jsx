'use client'

import { Fragment, useEffect, useState, useRef } from 'react'
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
import { Bars3Icon, ShoppingBagIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'
import { toast } from 'react-toastify'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Loading from '../loader/Loading.jsx'
import { checkAuth, logout as logoutAction } from '../../redux/slices/authSlice.js'
import { fetchCart } from '../../redux/slices/cartSlice.js'

const navigation = {
  categories: [
    {
      id: 'women',
      name: 'Women',
      featured: [
        {
          name: 'New Arrivals',
          href: '#',
          imageSrc: 'https://tailwindcss.com/plus-assets/img/ecommerce-images/mega-menu-category-01.jpg',
          imageAlt: 'Models sitting back to back, wearing Basic Tee in black and bone.',
        },
        {
          name: 'Basic Tees',
          href: '#',
          imageSrc: 'https://tailwindcss.com/plus-assets/img/ecommerce-images/mega-menu-category-02.jpg',
          imageAlt: 'Close up of Basic Tee fall bundle with off-white, ochre, olive, and black tees.',
        },
      ],
      sections: [
        {
          id: 'clothing',
          name: 'Clothing',
          items: [
            { name: 'Tops', href: '/product?category1=women&category2=clothing&category3=tops' },
            { name: 'Dresses', href: '/product?category1=women&category2=clothing&category3=dressses' },
            { name: 'Pants', href: '/product?category1=women&category2=clothing&category3=pants' },
            { name: 'Denim', href: '/product?category1=women&category2=clothing&category3=denim' },
            { name: 'Sweaters', href: '/product?category1=women&category2=clothing&category3=sweaters' },
            { name: 'T-Shirts', href: '/product?category1=women&category2=clothing&category3=tshirts' },
            { name: 'Jackets', href: '/product?category1=women&category2=clothing&category3=jackets' },
            { name: 'Activewear', href: '/product?category1=women&category2=clothing&category3=activewear' },
            { name: 'Browse All', href: '/product?category1=women&category2=clothing&category3=browseall' },
          ],
        },
        {
          id: 'accessories',
          name: 'Accessories',
          items: [
            { name: 'Watches', href: '/product?category1=women&category2=accessories&category3=watches' },
            { name: 'Wallets', href: '/product?category1=women&category2=accessories&category3=wallets' },
            { name: 'Bags', href: '/product?category1=women&category2=accessories&category3=bags' },
            { name: 'Sunglasses', href: '/product?category1=women&category2=accessories&category3=sunglasses' },
            { name: 'Hats', href: '/product?category1=women&category2=accessories&category3=hats' },
            { name: 'Belts', href: '/product?category1=women&category2=accessories&category3=belts' },
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
          href: '#',
          imageSrc:
            'https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-04-detail-product-shot-01.jpg',
          imageAlt: 'Drawstring top with elastic loop closure and textured interior padding.',
        },
        {
          name: 'Artwork Tees',
          href: '#',
          imageSrc: 'https://tailwindcss.com/plus-assets/img/ecommerce-images/category-page-02-image-card-06.jpg',
          imageAlt:
            'Three shirts in gray, white, and blue arranged on table with same line drawing of hands and shapes overlapping on front of shirt.',
        },
      ],
      sections: [
        {
          id: 'clothing',
          name: 'Clothing',
          items: [
            { name: 'Shirts', href: '/product?category1=men&category2=clothing&category3=shirts' },
            { name: 'Pants', href: '/product?category1=men&category2=clothing&category3=pants' },
            { name: 'Sweaters', href: '/product?category1=men&category2=clothing&category3=sweaters' },
            { name: 'T-Shirts', href: '/product?category1=men&category2=clothing&category3=tshirts' },
            { name: 'Jackets', href: '/product?category1=men&category2=clothing&category3=jackets' },
            { name: 'Activewear', href: '/product?category1=men&category2=clothing&category3=activewear' },
            { name: 'Browse All', href: '/product?category1=men&category2=clothing&category3=browseall' },
          ],
        },
        {
          id: 'accessories',
          name: 'Accessories',
          items: [
            { name: 'Watches', href: '/product?category1=men&category2=accessories&category3=watches' },
            { name: 'Wallets', href: '/product?category1=men&category2=accessories&category3=wallets' },
            { name: 'Bags', href: '/product?category1=men&category2=accessories&category3=bags' },
            { name: 'Sunglasses', href: '/product?category1=men&category2=accessories&category3=sunglasses' },
            { name: 'Hats', href: '/product?category1=men&category2=accessories&category3=hats' },
            { name: 'Belts', href: '/product?category1=men&category2=accessories&category3=belts' },
          ],
        },
      ],
    },
  ],
  pages: [
    { name: 'Company', href: '#' },
    { name: 'Stores', href: '#' },
  ],
}

export default function Navigation() {
  const [open, setOpen] = useState(false)
  const [showProfileDropdown, setShowProfileDropdown] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [searchLoading, setSearchLoading] = useState(false)
  
  const router = useRouter()
  const dispatch = useDispatch()
  const profileDropdownRef = useRef(null)
  const searchRef = useRef(null)

  // Redux state
  const { user, isAuthenticated, loading: authLoading } = useSelector(state => state.auth)
  const { cartData } = useSelector(state => state.cart)
  const cartItems = cartData?.totalItem || 0

  // Initialize auth and cart on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        await dispatch(checkAuth()).unwrap()
      } catch (error) {
        console.log("Not authenticated")
      }
    }
    
    initializeAuth()
  }, [dispatch])

  // Refresh cart when user authentication changes
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCart())
    }
  }, [isAuthenticated, dispatch])

  const onLogout = async() => {
    setShowProfileDropdown(false)
    try {
      await dispatch(logoutAction()).unwrap()
      toast.success('Logout successful')
      router.push('/')
    } catch (error) {
      console.error("Logout error:", error)
      toast.error("Something went wrong while logging out.")
    }
  }

  const handleLinkClick = () => {
    setShowProfileDropdown(false)
  }

  const handleSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults([])
      setShowSearchResults(false)
      return
    }

    setSearchLoading(true)
    try {
      const lowerQuery = query.toLowerCase().trim()
      
      let category1 = ''
      let category2 = ''
      let category3 = ''

      if (lowerQuery.includes('men') && !lowerQuery.includes('women')) {
        category1 = 'men'
      } else if (lowerQuery.includes('women')) {
        category1 = 'women'
      }

      if (lowerQuery.includes('clothing') || 
          lowerQuery.includes('shirt') || 
          lowerQuery.includes('pant') || 
          lowerQuery.includes('dress') || 
          lowerQuery.includes('sweater') || 
          lowerQuery.includes('jacket') || 
          lowerQuery.includes('tshirt') || 
          lowerQuery.includes('t-shirt') ||
          lowerQuery.includes('top')) {
        category2 = 'clothing'
      } else if (lowerQuery.includes('accessories') || 
                 lowerQuery.includes('watch') || 
                 lowerQuery.includes('wallet') || 
                 lowerQuery.includes('bag') || 
                 lowerQuery.includes('sunglass') || 
                 lowerQuery.includes('hat') || 
                 lowerQuery.includes('belt')) {
        category2 = 'accessories'
      }

      if (lowerQuery.includes('shirt')) category3 = 'shirts'
      else if (lowerQuery.includes('pant')) category3 = 'pants'
      else if (lowerQuery.includes('dress')) category3 = 'dresses'
      else if (lowerQuery.includes('sweater')) category3 = 'sweaters'
      else if (lowerQuery.includes('jacket')) category3 = 'jackets'
      else if (lowerQuery.includes('tshirt') || lowerQuery.includes('t-shirt')) category3 = 'tshirts'
      else if (lowerQuery.includes('watch')) category3 = 'watches'
      else if (lowerQuery.includes('wallet')) category3 = 'wallets'
      else if (lowerQuery.includes('bag')) category3 = 'bags'
      else if (lowerQuery.includes('sunglass')) category3 = 'sunglasses'
      else if (lowerQuery.includes('hat')) category3 = 'hats'
      else if (lowerQuery.includes('belt')) category3 = 'belts'
      else if (lowerQuery.includes('top')) category3 = 'tops'

      const response = await axios.post(`/api/product/getProductsByCategory`, {
        category1,
        category2,
        category3,
      })

      setSearchResults(response.data || [])
      setShowSearchResults(true)
    } catch (error) {
      console.error('Search error:', error)
      setSearchResults([])
    } finally {
      setSearchLoading(false)
    }
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      setShowSearchResults(false)
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
      setSearchQuery('')
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch(searchQuery)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery])

  // Click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false)
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="bg-white">
      {/* Mobile menu */}
      <Dialog open={open} onClose={setOpen} className="relative z-40 lg:hidden">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-black/25 transition-opacity duration-300 ease-linear data-closed:opacity-0"
        />
        <div className="fixed inset-0 z-40 flex">
          <DialogPanel
            transition
            className="relative flex w-full max-w-xs transform flex-col overflow-y-auto bg-white pb-12 shadow-xl transition duration-300 ease-in-out data-closed:-translate-x-full"
          >
            <div className="flex px-4 pt-5 pb-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="relative -m-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400"
              >
                <span className="absolute -inset-0.5" />
                <span className="sr-only">Close menu</span>
                <XMarkIcon aria-hidden="true" className="size-6" />
              </button>
            </div>
            <TabGroup className="mt-2">
              <div className="border-b border-gray-200">
                <TabList className="-mb-px flex space-x-8 px-4">
                  {navigation.categories.map((category) => (
                    <Tab
                      key={category.name}
                      className="flex-1 border-b-2 border-transparent px-1 py-4 text-base font-medium whitespace-nowrap text-gray-900 data-selected:border-indigo-600 data-selected:text-indigo-600"
                    >
                      {category.name}
                    </Tab>
                  ))}
                </TabList>
              </div>
              <TabPanels as={Fragment}>
                {navigation.categories.map((category) => (
                  <TabPanel key={category.name} className="space-y-10 px-4 pt-10 pb-8">
                    <div className="grid grid-cols-2 gap-x-4">
                      {category.featured.map((item) => (
                        <div key={item.name} className="group relative text-sm">
                          <img
                            alt={item.imageAlt}
                            src={item.imageSrc}
                            className="aspect-square w-full rounded-lg bg-gray-100 object-cover group-hover:opacity-75"
                          />
                          <a href={item.href} className="mt-6 block font-medium text-gray-900">
                            <span aria-hidden="true" className="absolute inset-0 z-10" />
                            {item.name}
                          </a>
                          <p aria-hidden="true" className="mt-1">
                            Shop now
                          </p>
                        </div>
                      ))}
                    </div>
                    {category.sections.map((section) => (
                      <div key={section.name}>
                        <Link href="/" id={`${category.id}-${section.id}-heading-mobile`} className="font-medium text-gray-900">
                          {section.name}
                        </Link>
                        <ul
                          role="list"
                          aria-labelledby={`${category.id}-${section.id}-heading-mobile`}
                          className="mt-6 flex flex-col space-y-6"
                        >
                          {section.items.map((item) => (
                            <li key={item.name} className="flow-root">
                              <Link href={item.href} className="-m-2 block p-2 text-gray-500">
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
              {isAuthenticated ? (
                <>
                  <div className="flow-root">
                    <Link href="/account" className="-m-2 block p-2 font-medium text-gray-900">
                      My Profile
                    </Link>
                  </div>
                  <div className="flow-root">
                    <Link href="/orders" className="-m-2 block p-2 font-medium text-gray-900">
                      My Orders
                    </Link>
                  </div>
                  {/* <div className="flow-root">
                    <Link href="/wishlist" className="-m-2 block p-2 font-medium text-gray-900">
                      Wishlist
                    </Link>
                  </div> */}
                  <div className="flow-root">
                    <button onClick={onLogout} className="-m-2 block p-2 font-medium text-gray-900 w-full text-left">
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="flow-root">
                    <a href="/auth/login" className="-m-2 block p-2 font-medium text-gray-900">
                      Sign in
                    </a>
                  </div>
                  <div className="flow-root">
                    <a href="/auth/signup" className="-m-2 block p-2 font-medium text-gray-900">
                      Create account
                    </a>
                  </div>
                </>
              )}
            </div>
          </DialogPanel>
        </div>
      </Dialog>

      {authLoading && <Loading />}

      <header className="relative bg-white">
        <p className="flex h-10 items-center justify-center bg-indigo-600 px-4 text-sm font-medium text-white sm:px-6 lg:px-8">
          Get free delivery on orders over $100
        </p>

        <nav aria-label="Top" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="border-b border-gray-200">
            <div className="flex h-16 items-center">
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="relative rounded-md bg-white p-2 text-gray-400 lg:hidden"
              >
                <span className="absolute -inset-0.5" />
                <span className="sr-only">Open menu</span>
                <Bars3Icon aria-hidden="true" className="size-6" />
              </button>

              {/* Logo */}
              <div className="ml-4 flex lg:ml-0">
                <Link href="/">
                  <span className="sr-only">Your Company</span>
                  <img
                    alt=""
                    src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
                    className="h-8 w-auto"
                  />
                </Link>
              </div>

              {/* Flyout menus */}
              <PopoverGroup className="hidden lg:ml-8 lg:block lg:self-stretch">
                <div className="flex h-full space-x-8">
                  {navigation.categories.map((category) => (
                    <Popover key={category.name} className="flex">
                      <div className="relative flex">
                        <PopoverButton className="group relative flex items-center justify-center text-sm font-medium text-gray-700 transition-colors duration-200 ease-out hover:text-gray-800 data-open:text-indigo-600">
                          {category.name}
                          <span
                            aria-hidden="true"
                            className="absolute inset-x-0 -bottom-px z-30 h-0.5 transition duration-200 ease-out group-data-open:bg-indigo-600"
                          />
                        </PopoverButton>
                      </div>
                      <PopoverPanel
                        transition
                        className="absolute inset-x-0 top-full z-20 w-full bg-white text-sm text-gray-500 transition data-closed:opacity-0 data-enter:duration-200 data-enter:ease-out data-leave:duration-150 data-leave:ease-in"
                      >
                        <div aria-hidden="true" className="absolute inset-0 top-1/2 bg-white shadow-sm" />
                        <div className="relative bg-white">
                          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                            <div className="grid grid-cols-2 gap-x-8 gap-y-10 py-16">
                              <div className="col-start-2 grid grid-cols-2 gap-x-8">
                                {category.featured.map((item) => (
                                  <div key={item.name} className="group relative text-base sm:text-sm">
                                    <img
                                      alt={item.imageAlt}
                                      src={item.imageSrc}
                                      className="aspect-square w-full rounded-lg bg-gray-100 object-cover group-hover:opacity-75"
                                    />
                                    <a href={item.href} className="mt-6 block font-medium text-gray-900">
                                      <span aria-hidden="true" className="absolute inset-0 z-10" />
                                      {item.name}
                                    </a>
                                    <p aria-hidden="true" className="mt-1">
                                      Shop now
                                    </p>
                                  </div>
                                ))}
                              </div>
                              <div className="row-start-1 grid grid-cols-3 gap-x-8 gap-y-10 text-sm">
                                {category.sections.map((section) => (
                                  <div key={section.name}>
                                    <Link href="/" id={`${section.name}-heading`} className="font-medium text-gray-900">
                                      {section.name}
                                    </Link>
                                    <ul
                                      role="list"
                                      aria-labelledby={`${section.name}-heading`}
                                      className="mt-6 space-y-6 sm:mt-4 sm:space-y-4"
                                    >
                                      {section.items.map((item) => (
                                        <li key={item.name} className="flex">
                                          <a href={item.href} className="hover:text-gray-800">
                                            {item.name}
                                          </a>
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
                    </Popover>
                  ))}
                </div>
              </PopoverGroup>

              <div className="ml-auto flex items-center gap-4">
                {/* Desktop Search */}
                <div className="hidden lg:block relative" ref={searchRef}>
                  <form onSubmit={handleSearchSubmit}>
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-64 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </form>
                  
                  {/* Search Results Dropdown */}
                  {showSearchResults && searchQuery && (
                    <div className="absolute top-full mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-y-auto z-50">
                      {searchLoading ? (
                        <div className="p-4 text-center text-gray-500">Searching...</div>
                      ) : searchResults.length > 0 ? (
                        <div className="py-2">
                          {searchResults.slice(0, 5).map((product) => (
                            <Link
                              key={product._id}
                              href={`/product/${product._id}`}
                              className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition"
                              onClick={() => {
                                setShowSearchResults(false)
                                setSearchQuery('')
                              }}
                            >
                              {product.images && product.images[0] && (
                                <img
                                  src={product.images[0]}
                                  alt={product.name}
                                  className="w-12 h-12 object-cover rounded"
                                />
                              )}
                              <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900">{product.name}</p>
                                <p className="text-sm text-gray-500">${product.price}</p>
                              </div>
                            </Link>
                          ))}
                          {searchResults.length > 5 && (
                            <Link
                              href={`/search?q=${encodeURIComponent(searchQuery)}`}
                              className="block px-4 py-2 text-center text-sm text-indigo-600 hover:bg-gray-50 font-medium"
                              onClick={() => {
                                setShowSearchResults(false)
                                setSearchQuery('')
                              }}
                            >
                              View all {searchResults.length} results
                            </Link>
                          )}
                        </div>
                      ) : (
                        <div className="p-4 text-center text-gray-500">No products found</div>
                      )}
                    </div>
                  )}
                </div>

                {/* Profile/Auth */}
                {isAuthenticated ? (
                  <div className="relative" ref={profileDropdownRef}>
                    <button
                      className="flex items-center space-x-1 focus:outline-none p-2 rounded-full hover:bg-gray-100 transition"
                      onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                    >
                      <i className="fa-solid fa-circle-user text-2xl text-indigo-600 hover:text-indigo-700"></i>
                    </button>

                    {/* Desktop Profile Dropdown */}
                    {showProfileDropdown && (
                      <div className="absolute right-0 mt-2 w-56 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50 overflow-hidden">
                        <div className="py-1">
                          <Link
                            href="/account"
                            onClick={handleLinkClick}
                            className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50 transition"
                          >
                            <i className="fa-solid fa-user w-5 text-indigo-600"></i>
                            <span className="ml-3">My Profile</span>
                          </Link>
                          <Link
                            href="/orders"
                            onClick={handleLinkClick}
                            className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50 transition"
                          >
                            <i className="fa-solid fa-box-open w-5 text-indigo-600"></i>
                            <span className="ml-3">My Orders</span>
                          </Link>
                          <Link
                            href="/cart"
                            onClick={handleLinkClick}
                            className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50 transition"
                          >
                            <i className="fa-solid fa-cart-shopping w-5 text-indigo-600"></i>
                            <span className="ml-3">My Cart</span>
                          </Link>
                          {/* <Link
                            href="/wishlist"
                            onClick={handleLinkClick}
                            className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50 transition"
                          >
                            <i className="fa-solid fa-heart w-5 text-indigo-600"></i>
                            <span className="ml-3">Wishlist</span>
                          </Link> */}
                          <div className="border-t border-gray-100"></div>
                          <button
                            onClick={onLogout}
                            className="w-full flex items-center px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition"
                          >
                            <i className="fa-solid fa-arrow-right-from-bracket w-5"></i>
                            <span className="ml-3">Logout</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="hidden lg:flex lg:items-center lg:space-x-4">
                    <a href="/auth/login" className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition">
                      Sign in
                    </a>
                    <span aria-hidden="true" className="h-6 w-px bg-gray-200" />
                    <a href="/auth/signup" className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition">
                      Create account
                    </a>
                  </div>
                )}

                {/* Cart */}
                <div className="flow-root">
                  <Link href="/cart" className="group -m-2 flex items-center p-2">
                    <ShoppingBagIcon
                      aria-hidden="true"
                      className="size-6 shrink-0 text-gray-400 group-hover:text-gray-500"
                    />
                    <span className="ml-2 text-md font-bold text-gray-700 group-hover:text-gray-800">{cartItems}</span>
                    <span className="sr-only">items in cart, view bag</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          
          {/* Mobile Search Bar */}
          <div className="lg:hidden px-4 pb-4" ref={searchRef}>
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <button 
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                <i className="fa-solid fa-search"></i>
              </button>
            </form>
            
            {/* Mobile Search Results */}
            {showSearchResults && searchQuery && (
              <div className="absolute left-4 right-4 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 max-h-80 overflow-y-auto z-50">
                {searchLoading ? (
                  <div className="p-4 text-center text-gray-500">Searching...</div>
                ) : searchResults.length > 0 ? (
                  <div className="py-2">
                    {searchResults.slice(0, 5).map((product) => (
                      <Link
                        key={product._id}
                        href={`/product/${product._id}`}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition"
                        onClick={() => {
                          setShowSearchResults(false)
                          setSearchQuery('')
                        }}
                      >
                        {product.images && product.images[0] && (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                        )}
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 line-clamp-1">{product.name}</p>
                          <p className="text-sm text-gray-500">${product.price}</p>
                        </div>
                      </Link>
                    ))}
                    {searchResults.length > 5 && (
                      <Link
                        href={`/search?q=${encodeURIComponent(searchQuery)}`}
                        className="block px-4 py-2 text-center text-sm text-indigo-600 hover:bg-gray-50 font-medium"
                        onClick={() => {
                          setShowSearchResults(false)
                          setSearchQuery('')
                        }}
                      >
                        View all {searchResults.length} results
                      </Link>
                    )}
                  </div>
                ) : (
                  <div className="p-4 text-center text-gray-500">No products found</div>
                )}
              </div>
            )}
          </div>
        </nav>
      </header>
    </div>
  )
}
// 'use client'

// import { Fragment, useEffect, useState, useRef } from 'react'
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
// import { Bars3Icon, ShoppingBagIcon, XMarkIcon } from '@heroicons/react/24/outline'
// import axios from 'axios'
// import { toast } from 'react-toastify'
// import Link from 'next/link'
// import { useRouter } from 'next/navigation'
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
//             { name: 'Tops', href: '/product?category1=women&category2=clothing&category3=tops' },
//             { name: 'Dresses', href: '/product?category1=women&category2=clothing&category3=dressses' },
//             { name: 'Pants', href: '/product?category1=women&category2=clothing&category3=pants' },
//             { name: 'Denim', href: '/product?category1=women&category2=clothing&category3=denim' },
//             { name: 'Sweaters', href: '/product?category1=women&category2=clothing&category3=sweaters' },
//             { name: 'T-Shirts', href: '/product?category1=women&category2=clothing&category3=tshirts' },
//             { name: 'Jackets', href: '/product?category1=women&category2=clothing&category3=jackets' },
//             { name: 'Activewear', href: '/product?category1=women&category2=clothing&category3=activewear' },
//             { name: 'Browse All', href: '/product?category1=women&category2=clothing&category3=browseall' },
//           ],
//         },
//         {
//           id: 'accessories',
//           name: 'Accessories',
//           items: [
//             { name: 'Watches', href: '/product?category1=women&category2=accessories&category3=watches' },
//             { name: 'Wallets', href: '/product?category1=women&category2=accessories&category3=wallets' },
//             { name: 'Bags', href: '/product?category1=women&category2=accessories&category3=bags' },
//             { name: 'Sunglasses', href: '/product?category1=women&category2=accessories&category3=sunglasses' },
//             { name: 'Hats', href: '/product?category1=women&category2=accessories&category3=hats' },
//             { name: 'Belts', href: '/product?category1=women&category2=accessories&category3=belts' },
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
//             { name: 'Shirts', href: '/product?category1=men&category2=clothing&category3=shirts' },
//             { name: 'Pants', href: '/product?category1=men&category2=clothing&category3=pants' },
//             { name: 'Sweaters', href: '/product?category1=men&category2=clothing&category3=sweaters' },
//             { name: 'T-Shirts', href: '/product?category1=men&category2=clothing&category3=tshirts' },
//             { name: 'Jackets', href: '/product?category1=men&category2=clothing&category3=jackets' },
//             { name: 'Activewear', href: '/product?category1=men&category2=clothing&category3=activewear' },
//             { name: 'Browse All', href: '/product?category1=men&category2=clothing&category3=browseall' },
//           ],
//         },
//         {
//           id: 'accessories',
//           name: 'Accessories',
//           items: [
//             { name: 'Watches', href: '/product?category1=men&category2=accessories&category3=watches' },
//             { name: 'Wallets', href: '/product?category1=men&category2=accessories&category3=wallets' },
//             { name: 'Bags', href: '/product?category1=men&category2=accessories&category3=bags' },
//             { name: 'Sunglasses', href: '/product?category1=men&category2=accessories&category3=sunglasses' },
//             { name: 'Hats', href: '/product?category1=men&category2=accessories&category3=hats' },
//             { name: 'Belts', href: '/product?category1=men&category2=accessories&category3=belts' },
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
//   const [loading, setLoading] = useState(false)
//   const [showProfileDropdown, setShowProfileDropdown] = useState(false)
//   const [cartItems, setCartItems] = useState(0)
//   const [searchQuery, setSearchQuery] = useState('')
//   const [searchResults, setSearchResults] = useState([])
//   const [showSearchResults, setShowSearchResults] = useState(false)
//   const [searchLoading, setSearchLoading] = useState(false)
  
//   const router = useRouter()
//   const profileDropdownRef = useRef(null)
//   const searchRef = useRef(null)

//   const onLogout = async() => {
//     setLoading(true)
//     setShowProfileDropdown(false)
//     try {
//       await axios.post('/api/users/logout')
//       setMe(false)
//       setLoading(false)
//       toast.success('Logout successful')
//       router.push('/')
//     } catch (error) {
//       console.error("Logout error:", error)
//       setLoading(false)
//       toast.error("Something went wrong while logging out.")
//     }
//   }

//   const handleLinkClick = () => {
//     setShowProfileDropdown(false)
//   }

//   const handleSearch = async (query) => {
//     if (!query.trim()) {
//       setSearchResults([])
//       setShowSearchResults(false)
//       return
//     }

//     setSearchLoading(true)
//     try {
//       const lowerQuery = query.toLowerCase().trim()
      
//       // Parse the search query to extract category information
//       let category1 = ''
//       let category2 = ''
//       let category3 = ''

//       // Check for gender
//       if (lowerQuery.includes('men') && !lowerQuery.includes('women')) {
//         category1 = 'men'
//       } else if (lowerQuery.includes('women')) {
//         category1 = 'women'
//       }

//       // Check for category2 (clothing/accessories)
//       if (lowerQuery.includes('clothing') || 
//           lowerQuery.includes('shirt') || 
//           lowerQuery.includes('pant') || 
//           lowerQuery.includes('dress') || 
//           lowerQuery.includes('sweater') || 
//           lowerQuery.includes('jacket') || 
//           lowerQuery.includes('tshirt') || 
//           lowerQuery.includes('t-shirt') ||
//           lowerQuery.includes('top')) {
//         category2 = 'clothing'
//       } else if (lowerQuery.includes('accessories') || 
//                  lowerQuery.includes('watch') || 
//                  lowerQuery.includes('wallet') || 
//                  lowerQuery.includes('bag') || 
//                  lowerQuery.includes('sunglass') || 
//                  lowerQuery.includes('hat') || 
//                  lowerQuery.includes('belt')) {
//         category2 = 'accessories'
//       }

//       // Check for specific items (category3)
//       if (lowerQuery.includes('shirt')) category3 = 'shirts'
//       else if (lowerQuery.includes('pant')) category3 = 'pants'
//       else if (lowerQuery.includes('dress')) category3 = 'dresses'
//       else if (lowerQuery.includes('sweater')) category3 = 'sweaters'
//       else if (lowerQuery.includes('jacket')) category3 = 'jackets'
//       else if (lowerQuery.includes('tshirt') || lowerQuery.includes('t-shirt')) category3 = 'tshirts'
//       else if (lowerQuery.includes('watch')) category3 = 'watches'
//       else if (lowerQuery.includes('wallet')) category3 = 'wallets'
//       else if (lowerQuery.includes('bag')) category3 = 'bags'
//       else if (lowerQuery.includes('sunglass')) category3 = 'sunglasses'
//       else if (lowerQuery.includes('hat')) category3 = 'hats'
//       else if (lowerQuery.includes('belt')) category3 = 'belts'
//       else if (lowerQuery.includes('top')) category3 = 'tops'

//       const response = await axios.post(`/api/product/getProductsByCategory`, {
//         category1,
//         category2,
//         category3,
//       })

//       setSearchResults(response.data || [])
//       setShowSearchResults(true)
//     } catch (error) {
//       console.error('Search error:', error)
//       setSearchResults([])
//     } finally {
//       setSearchLoading(false)
//     }
//   }

//   const handleSearchSubmit = (e) => {
//     e.preventDefault()
//     if (searchQuery.trim()) {
//       setShowSearchResults(false)
//       router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
//       setSearchQuery('')
//     }
//   }

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       handleSearch(searchQuery)
//     }, 300)

//     return () => clearTimeout(timer)
//   }, [searchQuery])

//   useEffect(() => {
//     let isMounted = true
//     const fetchUserData = async () => {
//       try {
//         setLoading(true)
//         const res = await axios.post('/api/users/me')
//         const response = await axios.get('/api/cart')
//         setCartItems(response.data.cart.totalItem)
//         if (isMounted) {
//           setMe(res.data)
//         }
//       } catch (error) {
//         console.error("Failed to fetch user data:", error)
//         if (isMounted) {
//           setMe(false)
//         }
//       } finally {
//         if (isMounted) {
//           setLoading(false)
//         }
//       }
//     }

//     fetchUserData()
//     return () => {
//       isMounted = false
//     }
//   }, [])

//   // Click outside to close dropdowns
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
//         setShowProfileDropdown(false)
//       }
//       if (searchRef.current && !searchRef.current.contains(event.target)) {
//         setShowSearchResults(false)
//       }
//     }

//     document.addEventListener('mousedown', handleClickOutside)
//     return () => document.removeEventListener('mousedown', handleClickOutside)
//   }, [])

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
//                         <Link href="/" id={`${category.id}-${section.id}-heading-mobile`} className="font-medium text-gray-900">
//                           {section.name}
//                         </Link>
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

//             <div className="space-y-6 border-t border-gray-200 px-4 py-6">
//               {me ? (
//                 <>
//                   <div className="flow-root">
//                     <Link href="/account" className="-m-2 block p-2 font-medium text-gray-900">
//                       My Profile
//                     </Link>
//                   </div>
//                   <div className="flow-root">
//                     <Link href="/orders" className="-m-2 block p-2 font-medium text-gray-900">
//                       My Orders
//                     </Link>
//                   </div>
//                   <div className="flow-root">
//                     <Link href="/wishlist" className="-m-2 block p-2 font-medium text-gray-900">
//                       Wishlist
//                     </Link>
//                   </div>
//                   <div className="flow-root">
//                     <button onClick={onLogout} className="-m-2 block p-2 font-medium text-gray-900 w-full text-left">
//                       Logout
//                     </button>
//                   </div>
//                 </>
//               ) : (
//                 <>
//                   <div className="flow-root">
//                     <a href="/auth/login" className="-m-2 block p-2 font-medium text-gray-900">
//                       Sign in
//                     </a>
//                   </div>
//                   <div className="flow-root">
//                     <a href="/auth/signup" className="-m-2 block p-2 font-medium text-gray-900">
//                       Create account
//                     </a>
//                   </div>
//                 </>
//               )}
//             </div>
//           </DialogPanel>
//         </div>
//       </Dialog>

//       {loading && <Loading />}

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
//                                     <Link href="/" id={`${section.name}-heading`} className="font-medium text-gray-900">
//                                       {section.name}
//                                     </Link>
//                                     <ul
//                                       role="list"
//                                       aria-labelledby={`${section.name}-heading`}
//                                       className="mt-6 space-y-6 sm:mt-4 sm:space-y-4"
//                                     >
//                                       {section.items.map((item) => (
//                                         <li key={item.name} className="flex">
//                                           <a href={item.href} className="hover:text-gray-800">
//                                             {item.name}
//                                           </a>
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
//                 </div>
//               </PopoverGroup>

//               <div className="ml-auto flex items-center gap-4">
//                 {/* Desktop Search */}
//                 <div className="hidden lg:block relative" ref={searchRef}>
//                   <form onSubmit={handleSearchSubmit}>
//                     <input
//                       type="text"
//                       placeholder="Search products..."
//                       value={searchQuery}
//                       onChange={(e) => setSearchQuery(e.target.value)}
//                       className="w-64 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                     />
//                   </form>
                  
//                   {/* Search Results Dropdown */}
//                   {showSearchResults && searchQuery && (
//                     <div className="absolute top-full mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-y-auto z-50">
//                       {searchLoading ? (
//                         <div className="p-4 text-center text-gray-500">Searching...</div>
//                       ) : searchResults.length > 0 ? (
//                         <div className="py-2">
//                           {searchResults.slice(0, 5).map((product) => (
//                             <Link
//                               key={product._id}
//                               href={`/product/${product._id}`}
//                               className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition"
//                               onClick={() => {
//                                 setShowSearchResults(false)
//                                 setSearchQuery('')
//                               }}
//                             >
//                               {product.images && product.images[0] && (
//                                 <img
//                                   src={product.images[0]}
//                                   alt={product.name}
//                                   className="w-12 h-12 object-cover rounded"
//                                 />
//                               )}
//                               <div className="flex-1">
//                                 <p className="text-sm font-medium text-gray-900">{product.name}</p>
//                                 <p className="text-sm text-gray-500">${product.price}</p>
//                               </div>
//                             </Link>
//                           ))}
//                           {searchResults.length > 5 && (
//                             <Link
//                               href={`/search?q=${encodeURIComponent(searchQuery)}`}
//                               className="block px-4 py-2 text-center text-sm text-indigo-600 hover:bg-gray-50 font-medium"
//                               onClick={() => {
//                                 setShowSearchResults(false)
//                                 setSearchQuery('')
//                               }}
//                             >
//                               View all {searchResults.length} results
//                             </Link>
//                           )}
//                         </div>
//                       ) : (
//                         <div className="p-4 text-center text-gray-500">No products found</div>
//                       )}
//                     </div>
//                   )}
//                 </div>

//                 {/* Profile/Auth */}
//                 {me ? (
//                   <div className="relative" ref={profileDropdownRef}>
//                     <button
//                       className="flex items-center space-x-1 focus:outline-none p-2 rounded-full hover:bg-gray-100 transition"
//                       onClick={() => setShowProfileDropdown(!showProfileDropdown)}
//                     >
//                       <i className="fa-solid fa-circle-user text-2xl text-indigo-600 hover:text-indigo-700"></i>
//                     </button>

//                     {/* Desktop Profile Dropdown */}
//                     {showProfileDropdown && (
//                       <div className="absolute right-0 mt-2 w-56 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50 overflow-hidden">
//                         <div className="py-1">
//                           <Link
//                             href="/account"
//                             onClick={handleLinkClick}
//                             className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50 transition"
//                           >
//                             <i className="fa-solid fa-user w-5 text-indigo-600"></i>
//                             <span className="ml-3">My Profile</span>
//                           </Link>
//                           <Link
//                             href="/orders"
//                             onClick={handleLinkClick}
//                             className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50 transition"
//                           >
//                             <i className="fa-solid fa-box-open w-5 text-indigo-600"></i>
//                             <span className="ml-3">My Orders</span>
//                           </Link>
//                           <Link
//                             href="/cart"
//                             onClick={handleLinkClick}
//                             className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50 transition"
//                           >
//                             <i className="fa-solid fa-cart-shopping w-5 text-indigo-600"></i>
//                             <span className="ml-3">My Cart</span>
//                           </Link>
//                           <Link
//                             href="/wishlist"
//                             onClick={handleLinkClick}
//                             className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50 transition"
//                           >
//                             <i className="fa-solid fa-heart w-5 text-indigo-600"></i>
//                             <span className="ml-3">Wishlist</span>
//                           </Link>
//                           <div className="border-t border-gray-100"></div>
//                           <button
//                             onClick={onLogout}
//                             className="w-full flex items-center px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition"
//                           >
//                             <i className="fa-solid fa-arrow-right-from-bracket w-5"></i>
//                             <span className="ml-3">Logout</span>
//                           </button>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 ) : (
//                   <div className="hidden lg:flex lg:items-center lg:space-x-4">
//                     <a href="/auth/login" className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition">
//                       Sign in
//                     </a>
//                     <span aria-hidden="true" className="h-6 w-px bg-gray-200" />
//                     <a href="/auth/signup" className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition">
//                       Create account
//                     </a>
//                   </div>
//                 )}

//                 {/* Cart */}
//                 <div className="flow-root">
//                   <Link href="/cart" className="group -m-2 flex items-center p-2">
//                     <ShoppingBagIcon
//                       aria-hidden="true"
//                       className="size-6 shrink-0 text-gray-400 group-hover:text-gray-500"
//                     />
//                     <span className="ml-2 text-md font-bold text-gray-700 group-hover:text-gray-800">{cartItems}</span>
//                     <span className="sr-only">items in cart, view bag</span>
//                   </Link>
//                 </div>
//               </div>
//             </div>
//           </div>
          
//           {/* Mobile Search Bar */}
//           <div className="lg:hidden px-4 pb-4" ref={searchRef}>
//             <form onSubmit={handleSearchSubmit} className="relative">
//               <input
//                 type="text"
//                 placeholder="Search products..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//               />
//               <button 
//                 type="submit"
//                 className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
//               >
//                 <i className="fa-solid fa-search"></i>
//               </button>
//             </form>
            
//             {/* Mobile Search Results */}
//             {showSearchResults && searchQuery && (
//               <div className="absolute left-4 right-4 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 max-h-80 overflow-y-auto z-50">
//                 {searchLoading ? (
//                   <div className="p-4 text-center text-gray-500">Searching...</div>
//                 ) : searchResults.length > 0 ? (
//                   <div className="py-2">
//                     {searchResults.slice(0, 5).map((product) => (
//                       <Link
//                         key={product._id}
//                         href={`/product/${product._id}`}
//                         className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition"
//                         onClick={() => {
//                           setShowSearchResults(false)
//                           setSearchQuery('')
//                         }}
//                       >
//                         {product.images && product.images[0] && (
//                           <img
//                             src={product.images[0]}
//                             alt={product.name}
//                             className="w-12 h-12 object-cover rounded"
//                           />
//                         )}
//                         <div className="flex-1">
//                           <p className="text-sm font-medium text-gray-900 line-clamp-1">{product.name}</p>
//                           <p className="text-sm text-gray-500">${product.price}</p>
//                         </div>
//                       </Link>
//                     ))}
//                     {searchResults.length > 5 && (
//                       <Link
//                         href={`/search?q=${encodeURIComponent(searchQuery)}`}
//                         className="block px-4 py-2 text-center text-sm text-indigo-600 hover:bg-gray-50 font-medium"
//                         onClick={() => {
//                           setShowSearchResults(false)
//                           setSearchQuery('')
//                         }}
//                       >
//                         View all {searchResults.length} results
//                       </Link>
//                     )}
//                   </div>
//                 ) : (
//                   <div className="p-4 text-center text-gray-500">No products found</div>
//                 )}
//               </div>
//             )}
//           </div>
//         </nav>
//       </header>
//     </div>
//   )
// }
