import { NextResponse } from "next/server";
import Razorpay from "razorpay";

export async function POST(request) {
  try {
    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_API_KEY,
      key_secret: process.env.RAZORPAY_API_SECRET,
    });

    const body = await request.json();
    const { amount } = body;

    const options = {
      amount: Math.round(amount * 100), 
      currency: "INR",
      receipt: "receipt_order_" + Math.floor(Math.random() * 100000),
    };

    const order = await instance.orders.create(options);
    console.log("Razorpay Order Created:", order);

    return NextResponse.json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Razorpay Error:", error);
    return NextResponse.json(
      { success: false, error: "Error processing payment" },
      { status: 500 }
    );
  }
}

export async function GET(request) {
    try {
        return NextResponse.json({
          key: process.env.RAZORPAY_API_KEY
        });
    } catch (error) {
        return NextResponse.json({ error: "Error fetching API key" }, { status: 500 });
    }
}