import { connectDB } from "../../../../dbConfig/dbconnection.js";
import User from "../../../../models/userModel.js";
import Address from "../../../../models/addressModel.js";
import { NextResponse, NextRequest } from "next/server";
import getDataFromToken from "../../../../utils/getDataFromToken.js";

connectDB();

export async function POST(request) {
    try {
        const userId = await getDataFromToken(request);
        
        if (!userId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const user = await User.findOne({ _id: userId })
            .select("-password -verifyToken -verifyTokenExpiry -verificationCode -verificationCodeCreatedAt")
            .populate({
                path: 'address',
                select: 'firstName lastName streetAddress city state zipCode country mobile'
            })
            // .populate({
            //     path: 'ratings',
            //     select: 'rating review createdAt'
            // })
            // .populate({
            //     path: 'reviews',
            //     select: 'title comment rating createdAt'
            // });

        if (!user) {
            return NextResponse.json(
                { error: "User not found." },
                { status: 404 }
            );
        }

        // Format user data for frontend
        const userData = {
            _id: user._id,
            username: user.username,
            email: user.email,
            firstName: user.username?.split(' ')[0] || user.username,
            lastName: user.username?.split(' ')[1] || '',
            role: user.role,
            isVerified: user.isVerified,
            address: user.address,
            ratings: user.ratings || [],
            reviews: user.reviews || [],
            paymentInformation: user.paymentInformation || [],
            createdAt: user.createdAt
        };

        if (user.address) {
            userData.mobile = user.address.mobile;
            userData.city = user.address.city;
            userData.state = user.address.state;
        }

        return NextResponse.json(
            {
                message: "User found",
                user: userData
            },
            { status: 200 }
        );

    } catch (error) {
        console.error("Error in /me endpoint:", error);
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 500 }
        );
    }
}// import { connectDB } from "../../../../dbConfig/dbconnection.js";
// import User from "../../../../models/userModel.js";
// import { NextResponse, NextRequest } from "next/server";
// import getDataFromToken from "../../../../utils/getDataFromToken.js";

// connectDB();

// export async function POST(request){
    
//     const userId = await getDataFromToken(request)
//     const user = await User.findOne({ _id: userId }).select("-password -verifyToken -verifyTokenExpiry");
//     if (!user) {
//         return NextResponse.json({ error: "User not found." }, { status: 404 });
//     }
//     return NextResponse.json({message: "User found , me", user }, { status: 200 });
// }