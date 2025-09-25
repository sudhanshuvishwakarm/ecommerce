import { connectDB } from "../../../../dbConfig/dbconnection.js";
import Product from "../../../../models/productModel.js";
import { NextResponse } from "next/server";
connectDB();
export async function GET(request) {
    try {
        const products = await Product.find();
        return NextResponse.json(products,{status:200})
    } catch (error) {
        return NextResponse.json({error:error.message},{status:500})
    }
}