// backend/models/Product.js
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  sku: {
    type: String,
    required: true,
    trim: true,
    uppercase: true
    // NOTE: no `unique: true` here
  },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },

  // INVENTORY MANAGEMENT FIELDS
  currentStock: { type: Number, required: true, default: 0, min: 0 },
  minStockLevel: { type: Number, required: true, default: 5, min: 0 },
  maxStockLevel: { type: Number, required: true, default: 100, min: 0 },
  reorderQuantity: { type: Number, required: true, default: 25, min: 1 },

  // PRICING & SUPPLIER INFO
  costPrice: { type: Number, required: true, min: 0 },
  sellingPrice: { type: Number, required: true, min: 0 },
  supplier: { type: String, trim: true },
  supplierContact: { type: String, trim: true },

  // INVENTORY HISTORY TRACKING
  lastRestocked: { type: Date, default: null },
  lastSold: { type: Date, default: null },

  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

// Helpful non-unique indexes
productSchema.index({ category: 1, name: 1 });
productSchema.index({ currentStock: 1 });
productSchema.index({ isActive: 1 });

// Virtuals
productSchema.virtual('isLowStock').get(function() {
  return this.currentStock <= this.minStockLevel;
});
productSchema.virtual('suggestedReorder').get(function() {
  if (this.currentStock <= this.minStockLevel) return this.reorderQuantity;
  return 0;
});

// Methods
productSchema.methods.needsReorder = function() {
  return this.currentStock <= this.minStockLevel;
};
productSchema.methods.getStockValue = function() {
  return this.currentStock * this.costPrice;
};

module.exports = mongoose.model("Product", productSchema);
