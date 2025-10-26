import { NextResponse } from "next/server";
import { connectDB } from "../../../../dbConfig/dbconnection.js";
import Order from "../../../../models/orderModel.js";
import OrderItem from "../../../../models/orderItemsModel.js";
import User from "../../../../models/userModel.js";
import Address from "../../../../models/addressModel.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

connectDB();

// Verify admin token helper
const verifyAdminToken = (token) => {
  if (!token) {
    return { valid: false, error: "No token found" };
  }
  try {
    jwt.verify(token, process.env.JWT_SECRET);
    return { valid: true };
  } catch (error) {
    return { valid: false, error: "Invalid or expired token" };
  }
};

// GET - Fetch All Orders with Shipping Address
export async function GET(request) {
  try {
    const token = request.cookies.get("adminToken")?.value;
    const verification = verifyAdminToken(token);

    if (!verification.valid) {
      return NextResponse.json(
        { message: `Unauthorized - ${verification.error}` },
        { status: 401 }
      );
    }

    const allOrders = await Order.find()
      .populate({
        path: "user",
        select: "username email",
      })
      .populate({
        path: "shippingAddress",
        select: "firstName lastName streetAddress city state zipCode mobile",
      })
      .populate({
        path: "orderItems",
        populate: {
          path: "product",
          select: "title price imageUrl",
        },
      })
      .sort({ createdAt: -1 });

    console.log("Orders fetched successfully:", allOrders.length);

    return NextResponse.json(
      {
        message: "Orders fetched successfully",
        orders: allOrders,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      {
        message: "Error fetching orders",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// POST - Update Order Status
export async function POST(request) {
  try {
    const token = request.cookies.get("adminToken")?.value;
    const verification = verifyAdminToken(token);

    if (!verification.valid) {
      return NextResponse.json(
        { message: `Unauthorized - ${verification.error}` },
        { status: 401 }
      );
    }

    // Get order ID from query
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get("id");

    if (!orderId) {
      return NextResponse.json(
        { message: "Order ID is required" },
        { status: 400 }
      );
    }

    // Validate MongoDB ID
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return NextResponse.json(
        { message: "Invalid order ID" },
        { status: 400 }
      );
    }

    const { orderStatus } = await request.json();

    if (!orderStatus) {
      return NextResponse.json(
        { message: "Status is required" },
        { status: 400 }
      );
    }

    // Valid statuses
    const validStatuses = ["PENDING", "CONFIRMED", "SHIPPED", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED"];
    if (!validStatuses.includes(orderStatus)) {
      return NextResponse.json(
        { message: `Invalid status. Valid statuses: ${validStatuses.join(", ")}` },
        { status: 400 }
      );
    }

    // Find and update order
    const order = await Order.findByIdAndUpdate(
      orderId,
      { orderStatus },
      { new: true }
    )
      .populate({
        path: "user",
        select: "name email",
      })
      .populate({
        path: "shippingAddress",
        select: "firstName lastName streetAddress city state zipCode mobile",
      })
      .populate({
        path: "orderItems",
        populate: {
          path: "product",
          select: "title price imageUrl",
        },
      });

    if (!order) {
      return NextResponse.json(
        { message: "Order not found" },
        { status: 404 }
      );
    }

    console.log("Order status updated successfully:", orderId);

    return NextResponse.json(
      {
        message: "Order status updated successfully",
        order: order,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating order status:", error);
    return NextResponse.json(
      {
        message: "Error updating order status",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// DELETE - Delete Order and Associated OrderItems
export async function DELETE(request) {
  try {
    const token = request.cookies.get("adminToken")?.value;
    const verification = verifyAdminToken(token);

    if (!verification.valid) {
      return NextResponse.json(
        { message: `Unauthorized - ${verification.error}` },
        { status: 401 }
      );
    }

    // Get order ID from query
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get("id");

    if (!orderId) {
      return NextResponse.json(
        { message: "Order ID is required" },
        { status: 400 }
      );
    }

    // Validate MongoDB ID
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return NextResponse.json(
        { message: "Invalid order ID" },
        { status: 400 }
      );
    }

    // Find order to get associated orderItems
    const order = await Order.findById(orderId);

    if (!order) {
      return NextResponse.json(
        { message: "Order not found" },
        { status: 404 }
      );
    }

    // Delete associated order items
    if (order.orderItems && order.orderItems.length > 0) {
      await OrderItem.deleteMany({ _id: { $in: order.orderItems } });
      console.log("Order items deleted:", order.orderItems.length);
    }

    // Delete order
    await Order.findByIdAndDelete(orderId);

    console.log("Order and all associated items deleted successfully:", orderId);

    return NextResponse.json(
      {
        message: "Order and all associated items deleted successfully",
        orderId: orderId,
        deletedData: {
          orderItemsDeleted: order.orderItems ? order.orderItems.length : 0,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting order:", error);
    return NextResponse.json(
      {
        message: "Error deleting order",
        error: error.message,
      },
      { status: 500 }
    );
  }
}