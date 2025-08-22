// backend/models/Product.js
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: false,
    trim: true
  },
  sku: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  
  // INVENTORY MANAGEMENT FIELDS
  currentStock: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  minStockLevel: {
    type: Number,
    required: true,
    default: 5,
    min: 0
  },
  maxStockLevel: {
    type: Number,
    required: true,
    default: 100,
    min: 0
  },
  reorderQuantity: {
    type: Number,
    required: true,
    default: 25,
    min: 1
  },
  
  // PRICING & SUPPLIER INFO
  costPrice: {
    type: Number,
    required: true,
    min: 0
  },
  sellingPrice: {
    type: Number,
    required: true,
    min: 0
  },
  supplier: {
    type: String,
    required: false,
    trim: true
  },
  supplierContact: {
    type: String,
    required: false,
    trim: true
  },
  
  // INVENTORY HISTORY TRACKING
  lastRestocked: {
    type: Date,
    default: null
  },
  lastSold: {
    type: Date,
    default: null
  },
  
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Virtual for low stock alert
productSchema.virtual('isLowStock').get(function() {
  return this.currentStock <= this.minStockLevel;
});

// Virtual for reorder suggestion
productSchema.virtual('suggestedReorder').get(function() {
  if (this.currentStock <= this.minStockLevel) {
    return this.reorderQuantity;
  }
  return 0;
});

// Indexes for performance
productSchema.index({ category: 1, name: 1 });
productSchema.index({ currentStock: 1 }); // For low stock alerts
productSchema.index({ isActive: 1 }); // For active products only
productSchema.index({ sku: 1 }, { unique: true }); // Unique SKU

// Method to check if product needs reordering
productSchema.methods.needsReorder = function() {
  return this.currentStock <= this.minStockLevel;
};

// Method to calculate stock value
productSchema.methods.getStockValue = function() {
  return this.currentStock * this.costPrice;
};

module.exports = mongoose.model("Product", productSchema);