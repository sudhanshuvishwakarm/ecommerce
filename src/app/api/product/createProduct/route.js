import Product from "../../../../models/productModel.js";
import { NextResponse } from "next/server";
import { connectDB } from "../../../../dbConfig/dbconnection.js";
import Category from "../../../../models/categoryModel.js";

connectDB()
export async function POST(request) {
  try {
    const {
      title,
      description,
      price,
      discountedPrice,
      discountPercent,
      quantity,
      brand,
      color,
      sizes,
      imageUrl,
      category1,
      category2,
      category3,
    } = await request.json();

    const categoryOfNewProduct = await Category.create({
      category1,
      category2,
      category3,
    })

    const newProduct = await Product.create({
      title,
      description,
      price,
      discountedPrice,
      discountPercent,
      quantity,
      brand,
      color,
      sizes,
      imageUrl,
      category: categoryOfNewProduct._id,
    });

    return NextResponse.json({
      message: "Product created successfully",
      product: newProduct.title,
    });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { message: "Error creating product" },
      { status: 500 }
    );
  }
}
