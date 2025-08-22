// backend/controllers/categoryController.js
const Category = require('../models/Category');

// GET /api/categories → Get all categories
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().populate('createdBy', 'username email');
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/categories → Create a new category
const addCategory = async (req, res) => {
  const { name, description } = req.body;
  
  try {
    const category = await Category.create({
      name,
      description,
      createdBy: req.user.id // From authentication middleware
    });
    
    res.status(201).json(category);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Category name already exists' });
    }
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/categories/:id → Update a category
const updateCategory = async (req, res) => {
  const { name, description } = req.body;
  
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });

    category.name = name || category.name;
    category.description = description || category.description;

    const updatedCategory = await category.save();
    res.json(updatedCategory);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Category name already exists' });
    }
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/categories/:id → Delete a category
const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });

    await category.deleteOne();
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getCategories, addCategory, updateCategory, deleteCategory };