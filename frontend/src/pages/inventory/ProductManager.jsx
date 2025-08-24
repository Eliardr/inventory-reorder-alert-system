// frontend/src/pages/inventory/ProductManager.jsx
import { useEffect, useState } from 'react';
import axiosInstance from '../../axiosConfig';
import ProductForm from '../../components/ProductForm';
import ProductList from '../../components/ProductList';

export default function ProductManager() {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  // Load products on mount
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await axiosInstance.get('/api/products'); // token added by interceptor
        if (!alive) return;
        setProducts(Array.isArray(res.data) ? res.data : []);
      } catch (e) {
        const msg = e?.response?.data?.message || e.message || 'Failed to load products';
        setErr(msg);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  // Delete handler (used after we add Actions column in ProductList)
  async function handleDelete(p) {
    const id = p?.id || p?._id;
    if (!id) return alert('Missing product id.');
    const ok = window.confirm(`Delete product "${p.name}"?`);
    if (!ok) return;
    try {
      await axiosInstance.delete(`/api/products/${id}`);
      setProducts(prev => prev.filter(x => (x.id || x._id) !== id));
    } catch (e) {
      const msg = e?.response?.data?.message || e.message || 'Delete failed';
      alert(msg);
      console.error('Delete product error:', msg);
    }
  }

  if (loading) return <div className="p-4">Loading products…</div>;

  return (
    <div className="container mx-auto p-6">
      {err ? (
        <div className="mb-4 p-3 rounded bg-red-50 text-red-700">
          Error: {err}
        </div>
      ) : null}

      {/* Create / Update */}
      <ProductForm
        products={products}
        setProducts={setProducts}
        editingProduct={editingProduct}
        setEditingProduct={setEditingProduct}
      />

      {/* Read (table). Next step we’ll add an Actions column and wire Edit/Delete */}
      <ProductList
        products={products}
        setEditingProduct={setEditingProduct} // ignored for now if your list doesn’t use it yet
        onDelete={handleDelete}              // ignored for now
      />
    </div>
  );
}
