'use client';

const AddressCard = ({ getAddress, addressData }) => {
  return (
    <div>
      {getAddress ? (
        <div className="border border-gray-200 rounded-lg p-5 bg-white">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-lg font-semibold text-gray-900">{addressData.firstname} {addressData.lastname}</p>
              <p className="mt-2 text-gray-700">{addressData.address}</p>
              <p className="text-gray-700">
                {addressData.city}, {addressData.state}, {addressData.postalcode}
              </p>
              <div className="mt-3 flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="font-medium text-gray-700">{addressData.phonenumber}</span>
              </div>
            </div>
            <button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
              Change
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
          <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <p className="text-gray-500">No address available</p>
        </div>
      )}
    </div>
  );
};
export default AddressCard;
