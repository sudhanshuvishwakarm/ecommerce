import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../../../../../models/adminModel.js";
import { connectDB } from "../../../../../dbConfig/dbconnection.js";

connectDB();

export async function POST(request) {
    try {
        const { username, password } = await request.json();

        if (!username || !password) {
            return NextResponse.json(
                { message: "Username and password are required" },
                { status: 400 }
            );
        }

        const admin = await Admin.findOne({ username });
        if (!admin) {
            return NextResponse.json(
                { message: "Admin not found" },
                { status: 404 }
            );
        }

        const isPasswordValid = await bcrypt.compare(password, admin.password);
        if (!isPasswordValid) {
            return NextResponse.json(
                { message: "Invalid password" },
                { status: 400 }
            );
        }

        const tokenData = {
            id: admin._id,
            username: admin.username,
            role: "admin"
        };

        const token = jwt.sign(tokenData, process.env.JWT_SECRET, { expiresIn: '2d' });

        const response = NextResponse.json(
            {
                message: "Admin login successful",
                token,
                admin: tokenData
            },
            { status: 200 }
        );

        response.cookies.set('adminToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 2 * 24 * 60 * 60,
            path: '/',
        });

        return response;

    } catch (error) {
        console.error("Admin login error:", error);
        return NextResponse.json(
            { message: "Error during admin login", error: error.message },
            { status: 500 }
        );
    }
}