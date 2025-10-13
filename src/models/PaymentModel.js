import mongoose from "mongoose";

const paymentInformationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  orderId: {
    type: String,
    required: true,
  },
  paymentId: {
    type: String, 
  },
  signature: {
    type: String, 
  },
  amount: {
    type: Number,
    required: true,
  },

  status: {
    type: String,
    enum: ["created", "paid", "failed", "refunded"],
    default: "created",
  },
  paymentDate: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const PaymentInformation =
  mongoose.models.payment_information ||
  mongoose.model("payment_information", paymentInformationSchema);

export default PaymentInformation;


//   currency: {
//     type: String,
//     default: "INR",
//   },
//   method: {
//     type: String, // e.g. card, UPI, netbanking
//   },