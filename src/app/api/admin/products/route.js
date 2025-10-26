import Product from "../../../../models/productModel.js";
import { NextResponse } from "next/server";
import { connectDB } from "../../../../dbConfig/dbconnection.js";
import Category from "../../../../models/categoryModel.js";
import Rating from "../../../../models/ratingModel.js";
import Review from "../../../../models/reviewModel.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

connectDB();
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

    const missingFields = [];
    if (!title?.trim()) missingFields.push("title");
    if (!description?.trim()) missingFields.push("description");
    if (!price) missingFields.push("price");
    if (!discountedPrice) missingFields.push("discountedPrice");
    if (!discountPercent) missingFields.push("discountPercent");
    if (!quantity) missingFields.push("quantity");
    if (!brand?.trim()) missingFields.push("brand");
    if (!color?.trim()) missingFields.push("color");
    if (!imageUrl?.trim()) missingFields.push("imageUrl");
    if (!category1) missingFields.push("category1");
    if (!category2) missingFields.push("category2");
    if (!category3) missingFields.push("category3");
    if (!sizes || sizes.length === 0) missingFields.push("sizes");

    if (missingFields.length > 0) {
      console.log("Missing fields:", missingFields);
      return NextResponse.json(
        { message: `Missing required fields: ${missingFields.join(", ")}` },
        { status: 400 }
      );
    }

    const categoryOfNewProduct = await Category.create({
      category1: category1.toLowerCase(),
      category2: category2.toLowerCase(),
      category3: category3.toLowerCase(),
    });

    console.log("Category created:", categoryOfNewProduct._id);

    const newProduct = await Product.create({
      title,
      description,
      price: Number(price),
      discountedPrice: Number(discountedPrice),
      discountPercent: Number(discountPercent),
      quantity: Number(quantity),
      brand,
      color: color.toLowerCase(),
      sizes,
      imageUrl,
      category: categoryOfNewProduct._id,
    });

    console.log("Product created successfully:", newProduct._id);

    return NextResponse.json(
      {
        message: "Product created successfully",
        product: newProduct,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      {
        message: "Error creating product",
        error: error.message,
      },
      { status: 500 }
    );
  }
}


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

    const allProducts = await Product.find().populate("category");
    
    console.log("Products fetched successfully:", allProducts.length);

    return NextResponse.json(
      {
        message: "Products fetched successfully",
        product: allProducts,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      {
        message: "Error fetching products",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// DELETE - Delete Product
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

    // Get product ID from query
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("id");

    if (!productId) {
      return NextResponse.json(
        { message: "Product ID is required" },
        { status: 400 }
      );
    }

    // Validate MongoDB ID
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return NextResponse.json(
        { message: "Invalid product ID" },
        { status: 400 }
      );
    }

    // Find product to get associated data
    const product = await Product.findById(productId);

    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    // Delete associated category
    if (product.category) {
      await Category.findByIdAndDelete(product.category);
      console.log("Category deleted:", product.category);
    }

    // Delete associated ratings
    if (product.ratings && product.ratings.length > 0) {
      await Rating.deleteMany({ _id: { $in: product.ratings } });
      console.log("Ratings deleted:", product.ratings.length);
    }

    // Delete associated reviews
    if (product.reviews && product.reviews.length > 0) {
      await Review.deleteMany({ _id: { $in: product.reviews } });
      console.log("Reviews deleted:", product.reviews.length);
    }

    // Delete product
    await Product.findByIdAndDelete(productId);

    console.log("Product and all associated data deleted successfully:", productId);

    return NextResponse.json(
      {
        message: "Product and all associated data deleted successfully",
        productId: productId,
        deletedData: {
          categoryDeleted: !!product.category,
          ratingsDeleted: product.ratings ? product.ratings.length : 0,
          reviewsDeleted: product.reviews ? product.reviews.length : 0,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      {
        message: "Error deleting product",
        error: error.message,
      },
      { status: 500 }
    );
  }
}