import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../../../../../models/adminModel.js";
import { connectDB } from "../../../../../dbConfig/dbconnection.js";

connectDB()

export async function POST(request) {
    try {
        const { username, password } = await request.json();
        if (!username || !password) {
            return NextResponse.json(
                { message: "Username and password are required" }, 
                { status: 400 }
            );
        }
        
        const existingAdmin = await Admin.findOne({ username });
        if (existingAdmin) {
            return NextResponse.json(
                { message: "Admin already exists" }, 
                { status: 409 }
            );
        }
        
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);
        const admin = await Admin.create({
            username,
            password:hashPassword
        });
        
        const adminJWT = jwt.sign(
            { 
                id: admin._id, 
                username: admin.username 
            },
            process.env.JWT_SECRET,
            { expiresIn: '2d' }
        );

        const response = NextResponse.json(
            { 
                message: 'Admin created successfully',
                admin: { id: admin._id, username: admin.username }
            }, 
            { status: 201 } 
        );

        response.cookies.set('adminToken', adminJWT, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 2 * 24 * 60 * 60, 
            path: '/',
        });

        return response;

    } catch (error) {
        console.error("Admin creation error:", error);
        return NextResponse.json(
            { message: "Error creating admin", error: error.message }, 
            { status: 500 }
        );
    }
}