import getDataFromToken from "../../../../utils/getDataFromToken.js";
import Order from "../../../../models/orderModel.js";
import Orderitem from "../../../../models/orderItemsModel.js";
import Address from "../../../../models/addressModel.js";
import PaymentInformation from "../../../../models/PaymentModel.js";
import { NextResponse } from "next/server";

export async function GET(request){
    try {
        const userId = await getDataFromToken(request);
        
        if(!userId){
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        console.log("User ID from token:", userId); 
        
        // Fetch orders with all populated fields
        const orders = await Order.find({ user: userId })
            .sort({ createdAt: -1 })
            .populate({
                path: 'orderItems',
                populate: {
                    path: 'product',
                    select: 'title imageUrl images color brand price discountedPrice'
                }
            })
            .populate({
                path: 'shippingAddress',
                select: 'firstName lastName streetAddress city state zipCode country mobile'
            })
            .populate({
                path: 'paymentDetails.paymentMethod',
                select: 'paymentMethod'
            });

        if(!orders || orders.length === 0){
            return NextResponse.json(
                { 
                    orders: [],
                    message: "No orders found" 
                },
                { status: 200 }
            );
        }

        // Transform order data for frontend
        const transformedOrders = orders.map(order => ({
            _id: order._id,
            orderItems: order.orderItems || [],
            orderDate: order.orderDate,
            createdAt: order.createdAt,
            deliveryDate: order.deliveryDate,
            shippingAddress: order.shippingAddress,
            paymentDetails: order.paymentDetails,
            totalPrice: order.totalPrice,
            totalDiscountedPrice: order.totalDiscountedPrice,
            discount: order.discounte,
            orderStatus: order.orderStatus,
            totalItem: order.totalItem,
            totalDiscount: order.discounte
        }));

        return NextResponse.json(
            { orders: transformedOrders },
            { status: 200 }
        );

    } catch (error) {
        console.error("Orders fetch error:", error);
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}