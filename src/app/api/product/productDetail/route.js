import { connectDB } from "../../../../dbConfig/dbconnection.js";
import Product from "../../../../models/productModel.js";
import { NextResponse } from "next/server";
connectDB();

export async function POST(request) {
  try {
    const { productId } = await request.json();
    if (!productId) {
      return NextResponse.json({ message: "Product ID is required" }, { status: 400 });
    }
    const product = await Product.findById(productId).populate("category");
    if (!product) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }
    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json(
      { message: "Error in product detail route", error: error.message },
      { status: 500 }
    );
  }
}
