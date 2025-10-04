'use client'
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import Loading from '../../../components/loader/Loading.jsx';
import { signup, clearError } from '../../../redux/slices/authSlice.js';

export default function Signup() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { loading, error, signupEmail } = useSelector(state => state.auth);

  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [buttonDisabled, setButtonDisabled] = useState(true);

  useEffect(() => {
    if (user.username.length > 0 && user.email.length > 0 && user.password.length >= 8) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [user]);

  useEffect(() => {
    if (signupEmail) {
      toast.success("Account created successfully. Please check your email to verify your account.");
      router.push(`/auth/verify-otp?email=${encodeURIComponent(signupEmail)}`);
    }
  }, [signupEmail, router]);

  useEffect(() => {
    if (error) {
      toast.error(error.message || "An error occurred during signup.");
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const onSignup = async (e) => {
    e.preventDefault();
    try {
      await dispatch(signup(user)).unwrap();
    } catch (error) {
      console.error("Signup error:", error);
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="w-full lg:w-1/2 h-screen overflow-y-auto py-12">
        <div className="min-h-full flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-md space-y-8 py-0">
            <div className="text-center">
              <a href="/">
                <img
                  alt="Your Company"
                  src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
                  className="mx-auto h-10 w-auto"
                />
              </a>
              <h1 className="mt-6 text-2xl font-bold text-gray-900">
                Create your account
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                Join our ecommerce community today
              </p>
            </div>

            <form onSubmit={onSignup} className="mt-8 space-y-6">
              <div className="grid gap-4">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                    Username
                  </label>
                  <input
                    value={user.username}
                    onChange={(e) => setUser({ ...user, username: e.target.value })}
                    id="username"
                    name="userName"
                    type="text"
                    required
                    className="block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <input
                  value={user.email}
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  value={user.password}
                  onChange={(e) => setUser({ ...user, password: e.target.value })}
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Must be at least 8 characters
                </p>
              </div>

              <div className="flex items-start">
                <div className="flex h-5 items-center">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    required
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="terms" className="font-medium text-gray-700">
                    I agree to the{' '}
                    <a href="#" className="text-indigo-600 hover:text-indigo-500">
                      Terms of Service
                    </a>{' '}
                    and{' '}
                    <a href="#" className="text-indigo-600 hover:text-indigo-500">
                      Privacy Policy
                    </a>
                  </label>
                </div>
              </div>
              <div>
                <button
                  type="submit"
                  disabled={buttonDisabled || loading}
                  className={`group relative flex w-full justify-center rounded-md border border-transparent 
                  ${buttonDisabled || loading ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700 cursor-pointer"} 
                  py-2 px-4 text-sm font-medium text-white 
                  focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                </button>
              </div>
            </form>

            <div className="text-center text-sm">
              <p className="text-gray-600">
                Already have an account?{' '}
                <button
                  onClick={() => router.push('/auth/login')}
                  className="font-medium text-indigo-600 cursor-pointer hover:underline hover:text-indigo-500"
                >
                  Sign in
                </button>
              </p>
            </div>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-2 text-gray-500">
                    Or sign up with
                  </span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  className="inline-flex w-full justify-center items-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 gap-2 cursor-pointer shadow-sm hover:bg-gray-50"
                >
                  <i className="fa-brands text-xl fa-google"></i>
                  <span>Google</span>
                </button>
                <button
                  type="button"
                  className="inline-flex w-full justify-center items-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 gap-2 cursor-pointer shadow-sm hover:bg-gray-50"
                >
                  <i className="fa-brands text-xl fa-github"></i>
                  <span>GitHub</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {loading && (
        <Loading/>
      )}
      <div className="hidden lg:fixed lg:inset-y-0 lg:right-0 lg:flex lg:w-1/2">
        <div className="relative h-full w-full">
          <Image
            src="/Images/auth.jpg"
            alt="Decorative background"
            fill
            style={{ objectFit: "cover" }}
            quality={100}
            priority
          />
        </div>
      </div>
    </div>
  );
}// 'use client'
// import Image from 'next/image';
// import { useRouter } from 'next/navigation';
// import React, { useEffect, useState } from 'react';
// import { toast } from 'react-toastify';
// import axios from 'axios';
// import Loading from '../../../components/loader/Loading.jsx';
// export default function Signup() {
//   const router = useRouter();
//   const [user, setuser] = useState({
//     username: "",
//     email: "",
//     password: "",
//   })
//   const [buttonDisabled, setButtonDisabled] = useState(true);
//   const [loading, setLoading] = useState(false);

//  // In your signup component, replace the success handler:
// const onSignup = async (e) => {
//   e.preventDefault()
//   setLoading(true)
//   try {
//     const res = await axios.post('/api/users/signup', user)
//     toast.success("Account created successfully. Please check your email to verify your account.");
//     setLoading(false)
//     router.push(`/auth/verify-otp?email=${encodeURIComponent(user.email)}`);
//   } catch (error) {
//     console.error("Signup error:", error);
//     toast.error(error.response?.data?.message || "An error occurred during signup.");
//     setLoading(false)
//   }
// }


//   useEffect(() => {
//     if (user.username.length > 0 && user.email.length > 0 && user.password.length >= 8) {
//       setButtonDisabled(false);
//     }
//     else {
//       setButtonDisabled(true);
//     }
//   }, [user])
//   return (
//     <div className="flex min-h-screen">
//       {/* Auth form section - now properly scrollable with fixed positioning */}
//       <div className="w-full lg:w-1/2 h-screen overflow-y-auto py-12">
//         <div className="min-h-full flex items-center justify-center px-4 sm:px-6 lg:px-8">
//           <div className="w-full max-w-md space-y-8 py-0">
//             <div className="text-center">
//               <a href="/">
//                 <img
//                   alt="Your Company"
//                   src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
//                   className="mx-auto h-10 w-auto"
//                 />
//               </a>
//               <h1 className="mt-6 text-2xl font-bold text-gray-900">
//                 Create your account
//               </h1>
//               <p className="mt-2 text-sm text-gray-600">
//                 Join our ecommerce community today
//               </p>
//             </div>

//             <form onSubmit={onSignup} className="mt-8 space-y-6">
//               <div className="grid  gap-4">
//                 <div>
//                   <label htmlFor="username" className="block text-sm font-medium text-gray-700">
//                     Username
//                   </label>
//                   <input
//                     value={user.username}
//                     onChange={(e) => setuser({ ...user, username: e.target.value })}
//                     id="username"
//                     name="userName"
//                     type="text"
//                     required
//                     className="block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
//                   />
//                 </div>
//               </div>

//               <div>
//                 <label htmlFor="email" className="block text-sm font-medium text-gray-700">
//                   Email address
//                 </label>
//                 <input
//                   value={user.email}
//                   onChange={(e) => setuser({ ...user, email: e.target.value })}
//                   id="email"
//                   name="email"
//                   type="email"
//                   required
//                   className="block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
//                 />
//               </div>
//               <div>
//                 <label htmlFor="password" className="block text-sm font-medium text-gray-700">
//                   Password
//                 </label>
//                 <input
//                   value={user.password}
//                   onChange={(e) => setuser({ ...user, password: e.target.value })}
//                   id="password"
//                   name="password"
//                   type="password"
//                   required
//                   className="block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
//                 />
//                 <p className="mt-1 text-xs text-gray-500">
//                   Must be at least 8 characters
//                 </p>
//               </div>

//               <div className="flex items-start">
//                 <div className="flex h-5 items-center">
//                   <input
//                     id="terms"
//                     name="terms"
//                     type="checkbox"
//                     required
//                     className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
//                   />
//                 </div>
//                 <div className="ml-3 text-sm">
//                   <label htmlFor="terms" className="font-medium text-gray-700">
//                     I agree to the{' '}
//                     <a href="#" className="text-indigo-600 hover:text-indigo-500">
//                       Terms of Service
//                     </a>{' '}
//                     and{' '}
//                     <a href="#" className="text-indigo-600 hover:text-indigo-500">
//                       Privacy Policy
//                     </a>
//                   </label>
//                 </div>
//               </div>
//               <div>
//                 <button
//                   type="submit"
//                   className={`group relative flex w-full justify-center rounded-md border border-transparent 
//                   ${buttonDisabled ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700 cursor-pointer"} 
//                   py-2 px-4 text-sm font-medium text-white 
//                   focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
//                 >
//                   Create Account
//                 </button>
//               </div>
//             </form>

//             <div className="text-center text-sm">
//               <p className="text-gray-600">
//                 Already have an account?{' '}
//                 <button
//                   onClick={() => router.push('/auth/login')}
//                   className="font-medium text-indigo-600 cursor-pointer hover:underline hover:text-indigo-500"
//                 >
//                   Sign in
//                 </button>
//               </p>
//             </div>

//             <div className="mt-6">
//               <div className="relative">
//                 <div className="absolute inset-0 flex items-center">
//                   <div className="w-full border-t border-gray-300" />
//                 </div>
//                 <div className="relative flex justify-center text-sm">
//                   <span className="bg-white px-2 text-gray-500">
//                     Or sign up with
//                   </span>
//                 </div>
//               </div>

//               <div className="mt-6 grid grid-cols-2 gap-3">
//                 <button
//                   type="button"
//                   className="inline-flex w-full justify-center items-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 gap-2 cursor-pointer shadow-sm hover:bg-gray-50"
//                 >
//                   <i className="fa-brands text-xl fa-google"></i>
//                   <span>Google</span>
//                 </button>
//                 <button
//                   type="button"
//                   className="inline-flex w-full justify-center items-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 gap-2 cursor-pointer shadow-sm hover:bg-gray-50"
//                 >
//                   <i className="fa-brands text-xl fa-github"></i>
//                   <span>GitHub</span>
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//       {loading && (
//         <Loading/>
//       )}
//       {/* Sidebar with image - now fixed and full height */}
//       <div className="hidden lg:fixed lg:inset-y-0 lg:right-0 lg:flex lg:w-1/2">
//         <div className="relative h-full w-full">
//           <Image
//             src="/Images/auth.jpg"
//             alt="Decorative background"
//             fill
//             style={{ objectFit: "cover" }}
//             quality={100}
//             priority
//           />
//         </div>
//       </div>
//     </div>
//   );
// }