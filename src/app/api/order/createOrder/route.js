import { NextResponse } from "next/server";
import Order from "../../../../models/orderModel.js";
import OrderItem from "../../../../models/orderItemsModel.js";
import Cart from "../../../../models/cartModel.js";
import getDataFromToken from "../../../../utils/getDataFromToken.js";
import { connectDB } from "../../../../dbConfig/dbconnection.js";
connectDB();
export async function POST(request) {
  try {
    await connectDB();
    
    const userId = await getDataFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { shippingAddressId } = await request.json();

    // Get user's cart with populated items
    const cart = await Cart.findOne({ user: userId })
      .populate({
        path: "cartItems",
        populate: {
          path: "product",
          model: "products"
        }
      });

    if (!cart || cart.cartItems.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // Return order details for payment (DON'T create order yet)
    return NextResponse.json({
      success: true,
      orderData: {
        amount: cart.totalDiscountedPrice,
        items: cart.cartItems.length,
        cartId: cart._id,
        shippingAddressId: shippingAddressId
      }
    });

  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Error creating order" },
      { status: 500 }
    );
  }
}