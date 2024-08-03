const mongoose = require("mongoose");

const collectionSchema = new mongoose.Schema({
    collectionId: {
        type: String,
        required: true,
        unique: true
    },
    adminId: {
        type: String,
        required: true,
    },
    handle: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
    },
    products_count: {
        type: Number,
        required: true
    },
    products: [
        {
            id: {
                type: String,
            }
        }
    ]
},
{ timestamps: true }
);

// Model
const Collections = mongoose.model("Collections", collectionSchema);

module.exports = Collections;
