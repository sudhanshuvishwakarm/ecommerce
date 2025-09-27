import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({

    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
    },
    orderItems:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"orderItems",
    }],
    orderDate:{
        type:Date,
        required:true,
        default:Date.now() 
    },
    deliveryDate:{
        type:Date,
        required:true,
    },
    shippingAddress:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"addresses",
    }],

    paymentDetails:{
        paymentMethod:{
            type:String,
        },
        transactionId:{
            type:String,
        },
        paymentId:{
            type:String,
        },
        paymentStatus:{
            type:String,
            default:"PENDING"
        },
    },
    totalPrice:{
        type:Number,
        required:true
    },
    totalDiscountedPrice:{
        type:Number,
        required:true
    },  
    discounte:{
        type:Number,
        required:true,
    },
    orderStatus:{
        type:Number,
        required:true,
        default:"PENDING"
    },
    totalItem:{
        type:Number,
        required:true,
    },
    createdAt:{
        type:Date,
        default:Date.now()
    }
})

const Order = mongoose.models.orders || mongoose.model("orders",orderSchema);
export default Order;