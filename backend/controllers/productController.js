// backend/controllers/productController.js
const Product = require('../models/Product');

// GET /api/products → Get active products for logged-in user
const getProducts = async (req, res) => {
  try {
    const products = await Product.find({
      createdBy: req.user.id,
      isActive: true           // ← hide soft-deleted ones
    })
      .populate('category', 'name description')
      .populate('createdBy', 'username email');

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/products → Create a new product
const addProduct = async (req, res) => {
  const { name, description, sku, category, currentStock, minStockLevel, 
          maxStockLevel, reorderQuantity, costPrice, sellingPrice, 
          supplier, supplierContact } = req.body;
  
  try {
    const product = await Product.create({
      name,
      description,
      sku: sku.toUpperCase(), // Ensure uppercase SKU
      category,
      currentStock: currentStock || 0,
      minStockLevel: minStockLevel || 5,
      maxStockLevel: maxStockLevel || 100,
      reorderQuantity: reorderQuantity || 25,
      costPrice,
      sellingPrice,
      supplier,
      supplierContact,
      createdBy: req.user.id
    });
    
    res.status(201).json(product);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'SKU already exists' });
    }
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/products/:id → Update a product
const updateProduct = async (req, res) => {
  const { name, description, currentStock, minStockLevel, maxStockLevel, 
          reorderQuantity, costPrice, sellingPrice, supplier, supplierContact } = req.body;
  
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    // Update fields
    product.name = name || product.name;
    product.description = description || product.description;
    product.currentStock = currentStock !== undefined ? currentStock : product.currentStock;
    product.minStockLevel = minStockLevel !== undefined ? minStockLevel : product.minStockLevel;
    product.maxStockLevel = maxStockLevel !== undefined ? maxStockLevel : product.maxStockLevel;
    product.reorderQuantity = reorderQuantity !== undefined ? reorderQuantity : product.reorderQuantity;
    product.costPrice = costPrice !== undefined ? costPrice : product.costPrice;
    product.sellingPrice = sellingPrice !== undefined ? sellingPrice : product.sellingPrice;
    product.supplier = supplier || product.supplier;
    product.supplierContact = supplierContact || product.supplierContact;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/products/:id → Delete a product (soft delete)
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    // Soft delete instead of removing
    product.isActive = false;
    await product.save();
    
    res.json({ message: 'Product deactivated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getProducts, addProduct, updateProduct, deleteProduct };