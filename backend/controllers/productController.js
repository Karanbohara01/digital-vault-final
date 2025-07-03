

// const Product = require('../models/Product');
// const { logActivity } = require('../services/logService');
// const path = require('path');
// const Order = require('../models/Order');
// const fs = require('fs');
// const sharp = require('sharp');



// // @desc    Get all products
// // @route   GET /api/products
// // @access  Public
// const getProducts = async (req, res) => {
//     try {
//         const products = await Product.find({});
//         res.status(200).json(products);
//     } catch (error) {
//         res.status(500).json({ message: 'Server Error', error: error.message });
//     }
// };

// // @desc    Get a single product by ID
// // @route   GET /api/products/:id
// // @access  Public
// const getProductById = async (req, res) => {
//     try {
//         const product = await Product.findById(req.params.id);
//         if (product) {
//             res.status(200).json(product);
//         } else {
//             res.status(404).json({ message: 'Product not found' });
//         }
//     } catch (error) {
//         res.status(500).json({ message: 'Server Error', error: error.message });
//     }
// };

// // controllers/orderController.js


// const getMyOrders = async (req, res) => {
//     try {
//         const orders = await Order.find({ user: req.user._id })
//             .populate('product') // ✅ This pulls in the full product object
//             .sort({ createdAt: -1 });

//         res.status(200).json(orders);
//     } catch (error) {
//         console.error('Error fetching orders:', error);
//         res.status(500).json({ message: 'Server Error', error: error.message });
//     }
// };




// // @desc    Get logged in creator's products
// // @route   GET /api/products/my-products
// // @access  Private/Creator
// const getMyProducts = async (req, res) => {
//     try {
//         const products = await Product.find({ creator: req.user._id });
//         res.json(products);
//     } catch (error) {
//         res.status(500).json({ message: 'Server Error', error: error.message });
//     }
// };


// const createProduct = async (req, res) => {
//     try {
//         const { name, description, price, category } = req.body;

//         if (!req.file) {
//             return res.status(400).json({ message: 'Image file is required.' });
//         }

//         const originalPath = req.file.path;
//         const publicFileName = `watermarked-${req.file.filename}`;
//         const publicPath = `uploads/${publicFileName}`;

//         // --- NEW, MORE ROBUST METHOD ---
//         // 1. Explicitly read the entire original image file into memory first.
//         const originalImageBuffer = fs.readFileSync(originalPath);

//         // 2. Create the SVG watermark.
//         const watermarkSvg = `<svg width="500" height="100"><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="40" font-family="sans-serif" fill="white" fill-opacity="0.6">Digital Vault</text></svg>`;
//         const watermarkBuffer = Buffer.from(watermarkSvg);

//         // 3. Run the sharp pipeline on the buffer, not the file path.
//         await sharp(originalImageBuffer)
//             .withMetadata() // Strip all metadata
//             .resize(800, 600, { fit: 'inside' })
//             .composite([{
//                 input: watermarkBuffer,
//                 gravity: 'center',
//             }])
//             .toFile(publicPath); // Save the final processed image

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



// const downloadProductFile = async (req, res) => {
//     try {
//         const productId = req.params.id;
//         const userId = req.user._id;

//         // Verify the user has a completed order for this product
//         const order = await Order.findOne({
//             product: productId,
//             user: userId,
//             status: 'completed',
//         });

//         if (!order) {
//             return res.status(403).json({ message: 'Access Denied: You have not purchased this item.' });
//         }

//         // Find the product to get its file paths
//         const product = await Product.findById(productId);
//         if (!product || !product.originalFilePath) { // Check for the original file path
//             return res.status(404).json({ message: 'Original file not found.' });
//         }

//         // --- THIS IS THE KEY CHANGE ---
//         // Construct the absolute path to the ORIGINAL file in the private folder
//         const absoluteFilePath = path.resolve(product.originalFilePath);

//         await logActivity(userId, 'FILE_DOWNLOAD_SUCCESS', 'info', { productId });

//         // Send the original, clean file for download
//         res.download(absoluteFilePath);

//     } catch (error) {
//         await logActivity(req.user?._id, 'FILE_DOWNLOAD_ERROR', 'error', { error: error.message });
//         res.status(500).json({ message: 'Server Error' });
//     }
// };

// // @desc    Update a product
// // @route   PUT /api/products/:id
// // @access  Private/Creator
// const updateProduct = async (req, res) => {
//     try {
//         const { name, description, price, category } = req.body;
//         const product = await Product.findById(req.params.id);

