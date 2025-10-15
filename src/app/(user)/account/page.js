'use client';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { checkAuth, logout as logoutAction } from '../../../redux/slices/authSlice.js';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import axios from 'axios';
import Loading from '../../../components/loader/Loading.jsx';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Edit2,
  Lock,
  LogOut,
  ChevronRight,
  Settings
} from 'lucide-react';

const Account = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading } = useSelector(state => state.auth);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(null); // 'edit', 'password', 'logout'

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const response = await axios.post('/api/users/me');
        setUserData(response.data.user || response.data);
        console.log("User data:", response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        if (error.response?.status === 401) {
          toast.error("Please login first");
          router.push('/auth/login');
        } else {
          toast.error("Failed to load profile");
        }
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchUserData();
    }
  }, [isAuthenticated, router]);

  const handleLogout = async () => {
    try {
      await dispatch(logoutAction()).unwrap();
      toast.success('Logged out successfully');
      router.push('/');
    } catch (error) {
      toast.error("Error logging out");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Please login to view your profile</h1>
          <button
            onClick={() => router.push('/auth/login')}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (loading || authLoading) {
    return <Loading />;
  }

  const profileData = userData || user || {};
  
  // Generate avatar with initials
  const getInitials = () => {
    const firstName = profileData.firstName || profileData.name?.split(' ')[0] || 'U';
    const lastName = profileData.lastName || profileData.name?.split(' ')[1] || '';
    return (firstName[0] + (lastName ? lastName[0] : '')).toUpperCase();
  };

  // Avatar background color (consistent with indigo theme)
  const getAvatarColor = (str) => {
    const colors = [
      'bg-indigo-600',
      'bg-indigo-500',
      'bg-indigo-700',
    ];
    let hash = 0;
    for (let i = 0; i < (str || 'user').length; i++) {
      hash = (str || 'user').charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const menuItems = [
    {
      id: 'edit',
      label: 'Edit Profile',
      icon: Edit2,
      description: 'Update your personal information',
      color: 'text-indigo-600'
    },
    {
      id: 'password',
      label: 'Change Password',
      icon: Lock,
      description: 'Update your password for security',
      color: 'text-amber-600'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      description: 'Manage your account settings',
      color: 'text-blue-600'
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-4xl">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-6">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            {/* Avatar */}
            <div className={`w-24 h-24 ${getAvatarColor(profileData.firstName || 'user')} rounded-full flex items-center justify-center shadow-lg`}>
              <span className="text-4xl font-bold text-white">
                {getInitials()}
              </span>
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">
                {profileData.firstName} {profileData.lastName}
              </h1>
              <p className="text-gray-600 mt-1">
                {profileData.email}
              </p>
              <div className="flex gap-4 mt-4">
                {/* <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium">
                  <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                  Active
                </span> */}
                <span className="text-sm text-gray-600">
                  Member since {new Date(profileData.createdAt || Date.now()).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Quick Action */}
            {/* <button
              onClick={() => {
                setModalType('logout');
                setShowModal(true);
              }}
              className="p-3 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </button> */}
          </div>
        </div>

        {/* Profile Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Contact Information */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-indigo-600" />
              Contact Information
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-gray-400 mt-1" />
                <div className="flex-1">
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium text-gray-900">{profileData.email || 'N/A'}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-gray-400 mt-1" />
                <div className="flex-1">
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-medium text-gray-900">{profileData.mobile || 'Not provided'}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                <div className="flex-1">
                  <p className="text-sm text-gray-600">Location</p>
                  <p className="font-medium text-gray-900">{profileData.city || 'Not provided'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Account Details */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-600" />
              Account Details
            </h2>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Account Created</p>
                <p className="font-medium text-gray-900">
                  {new Date(profileData.createdAt || Date.now()).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Account Status</p>
                <p className="font-medium text-gray-900">
                  <span className="inline-flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm">
                    <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                    Active
                  </span>
                </p>
              </div>

              {/* <div>
                <p className="text-sm text-gray-600">User ID</p>
                <p className="font-medium text-gray-900 text-xs break-all">{profileData._id || 'N/A'}</p>
              </div> */}
            </div>
          </div>
        </div>

        {/* Action Menu */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <h2 className="text-lg font-semibold text-gray-900 p-6 border-b border-gray-100">
            Account Actions
          </h2>
          
          <div className="divide-y divide-gray-100">
            {menuItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setModalType(item.id);
                    setShowModal(true);
                  }}
                  className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gray-100 rounded-lg group-hover:bg-indigo-50 transition-colors">
                      <IconComponent className={`w-5 h-5 ${item.color}`} />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-gray-900">{item.label}</p>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
                </button>
              );
            })}
          </div>
        </div>

        {/* Logout Danger Zone */}
        {/* <div className="bg-white rounded-2xl shadow-sm p-6 mt-6 border-l-4 border-red-600">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <LogOut className="w-5 h-5 text-red-600" />
            Danger Zone
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Logging out will end your current session. You'll need to login again to access your account.
          </p>
          <button
            onClick={() => {
              setModalType('logout');
              setShowModal(true);
            }}
            className="w-full py-3 px-4 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
          >
            Logout
          </button>
        </div> */}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            {modalType === 'logout' && (
              <>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Confirm Logout</h2>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to logout? You'll need to login again to access your account.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowModal(false)}
                    className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      setShowModal(false);
                      handleLogout();
                    }}
                    className="flex-1 py-2 px-4 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </>
            )}

            {modalType === 'edit' && (
              <>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Edit Profile</h2>
                <p className="text-gray-600 mb-6">
                  Edit profile functionality coming soon. The backend will be implemented to update your information.
                </p>
                <button
                  onClick={() => setShowModal(false)}
                  className="w-full py-2 px-4 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                >
                  Close
                </button>
              </>
            )}

            {modalType === 'password' && (
              <>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Change Password</h2>
                <p className="text-gray-600 mb-6">
                  Change password functionality coming soon. The backend will be implemented to securely update your password.
                </p>
                <button
                  onClick={() => setShowModal(false)}
                  className="w-full py-2 px-4 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                >
                  Close
                </button>
              </>
            )}

            {modalType === 'settings' && (
              <>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Account Settings</h2>
                <p className="text-gray-600 mb-6">
                  Account settings functionality coming soon. You'll be able to configure your preferences and notifications here.
                </p>
                <button
                  onClick={() => setShowModal(false)}
                  className="w-full py-2 px-4 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                >
                  Close
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Account;