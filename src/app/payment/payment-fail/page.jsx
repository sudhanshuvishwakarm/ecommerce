export default function PaymentFail() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <div className="bg-white shadow-lg rounded-2xl p-8 text-center">
        <h1 className="text-3xl font-semibold text-red-600 mb-2">
          Payment Failed ❌
        </h1>
        <p className="text-gray-700 mb-2">
          Something went wrong with your payment.
        </p>
        <p className="text-gray-500 text-sm">
          Please try again or contact support.
        </p>
      </div>
    </div>
  );
}