//         if (!product) {
//             return res.status(404).json({ message: 'Product not found' });
//         }

//         // --- SECURITY CHECK ---
//         // Ensure the user trying to update the product is the one who created it.
//         if (product.creator.toString() !== req.user.id) {
//             await logActivity(req.user.id, 'PRODUCT_UPDATE_FAIL', 'fatal', { productId: req.params.id, reason: 'User does not own product.' });
//             return res.status(403).json({ message: 'User not authorized to update this product' });
//         }

//         // Update the fields
//         product.name = name || product.name;
//         product.description = description || product.description;
//         product.price = price || product.price;
//         product.category = category || product.category;

//         const updatedProduct = await product.save();

//         await logActivity(req.user.id, 'PRODUCT_UPDATE_SUCCESS', 'info', { productId: updatedProduct._id });
//         res.json(updatedProduct);

//     } catch (error) {
//         await logActivity(req.user?._id, 'PRODUCT_UPDATE_ERROR', 'error', { productId: req.params.id, error: error.message });
//         res.status(500).json({ message: 'Server Error', error: error.message });
//     }
// };

// // @desc    Delete a product
// // @route   DELETE /api/products/:id
// // @access  Private/Creator
// const deleteProduct = async (req, res) => {
//     try {
//         const product = await Product.findById(req.params.id);

//         if (!product) {
//             return res.status(404).json({ message: 'Product not found' });
//         }

//         // --- SECURITY CHECK ---
//         // Ensure the user trying to delete the product is the one who created it.
//         if (product.creator.toString() !== req.user.id) {
//             await logActivity(req.user.id, 'PRODUCT_DELETE_FAIL', 'fatal', { productId: req.params.id, reason: 'User does not own product.' });
//             return res.status(403).json({ message: 'User not authorized to delete this product' });
//         }

//         // --- DELETE THE IMAGE FILE ---
//         // Use fs.unlink to delete the file from the server's storage
//         fs.unlink(product.filePath, (err) => {
//             if (err) {
//                 // We'll log the error, but not stop the process,
//                 // as we still want to remove the database record.
//                 console.error(`Failed to delete product image: ${product.filePath}`, err);
//                 logActivity(req.user.id, 'PRODUCT_IMAGE_DELETE_FAIL', 'error', { productId: req.params.id, filePath: product.filePath });
//             }
//         });

//         // --- DELETE THE DATABASE RECORD ---
//         await Product.findByIdAndDelete(req.params.id);

//         await logActivity(req.user.id, 'PRODUCT_DELETE_SUCCESS', 'info', { productId: req.params.id });
//         res.json({ message: 'Product removed successfully' });

//     } catch (error) {
//         await logActivity(req.user?._id, 'PRODUCT_DELETE_ERROR', 'error', { productId: req.params.id, error: error.message });
//         res.status(500).json({ message: 'Server Error', error: error.message });
//     }
// };


// module.exports = {
//     getProducts,
//     getProductById,
//     getMyProducts,
//     createProduct,
//     downloadProductFile,
//     updateProduct,
//     deleteProduct,
//     getMyOrders
// };


