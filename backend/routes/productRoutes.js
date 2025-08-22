// backend/routes/productRoutes.js
const express = require('express');
const { getProducts, addProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/')
  .get(protect, getProducts)        // GET /api/products
  .post(protect, addProduct);       // POST /api/products

router.route('/:id')
  .put(protect, updateProduct)      // PUT /api/products/:id
  .delete(protect, deleteProduct);  // DELETE /api/products/:id

module.exports = router;