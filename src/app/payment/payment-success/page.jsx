"use client";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

export default function PaymentSuccess() {
  const searchParams = useSearchParams();
  const paymentId = searchParams.get("payment_id");
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(paymentId);
    setCopied(true);
    toast.success("Payment ID copied!");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <div className="bg-white shadow-lg rounded-2xl p-8 text-center">
        <h1 className="text-3xl font-semibold text-green-600 mb-2">
          Payment Successful 🎉
        </h1>
        <p className="text-gray-700 mb-4">Thank you for your order!</p>

        <div className="bg-gray-100 rounded-lg p-4 flex items-center justify-between">
          <div className="font-mono text-gray-800">{paymentId}</div>
          <button
            onClick={handleCopy}
            className="ml-3 bg-blue-500 hover:bg-blue-600 text-white text-sm px-3 py-1.5 rounded-lg"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>

        <p className="text-sm text-gray-500 mt-3">
          Keep this Payment ID as proof for any future reference.
        </p>
      </div>
    </div>
  );
}
