import { useState, useEffect } from 'react';
import api from '../../api';
import { imgUrl, getProductImages } from '../../lib/img';

const EMPTY = { name: '', description: '', price: '', category: 'Shirts', sizes: 'S,M,L,XL', gender: 'Unisex', inStock: true, stock: 0, images: null };

export default function ShopkeeperProducts() {
  const [products, setProducts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [msg, setMsg] = useState('');
  const token = localStorage.getItem('wearout_seller_token');

  const load = () => api.sellerGetProducts(token).then((r) => setProducts(r.products || r)).catch(() => {});
  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditing(null); setForm(EMPTY); };
  const openEdit = (p) => {
    setEditing(p._id);
    setForm({ name: p.name, description: p.description, price: p.price, category: p.category, sizes: p.sizes.join(','), gender: p.gender || 'Unisex', inStock: p.inStock, stock: p.stock || 0, images: null });
  };

  const submit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append('name', form.name);
    fd.append('description', form.description);
    fd.append('price', form.price);
    fd.append('category', form.category);
    fd.append('sizes', form.sizes);
    fd.append('gender', form.gender);
    fd.append('inStock', form.inStock);
    fd.append('stock', form.stock);
    if (form.images) {
      for (let i = 0; i < form.images.length; i++) {
        fd.append('images', form.images[i]);
      }
    }

    try {
      if (editing) await api.sellerUpdateProduct(token, editing, fd);
      else await api.sellerCreateProduct(token, fd);
      setMsg(editing ? 'Updated successfully' : 'Added successfully');
      setEditing(null);
      setForm(EMPTY);
      await load();
    } catch (err) {
      setMsg('Error: ' + (err?.response?.data?.message || 'save failed'));
    }
  };

  const remove = async (id) => {
    if (!confirm('Delete this product?')) return;
    await api.sellerDeleteProduct(token, id);
    await load();
  };

  const requestFeatured = async (id) => {
    try {
      await api.sellerRequestFeatured(token, id);
      setMsg('Featured request sent to admin');
      await load();
    } catch (err) {
      setMsg('Error: ' + (err?.response?.data?.message || 'request failed'));
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold text-ink">My Products</h1>
        <button className="btn-gold" onClick={openAdd}>+ Add Product</button>
      </div>
      {msg && <p className="text-sm text-gold-dark mb-3">{msg}</p>}

      {form && (
        <form onSubmit={submit} className="admin-surface p-5 mb-6 grid md:grid-cols-2 gap-3">
          <input className="input-field" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <input className="input-field" type="number" placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
          <select className="input-field" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
            {['Shirts', 'Trousers', 'Caps', 'Watches', 'Accessories', 'Shoes', 'Un Stitch'].map((c) => (<option key={c}>{c}</option>))}
          </select>
          <select className="input-field" value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}>
            {['Unisex', 'Male', 'Female'].map((g) => (<option key={g}>{g}</option>))}
          </select>
          <input className="input-field" placeholder="Sizes (comma separated)" value={form.sizes} onChange={(e) => setForm({ ...form, sizes: e.target.value })} />
          <textarea className="input-field md:col-span-2" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <div className="md:col-span-2">
            <label className="block text-sm text-slate-600 mb-1">Product Images (select multiple)</label>
            <input type="file" accept="image/*" multiple className="w-full text-sm border border-slate-200 rounded-md p-2" onChange={(e) => setForm({ ...form, images: e.target.files })} />
            {form.images && <p className="text-xs text-slate-400 mt-1">{form.images.length} file(s) selected</p>}
          </div>
          <label className="text-sm text-slate-600">
            <span className="mb-1 block">Stock count (0 = out of stock)</span>
            <input type="number" min="0" className="input-field w-full" value={form.stock} onChange={(e) => { const v = Number(e.target.value); setForm({ ...form, stock: v, inStock: v > 0 }); }} />
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-600">
            <input type="checkbox" checked={form.inStock} onChange={(e) => setForm({ ...form, inStock: e.target.checked })} /> In Stock
          </label>
          <div className="md:col-span-2 flex gap-3">
            <button type="submit" className="btn-gold">Save</button>
            <button type="button" className="btn-outline" onClick={() => { setEditing(null); setForm(EMPTY); }}>Cancel</button>
          </div>
        </form>
      )}

      <div className="admin-surface overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[600px]">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="text-left p-3">Images</th>
                <th className="text-left p-3">Name</th>
                <th className="text-left p-3">Category</th>
                <th className="text-left p-3">Price</th>
                <th className="text-left p-3">Stock</th>
                <th className="text-left p-3">Status</th>
                <th className="text-left p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id} className="border-t border-slate-100">
                  <td className="p-3">
                    {p.image ? (
                      <div className="flex items-center gap-1">
                        <img src={imgUrl(p.image)} alt={p.name} className="h-12 w-10 object-cover rounded" />
                        {p.images && p.images.length > 1 && (
                          <span className="text-[10px] text-slate-400">+{p.images.length - 1}</span>
                        )}
                      </div>
                    ) : <span className="text-slate-300">—</span>}
                  </td>
                  <td className="p-3 text-ink font-medium">{p.name}</td>
                  <td className="p-3 text-slate-500">{p.category}</td>
                  <td className="p-3 text-ink">Rs {p.price.toLocaleString()}</td>
                  <td className="p-3">
                    {p.inStock ? (
                      <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded">In Stock</span>
                    ) : (
                      <span className="text-xs text-red-500 bg-red-50 px-2 py-0.5 rounded">Out</span>
                    )}
                  </td>
                  <td className="p-3">
                    {p.featured && <span className="text-xs bg-gold/10 text-gold-dark px-2 py-1 rounded-full">Featured</span>}
                    {!p.featured && p.featuredPending && <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">Pending</span>}
                    {!p.featured && !p.featuredPending && <span className="text-xs text-slate-400">—</span>}
                  </td>
                  <td className="p-3 space-x-2">
                    <button className="text-gold-dark hover:underline" onClick={() => openEdit(p)}>Edit</button>
                    {!p.featured && !p.featuredPending && (
                      <button className="text-blue-500 hover:underline" onClick={() => requestFeatured(p._id)}>★ Featured</button>
                    )}
                    <button className="text-red-500 hover:underline" onClick={() => remove(p._id)}>Remove</button>
                  </td>
                </tr>
              ))}
              {products.length === 0 && <tr><td colSpan="7" className="p-4 text-center text-slate-400">No products yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
