import { NextResponse } from "next/server";
import crypto from "crypto";
import Order from "../../../../models/orderModel.js";
import OrderItem from "../../../../models/orderItemsModel.js";
import PaymentInformation from "../../../../models/PaymentModel.js";
import Cart from "../../../../models/cartModel.js";
import CartItem from "../../../../models/cartItemModel.js";
import Address from "../../../../models/addressModel.js";
import getDataFromToken from "../../../../utils/getDataFromToken.js";
import { connectDB } from "../../../../dbConfig/dbconnection.js";
import User from "../../../../models/userModel.js";
 await connectDB();
export async function POST(request) {
  let orderItemsCreated = [];
  
  try {
    const formData = await request.formData();
    const razorpay_order_id = formData.get("razorpay_order_id");
    const razorpay_payment_id = formData.get("razorpay_payment_id");
    const razorpay_signature = formData.get("razorpay_signature");

    // Verify payment signature FIRST
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_API_SECRET)
      .update(sign)
      .digest("hex");

    if (razorpay_signature !== expectedSign) {
      console.log("Invalid payment signature!");
      return NextResponse.redirect("http://localhost:3000/payment/payment-fail", {
        status: 303,
      });
    }

    console.log("Payment verified successfully!");
   

    // Get user ID from token
    const userId = await getDataFromToken(request);
    if (!userId) {
      return NextResponse.redirect("http://localhost:3000/payment/payment-fail", {
        status: 303,
      });
    }

    // Get user's cart with proper population
    const cart = await Cart.findOne({ user: userId })
      .populate({
        path: "cartItems",
        populate: {
          path: "product",
          model: "products"
        }
      });

    if (!cart || cart.cartItems.length === 0) {
      return NextResponse.redirect("http://localhost:3000/payment/payment-fail", {
        status: 303,
      });
    }

    // Get user's default address
    const userAddress = await Address.findOne({ user: userId });
    if (!userAddress) {
      console.error("No address found for user:", userId);
      return NextResponse.redirect("http://localhost:3000/payment/payment-fail", {
        status: 303,
      });
    }

    // Create order items (store IDs for cleanup if needed)
    const orderItems = [];
    for (const cartItem of cart.cartItems) {
      const orderItem = new OrderItem({
        product: cartItem.product._id,
        size: cartItem.size,
        quantity: cartItem.quantity,
        price: cartItem.price,
        discountPrice: cartItem.discountedPrice,
        userId: userId
      });
      await orderItem.save();
      orderItems.push(orderItem._id);
      orderItemsCreated.push(orderItem._id); // Store for cleanup
    }

    // Calculate delivery date
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 7);

    // Create order - FIXED FIELD NAMES to match Cart model
    const order = new Order({
      user: userId,
      orderItems: orderItems,
      orderDate: new Date(),
      deliveryDate: deliveryDate,
      shippingAddress: userAddress._id,
      paymentDetails: {
        paymentMethod: "RAZORPAY",
        transactionId: razorpay_payment_id,
        paymentId: razorpay_payment_id,
        paymentStatus: "PAID"
      },
      totalPrice: cart.totalPrice,
      totalDiscountedPrice: cart.totalDiscountPrice, // Fixed: matches cart field name
      discounte: cart.discounte,
      orderStatus: "CONFIRMED",
      totalItem: cart.totalItem
    });

    await order.save();

    // Create payment record
    const payment = new PaymentInformation({
      user: userId,
      orderId: order._id.toString(),
      paymentId: razorpay_payment_id,
      signature: razorpay_signature,
      amount: cart.totalDiscountPrice, 
      status: "paid",
      paymentDate: new Date()
    });

    await payment.save();

     const user = await User.findById(userId);
    if (user) {
      user.paymentInformation.push(payment._id);
      await user.save(); // Added missing await
    }


    // Clear user's cart after successful order
    await CartItem.deleteMany({ _id: { $in: cart.cartItems } });
    await Cart.findOneAndUpdate(
      { user: userId },
      { 
        cartItems: [],
        totalPrice: 0,
        totalItem: 0,
        totalDiscountPrice: 0, // Fixed: matches cart field name
        discounte: 0
      }
    );

    console.log("Order created successfully:", order._id);
    console.log("Payment recorded successfully:", payment._id);
   
    return NextResponse.redirect(
      `http://localhost:3000/payment/payment-success?payment_id=${razorpay_payment_id}&order_id=${order._id}`,
      { status: 303 }
    );

  } catch (error) {
    console.error("Error verifying payment and creating order:", error);
    
    // CLEANUP: Delete any order items that were created if payment failed
    if (orderItemsCreated.length > 0) {
      try {
        await OrderItem.deleteMany({ _id: { $in: orderItemsCreated } });
        console.log("Cleaned up order items due to payment failure");
      } catch (cleanupError) {
        console.error("Error cleaning up order items:", cleanupError);
      }
    }
    
    return NextResponse.redirect("http://localhost:3000/payment/payment-fail", {
      status: 303,
    });
  }
}
