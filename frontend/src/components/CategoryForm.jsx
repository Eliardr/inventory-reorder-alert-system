import { useEffect, useState } from 'react';
import axiosInstance from '../axiosConfig';

export default function CategoryForm({
  categories,
  setCategories,
  editingCategory,
  setEditingCategory,
}) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const isEditing = !!editingCategory;

  // preload when editing
  useEffect(() => {
    if (editingCategory) {
      setName(editingCategory.name || '');
      setDescription(editingCategory.description || '');
    } else {
      setName('');
      setDescription('');
    }
  }, [editingCategory]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) {
      alert('Category name is required');
      return;
    }

    try {
      const payload = {
        name: name.trim(),
        description: description.trim(),
      };

      if (isEditing) {
        // UPDATE
        const id = editingCategory.id || editingCategory._id;
        const { data: updated } = await axiosInstance.put(`/api/categories/${id}`, payload);

        setCategories(prev =>
          prev.map(c => (c.id === id || c._id === id ? updated : c))
        );
        setEditingCategory(null);
      } else {
        // CREATE
        const { data: created } = await axiosInstance.post('/api/categories', payload);
        setCategories(prev => [created, ...prev]);
      }

      setName('');
      setDescription('');
    } catch (err) {
      const msg = err?.response?.data?.message || err.message || 'Save failed';
      alert(msg);
      console.error('Category save error:', msg);
    }
  }

  function handleCancel() {
    setEditingCategory(null);
    setName('');
    setDescription('');
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-4">
      <h2 className="text-xl font-semibold mb-3">
        {isEditing ? 'Edit Category' : 'Add Category'}
      </h2>

      <div className="flex flex-col sm:flex-row gap-3">
        <input
          className="border rounded p-2 flex-1"
          placeholder="Category name"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <input
          className="border rounded p-2 flex-[2]"
          placeholder="Description (optional)"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
      </div>

      <div className="mt-3 flex gap-2">
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {isEditing ? 'Update' : 'Add'}
        </button>
        {isEditing && (
          <button
            type="button"
            onClick={handleCancel}
            className="bg-gray-200 px-4 py-2 rounded"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

