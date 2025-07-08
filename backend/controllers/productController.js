

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
