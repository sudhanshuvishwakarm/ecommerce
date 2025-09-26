'use client'

import { Fragment, useEffect, useState } from 'react'
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
import { Bars3Icon, MagnifyingGlassIcon, ShoppingBagIcon, XMarkIcon } from '@heroicons/react/24/outline'
import axios from 'axios'
import { toast } from 'react-toastify'
import Link from 'next/link'
import Loading from '../loader/Loading.jsx'
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
            { name: 'Tops', href: '/product/women/clothing/tops' },
            { name: 'Dresses', href: '/product/women/clothing/dressses' },
            { name: 'Pants', href: '/product/women/clothing/pants' },
            { name: 'Denim', href: '/product/women/clothing/denim' },
            { name: 'Sweaters', href: '/product/women/clothing/sweaters' },
            { name: 'T-Shirts', href: '/product/women/clothing/tshirts' },
            { name: 'Jackets', href: '/product/women/clothing/jackets' },
            { name: 'Activewear', href: '/product/women/clothing/activewear' },
            { name: 'Browse All', href: '/product/women/clothing/browseall' },
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
            { name: 'Shirts', href: '/product/men/clothing/shirts' },
            { name: 'Pants', href: '/product/men/clothing/pants' },
            { name: 'Sweaters', href: '/product/men/clothing/sweaters' },
            { name: 'T-Shirts', href: '/product/men/clothing/tshirts' },
            { name: 'Jackets', href: '/product/men/clothing/jackets' },
            { name: 'Activewear', href: '/product/men/clothing/activewear' },
            { name: 'Browse All', href: '/product/men/clothing/browseall' },
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
  pages: [
    { name: 'Company', href: '#' },
    { name: 'Stores', href: '#' },
  ],
}

export default function Navigation() {
  const [open, setOpen] = useState(false)
  const [me, setMe] = useState(false)
  const [loading, setLoading] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [cartItems, setCartItems] = useState(0);
  const onLogout = async() => {
    setLoading(true);
    setShowProfileDropdown(false);
    try {
      const res = axios.post('/api/users/logout');
      setMe(false);
      setLoading(false);
      toast.success('Logout successful');
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Something went wrong while logging out.");
    }
  }




  useEffect(() => {
    let isMounted = true;
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const res = await axios.post('/api/users/me');
        const response = await axios.get('/api/cart');
        setCartItems(response.data.cart.totalItem);
        if (isMounted) {
          setMe(res.data);
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        if (isMounted) {
          setMe(false);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchUserData();
    return () => {
      isMounted = false;
    };
  }, []);

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
                        <p id={`${category.id}-${section.id}-heading-mobile`} className="font-medium text-gray-900">
                          {section.name}
                        </p>
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

            {/* <div className="space-y-6 border-t border-gray-200 px-4 py-6">
              {navigation.pages.map((page) => (
                <div key={page.name} className="flow-root">
                  <a href={page.href} className="-m-2 block p-2 font-medium text-gray-900">
                    {page.name}
                  </a>
                </div>
              ))}
            </div> */}

            <div className="space-y-6 border-t border-gray-200 px-4 py-6">
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
            </div>

            {/* <div className="border-t border-gray-200 px-4 py-6">
              <a href="#" className="-m-2 flex items-center p-2">
                <img
                  alt=""
                  src="https://tailwindcss.com/plus-assets/img/flags/flag-canada.svg"
                  className="block h-auto w-5 shrink-0"
                />
                <span className="ml-3 block text-base font-medium text-gray-900">CAD</span>
                <span className="sr-only">, change currency</span>
              </a>
            </div> */}
          </DialogPanel>
        </div>
      </Dialog>
      {loading && (
        <Loading />
      )}
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
                        {/* Presentational element used to render the bottom shadow, if we put the shadow on the actual panel it pokes out the top, so we use this shorter element to hide the top of the shadow */}
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
                                    <p id={`${section.name}-heading`} className="font-medium text-gray-900">
                                      {section.name}
                                    </p>
                                    <ul
                                      role="list"
                                      aria-labelledby={`${section.name}-heading`}
                                      className="mt-6 space-y-6 sm:mt-4 sm:space-y-4"
                                    >
                                      {section.items.map((item) => (
                                        <li key={item.name} className="flex">
                                          <Link href={item.href} className="hover:text-gray-800">
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
                    </Popover>
                  ))}
                  {/* {navigation.pages.map((page) => (
                    <a
                      key={page.name}
                      href={page.href}
                      className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-800"
                    >
                      {page.name}
                    </a>
                  ))} */}
                </div>
              </PopoverGroup>

              <div className="ml-auto flex items-center">
                {me ? (
                  <div className="relative">
                    <button
                      className="flex items-center space-x-1 focus:outline-none"
                      onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                    >
                      <i className="fa-solid fa-circle-user text-2xl text-indigo-600 hover:text-indigo-700"></i>

                    </button>
                    {/* desktop profile dropdown  */}
                    {showProfileDropdown && (
                      <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                        <div className="py-1">
                          <Link
                            href="/account"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <i className="fa-solid fa-user mr-2 text-indigo-500"></i>
                            My Profile
                          </Link>
                          <Link
                            href="/orders"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <i className="fa-solid fa-box-open mr-2 text-indigo-500"></i>
                            My Orders
                          </Link>
                          <Link
                            href="/cart"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <i className="fa-solid fa-cart-shopping mr-2 text-indigo-500"></i>
                            My Cart
                          </Link>
                          <Link
                            href="/wishlist"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <i className="fa-solid fa-heart mr-2 text-indigo-500"></i>
                            Wishlist
                          </Link>
                          <div className="border-t border-gray-200"></div>
                          <button
                            onClick={onLogout}
                            className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <i className="fa-solid fa-arrow-right-from-bracket mr-2 text-indigo-500"></i>
                            logout
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:space-x-6">
                    <a href="/auth/login" className="text-sm font-medium text-gray-700 hover:text-gray-800">
                      Sign in
                    </a>
                    <span aria-hidden="true" className="h-6 w-px bg-gray-200" />
                    <a href="/auth/signup" className="text-sm font-medium text-gray-700 hover:text-gray-800">
                      Create account
                    </a>
                  </div>
                )}
                {/* Search */}
                <div className="flex lg:ml-6">
                  <a href="#" className="p-2 text-gray-400 hover:text-gray-500">
                    <span className="sr-only">Search</span>
                    <MagnifyingGlassIcon aria-hidden="true" className="size-6" />
                  </a>
                </div>

                {/* Cart */}
                <div className="ml-4 flow-root lg:ml-6">
                  <Link href="/cart" className="group -m-2 flex items-center p-2">
                    <ShoppingBagIcon
                      aria-hidden="true"
                      className="size-6 shrink-0 text-gray-400 group-hover:text-gray-500"
                    />
                    <span className="ml-2 text-md font-medium text-gray-700 font-bold group-hover:text-gray-800">{cartItems}</span>
                    <span className="sr-only">items in cart, view bag</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>
    </div>
  )
}
