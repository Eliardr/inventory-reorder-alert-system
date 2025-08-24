// frontend/src/components/CategoryList.jsx
import axiosInstance from '../axiosConfig';

export default function CategoryList({
  categories,
  setCategories,
  setEditingCategory,
}) {
  async function handleDelete(cat) {
    const id = cat.id || cat._id;
    if (!id) return alert('Missing category id.');

    const ok = window.confirm(`Delete category "${cat.name}"?`);
    if (!ok) return;

    try {
      await axiosInstance.delete(`/api/categories/${id}`);
      // remove from local state
      setCategories(prev => prev.filter(c => (c.id || c._id) !== id));
    } catch (err) {
      const msg = err?.response?.data?.message || err.message || 'Delete failed';
      alert(msg);
      console.error('Delete category error:', msg);
    }
  }

  if (!categories || categories.length === 0) {
    return <p className="p-4">No categories yet.</p>;
  }

  return (
    <ul className="space-y-3">
      {categories.map(cat => (
        <li
          key={cat.id || cat._id}
          className="border rounded-lg p-4 flex items-start justify-between gap-3"
        >
          <div>
            <div className="font-semibold">{cat.name}</div>
            {cat.description ? (
              <div className="text-gray-600">{cat.description}</div>
            ) : null}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setEditingCategory(cat)}
              className="px-3 py-1 rounded bg-yellow-500 text-white hover:bg-yellow-600"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(cat)}
              className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}

