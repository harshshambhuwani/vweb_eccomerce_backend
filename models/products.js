const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    productId: {
        type: Number,
        required: true,
        unique: true
    },
    adminId: {
        type: String,
        required: true,
    },
    collectionId: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
    },
    brand: {
        type: String,
        required: true,
    },
    sku: {
        type: String,
        required: true
    },
    stocks: {
        type: Number,
        required: true
    },
    availabilityStatus: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    discountPercentage: { 
        type: Number,
        required: true
    },
    weight: {
        type: String,
        required: true
    },
    length: { // Corrected from lenght to length
        type: Number,
        required: true
    },
    width: {
        type: Number,
        required: true
    },
    height: {
        type: Number,
        required: true
    },
    warranty: {
        type: String,
        required: true
    },
    shippingInformation: {
        type: String,
        required: true
    },
    returnPolicy: {
        type: String,
        required: true
    },
    reviews: [
        {
            rating: {
                type: Number,
            },
            comment: {
                type: String
            },
            date: {
                type: String
            },
            reviewerName: {
                type: String
            },
            reviewerEmail: {
                type: String
            },
        },
    ],
    imageUrls: [{
        type: String,
    }],
    thumbnail: {
        type: String,
    },
},
{ timestamps: true }
);

// Model
const Products = mongoose.model("Products", productSchema);

module.exports = Products;
