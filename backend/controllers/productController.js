

const Product = require('../models/Product');
const { logActivity } = require('../services/logService');
const path = require('path');
const Order = require('../models/Order');
const fs = require('fs');
const sharp = require('sharp');



// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get a single product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            res.status(200).json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// controllers/orderController.js


const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id })
            .populate('product') // ✅ This pulls in the full product object
            .sort({ createdAt: -1 });

        res.status(200).json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};




// @desc    Get logged in creator's products
// @route   GET /api/products/my-products
// @access  Private/Creator
const getMyProducts = async (req, res) => {
    try {
        const products = await Product.find({ creator: req.user._id });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// // @desc    Create a new product with an image upload
// // @route   POST /api/products
// // @access  Private/Creator
// const createProduct = async (req, res) => {
//     try {
//         // Text fields come from req.body
//         const { name, description, price, category } = req.body;

//         // The file path comes from the multer middleware (req.file)
//         const imagePath = req.file ? req.file.path.replace(/\\/g, "/") : '';

//         // Check if a file was actually uploaded
//         if (!imagePath) {
//             return res.status(400).json({ message: 'Image file is required.' });
//         }

//         const product = new Product({
//             name,
//             description,
//             price,
//             category,
//             filePath: imagePath, // Use the path of the uploaded file
//             creator: req.user._id, // User ID from 'protect' middleware
//         });

//         const createdProduct = await product.save();

//         // Log the activity
//         await logActivity(req.user._id, 'PRODUCT_CREATE_SUCCESS', 'info', {
//             productId: createdProduct._id,
//             productName: createdProduct.name
//         });

//         res.status(201).json(createdProduct);

//     } catch (error) {
//         // Log any errors
//         await logActivity(req.user?._id, 'PRODUCT_CREATE_FAIL', 'error', { error: error.message });
//         res.status(500).json({ message: 'Server Error', error: error.message });
//     }
// };

// In backend/controllers/productController.js

// const createProduct = async (req, res) => {
//     try {
//         const { name, description, price, category } = req.body;

//         // 1. Check if a file was uploaded by multer
//         if (!req.file) {
//             return res.status(400).json({ message: 'Image file is required.' });
//         }

//         // 2. Define paths for original and new watermarked file
//         const originalPath = req.file.path;
//         const publicFileName = `watermarked-${req.file.filename}`;
//         const publicPath = `uploads/${publicFileName}`;

//         // 3. Create a dynamic SVG for the watermark
//         const watermarkText = Buffer.from(
//             `<svg width="400" height="150">
//               <text
//                 x="50%" y="50%"
//                 dominant-baseline="middle" text-anchor="middle"
//                 font-size="30" font-family="Arial"
//                 fill="#FFF" fill-opacity="0.5"
//                 transform="rotate(-45 200 75)">
//                 Digital Vault
//               </text>
//             </svg>`
//         );

//         // 4. Use Sharp to process the image
//         await sharp(originalPath)
//             .resize(800, 600, { fit: 'inside' }) // Resize for public viewing
//             .composite([{
//                 input: watermarkText,
//                 tile: true, // Repeat the watermark over the whole image
//                 blend: 'saturate'
//             }])
//             .toFile(publicPath); // Save the new watermarked image to the public 'uploads' folder

//         // 5. Create the product record with both file paths
//         const product = new Product({
//             name,
//             description,
//             price,
//             category,
//             filePath: publicPath.replace(/\\/g, "/"), // The public, watermarked image path
//             originalFilePath: originalPath.replace(/\\/g, "/"), // The private, original image path
//             creator: req.user._id,
//         });

//         const createdProduct = await product.save();
//         await logActivity(req.user._id, 'PRODUCT_CREATE_SUCCESS', 'info', { productId: createdProduct._id });
//         res.status(201).json(createdProduct);

//     } catch (error) {
//         console.error('PRODUCT CREATION ERROR:', error);
//         await logActivity(req.user?._id, 'PRODUCT_CREATE_FAIL', 'error', { error: error.message });
//         res.status(500).json({ message: 'Server Error', error: error.message });
//     }
// };

// backend/controllers/productController.js (Debugging Version)

// In backend/controllers/productController.js

// const createProduct = async (req, res) => {
//     try {
//         const { name, description, price, category } = req.body;

//         if (!req.file) {
//             return res.status(400).json({ message: 'Image file is required.' });
//         }

//         const originalPath = req.file.path;
//         const publicFileName = `watermarked-${req.file.filename}`;
//         const publicPath = `uploads/${publicFileName}`;

//         // --- DYNAMIC SVG TEXT WATERMARK ---
//         // We create a piece of SVG code as a string, then convert it to a Buffer.
//         // This is a cleaner alternative to a separate image file, but may not work on all systems.
//         const watermarkSvg = `
//             <svg width="500" height="100">
//               <text
//                 x="50%" y="50%"
//                 dominant-baseline="middle" text-anchor="middle"
//                 font-size="40" font-family="sans-serif"
//                 fill="white" fill-opacity="0.6"
//                 stroke="black" stroke-width="1" stroke-opacity="0.6">
//                 Digital Vault
//               </text>
//             </svg>
//         `;
//         const watermarkBuffer = Buffer.from(watermarkSvg);


//         await sharp(originalPath)
//             .withMetadata()
//             .resize(800, 600, { fit: 'inside' })

//             // This is the NEW code
//             .composite([{
//                 input: watermarkBuffer,
//                 gravity: 'center', // This places the watermark once in the center
//             }])
//             .toFile(publicPath); // Save the new watermarked image

//         const product = new Product({
//             name, description, price, category,
//             filePath: publicPath.replace(/\\/g, "/"),
//             originalFilePath: originalPath.replace(/\\/g, "/"),
//             creator: req.user._id,
//         });

//         const createdProduct = await product.save();
//         await logActivity(req.user._id, 'PRODUCT_CREATE_SUCCESS', 'info', { productId: createdProduct._id });
//         res.status(201).json(createdProduct);

//     } catch (error) {
//         console.error('PRODUCT CREATION ERROR:', error);
//         await logActivity(req.user?._id, 'PRODUCT_CREATE_FAIL', 'error', { error: error.message });
//         res.status(500).json({ message: 'Server Error', error: error.message });
//     }
// };

// In backend/controllers/productController.js

const createProduct = async (req, res) => {
    try {
        const { name, description, price, category } = req.body;

        if (!req.file) {
            return res.status(400).json({ message: 'Image file is required.' });
        }

        const originalPath = req.file.path;
        const publicFileName = `watermarked-${req.file.filename}`;
        const publicPath = `uploads/${publicFileName}`;

        // --- NEW, MORE ROBUST METHOD ---
        // 1. Explicitly read the entire original image file into memory first.
        const originalImageBuffer = fs.readFileSync(originalPath);

        // 2. Create the SVG watermark.
        const watermarkSvg = `<svg width="500" height="100"><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="40" font-family="sans-serif" fill="white" fill-opacity="0.6">Digital Vault</text></svg>`;
        const watermarkBuffer = Buffer.from(watermarkSvg);

        // 3. Run the sharp pipeline on the buffer, not the file path.
        await sharp(originalImageBuffer)
            .withMetadata() // Strip all metadata
            .resize(800, 600, { fit: 'inside' })
            .composite([{
                input: watermarkBuffer,
                gravity: 'center',
            }])
            .toFile(publicPath); // Save the final processed image

        const product = new Product({
            name, description, price, category,
            filePath: publicPath.replace(/\\/g, "/"),
            originalFilePath: originalPath.replace(/\\/g, "/"),
            creator: req.user._id,
        });

        const createdProduct = await product.save();
        await logActivity(req.user._id, 'PRODUCT_CREATE_SUCCESS', 'info', { productId: createdProduct._id });
        res.status(201).json(createdProduct);

    } catch (error) {
        console.error('PRODUCT CREATION ERROR:', error);
        await logActivity(req.user?._id, 'PRODUCT_CREATE_FAIL', 'error', { error: error.message });
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// // @desc    Download a purchased product's file
// // @route   GET /api/products/:id/download
// // @access  Private/Customer
// const downloadProductFile = async (req, res) => {
//     try {
//         // The ID of the product the user wants to download
//         const productId = req.params.id;

//         // The ID of the logged-in user from our 'protect' middleware
//         const userId = req.user._id;

//         // 1. Verify that the user has a completed order for this product
//         const order = await Order.findOne({
//             product: productId,
//             user: userId,
//             status: 'completed', // Only allow downloads for completed orders
//         });

//         // 2. If no completed order is found, deny access.
//         if (!order) {
//             await logActivity(userId, 'FILE_DOWNLOAD_FAIL', 'warn', { productId, reason: 'No completed purchase found.' });
//             return res.status(403).json({ message: 'Access Denied: You have not purchased this item.' });
//         }

//         // 3. If the purchase is verified, get the product details to find the file path.
//         const product = await Product.findById(productId);
//         if (!product || !product.filePath) {
//             return res.status(404).json({ message: 'File not found.' });
//         }

//         // 4. Securely send the file for download.
//         // We construct the absolute path to the file.
//         // '__dirname' gives us the current directory, we go up one level ('..') to the backend root, then into the filePath.
//         const filePath = path.join(__dirname, '..', product.filePath);

//         await logActivity(userId, 'FILE_DOWNLOAD_SUCCESS', 'info', { productId });

//         // The res.download() method in Express is specifically for prompting a download in the browser.
//         res.download(filePath);

//     } catch (error) {
//         await logActivity(req.user?._id, 'FILE_DOWNLOAD_ERROR', 'error', { error: error.message });
//         res.status(500).json({ message: 'Server Error' });
//     }
// };

// In backend/controllers/productController.js

const downloadProductFile = async (req, res) => {
    try {
        const productId = req.params.id;
        const userId = req.user._id;

        // Verify the user has a completed order for this product
        const order = await Order.findOne({
            product: productId,
            user: userId,
            status: 'completed',
        });

        if (!order) {
            return res.status(403).json({ message: 'Access Denied: You have not purchased this item.' });
        }

        // Find the product to get its file paths
        const product = await Product.findById(productId);
        if (!product || !product.originalFilePath) { // Check for the original file path
            return res.status(404).json({ message: 'Original file not found.' });
        }

        // --- THIS IS THE KEY CHANGE ---
        // Construct the absolute path to the ORIGINAL file in the private folder
        const absoluteFilePath = path.resolve(product.originalFilePath);

        await logActivity(userId, 'FILE_DOWNLOAD_SUCCESS', 'info', { productId });

        // Send the original, clean file for download
        res.download(absoluteFilePath);

    } catch (error) {
        await logActivity(req.user?._id, 'FILE_DOWNLOAD_ERROR', 'error', { error: error.message });
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Creator
const updateProduct = async (req, res) => {
    try {
        const { name, description, price, category } = req.body;
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // --- SECURITY CHECK ---
        // Ensure the user trying to update the product is the one who created it.
        if (product.creator.toString() !== req.user.id) {
            await logActivity(req.user.id, 'PRODUCT_UPDATE_FAIL', 'fatal', { productId: req.params.id, reason: 'User does not own product.' });
            return res.status(403).json({ message: 'User not authorized to update this product' });
        }

        // Update the fields
        product.name = name || product.name;
        product.description = description || product.description;
        product.price = price || product.price;
        product.category = category || product.category;

        const updatedProduct = await product.save();

        await logActivity(req.user.id, 'PRODUCT_UPDATE_SUCCESS', 'info', { productId: updatedProduct._id });
        res.json(updatedProduct);

    } catch (error) {
        await logActivity(req.user?._id, 'PRODUCT_UPDATE_ERROR', 'error', { productId: req.params.id, error: error.message });
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Creator
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // --- SECURITY CHECK ---
        // Ensure the user trying to delete the product is the one who created it.
        if (product.creator.toString() !== req.user.id) {
            await logActivity(req.user.id, 'PRODUCT_DELETE_FAIL', 'fatal', { productId: req.params.id, reason: 'User does not own product.' });
            return res.status(403).json({ message: 'User not authorized to delete this product' });
        }

        // --- DELETE THE IMAGE FILE ---
        // Use fs.unlink to delete the file from the server's storage
        fs.unlink(product.filePath, (err) => {
            if (err) {
                // We'll log the error, but not stop the process,
                // as we still want to remove the database record.
                console.error(`Failed to delete product image: ${product.filePath}`, err);
                logActivity(req.user.id, 'PRODUCT_IMAGE_DELETE_FAIL', 'error', { productId: req.params.id, filePath: product.filePath });
            }
        });

        // --- DELETE THE DATABASE RECORD ---
        await Product.findByIdAndDelete(req.params.id);

        await logActivity(req.user.id, 'PRODUCT_DELETE_SUCCESS', 'info', { productId: req.params.id });
        res.json({ message: 'Product removed successfully' });

    } catch (error) {
        await logActivity(req.user?._id, 'PRODUCT_DELETE_ERROR', 'error', { productId: req.params.id, error: error.message });
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};


module.exports = {
    getProducts,
    getProductById,
    getMyProducts,
    createProduct,
    downloadProductFile,
    updateProduct,
    deleteProduct,
    getMyOrders
};