// api/ratingreview/route.js
import { connectDB } from "../../../dbConfig/dbconnection.js";
import getDataFromToken from "../../../utils/getDataFromToken.js";
import { NextResponse } from "next/server";
import Rating from "../../../models/ratingModel.js";
import Review from "../../../models/reviewModel.js";
import Order from "../../../models/orderModel.js";
import Product from "../../../models/productModel.js";
import User from "../../../models/userModel.js";
import mongoose from "mongoose";

connectDB();

export async function POST(request) {
    try {
        const { rating, review, productId, orderItemId } = await request.json();
        
        if (!productId) {
            return NextResponse.json({ 
                message: "Product ID is required" 
            }, { status: 400 });
        }

        const userId = await getDataFromToken(request);
        
        if (!userId) {
            return NextResponse.json({ 
                message: "User not authenticated" 
            }, { status: 401 });
        }

        const userObjectId = new mongoose.Types.ObjectId(userId);
        const productObjectId = new mongoose.Types.ObjectId(productId);

        if (orderItemId) {
            const orderItemObjectId = new mongoose.Types.ObjectId(orderItemId);
            
            const deliveredOrder = await Order.findOne({
                user: userObjectId,
                orderItems: orderItemObjectId,
                orderStatus: { $regex: "delivered", $options: "i" }
            });

            if (!deliveredOrder) {
                return NextResponse.json({ 
                    message: "Cannot rate or review - item has not been delivered yet" 
                }, { status: 400 });
            }
        }

        if (rating && (rating < 1 || rating > 5)) {
            return NextResponse.json({ 
                message: "Rating must be between 1 and 5" 
            }, { status: 400 });
        }

        let ratingResult = null;
        let reviewResult = null;

        // Create or Update Rating
        if (rating) {
            ratingResult = await Rating.findOneAndUpdate(
                {
                    user: userObjectId,
                    product: productObjectId
                },
                {
                    user: userObjectId,
                    product: productObjectId,
                    rating: Number(rating),
                    createdAt: new Date()
                },
                { upsert: true, new: true }
            );

            // Add rating ID to User model if not already there
            await User.findByIdAndUpdate(
                userObjectId,
                { $addToSet: { ratings: ratingResult._id } },
                { new: true }
            );

            // Add rating ID to Product model if not already there
            await Product.findByIdAndUpdate(
                productObjectId,
                { $addToSet: { ratings: ratingResult._id } },
                { new: true }
            );
        }

        // Create or Update Review
        if (review && review.trim().length > 0) {
            reviewResult = await Review.findOneAndUpdate(
                {
                    user: userObjectId,
                    product: productObjectId
                },
                {
                    user: userObjectId,
                    product: productObjectId,
                    review: review.trim(),
                    createdAt: new Date()
                },
                { upsert: true, new: true }
            );

            await User.findByIdAndUpdate(
                userObjectId,
                { $addToSet: { reviews: reviewResult._id } },
                { new: true }
            );

            // Add review ID to Product model if not already there
            await Product.findByIdAndUpdate(
                productObjectId,
                { $addToSet: { reviews: reviewResult._id } },
                { new: true }
            );
        }

        if (!ratingResult && !reviewResult) {
            return NextResponse.json({ 
                message: "Please provide either a rating or review" 
            }, { status: 400 });
        }

        return NextResponse.json({
            message: "Rating and review submitted successfully",
            data: {
                rating: ratingResult,
                review: reviewResult
            }
        }, { status: 201 });

    } catch (error) {
        console.error("Rating/Review error:", error);
        return NextResponse.json({ 
            message: error.message || "Internal server error" 
        }, { status: 500 });
    }
}

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const productId = searchParams.get('productId');

        if (!productId) {
            return NextResponse.json({ 
                message: "Product ID is required" 
            }, { status: 400 });
        }

        const productObjectId = new mongoose.Types.ObjectId(productId);

        const [ratings, reviews] = await Promise.all([
            Rating.find({ product: productObjectId })
                .populate('user', 'firstName lastName email')
                .sort({ createdAt: -1 }),
            Review.find({ product: productObjectId })
                .populate('user', 'firstName lastName email')
                .sort({ createdAt: -1 })
        ]);

        const avgRating = ratings.length > 0 
            ? (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(1)
            : 0;

        const ratingDistribution = {
            5: ratings.filter(r => r.rating === 5).length,
            4: ratings.filter(r => r.rating === 4).length,
            3: ratings.filter(r => r.rating === 3).length,
            2: ratings.filter(r => r.rating === 2).length,
            1: ratings.filter(r => r.rating === 1).length
        };

        return NextResponse.json({
            ratings: ratings,
            reviews: reviews,
            averageRating: Number(avgRating),
            totalRatings: ratings.length,
            totalReviews: reviews.length,
            ratingDistribution: ratingDistribution
        }, { status: 200 });

    } catch (error) {
        console.error("Fetch ratings/reviews error:", error);
        return NextResponse.json({ 
            message: error.message || "Internal server error" 
        }, { status: 500 });
    }
}