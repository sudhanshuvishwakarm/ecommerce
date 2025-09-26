import User from "@/models/userModel.js";
import Address from "../../../models/addressModel.js";
import getDataFromToken from "../../../utils/getDataFromToken.js";

export async function POST(request) {
    try {
        const {firstName, lastName, streetAddress, city ,state, zipCode,mobile} = await request.json();
        const userId = await getDataFromToken(request);
        if (!userId) {
            return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
        }
        const newAddress = new Address({
            firstName,
            lastName,
            streetAddress,
            city,
            state,
            zipCode,
            user: userId,
            mobile
        });
        const user = await User.findById(userId);
        if (!user) {
            return new Response(JSON.stringify({ message: "User not found" }), { status: 404 });
        }
        user.addresses.push(newAddress._id);
        await user.save();
        await newAddress.save();
        return new Response(JSON.stringify({ message: "Address added successfully" }), { status: 201
        })
    } catch (error) {
        return new Response(JSON.stringify({ message: "Error adding address", error: error.message }), { status: 500 });
    }
}