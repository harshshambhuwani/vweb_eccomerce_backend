const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
    adminId: {
        type: Number,
        required: true,
        unique: true,
    },
    profilePic: {
        type: String,
        required: null,
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
    companyName:{
        type: String,
        required: true, 
    },
    password:{
        type: String,
        required: true,
    },
    userType:{
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
const Admin = mongoose.model("admin", adminSchema);

module.exports = Admin;
