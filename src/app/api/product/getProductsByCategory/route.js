import { NextResponse } from "next/server";
import Product from "../../../../models/productModel.js";
import Category from "../../../../models/categoryModel.js";
import { connectDB } from "../../../../dbConfig/dbconnection.js";

connectDB();
export async function POST(request) {
  try {
    const reqBody = await request.json();
    const { category1, category2, category3 } = reqBody;
  

    if (category3) {
      const categories = await Category.find({ category1, category2, category3 });
      if (!categories || categories.length === 0) {
        return NextResponse.json(
          { message: "Product Not Available!" },
          { status: 404 }
        );
      }
      const categoryIds = categories.map((cat) => cat._id);
      const products = await Product.find({ category: { $in: categoryIds } });
      return NextResponse.json(products);
    }
    if (category2) {
      const categories = await Category.find({ category1, category2 });
      if (!categories || categories.length === 0) {
        return NextResponse.json(
          { message: "Product Not Available!" },
          { status: 404 }
        );
      }
      const categoryIds = categories.map((cat) => cat._id);
      const products = await Product.find({ category: { $in: categoryIds } });
      return NextResponse.json(products);
    }

    if (category1) {
      const categories = await Category.find({ category1 });
       if (!categories || categories.length === 0) {
        return NextResponse.json(
          { message: "Product Not Available!" },
          { status: 404 }
        );
      }
      const categoryIds = categories.map((cat) => cat._id);
      const products = await Product.find({ category: { $in: categoryIds } });
      return NextResponse.json(products);
    }
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
