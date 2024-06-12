const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    orderId: {
        type: Number,
        required: true,
        unique: true
    },
    customerId: {
        type: Number,
        required: true
    },
    customerName: {
        type: String,
        required: true
    },
    customerAddress: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    pincode: {
        type: String,
        required: true
    },
    mobileNo: {
        type: String,
        required: true
    },
    orderedProducts: [
        {
          productId: {
            type: Number,
            ref: 'Products',
            required: true
          },
          adminId:{
            type: Number,
            ref:'Admin',
            reqired:true
          },
          quantity: {
            type: Number,
            required: true,
            default: 1
          }
        }
      ],
    orderStatus: {
        type: String,
        required: true
    },
    totalItems: {
        type: Number,
        required: true,
    },
    totalAmount: {
        type: Number,
        required: true
    },
    deliveryDate: {
        type: Date,
        required: true
    },
    deliveryStatus: {
        type: String,
        required: true
    }
},
    { timestamps: true }
);

//model
const Orders = mongoose.model("orders", orderSchema);

module.exports = Orders;
