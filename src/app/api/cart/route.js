import Cart from "../../../models/cartModel.js";
import CartItem from "../../../models/cartItemModel.js";
import getDataFromToken from "../../../utils/getDataFromToken.js";
import { NextResponse } from "next/server";
import { connectDB } from "../../../dbConfig/dbconnection.js";
connectDB();
export async function POST(request) {
    try {
        const { id, size, quantity, price, discountedPrice } = await request.json();
        const userId = await getDataFromToken(request);
        
        if (!userId) {
            return NextResponse.json({ message: "User not authenticated" }, { status: 401 });
        }
        let cart = await Cart.findOne({ user: userId }).populate('cartItems');

        if (!cart) {
            cart = await Cart.create({
                user: userId,
                cartItems: [],
                totalPrice: 0,
                totalItem: 0,
                totalDiscountPrice: 0,
                discounte: 0
            });
        }

        const existingCartItem = await CartItem.findOne({
            userId: userId,
            product: id,
            size: size,
            cart: cart._id
        });

        if (existingCartItem) {
            existingCartItem.quantity += quantity;
            await existingCartItem.save();
        } else {
            const cartItem = await CartItem.create({
                userId: userId,
                product: id,
                size: size,
                quantity: quantity,
                price: price,
                discountedPrice: discountedPrice,
                cart: cart._id 
            });

            cart.cartItems.push(cartItem._id);
            await cart.save();
        }

        await recalculateCartTotals(cart._id);

        return NextResponse.json({ message: "Product added to cart successfully" });

    } catch (error) {
        return NextResponse.json({ 
            message: "Error adding product to cart", 
            error: error.message 
        }, { status: 500 });
    }
}



export async function GET(request) {
    try {
        const userId = await getDataFromToken(request);
        
        if (!userId) {
            return NextResponse.json({ message: "User not authenticated" }, { status: 401 });
        }

        const cart = await Cart.findOne({ user: userId })
            .populate({
                path: 'cartItems',
                populate: {
                    path: 'product',
                    model: 'products'
                }
            });

        if (!cart) {
            return NextResponse.json({ 
                cart: null, 
                message: "Cart not found" 
            });
        }

        return NextResponse.json({ cart });

    } catch (error) {
        return NextResponse.json({ 
            message: "Error fetching cart", 
            error: error.message 
        }, { status: 500 });
    }
}


export async function PUT(request) {
    try {
        const { cartItemId, quantity } = await request.json();
        const userId = await getDataFromToken(request);
        
        if (!userId) {
            return NextResponse.json({ message: "User not authenticated" }, { status: 401 });
        }
        const cartItem = await CartItem.findOne({ 
            _id: cartItemId, 
            userId: userId 
        });

        if (!cartItem) {
            return NextResponse.json({ 
                message: "Cart item not found" 
            }, { status: 404 });
        }
        cartItem.quantity = quantity;
        await cartItem.save();
        await recalculateCartTotals(cartItem.cart);

        return NextResponse.json({ message: "Cart updated successfully" });

    } catch (error) {
        return NextResponse.json({ 
            message: "Error updating cart", 
            error: error.message 
        }, { status: 500 });
    }
}



export async function DELETE(request) {
    try {
        const { searchParams } = new URL(request.url);
        const cartItemId = searchParams.get('cartItemId');
        const userId = await getDataFromToken(request);
        
        if (!userId) {
            return NextResponse.json({ message: "User not authenticated" }, { status: 401 });
        }
        const cartItem = await CartItem.findOne({ 
            _id: cartItemId, 
            userId: userId 
        });

        if (!cartItem) {
            return NextResponse.json({ 
                message: "Cart item not found" 
            }, { status: 404 });
        }
        const cartId = cartItem.cart;
        await CartItem.findByIdAndDelete(cartItemId);
        await Cart.findByIdAndUpdate(cartId, {
            $pull: { cartItems: cartItemId }
        });
        await recalculateCartTotals(cartId);
        return NextResponse.json({ message: "Item removed from cart" });

    } catch (error) {
        return NextResponse.json({ 
            message: "Error removing item from cart", 
            error: error.message 
        }, { status: 500 });
    }
}



async function recalculateCartTotals(cartId) {
    try {
        const cartItems = await CartItem.find({ cart: cartId });
        
        let totalPrice = 0;
        let totalDiscountPrice = 0;
        let totalItem = 0;
        let discounte = 0;

        cartItems.forEach(item => {
            totalPrice += item.price * item.quantity;
            totalDiscountPrice += item.discountedPrice * item.quantity;
            totalItem += item.quantity;
            discounte += (item.price - item.discountedPrice) * item.quantity;
        });

        await Cart.findByIdAndUpdate(cartId, {
            totalPrice,
            totalDiscountPrice,
            totalItem,
            discounte
        });

    } catch (error) {
        throw new Error(`Error recalculating cart totals: ${error.message}`);
    }
}