// api/product/productDetail/route.js
import { connectDB } from "../../../../dbConfig/dbconnection.js";
import Product from "../../../../models/productModel.js";
import { NextResponse } from "next/server";
import Category from "../../../../models/categoryModel.js";
import Rating from "../../../../models/ratingModel.js";
import Review from "../../../../models/reviewModel.js";
connectDB();

export async function POST(request) {
  try {
    const { productId } = await request.json();
    
    if (!productId) {
      return NextResponse.json({ message: "Product ID is required" }, { status: 400 });
    }

    const product = await Product.findById(productId)
      .populate("category")
      .populate({
        path: "ratings",
        populate: {
          path: "user",
          select: "username email"
        }
      })
      .populate({
        path: "reviews",
        populate: {
          path: "user",
          select: "username email"
        }
      });

    if (!product) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }

    // Calculate average rating from ratings array
    const avgRating = product.ratings && product.ratings.length > 0
      ? (product.ratings.reduce((sum, r) => sum + r.rating, 0) / product.ratings.length).toFixed(1)
      : 0;

    // Calculate rating distribution
    const ratingDistribution = {
      5: product.ratings?.filter(r => r.rating === 5).length || 0,
      4: product.ratings?.filter(r => r.rating === 4).length || 0,
      3: product.ratings?.filter(r => r.rating === 3).length || 0,
      2: product.ratings?.filter(r => r.rating === 2).length || 0,
      1: product.ratings?.filter(r => r.rating === 1).length || 0
    };

    // Return product with calculated rating data
    return NextResponse.json({
      ...product.toObject(),
      averageRating: Number(avgRating),
      totalRatings: product.ratings?.length || 0,
      totalReviews: product.reviews?.length || 0,
      ratingDistribution: ratingDistribution
    });

  } catch (error) {
    console.error("Product detail error:", error);
    return NextResponse.json(
      { message: "Error in product detail route", error: error.message },
      { status: 500 }
    );
  }
}