import mongoose from "mongoose";

const orderitemSchema = new mongoose.Schema({

    product:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"products",
        required:true
    },
    size:{
        type:String,
    },
    quantity:{
        type:Number,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    discountPrice:{
        type:Number,
        required:true
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users",
        required:true
    },

   
})

const Orderitem = mongoose.models.orderItems || mongoose.model("orderItems",orderitemSchema);
export default Orderitem;