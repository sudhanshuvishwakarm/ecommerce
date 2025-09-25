import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  category1: {
    type: String,  
    required: true,
  },
  category2: {
    type: String,   
    required: true,
  },
  category3: {
    type: String,   
    required: true,
  }
}, { timestamps: true });

const Category =
  mongoose.models.categories || mongoose.model("categories", categorySchema);

export default Category;
