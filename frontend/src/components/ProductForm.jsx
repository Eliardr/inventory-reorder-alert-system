// frontend/src/components/ProductForm.jsx
import { useEffect, useMemo, useState } from 'react';
import axiosInstance from '../axiosConfig';

const initialState = {
  name: '',
  sku: '',
  category: '',
  description: '',
  currentStock: 0,
  minStockLevel: 5,
  maxStockLevel: 100,
  reorderQuantity: 25,
  costPrice: 0,
  sellingPrice: 0,
  supplier: '',
  supplierContact: '',
  lastRestocked: '',
  lastSold: '',
  isActive: true,
};

export default function ProductForm({
  products,
  setProducts,
  editingProduct,
  setEditingProduct,
}) {
  const [form, setForm] = useState(initialState);
  const [categories, setCategories] = useState([]);
  const [loadingCats, setLoadingCats] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  const isEditing = !!editingProduct;
  const productId = useMemo(
    () => (editingProduct ? editingProduct.id || editingProduct._id : null),
    [editingProduct]
  );

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await axiosInstance.get('/api/categories');
        if (!alive) return;
        setCategories(Array.isArray(res.data) ? res.data : []);
      } catch (e) {
        setErr(e?.response?.data?.message || e.message || 'Failed to load categories');
      } finally {
        if (alive) setLoadingCats(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  useEffect(() => {
    if (!editingProduct) {
      setForm(initialState);
      return;
    }
    const p = editingProduct;
    setForm({
      name: p.name || '',
      sku: p.sku || '',
      category:
        (typeof p.category === 'object' && p.category?._id) ? p.category._id :
        (typeof p.category === 'string' ? p.category : ''),
      description: p.description || '',
      currentStock: p.currentStock ?? 0,
      minStockLevel: p.minStockLevel ?? 5,
      maxStockLevel: p.maxStockLevel ?? 100,
      reorderQuantity: p.reorderQuantity ?? 25,
      costPrice: p.costPrice ?? 0,
      sellingPrice: p.sellingPrice ?? 0,
      supplier: p.supplier || '',
      supplierContact: p.supplierContact || '',
      lastRestocked: p.lastRestocked ? p.lastRestocked.substring(0,10) : '',
      lastSold: p.lastSold ? p.lastSold.substring(0,10) : '',
      isActive: p.isActive ?? true,
    });
  }, [editingProduct]);

  function onChange(e) {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }

  function toNumber(v, fallback = 0) {
    const n = Number(v);
    return Number.isFinite(n) ? n : fallback;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErr('');

    if (!form.name.trim()) return setErr('Name is required');
    if (!form.sku.trim()) return setErr('SKU is required');
    if (!form.category) return setErr('Category is required');

    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        sku: form.sku.trim().toUpperCase(),
        category: form.category,
        description: form.description.trim(),
        currentStock: toNumber(form.currentStock, 0),
        minStockLevel: toNumber(form.minStockLevel, 0),
        maxStockLevel: toNumber(form.maxStockLevel, 0),
        reorderQuantity: toNumber(form.reorderQuantity, 0),
        costPrice: toNumber(form.costPrice, 0),
        sellingPrice: toNumber(form.sellingPrice, 0),
        supplier: form.supplier.trim(),
        supplierContact: form.supplierContact.trim(),
        lastRestocked: form.lastRestocked || null,
        lastSold: form.lastSold || null,
        isActive: !!form.isActive,
      };

      if (isEditing && productId) {
        const { data: updated } = await axiosInstance.put(`/api/products/${productId}`, payload);
        setProducts(prev =>
          prev.map(p => ((p.id || p._id) === (updated.id || updated._id) ? updated : p))
        );
        setEditingProduct(null);
        setForm(initialState);
      } else {
        const { data: created } = await axiosInstance.post('/api/products', payload);
        setProducts(prev => [created, ...prev]);
        setForm(initialState);
      }
    } catch (e) {
      const msg =
        e?.response?.data?.message ||
        (e?.response?.status === 400 ? 'Validation error' : '') ||
        e.message ||
        'Save failed';
      setErr(msg);
    } finally {
      setSaving(false);
    }
  }

  function handleCancel() {
    setEditingProduct?.(null);
    setForm(initialState);
    setErr('');
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-4">
      <h2 className="text-xl font-semibold mb-3">
        {isEditing ? 'Edit Product' : 'Add Product'}
      </h2>

      {err ? (
        <div className="mb-3 p-2 rounded bg-red-50 text-red-700">Error: {err}</div>
      ) : null}

      {/* Row 1 */}
      <div className="grid md:grid-cols-3 gap-3">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">Name *</label>
          <input
            id="name"
            className="border rounded p-2 w-full"
            name="name"
            value={form.name}
            onChange={onChange}
            required
          />
        </div>

        <div>
          <label htmlFor="sku" className="block text-sm font-medium mb-1">SKU *</label>
          <input
            id="sku"
            className="border rounded p-2 w-full"
            name="sku"
            value={form.sku}
            onChange={onChange}
            required
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium mb-1">Category *</label>
          <select
            id="category"
            className="border rounded p-2 w-full"
            name="category"
            value={form.category}
            onChange={onChange}
            disabled={loadingCats}
            required
          >
            <option value="">{loadingCats ? 'Loading…' : 'Select a category'}</option>
            {categories.map(c => (
              <option key={c.id || c._id} value={c.id || c._id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Row 2 */}
      <div className="grid md:grid-cols-3 gap-3 mt-3">
        <div>
          <label htmlFor="currentStock" className="block text-sm font-medium mb-1">Current stock</label>
          <input
            id="currentStock"
            className="border rounded p-2 w-full"
            name="currentStock"
            value={form.currentStock}
            onChange={onChange}
            type="number"
            min="0"
          />
        </div>

        <div>
          <label htmlFor="minStockLevel" className="block text-sm font-medium mb-1">Min stock level</label>
          <input
            id="minStockLevel"
            className="border rounded p-2 w-full"
            name="minStockLevel"
            value={form.minStockLevel}
            onChange={onChange}
            type="number"
            min="0"
          />
        </div>

        <div>
          <label htmlFor="maxStockLevel" className="block text-sm font-medium mb-1">Max stock level</label>
          <input
            id="maxStockLevel"
            className="border rounded p-2 w-full"
            name="maxStockLevel"
            value={form.maxStockLevel}
            onChange={onChange}
            type="number"
            min="0"
          />
        </div>
      </div>

      {/* Row 3 */}
      <div className="grid md:grid-cols-3 gap-3 mt-3">
        <div>
          <label htmlFor="reorderQuantity" className="block text-sm font-medium mb-1">Reorder quantity</label>
          <input
            id="reorderQuantity"
            className="border rounded p-2 w-full"
            name="reorderQuantity"
            value={form.reorderQuantity}
            onChange={onChange}
            type="number"
            min="0"
          />
        </div>

        <div>
          <label htmlFor="costPrice" className="block text-sm font-medium mb-1">Cost price</label>
          <input
            id="costPrice"
            className="border rounded p-2 w-full"
            name="costPrice"
            value={form.costPrice}
            onChange={onChange}
            type="number"
            min="0"
            step="0.01"
          />
        </div>

        <div>
          <label htmlFor="sellingPrice" className="block text-sm font-medium mb-1">Selling price</label>
          <input
            id="sellingPrice"
            className="border rounded p-2 w-full"
            name="sellingPrice"
            value={form.sellingPrice}
            onChange={onChange}
            type="number"
            min="0"
            step="0.01"
          />
        </div>
      </div>

      {/* Row 4 */}
      <div className="grid md:grid-cols-2 gap-3 mt-3">
        <div>
          <label htmlFor="supplier" className="block text-sm font-medium mb-1">Supplier</label>
          <input
            id="supplier"
            className="border rounded p-2 w-full"
            name="supplier"
            value={form.supplier}
            onChange={onChange}
          />
        </div>

        <div>
          <label htmlFor="supplierContact" className="block text-sm font-medium mb-1">Supplier contact</label>
          <input
            id="supplierContact"
            className="border rounded p-2 w-full"
            name="supplierContact"
            value={form.supplierContact}
            onChange={onChange}
          />
        </div>
      </div>

      {/* Row 5 */}
      <div className="grid md:grid-cols-3 gap-3 mt-3">
        <div>
          <label htmlFor="lastRestocked" className="block text-sm font-medium mb-1">Last restocked</label>
          <input
            id="lastRestocked"
            className="border rounded p-2 w-full"
            name="lastRestocked"
            value={form.lastRestocked}
            onChange={onChange}
            type="date"
          />
        </div>

        <div>
          <label htmlFor="lastSold" className="block text-sm font-medium mb-1">Last sold</label>
          <input
            id="lastSold"
            className="border rounded p-2 w-full"
            name="lastSold"
            value={form.lastSold}
            onChange={onChange}
            type="date"
          />
        </div>

        <div className="flex items-end">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isActive"
              checked={form.isActive}
              onChange={onChange}
            />
            <span>Active</span>
          </label>
        </div>
      </div>

      <div className="mt-3">
        <label htmlFor="description" className="block text-sm font-medium mb-1">Description</label>
        <textarea
          id="description"
          className="border rounded p-2 w-full"
          name="description"
          value={form.description}
          onChange={onChange}
          rows={3}
        />
      </div>

      <div className="mt-3 flex gap-2">
        <button
          type="submit"
          disabled={saving}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-60"
        >
          {saving ? (isEditing ? 'Updating…' : 'Adding…') : (isEditing ? 'Update' : 'Add Product')}
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
