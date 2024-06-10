const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
    cartId: {
        type: Number,
        required: true,
        unique: true
    },
    customerId:{
        type: Number,
        required: true,
    },
    addedProducts:[{
        productId:{
            type: Number,
            ref:'Product',
            required: true,
        },
        adminId:{
            type: Number,
            required: true,
        },
        quantity:{
            type: Number, // Change the type to Number for quantity
            required: true
        },
    }]
},
    { timestamps: true }
);

//model
const Cart = mongoose.model("Cart", cartSchema); // Corrected from "cart" to "Cart" for model name

module.exports = Cart;
