import { StarIcon } from "@heroicons/react/24/solid" 

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const ProductReviewCard = ({ review }) => {
  console.log(" cccccccccccccccccccc",review)
  return (
    <div className="flex gap-4 p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex-shrink-0">
        <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
          {review?.name?.charAt(0) || 'U'}
        </div>
      </div>
      <div className="flex-1">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h4 className="font-medium text-gray-900">{review?.name || 'User'}</h4>
          <p className="text-sm text-gray-500 mt-1 sm:mt-0">{new Date(review?.date).toLocaleDateString() || ''}</p>
        </div>
        <div className="flex items-center mt-2">
          {[0, 1, 2, 3, 4].map((rating) => (
            <StarIcon
              key={rating}
              className={classNames(
                review?.rating > rating ? 'text-yellow-400' : 'text-gray-300',
                'h-5 w-5 flex-shrink-0'
              )}
              aria-hidden="true"
            />
          ))}
        </div>
        <p className="text-gray-700 mt-3 leading-relaxed">{review?.comment || 'No review text provided.'}</p>
        
        <div className="flex items-center mt-4 space-x-4">
          <button className="flex items-center text-sm text-gray-500 hover:text-indigo-600 transition-colors duration-200">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905a3.61 3.61 0 01-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
            </svg>
            Helpful (24)
          </button>
          <button className="text-sm text-gray-500 hover:text-indigo-600 transition-colors duration-200">
            Reply
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductReviewCard
