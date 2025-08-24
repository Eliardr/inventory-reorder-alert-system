// src/pages/inventory/InventoryDashboard.jsx
import { useState } from 'react';
import CategoryManager from './CategoryManager';
import ProductManager from './ProductManager';

export default function InventoryDashboard() {
  const [activeTab, setActiveTab] = useState('categories');

  const baseTab =
    'px-5 py-2 rounded-full text-sm font-medium transition border';
  const active =
    'bg-blue-600 text-white border-blue-600 shadow';
  const inactive =
    'bg-white text-gray-700 border-gray-300 hover:bg-gray-50';

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* Centered page title */}
      <h1 className="text-3xl font-semibold text-center mb-2">
        Inventory Alert System
      </h1>
      <p className="text-center text-gray-500 mb-6">
        Manage your categories and products
      </p>

      {/* Centered tabs */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex gap-3">
          <button
            type="button"
            className={`${baseTab} ${activeTab === 'categories' ? active : inactive}`}
            onClick={() => setActiveTab('categories')}
          >
            Categories
          </button>
          <button
            type="button"
            className={`${baseTab} ${activeTab === 'products' ? active : inactive}`}
            onClick={() => setActiveTab('products')}
          >
            Products
          </button>
        </div>
      </div>

      {/* Tab content */}
      {activeTab === 'categories' ? <CategoryManager /> : <ProductManager />}
    </div>
  );
}
