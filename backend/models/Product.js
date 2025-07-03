// models/Product.js

const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    // This is a reference to the User model.
    // It links each product to the user who created it.
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User', // This tells Mongoose the ObjectId refers to a document in the 'User' collection
    },
    name: {
        type: String,
        required: [true, 'Please provide a product name'],
        trim: true, // Removes whitespace from both ends
    },
    description: {
        type: String,
        required: [true, 'Please provide a product description'],
    },
    price: {
        type: Number,
        required: [true, 'Please provide a price'],
        default: 0,
    },
    category: {
        type: String,
        required: [true, 'Please provide a category'],
    },
    // In a real app, this would point to a file on a cloud storage service.
    // For now, we'll just store a placeholder path.
    filePath: {
        type: String,
        required: true,
    },


    originalFilePath: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;