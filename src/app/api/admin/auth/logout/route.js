import { NextResponse } from "next/server";
import { connectDB } from "../../../../../dbConfig/dbconnection.js";
connectDB()
export async function GET(request) {
    try {
        const response = NextResponse.json(
            { message: "Admin logout successful" },
            { status: 200 }
        );

        response.cookies.set('adminToken', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 0,
            path: '/',
        });

        return response;

    } catch (error) {
        console.error("Admin logout error:", error);
        return NextResponse.json(
            { message: "Error during admin logout", error: error.message },
            { status: 500 }
        );
    }
}