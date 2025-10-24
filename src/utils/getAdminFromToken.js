import jwt from "jsonwebtoken";

const getAdminFromToken = async (request) => {
    try {
        const token = request.cookies.get('adminToken')?.value;
        if (!token) {
            throw new Error("No admin token provided");
        }
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
        return decodedToken.id; 
    } catch (error) {
        console.error("Error retrieving admin token:", error);
        return null;
    }
}

export default getAdminFromToken;