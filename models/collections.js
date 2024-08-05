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
        default:0,
    },
    products: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Products'
        }
    ]
},
{ timestamps: true }
);

// Middleware to set products_count before saving
collectionSchema.pre('save', function(next) {
    this.products_count = this.products.length;
    next();
});

// Middleware to set products_count before updating
collectionSchema.pre('findOneAndUpdate', async function(next) {
    const update = this.getUpdate();
    if (update.products) {
        const productCount = update.products.length;
        this.setUpdate({ ...update, products_count: productCount });
    }
    next();
});


// Model
const Collections = mongoose.model("Collections", collectionSchema);

module.exports = Collections;
