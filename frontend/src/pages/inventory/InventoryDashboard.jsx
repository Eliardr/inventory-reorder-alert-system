// src/pages/inventory/InventoryDashboard.jsx
import { useState } from 'react';
import CategoryManager from './CategoryManager';
import ProductManager from './ProductManager';

const InventoryDashboard = () => {
  const [activeTab, setActiveTab] = useState('categories');

  return (
    <div className="container mt-4">
      <h1>Inventory Alert System</h1>
      
      {/* Tab Navigation */}
      <div className="tabs" style={{ marginBottom: '20px' }}>
        <button 
          onClick={() => setActiveTab('categories')}
          style={{ 
            padding: '10px 20px', 
            marginRight: '10px',
            backgroundColor: activeTab === 'categories' ? '#007bff' : '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '5px'
          }}
        >
          Categories
        </button>
        <button 
          onClick={() => setActiveTab('products')}
          style={{ 
            padding: '10px 20px',
            backgroundColor: activeTab === 'products' ? '#007bff' : '#6c757d', 
            color: 'white',
            border: 'none',
            borderRadius: '5px'
          }}
        >
          Products
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'categories' && <CategoryManager />}
      {activeTab === 'products' && <ProductManager />}
    </div>
  );
};

export default InventoryDashboard;