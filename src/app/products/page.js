'use client'
import { useEffect, useState } from 'react'
import axios from 'axios'

import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { ChevronDownIcon, FunnelIcon, MinusIcon, PlusIcon, Squares2X2Icon } from '@heroicons/react/20/solid'
import ProductCard from '../../components/product/ProductCard.jsx'

const sortOptions = [
  { name: 'Most Popular', href: '#', current: true },
  { name: 'Best Rating', href: '#', current: false },
  { name: 'Newest', href: '#', current: false },
  { name: 'Price: Low to High', href: '#', current: false },
  { name: 'Price: High to Low', href: '#', current: false },
]
const subCategories = [
  { name: 'Totes', href: '#' },
  { name: 'Backpacks', href: '#' },
  { name: 'Travel Bags', href: '#' },
  { name: 'Hip Bags', href: '#' },
  { name: 'Laptop Sleeves', href: '#' },
]
const filtredata1 = [
    {
        id:"color",
        name:"Color",
        options:[
            {value:"white",label:"white"},
            {value:"beige",label:"beige"},
            {value:"blue",label:"blue"},
            {value:"brown",label:"brown"},
            {value:"green",label:"green"},
            {value:"purple",label:"purple"},
            {value:"yellow",label:"yellow"},
        ]
    },
    {
        id:"size",
        name:"Size",
        options:[
            {value:"S",label:"S"},
            {value:"M",label:"M"},
            {value:"L",label:"L"},
        ]
    }
]
const filtredata2 = [
    {
        id:"price",
        name:"Price",
        options:[
            {value:"159-399",label:"₹159 to ₹399"},
            {value:"399-999",label:"₹399 to ₹999"},
            {value:"999-1999",label:"₹999 to ₹1999"},
            {value:"1999-2999",label:"₹1999 to ₹2999"},
            {value:"3999-4999",label:"₹3999 to ₹4999"},
           
        ]
    },
    {
        id:"discount",
        name:"Discount Range",
        options:[
            {value:"10",label:"10% And Above"},
            {value:"20",label:"20% And Above"},
            {value:"30",label:"30% And Above"},
            {value:"40",label:"40% And Above"},
            {value:"50",label:"50% And Above"},
            {value:"60",label:"60% And Above"},
            {value:"70",label:"70% And Above"},
            {value:"80",label:"80% And Above"}, 
        ]
    },
    {
        id:"availability",
        name:"Availability",
        options:[
            {value:"instock",label:"In Stock"},
            {value:"outstock",label:"Out Of Stock"},
        ]
    }
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function ProductsPage() {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [products, setProducts] = useState([])
  const [status, setStatus] = useState('idle')
  useEffect(() => {
    if (status === 'idle') {
      fetchProducts()
    }
  }, [status])

  const fetchProducts = async () => {
    try {
      setStatus('loading')
      const response = await axios.get('https://fakestoreapi.com/products')
      setProducts(response.data)
      setStatus('succeeded')
    } catch (error) {
      console.error('Error fetching products:', error)
      setStatus('failed')
    }
  }

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (status === 'failed') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-xl font-medium text-red-500">Something went wrong! Please try again later</p>
      </div>
    )
  }

  return (
   <div className="bg-gray-50 min-h-screen">
      <div>
        {/* Mobile filter dialog */}
        <Dialog open={mobileFiltersOpen} onClose={setMobileFiltersOpen} className="relative z-40 lg:hidden">
          <DialogBackdrop
            transition
          className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300 ease-linear data-[closed]:opacity-0"

          />

          <div className="fixed inset-0 z-40 flex">
            <DialogPanel
              transition
              className="relative ml-auto flex h-full w-full max-w-xs transform flex-col overflow-y-auto bg-white py-4 pb-12 shadow-xl transition duration-300 ease-in-out data-[closed]:translate-x-full"
            >
              <div className="flex items-center justify-between px-4">
                <h2 className="text-lg font-medium text-gray-900">Filters</h2>
                <button
                  type="button"
                  onClick={() => setMobileFiltersOpen(false)}
                  className="flex items-center justify-center w-10 h-10 p-2 -mr-2 text-gray-400 bg-white rounded-md hover:bg-gray-100"
                >
                  <span className="sr-only">Close menu</span>
                  <XMarkIcon aria-hidden="true" className="w-6 h-6" />
                </button>
              </div>

              {/* Mobile Filters Form */}
              <form className="mt-4 border-t border-gray-200">
                <h3 className="sr-only">Categories</h3>
                <ul className="px-4 py-3 space-y-3 text-sm font-medium text-gray-900 bg-gray-50 rounded-lg">
                  {subCategories.map((category) => (
                    <li key={category.name}>
                      <a href={category.href} className="block px-2 py-1 rounded-md hover:bg-gray-100">
                        {category.name}
                      </a>
                    </li>
                  ))}
                </ul>

                {filtredata1.map((section) => (
                  <Disclosure key={section.id} as="div" className="px-4 py-6 border-t border-gray-200">
                    <h3 className="flow-root -my-3">
                      <DisclosureButton className="flex items-center justify-between w-full py-3 text-sm text-gray-400 bg-white group hover:text-gray-500">
                        <span className="font-medium text-gray-900">{section.name}</span>
                        <span className="flex items-center ml-6">
                          <PlusIcon aria-hidden="true" className="h-5 w-5 group-data-[open]:hidden" />
                          <MinusIcon aria-hidden="true" className="h-5 w-5 [.group:not([data-open])_&]:hidden" />
                        </span>
                      </DisclosureButton>
                    </h3>
                    <DisclosurePanel className="pt-6">
                      <div className="space-y-4">
                        {section.options.map((option, optionIdx) => (
                          <div key={option.value} className="flex items-center">
                            <input
                              defaultValue={option.value}
                              defaultChecked={option.checked}
                              id={`mobile-filter-${section.id}-${optionIdx}`}
                              name={`${section.id}[]`}
                              type="checkbox"
                              className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                            />
                            <label htmlFor={`mobile-filter-${section.id}-${optionIdx}`} className="ml-3 text-sm text-gray-600">
                              {option.label}
                            </label>
                          </div>
                        ))}
                      </div>
                    </DisclosurePanel>
                  </Disclosure>
                ))}
                {filtredata2.map((section) => (
                  <Disclosure key={section.id} as="div" className="px-4 py-6 border-t border-gray-200">
                    <h3 className="flow-root -my-3">
                      <DisclosureButton className="flex items-center justify-between w-full py-3 text-sm text-gray-400 bg-white group hover:text-gray-500">
                        <span className="font-medium text-gray-900">{section.name}</span>
                        <span className="flex items-center ml-6">
                          <PlusIcon aria-hidden="true" className="h-5 w-5 group-data-[open]:hidden" />
                          <MinusIcon aria-hidden="true" className="h-5 w-5 [.group:not([data-open])_&]:hidden" />
                        </span>
                      </DisclosureButton>
                    </h3>
                    <DisclosurePanel className="pt-6">
                      <div className="space-y-4">
                        {section.options.map((option, optionIdx) => (
                          <div key={option.value} className="flex items-center">
                            <input
                              defaultValue={option.value}
                              defaultChecked={option.checked}
                              id={`mobile-filter-${section.id}-${optionIdx}`}
                              name={`${section.id}[]`}
                              type="radio"
                              className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                            />
                            <label htmlFor={`mobile-filter-${section.id}-${optionIdx}`} className="ml-3 text-sm text-gray-600">
                              {option.label}
                            </label>
                          </div>
                        ))}
                      </div>
                    </DisclosurePanel>
                  </Disclosure>
                ))}
              </form>
              
              <div className="px-4 mt-auto">
                <button
                  type="button"
                  onClick={() => setMobileFiltersOpen(false)}
                  className="w-full px-4 py-3 text-base font-medium text-white bg-indigo-600 rounded-md shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Apply Filters
                </button>
              </div>
            </DialogPanel>
          </div>
        </Dialog>

        <main className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex items-baseline justify-between pt-12 pb-6 border-b border-gray-200">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">New Arrivals</h1>

            <div className="flex items-center">
              <Menu as="div" className="relative inline-block text-left">
                <div>
                  <MenuButton className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                    Sort
                    <ChevronDownIcon
                      aria-hidden="true"
                      className="w-5 h-5 ml-2 -mr-1"
                    />
                  </MenuButton>
                </div>

                <MenuItems
                  transition
                  className="absolute right-0 z-10 mt-2 w-56 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                >
                  <div className="py-1">
                    {sortOptions.map((option) => (
                      <MenuItem key={option.name}>
                        <a
                          href={option.href}
                          className={classNames(
                            option.current ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                            'block px-4 py-2 text-sm hover:bg-gray-100'
                          )}
                        >
                          {option.name}
                        </a>
                      </MenuItem>
                    ))}
                  </div>
                </MenuItems>
              </Menu>

              <button type="button" className="p-2 ml-5 -m-2 text-gray-400 hover:text-gray-500 sm:ml-7">
                <span className="sr-only">View grid</span>
                <Squares2X2Icon aria-hidden="true" className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(true)}
                className="p-2 ml-4 -m-2 text-gray-400 hover:text-gray-500 sm:ml-6 lg:hidden"
              >
                <span className="sr-only">Filters</span>
                <FunnelIcon aria-hidden="true" className="w-5 h-5" />
              </button>
            </div>
          </div>

          <section aria-labelledby="products-heading" className="pt-6 pb-24">
            <h2 id="products-heading" className="sr-only">
              Products
            </h2>

            <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
              {/* Filters */}
              <form className="hidden lg:block">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Filters</h3>
                
                <h4 className="text-sm font-medium text-gray-900 mb-3">Categories</h4>
                <ul className="pb-6 space-y-3 text-sm font-medium text-gray-900 border-b border-gray-200">
                  {subCategories.map((category) => (
                    <li key={category.name}>
                      <a href={category.href} className="block py-1 transition-colors duration-200 hover:text-indigo-600">{category.name}</a>
                    </li>
                  ))}
                </ul>

                {filtredata1.map((section) => (
                  <Disclosure key={section.id} as="div" className="py-6 border-b border-gray-200">
                    <h3 className="flow-root -my-3">
                      <DisclosureButton className="flex items-center justify-between w-full py-3 text-sm text-gray-400 bg-white group hover:text-gray-500">
                        <span className="font-medium text-gray-900">{section.name}</span>
                        <span className="flex items-center ml-6">
                          <PlusIcon aria-hidden="true" className="h-5 w-5 group-data-[open]:hidden" />
                          <MinusIcon aria-hidden="true" className="h-5 w-5 [.group:not([data-open])_&]:hidden" />
                        </span>
                      </DisclosureButton>
                    </h3>
                    <DisclosurePanel className="pt-6">
                      <div className="space-y-4">
                        {section.options.map((option, optionIdx) => (
                          <div key={option.value} className="flex items-center">
                            <input
                              defaultValue={option.value}
                              defaultChecked={option.checked}
                              id={`filter-${section.id}-${optionIdx}`}
                              name={`${section.id}[]`}
                              type="checkbox"
                              className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                            />
                            <label htmlFor={`filter-${section.id}-${optionIdx}`} className="ml-3 text-sm text-gray-600">
                              {option.label}
                            </label>
                          </div>
                        ))}
                      </div>
                    </DisclosurePanel>
                  </Disclosure>
                ))}
                {filtredata2.map((section) => (
                  <Disclosure key={section.id} as="div" className="py-6 border-b border-gray-200">
                    <h3 className="flow-root -my-3">
                      <DisclosureButton className="flex items-center justify-between w-full py-3 text-sm text-gray-400 bg-white group hover:text-gray-500">
                        <span className="font-medium text-gray-900">{section.name}</span>
                        <span className="flex items-center ml-6">
                          <PlusIcon aria-hidden="true" className="h-5 w-5 group-data-[open]:hidden" />
                          <MinusIcon aria-hidden="true" className="h-5 w-5 [.group:not([data-open])_&]:hidden" />
                        </span>
                      </DisclosureButton>
                    </h3>
                    <DisclosurePanel className="pt-6">
                      <div className="space-y-4">
                        {section.options.map((option, optionIdx) => (
                          <div key={option.value} className="flex items-center">
                            <input
                              defaultValue={option.value}
                              defaultChecked={option.checked}
                              id={`filter-${section.id}-${optionIdx}`}
                              name={`${section.id}[]`}
                              type="radio"
                              className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                            />
                            <label htmlFor={`filter-${section.id}-${optionIdx}`} className="ml-3 text-sm text-gray-600">
                              {option.label}
                            </label>
                          </div>
                        ))}
                      </div>
                    </DisclosurePanel>
                  </Disclosure>
                ))}
                
                <div className="pt-6">
                  <button
                    type="submit"
                    className="w-full px-4 py-3 text-base font-medium text-white bg-indigo-600 rounded-md shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    Apply Filters
                  </button>
                </div>
              </form>

              {/* Product grid */}
              <div className="lg:col-span-3">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {products.map((data, index) => (
                    <div key={index} className="flex justify-center">
                      <ProductCard data={data} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}
// 'use client'
// import { useEffect, useState } from 'react'
// import axios from 'axios'

// import {
//   Dialog,
//   DialogBackdrop,
//   DialogPanel,
//   Disclosure,
//   DisclosureButton,
//   DisclosurePanel,
//   Menu,
//   MenuButton,
//   MenuItem,
//   MenuItems,
// } from '@headlessui/react'
// import { XMarkIcon } from '@heroicons/react/24/outline'
// import { ChevronDownIcon, FunnelIcon, MinusIcon, PlusIcon, Squares2X2Icon } from '@heroicons/react/20/solid'
// import ProductCard from '../../components/product/ProductCard.jsx'

// const sortOptions = [
//   { name: 'Most Popular', href: '#', current: true },
//   { name: 'Best Rating', href: '#', current: false },
//   { name: 'Newest', href: '#', current: false },
//   { name: 'Price: Low to High', href: '#', current: false },
//   { name: 'Price: High to Low', href: '#', current: false },
// ]
// const subCategories = [
//   { name: 'Totes', href: '#' },
//   { name: 'Backpacks', href: '#' },
//   { name: 'Travel Bags', href: '#' },
//   { name: 'Hip Bags', href: '#' },
//   { name: 'Laptop Sleeves', href: '#' },
// ]
// const filtredata1 = [
//     {
//         id:"color",
//         name:"Color",
//         options:[
//             {value:"white",label:"white"},
//             {value:"beige",label:"beige"},
//             {value:"blue",label:"blue"},
//             {value:"brown",label:"brown"},
//             {value:"green",label:"green"},
//             {value:"purple",label:"purple"},
//             {value:"yellow",label:"yellow"},
//         ]
//     },
//     {
//         id:"size",
//         name:"Size",
//         options:[
//             {value:"S",label:"S"},
//             {value:"M",label:"M"},
//             {value:"L",label:"L"},
//         ]
//     }
// ]
// const filtredata2 = [
//     {
//         id:"price",
//         name:"Price",
//         options:[
//             {value:"159-399",label:"₹159 to ₹399"},
//             {value:"399-999",label:"₹399 to ₹999"},
//             {value:"999-1999",label:"₹999 to ₹1999"},
//             {value:"1999-2999",label:"₹1999 to ₹2999"},
//             {value:"3999-4999",label:"₹3999 to ₹4999"},
           
//         ]
//     },
//     {
//         id:"discount",
//         name:"Discount Range",
//         options:[
//             {value:"10",label:"10% And Above"},
//             {value:"20",label:"20% And Above"},
//             {value:"30",label:"30% And Above"},
//             {value:"40",label:"40% And Above"},
//             {value:"50",label:"50% And Above"},
//             {value:"60",label:"60% And Above"},
//             {value:"70",label:"70% And Above"},
//             {value:"80",label:"80% And Above"}, 
//         ]
//     },
//     {
//         id:"availability",
//         name:"Availability",
//         options:[
//             {value:"instock",label:"In Stock"},
//             {value:"outstock",label:"Out Of Stock"},
//         ]
//     }
// ]


// function classNames(...classes) {
//   return classes.filter(Boolean).join(' ')
// }

// export default function ProductsPage() {
//   const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
//   const [products, setProducts] = useState([])
//   const [status, setStatus] = useState('idle')
//   useEffect(() => {
//     if (status === 'idle') {
//       fetchProducts()
//     }
//   }, [status])

//   const fetchProducts = async () => {
//     try {
//       setStatus('loading')
//       const response = await axios.get('https://fakestoreapi.com/products')
//       setProducts(response.data)
//       setStatus('succeeded')
//     } catch (error) {
//       console.error('Error fetching products:', error)
//       setStatus('failed')
//     }
//   }

//   if (status === 'loading') {
//     return <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-t-transparent"></div>
//   }

//   if (status === 'failed') {
//     return <p className="text-red-500">Something went wrong! Please try again later</p>
//   }

//   return (
//     <div className="bg-white">
//       <div>
//         {/* Mobile filter dialog */}
//         <Dialog open={mobileFiltersOpen} onClose={setMobileFiltersOpen} className="relative z-40 lg:hidden">
//           <DialogBackdrop
//             transition
//             className="fixed inset-0 bg-black bg-opacity-25 transition-opacity duration-300 ease-linear data-[closed]:opacity-0"
//           />

//           <div className="fixed inset-0 z-40 flex">
//             <DialogPanel
//               transition
//               className="relative ml-auto flex h-full w-full max-w-xs transform flex-col overflow-y-auto bg-white py-4 pb-12 shadow-xl transition duration-300 ease-in-out data-[closed]:translate-x-full"
//             >
//               <div className="flex items-center justify-between px-4">
//                 <h2 className="text-lg font-medium text-gray-900">Filters</h2>
//                 <button
//                   type="button"
//                   onClick={() => setMobileFiltersOpen(false)}
//                   className="flex items-center justify-center w-10 h-10 p-2 -mr-2 text-gray-400 bg-white rounded-md"
//                 >
//                   <span className="sr-only">Close menu</span>
//                   <XMarkIcon aria-hidden="true" className="w-6 h-6" />
//                 </button>
//               </div>
//             </DialogPanel>
//           </div>
//         </Dialog>

//         <main className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
//           <div className="flex items-baseline justify-between pt-12 pb-6 border-b border-gray-200">
//             <h1 className="text-4xl font-bold tracking-tight text-gray-900">New Arrivals</h1>

//             <div className="flex items-center">
//               <Menu as="div" className="relative inline-block text-left">
//                 <div>
//                   <MenuButton className="inline-flex justify-center text-sm font-medium text-gray-700 group hover:text-gray-900">
//                     Sort
//                     <ChevronDownIcon
//                       aria-hidden="true"
//                       className="flex-shrink-0 w-5 h-5 ml-1 -mr-1 text-gray-400 group-hover:text-gray-500"
//                     />
//                   </MenuButton>
//                 </div>

//                 <MenuItems
//                   transition
//                   className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-2xl ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
//                 >
//                   <div className="py-1">
//                     {sortOptions.map((option) => (
//                       <MenuItem key={option.name}>
//                         <a
//                           href={option.href}
//                           className={classNames(
//                             option.current ? 'font-medium text-gray-900' : 'text-gray-500',
//                             'block px-4 py-2 text-sm data-[focus]:bg-gray-100',
//                           )}
//                         >
//                           {option.name}
//                         </a>
//                       </MenuItem>
//                     ))}
//                   </div>
//                 </MenuItems>
//               </Menu>

//               <button type="button" className="p-2 ml-5 -m-2 text-gray-400 hover:text-gray-500 sm:ml-7">
//                 <span className="sr-only">View grid</span>
//                 <Squares2X2Icon aria-hidden="true" className="w-5 h-5" />
//               </button>
//               <button
//                 type="button"
//                 onClick={() => setMobileFiltersOpen(true)}
//                 className="p-2 ml-4 -m-2 text-gray-400 hover:text-gray-500 sm:ml-6 lg:hidden"
//               >
//                 <span className="sr-only">Filters</span>
//                 <FunnelIcon aria-hidden="true" className="w-5 h-5" />
//               </button>
//             </div>
//           </div>

//           <section aria-labelledby="products-heading" className="pt-6 pb-24">
//             <h2 id="products-heading" className="sr-only">
//               Products
//             </h2>

//             <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
//               {/* Filters */}
//               <form className="hidden lg:block">
//                 <h3 className="sr-only">Categories</h3>
//                 <ul className="pb-6 space-y-4 text-sm font-medium text-gray-900 border-b border-gray-200">
//                   {subCategories.map((category) => (
//                     <li key={category.name}>
//                       <a href={category.href}>{category.name}</a>
//                     </li>
//                   ))}
//                 </ul>

//                 {filtredata1.map((section) => (
//                   <Disclosure key={section.id} as="div" className="py-6 border-b border-gray-200">
//                     <h3 className="flow-root -my-3">
//                       <DisclosureButton className="flex items-center justify-between w-full py-3 text-sm text-gray-400 bg-white group hover:text-gray-500">
//                         <span className="font-medium text-gray-900">{section.name}</span>
//                         <span className="flex items-center ml-6">
//                           <PlusIcon aria-hidden="true" className="h-5 w-5 group-data-[open]:hidden" />
//                           <MinusIcon aria-hidden="true" className="h-5 w-5 [.group:not([data-open])_&]:hidden" />
//                         </span>
//                       </DisclosureButton>
//                     </h3>
//                     <DisclosurePanel className="pt-6">
//                       <div className="space-y-4">
//                         {section.options.map((option, optionIdx) => (
//                           <div key={option.value} className="flex items-center">
//                             <input
//                               defaultValue={option.value}
//                               defaultChecked={option.checked}
//                               id={`filter-${section.id}-${optionIdx}`}
//                               name={`${section.id}[]`}
//                               type="checkbox"
//                               className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
//                             />
//                             <label htmlFor={`filter-${section.id}-${optionIdx}`} className="ml-3 text-sm text-gray-600">
//                               {option.label}
//                             </label>
//                           </div>
//                         ))}
//                       </div>
//                     </DisclosurePanel>
//                   </Disclosure>
//                 ))}
//                 {filtredata2.map((section) => (
//                   <Disclosure key={section.id} as="div" className="py-6 border-b border-gray-200">
//                     <h3 className="flow-root -my-3">
//                       <DisclosureButton className="flex items-center justify-between w-full py-3 text-sm text-gray-400 bg-white group hover:text-gray-500">
//                         <span className="font-medium text-gray-900">{section.name}</span>
//                         <span className="flex items-center ml-6">
//                           <PlusIcon aria-hidden="true" className="h-5 w-5 group-data-[open]:hidden" />
//                           <MinusIcon aria-hidden="true" className="h-5 w-5 [.group:not([data-open])_&]:hidden" />
//                         </span>
//                       </DisclosureButton>
//                     </h3>
//                     <DisclosurePanel className="pt-6">
//                       <div className="space-y-4">
//                         {section.options.map((option, optionIdx) => (
//                           <div key={option.value} className="flex items-center">
//                             <input
//                               defaultValue={option.value}
//                               defaultChecked={option.checked}
//                               id={`filter-${section.id}-${optionIdx}`}
//                               name={`${section.id}[]`}
//                               type="radio"
//                               className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
//                             />
//                             <label htmlFor={`filter-${section.id}-${optionIdx}`} className="ml-3 text-sm text-gray-600">
//                               {option.label}
//                             </label>
//                           </div>
//                         ))}
//                       </div>
//                     </DisclosurePanel>
//                   </Disclosure>
//                 ))}
//               </form>

//               {/* Product grid */}
//               <div className="lg:col-span-3">
//                 <div className="flex flex-wrap justify-center mx-auto">
//                   {products.map((data, index) => (
//                     <ProductCard key={index} data={data} />
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </section>
//         </main>
//       </div>
//     </div>
//   )
// }