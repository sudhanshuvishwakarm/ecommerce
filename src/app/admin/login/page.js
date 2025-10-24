'use client'
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { loginAdmin, clearError } from '../../../redux/adminSlices/authSlice.js';
import Loading from '../../../components/loader/Loading.jsx';
import { useDispatch,useSelector } from 'react-redux';
import { toast } from 'react-toastify';

export default function Login() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { loading, error, isAuthenticated } = useSelector(state => state.adminAuth);

  const [admin, setAdmin] = useState({
    username: '',
    password: '',
  });
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [localError, setLocalError] = useState('');

  useEffect(() => {
    if (admin.username && admin.password) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [admin]);

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/admin');
      toast.success('Login Successfully')
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (error) {
      setLocalError(error);
      const timer = setTimeout(() => {
        setLocalError('');
        dispatch(clearError());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  const onSignin = async (e) => {
    e.preventDefault();
    
    if (!admin.username || !admin.password) {
      setLocalError('Please fill in all fields');
      toast.success('Please fill in all fields')
      return;
    }

    dispatch(loginAdmin({ 
      username: admin.username, 
      password: admin.password 
    }));
  };

  return (
    <div className="flex min-h-screen">
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12">
        <div className="w-full max-w-md">
          <a href="/">
            <img
              alt="Your Company"
              src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
              className="mx-auto h-10 w-auto"
            />
          </a>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Sign in to admin dashboard
            </h1>
          </div>

          {localError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{localError}</p>
            </div>
          )}

          <form onSubmit={onSignin} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-900 mb-1">
                Username
              </label>
              <input
                value={admin.username}
                onChange={(e) => setAdmin({ ...admin, username: e.target.value })}
                id="username"
                name="username"
                type="text"
                required
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <label htmlFor="password" className="block text-sm font-medium text-gray-900">
                  Password
                </label>
                <a href="#" className="text-sm text-indigo-600 hover:text-indigo-500">
                  Forgot password?
                </a>
              </div>
              <input
                value={admin.password}
                onChange={(e) => setAdmin({ ...admin, password: e.target.value })}
                id="password"
                name="password"
                type="password"
                required
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100"
              />
            </div>

            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                disabled={loading}
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                Remember me
              </label>
            </div>

            <button
              type="submit"
              disabled={buttonDisabled || loading}
              className={`group relative flex w-full justify-center rounded-md border border-transparent 
                  ${buttonDisabled || loading ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700 cursor-pointer"} 
                  py-2 px-4 text-sm font-medium text-white 
                  focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

        </div>
      </div>
      {loading && (
        <Loading />
      )}
      <div className="hidden lg:block lg:w-1/2 bg-gray-100">
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
}