const Product = require('../models/Product');
const Order = require('../models/Order');
const { logActivity } = require('../services/logService');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        await logActivity(null, 'GET_ALL_PRODUCTS', 'info', { method: req.method, count: products.length });
        res.status(200).json(products);
    } catch (error) {
        await logActivity(null, 'GET_ALL_PRODUCTS_FAIL', 'error', { method: req.method, error: error.message });
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            await logActivity(null, 'GET_PRODUCT_BY_ID', 'info', { method: req.method, productId: req.params.id });
            res.status(200).json(product);
        } else {
            await logActivity(null, 'PRODUCT_NOT_FOUND', 'warn', { method: req.method, productId: req.params.id });
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        await logActivity(null, 'GET_PRODUCT_BY_ID_ERROR', 'error', { method: req.method, productId: req.params.id, error: error.message });
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get products created by logged-in creator
// @route   GET /api/products/my-products
// @access  Private/Creator
const getMyProducts = async (req, res) => {
    try {
        const products = await Product.find({ creator: req.user._id });
        await logActivity(req.user._id, 'GET_MY_PRODUCTS', 'info', { method: req.method, count: products.length });
        res.json(products);
    } catch (error) {
        await logActivity(req.user._id, 'GET_MY_PRODUCTS_FAIL', 'error', { method: req.method, error: error.message });
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Create a new product with watermark
// @route   POST /api/products
// @access  Private/Creator
const createProduct = async (req, res) => {
    try {
        const { name, description, price, category } = req.body;

        if (!req.file) {
            return res.status(400).json({ message: 'Image file is required.' });
        }

        const originalPath = req.file.path;
        const publicFileName = `watermarked-${req.file.filename}`;
        const publicPath = `uploads/${publicFileName}`;

        const originalImageBuffer = fs.readFileSync(originalPath);
        const watermarkSvg = `<svg width="500" height="100"><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="40" font-family="sans-serif" fill="white" fill-opacity="0.6">Digital Vault</text></svg>`;
        const watermarkBuffer = Buffer.from(watermarkSvg);

        await sharp(originalImageBuffer)
            .withMetadata()
            .resize(800, 600, { fit: 'inside' })
            .composite([{ input: watermarkBuffer, gravity: 'center' }])
            .toFile(publicPath);

        const product = new Product({
            name, description, price, category,
            filePath: publicPath.replace(/\\/g, "/"),
            originalFilePath: originalPath.replace(/\\/g, "/"),
            creator: req.user._id,
        });

        const createdProduct = await product.save();
        await logActivity(req.user._id, 'PRODUCT_CREATE_SUCCESS', 'info', { method: req.method, productId: createdProduct._id });

        res.status(201).json(createdProduct);
    } catch (error) {
        await logActivity(req.user?._id, 'PRODUCT_CREATE_FAIL', 'error', { method: req.method, error: error.message });
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Allow users to download their purchased product
// @route   GET /api/products/:id/download
// @access  Private
const downloadProductFile = async (req, res) => {
    try {
        const productId = req.params.id;
        const userId = req.user._id;

        const order = await Order.findOne({ product: productId, user: userId, status: 'completed' });
        if (!order) {
            await logActivity(userId, 'FILE_DOWNLOAD_DENIED', 'warn', { method: req.method, productId });
            return res.status(403).json({ message: 'Access Denied: You have not purchased this item.' });
        }

        const product = await Product.findById(productId);
        if (!product || !product.originalFilePath) {
            await logActivity(userId, 'FILE_NOT_FOUND', 'error', { method: req.method, productId });
            return res.status(404).json({ message: 'Original file not found.' });
        }

        await logActivity(userId, 'FILE_DOWNLOAD_SUCCESS', 'info', { method: req.method, productId });
        res.download(path.resolve(product.originalFilePath));
    } catch (error) {
        await logActivity(req.user?._id, 'FILE_DOWNLOAD_ERROR', 'error', { method: req.method, error: error.message });
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Creator
const updateProduct = async (req, res) => {
    try {
        const { name, description, price, category } = req.body;
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        if (product.creator.toString() !== req.user.id) {
            await logActivity(req.user.id, 'PRODUCT_UPDATE_UNAUTHORIZED', 'fatal', { method: req.method, productId: req.params.id });
            return res.status(403).json({ message: 'User not authorized to update this product' });
        }

        product.name = name || product.name;
        product.description = description || product.description;
        product.price = price || product.price;
        product.category = category || product.category;

        const updatedProduct = await product.save();
        await logActivity(req.user.id, 'PRODUCT_UPDATE_SUCCESS', 'info', { method: req.method, productId: updatedProduct._id });

        res.json(updatedProduct);
    } catch (error) {
        await logActivity(req.user?._id, 'PRODUCT_UPDATE_ERROR', 'error', { method: req.method, productId: req.params.id, error: error.message });
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Creator
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        if (product.creator.toString() !== req.user.id) {
            await logActivity(req.user.id, 'PRODUCT_DELETE_UNAUTHORIZED', 'fatal', { method: req.method, productId: req.params.id });
            return res.status(403).json({ message: 'User not authorized to delete this product' });
        }

        fs.unlink(product.filePath, (err) => {
            if (err) {
                console.error('File delete failed:', err);
                logActivity(req.user.id, 'PRODUCT_IMAGE_DELETE_FAIL', 'error', { method: req.method, productId: req.params.id, filePath: product.filePath });
            }
        });

        await Product.findByIdAndDelete(req.params.id);
        await logActivity(req.user.id, 'PRODUCT_DELETE_SUCCESS', 'info', { method: req.method, productId: req.params.id });

        res.json({ message: 'Product removed successfully' });
    } catch (error) {
        await logActivity(req.user?._id, 'PRODUCT_DELETE_ERROR', 'error', { method: req.method, productId: req.params.id, error: error.message });
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
};
