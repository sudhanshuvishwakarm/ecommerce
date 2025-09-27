import { NextResponse } from "next/server.js";
import { connectDB } from "../../../dbConfig/dbconnection.js";
import getDataFromToken from "../../../utils/getDataFromToken.js";
import Address from "../../../models/addressModel.js";
import User from "../../../models/userModel.js";

connectDB();

export async function POST(request) {
    try {
        const reqBody = await request.json();
        const userId = await getDataFromToken(request);
        
        if (!userId) {
            return NextResponse.json(
                { error: "Please login first" }, 
                { status: 401 }
            );
        }
        
        const { firstName, lastName, streetAddress, city, state, zipCode, mobile } = reqBody;
        
        const requiredFields = { firstName, lastName, streetAddress, city, state, zipCode, mobile };
        const missingFields = Object.keys(requiredFields).filter(field => !requiredFields[field]);
        
        if (missingFields.length > 0) {
            return NextResponse.json(
                { error: "All fields are required", missingFields }, 
                { status: 400 }
            );
        }
        const mobileRegex = /^[0-9]{10}$/;
        if (!mobileRegex.test(mobile)) {
            return NextResponse.json(
                { error: "Mobile number must be 10 digits" }, 
                { status: 400 }
            );
        }
        const zipCodeRegex = /^[0-9]{5,6}$/;
        if (!zipCodeRegex.test(zipCode)) {
            return NextResponse.json(
                { error: "Zip code must be 5-6 digits" }, 
                { status: 400 }
            );
        }
        const user = await User.findById(userId).populate('address');
        if (!user) {
            return NextResponse.json(
                { error: "User not found" }, 
                { status: 404 }
            );
        }
        let address;
        let message;
        if (user.address) {
            address = await Address.findByIdAndUpdate(
                user.address._id,
                {
                    firstName: firstName.trim(),
                    lastName: lastName.trim(),
                    streetAddress: streetAddress.trim(),  
                    city: city.trim(),
                    state: state.trim(),
                    zipCode: zipCode.trim(),
                    mobile: mobile.trim(),
                    user: userId
                },
                { 
                    new: true, 
                    runValidators: true 
                }
            );
            message = "Address updated successfully";
        } else {
            address = await Address.create({
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                streetAddress: streetAddress.trim(),  
                city: city.trim(),
                state: state.trim(),
                zipCode: zipCode.trim(),
                mobile: mobile.trim(),
                user: userId
            });
            
            user.address = address._id;
            await user.save();
            message = "Address added successfully";
        }

        return NextResponse.json({
            message: message,
            address: address
        }, { status: 200 });

    } catch (error) {
        console.error("Address POST Error:", error);
        return NextResponse.json(
            { error: "Internal server error" }, 
            { status: 500 }
        );
    }
}

export async function GET(request) {
    try {
        const userId = await getDataFromToken(request);
        
        if (!userId) {
            return NextResponse.json(
                { error: "Please login first" }, 
                { status: 401 }
            );
        }

        const user = await User.findById(userId).populate('address');
        
        if (!user) {
            return NextResponse.json(
                { error: "User not found" }, 
                { status: 404 }
            );
        }
        if (!user.address) {
            return NextResponse.json(
                { message: "No address found", address: null }, 
                { status: 200 }
            );
        }
        return NextResponse.json({
            address: user.address
        }, { status: 200 });

    } catch (error) {
        console.error("Address GET Error:", error);
        return NextResponse.json(
            { error: "Internal server error" }, 
            { status: 500 }
        );
    }
}


export async function DELETE(request) {
    try {
        const userId = await getDataFromToken(request);
        
        if (!userId) {
            return NextResponse.json({ error: "Please login first" }, { status: 401 });
        }

        const user = await User.findById(userId);
        if (!user.address) {
            return NextResponse.json({ error: "No address found" }, { status: 404 });
        }

        await Address.findByIdAndDelete(user.address);
        user.address = null;
        await user.save();

        return NextResponse.json({ message: "Address deleted successfully" });

    } catch (error) {
        console.error("Address DELETE Error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

