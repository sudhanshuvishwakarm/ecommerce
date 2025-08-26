import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        maxlength:50
    },
    parentCategory:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"categories",
    },
    level:{
        type:Number,
        required:true,
    },
    
})

const Category = mongoose.models.categories || mongoose.model("categories",categorySchema);
export default Category;


// men
// cloths
// shirts