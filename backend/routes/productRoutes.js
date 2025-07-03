

const express = require('express');
const router = express.Router();
const { createProduct, getProducts, getProductById, getMyProducts, downloadProductFile, updateProduct, deleteProduct } = require('../controllers/productController');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware'); // 1. Import the upload middleware

// ... (your get routes remain unchanged)
router.get('/', getProducts);
router.get('/my-products', protect, authorize('creator'), getMyProducts);
router.get('/:id', getProductById);


// 2. Add the upload.single('image') middleware to this route
router.post('/', protect, authorize('creator'), upload.single('image'), createProduct);
router.get('/:id/download', protect, authorize('customer'), downloadProductFile);
router.put('/:id', protect, authorize('creator'), updateProduct);
router.delete('/:id', protect, authorize('creator'), deleteProduct);






module.exports = router;