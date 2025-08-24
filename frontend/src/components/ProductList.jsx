// frontend/src/components/ProductList.jsx
export default function ProductList({ products = [], setEditingProduct, onDelete }) {
  if (!Array.isArray(products) || products.length === 0) {
    return <div className="text-gray-600">No products yet.</div>;
  }

  const getId = (p) => p?.id || p?._id;
  const catName = (p) =>
    typeof p?.category === 'object' && p.category
      ? (p.category.name || p.category.title || '')
      : (p?.category || '');

  return (
    <div className="bg-white rounded shadow overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="text-left px-4 py-2">Name</th>
            <th className="text-left px-4 py-2">SKU</th>
            <th className="text-left px-4 py-2">Category</th>
            <th className="text-right px-4 py-2">Stock</th>
            <th className="text-right px-4 py-2">Min</th>
            <th className="text-right px-4 py-2">Max</th>
            <th className="text-right px-4 py-2">Reorder</th>
            <th className="text-right px-4 py-2">Cost</th>
            <th className="text-right px-4 py-2">Price</th>
            <th className="text-center px-4 py-2">Active</th>
            <th className="text-right px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => {
            const id = getId(p);
            return (
              <tr key={id} className="border-t">
                <td className="px-4 py-2">{p.name}</td>
                <td className="px-4 py-2">{p.sku}</td>
                <td className="px-4 py-2">{catName(p)}</td>
                <td className="px-4 py-2 text-right">{p.currentStock ?? 0}</td>
                <td className="px-4 py-2 text-right">{p.minStockLevel ?? 0}</td>
                <td className="px-4 py-2 text-right">{p.maxStockLevel ?? 0}</td>
                <td className="px-4 py-2 text-right">{p.reorderQuantity ?? 0}</td>
                <td className="px-4 py-2 text-right">
                  {p.costPrice !== undefined ? Number(p.costPrice).toFixed(2) : '0.00'}
                </td>
                <td className="px-4 py-2 text-right">
                  {p.sellingPrice !== undefined ? Number(p.sellingPrice).toFixed(2) : '0.00'}
                </td>
                <td className="px-4 py-2 text-center">
                  {p.isActive ? '✅' : '❌'}
                </td>
                <td className="px-4 py-2 text-right space-x-2">
                  <button
                    className="px-2 py-1 rounded bg-yellow-100 hover:bg-yellow-200"
                    onClick={() => setEditingProduct?.(p)}
                  >
                    Edit
                  </button>
                  <button
                    className="px-2 py-1 rounded bg-red-100 hover:bg-red-200"
                    onClick={() => onDelete?.(p)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
