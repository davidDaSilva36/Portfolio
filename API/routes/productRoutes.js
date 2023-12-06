const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/productController');
const auth = require('../middleware/authMiddleware');
const admin = require('../middleware/adminMiddleware');

// Define product routes
router.get('/getallproducts', auth, ProductController.getAllProducts);
router.post('/createproduct', auth, admin, ProductController.createProduct);
router.get('/getproductbyid/:id', auth, ProductController.getProductById);
router.put('/updateproduct/:id', auth, admin, ProductController.updateProduct);
router.delete('/deleteproduct/:id', auth, admin, ProductController.deleteProduct);
// Add more routes as needed

module.exports = router;
