const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
    customerId: {
        type: Number,
        required: true,
        unique: true,
    },
    profilePic: {
        type: String,
        required: true
    },
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    userType:{
        type: String,
        required: true,
    },
    password:{
        type: String,
        required: true,
    },
    token:{
        type:String,
    }
},
    { timestamps: true }
);

//model
const Customer = mongoose.model("customer", customerSchema);

module.exports = Customer;
