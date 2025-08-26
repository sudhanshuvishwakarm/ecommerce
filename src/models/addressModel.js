import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
    streetAdress:{
        type:String,
        required:true
    },
    city:{
        type:String,
        required:true
    },
    state:{
        type:String,
        required:true,
        default:"CUSTOMER"
    },
    zipCode:{
        type:Number,
        required:true,
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"users"
    },
    mobile:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:"payment_information"
    }],
})

const Address = mongoose.models.addresses || mongoose.model("addresses",addressSchema);
export default Address;