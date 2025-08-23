// src/pages/inventory/ProductManager.jsx
const ProductManager = () => {
  return (
    <div>
      <h2>Products Management</h2>
      <p>Product CRUD operations will go here</p>
      <div style={{padding: '20px', border: '1px solid #ccc', marginTop: '20px'}}>
        <h3>Add New Product</h3>
        <input type="text" placeholder="Product Name" style={{marginRight: '10px', padding: '5px'}}/>
        <input type="text" placeholder="SKU" style={{marginRight: '10px', padding: '5px'}}/>
        <button style={{padding: '5px 10px'}}>Add Product</button>
      </div>
    </div>
  );
};

export default ProductManager;