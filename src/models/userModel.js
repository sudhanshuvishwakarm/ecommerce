import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    email:{
        unique:true,
        type:String,
        required:true
    },
    role:{
        type:String,
        required:true,
        default:"CUSTOMER"
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    verificationCode:{
        type:String,
    },
    // mobile:{
    //     unique:true,
    //     type:Number,
    //     required:true,
    // },
    adress:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:"addresses"
    }],
    paymentInformation:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:"payment_information"
    }],
    ratings:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:"ratings"
    }],
    reviews:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:"reviews"
    }],
    createdAt:{
        type:Date,
        default:Date.now()
    }
})

const User =mongoose.models.users ||  mongoose.model("users",userSchema);
export default User;
