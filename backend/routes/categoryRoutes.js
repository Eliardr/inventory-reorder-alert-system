// backend/routes/categoryRoutes.js
const express = require('express');
const { getCategories, addCategory, updateCategory, deleteCategory } = require('../controllers/categoryController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/')
  .get(protect, getCategories)        // GET /api/categories
  .post(protect, addCategory);        // POST /api/categories

router.route('/:id')
  .put(protect, updateCategory)       // PUT /api/categories/:id
  .delete(protect, deleteCategory);   // DELETE /api/categories/:id

module.exports = router;