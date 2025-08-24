// frontend/src/pages/inventory/CategoryManager.jsx
import { useEffect, useState } from 'react';
import axiosInstance from '../../axiosConfig';

import CategoryForm from '../../components/CategoryForm';
import CategoryList from '../../components/CategoryList';

export default function CategoryManager() {
  const [categories, setCategories] = useState([]);
  const [editingCategory, setEditingCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  // Load categories on mount
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await axiosInstance.get('/api/categories'); // token added by interceptor
        if (!alive) return;
        const data = Array.isArray(res.data) ? res.data : [];
        setCategories(data);
      } catch (e) {
        const msg = e?.response?.data?.message || e.message || 'Failed to fetch categories';
        setErr(msg);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  if (loading) return <div className="p-4">Loading categories…</div>;

  return (
    <div className="container mx-auto p-6">
      {err ? (
        <div className="mb-4 p-3 rounded bg-red-50 text-red-700">
          Error: {err}
        </div>
      ) : null}

      <CategoryForm
        categories={categories}
        setCategories={setCategories}
        editingCategory={editingCategory}
        setEditingCategory={setEditingCategory}
      />

      <CategoryList
        categories={categories}
        setCategories={setCategories}
        setEditingCategory={setEditingCategory}
      />
    </div>
  );
}
