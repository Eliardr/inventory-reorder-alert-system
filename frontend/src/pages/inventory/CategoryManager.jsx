// src/pages/inventory/CategoryManager.jsx
const CategoryManager = () => {
  return (
    <div>
      <h2>Categories Management</h2>
      <p>Category CRUD operations will go here</p>
      <div style={{padding: '20px', border: '1px solid #ccc', marginTop: '20px'}}>
        <h3>Add New Category</h3>
        <input type="text" placeholder="Category Name" style={{marginRight: '10px', padding: '5px'}}/>
        <input type="text" placeholder="Description" style={{marginRight: '10px', padding: '5px'}}/>
        <button style={{padding: '5px 10px'}}>Add Category</button>
      </div>
    </div>
  );
};

export default CategoryManager;