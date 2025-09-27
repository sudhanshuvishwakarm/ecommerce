import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, "First name is required"],
        trim: true,
        maxLength: [50, "First name cannot exceed 50 characters"]
    },
    lastName: {
        type: String,
        required: [true, "Last name is required"],
        trim: true,
        maxLength: [50, "Last name cannot exceed 50 characters"]
    },
    streetAddress: {
        type: String,
        required: [true, "Street address is required"],
        trim: true,
        maxLength: [200, "Street address cannot exceed 200 characters"]
    },
    city: {
        type: String,
        required: [true, "City is required"],
        trim: true,
        maxLength: [50, "City name cannot exceed 50 characters"]
    },
    state: {
        type: String,
        required: [true, "State is required"],
        trim: true,
        maxLength: [50, "State name cannot exceed 50 characters"]
    },
    zipCode: {
        type: String,
        required: [true, "Zip code is required"],
        trim: true,
        validate: {
            validator: function(v) {
                return /^[0-9]{5,6}$/.test(v);
            },
            message: "Zip code must be 5-6 digits"
        }
    },
    mobile: {
        type: String,
        required: [true, "Mobile number is required"],
        trim: true,
        validate: {
            validator: function(v) {
                return /^[0-9]{10}$/.test(v);
            },
            message: "Mobile number must be 10 digits"
        }
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    }
}, {
    timestamps: true 
});

const Address = mongoose.models.addresses || mongoose.model("addresses", addressSchema);

export default Address;