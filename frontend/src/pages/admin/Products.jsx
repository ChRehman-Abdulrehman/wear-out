import { useEffect, useState } from 'react';
import api from '../../api';
import { imgUrl } from '../../lib/img';
import { pricing } from '../../lib/pricing';

const EMPTY = { name: '', description: '', price: '', salePrice: '', saleStart: '', saleEnd: '', category: 'Shirts', sizes: 'S,M,L,XL', inStock: true, stock: 0, featured: false, rating: 0, gender: 'Unisex', images: null };

const toInputDT = (d) => {
  if (!d) return '';
  const dt = new Date(d);
  const p = (n) => String(n).padStart(2, '0');
  return `${dt.getFullYear()}-${p(dt.getMonth() + 1)}-${p(dt.getDate())}T${p(dt.getHours())}:${p(dt.getMinutes())}`;
};

function StarInput({ value, onChange }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          type="button"
          key={n}
          onClick={() => onChange(n === value ? 0 : n)}
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(0)}
          className={`text-2xl leading-none ${n <= (hover || value) ? 'text-gold' : 'text-slate-300'}`}
          aria-label={`${n} star`}
        >
          ★
        </button>
      ))}
      <span className="text-sm text-slate-500 ml-2">{value ? `${value} / 5` : 'Not rated'}</span>
    </div>
  );
}

export default function Products() {
  const [products, setProducts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [msg, setMsg] = useState('');

  const load = () => api.getProducts().then((r) => setProducts(r.products || r));
  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditing(null); setForm(EMPTY); };
  const openEdit = (p) => {
    setEditing(p._id);
    setForm({
      name: p.name, description: p.description, price: p.price, salePrice: p.salePrice || '', saleStart: toInputDT(p.saleStart), saleEnd: toInputDT(p.saleEnd), category: p.category,
      sizes: p.sizes.join(','), inStock: p.inStock, stock: p.stock || 0, featured: p.featured, rating: p.rating || 0, gender: p.gender || 'Unisex', images: null,
    });
  };

  const submit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append('name', form.name);
    fd.append('description', form.description);
    fd.append('price', form.price);
    fd.append('salePrice', form.salePrice === '' ? 0 : Number(form.salePrice));
    fd.append('saleStart', form.saleStart || '');
    fd.append('saleEnd', form.saleEnd || '');
    fd.append('category', form.category);
    fd.append('sizes', form.sizes);
    fd.append('inStock', form.inStock);
    fd.append('stock', form.stock);
    fd.append('featured', form.featured);
    fd.append('rating', form.rating);
    fd.append('gender', form.gender);
    if (form.images) {
      for (let i = 0; i < form.images.length; i++) {
        fd.append('images', form.images[i]);
      }
    }

    try {
      if (editing) await api.updateProduct(editing, fd);
      else await api.createProduct(fd);
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
    await api.deleteProduct(id);
    await load();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold text-ink">Products</h1>
        <button className="btn-gold" onClick={openAdd}>+ Add Product</button>
      </div>
      {msg && <p className="text-sm text-gold-dark mb-3">{msg}</p>}

      {(editing !== undefined && form) && (
        <form onSubmit={submit} className="admin-surface p-5 mb-6 grid md:grid-cols-2 gap-3">
          <input className="input-field" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <input className="input-field" type="number" placeholder="Price (original)" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
          <div>
            <label className="block text-sm text-slate-600 mb-1">Sale Price <span className="text-slate-400">(0 = no sale)</span></label>
            <div className="flex items-center gap-2">
              <input className="input-field" type="number" min="0" placeholder="Sale price" value={form.salePrice} onChange={(e) => setForm({ ...form, salePrice: e.target.value })} />
              {(() => {
                const orig = Number(form.price);
                const sale = Number(form.salePrice);
                if (orig > 0 && sale > 0 && sale < orig) {
                  const pct = Math.round((1 - sale / orig) * 100);
                  return <span className="shrink-0 text-xs font-bold uppercase tracking-wider text-white bg-red-600 border border-red-700 px-2 py-1.5 rounded">−{pct}% OFF</span>;
                }
                return <span className="shrink-0 text-xs text-slate-400">No discount</span>;
              })()}
            </div>
          </div>
          <div>
            <label className="block text-sm text-slate-600 mb-1">Sale Start <span className="text-slate-400">(optional)</span></label>
            <input className="input-field" type="datetime-local" value={form.saleStart} onChange={(e) => setForm({ ...form, saleStart: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm text-slate-600 mb-1">Sale End <span className="text-slate-400">(optional)</span></label>
            <input className="input-field" type="datetime-local" value={form.saleEnd} onChange={(e) => setForm({ ...form, saleEnd: e.target.value })} />
          </div>
          <select className="input-field" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
            <option>Shirts</option>
            <option>Trousers</option>
            <optgroup label="Accessories">
              <option>Accessories</option>
              <option>Watches</option>
              <option>Caps</option>
            </optgroup>
            <option>Shoes</option>
            <option>Un Stitch</option>
          </select>
          <select className="input-field" value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}>
            {['Unisex', 'Male', 'Female'].map((g) => (
              <option key={g}>{g}</option>
            ))}
          </select>
          <div className="md:col-span-2">
            <label className="block text-sm text-slate-600 mb-1">Star Rating</label>
            <StarInput value={form.rating} onChange={(r) => setForm({ ...form, rating: r })} />
          </div>
          <input className="input-field" placeholder="Sizes (comma separated)" value={form.sizes} onChange={(e) => setForm({ ...form, sizes: e.target.value })} />
          <textarea className="input-field md:col-span-2" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <div className="md:col-span-2">
            <label className="block text-sm text-slate-600 mb-1">Product Images (select multiple)</label>
            <input type="file" accept="image/*" multiple className="w-full text-sm border border-slate-200 rounded-md p-2" onChange={(e) => setForm({ ...form, images: e.target.files })} />
            {form.images && <p className="text-xs text-slate-400 mt-1">{form.images.length} file(s) selected</p>}
          </div>
          <label className="text-sm text-slate-600">
            <span className="mb-1 block">Stock count (0 = unlimited / not tracked)</span>
            <input type="number" min="0" className="input-field" value={form.stock} onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })} />
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-600">
            <input type="checkbox" checked={form.inStock} onChange={(e) => setForm({ ...form, inStock: e.target.checked })} /> In Stock
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-600">
            <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} /> Featured
          </label>
          <div className="md:col-span-2 flex gap-3">
            <button type="submit" className="btn-gold">Save</button>
            <button type="button" className="btn-outline" onClick={() => { setEditing(null); setForm(EMPTY); }}>Cancel</button>
          </div>
        </form>
      )}

      <div className="admin-surface overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="text-left p-3">Images</th>
              <th className="text-left p-3">Name</th>
              <th className="text-left p-3">Category</th>
              <th className="text-left p-3">Gender</th>
              <th className="text-left p-3">Price</th>
              <th className="text-left p-3">Stock</th>
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
                  ) : (
                    <span className="text-slate-300">—</span>
                  )}
                </td>
                <td className="p-3 text-ink font-medium">{p.name}</td>
                <td className="p-3 text-slate-500">{p.category}</td>
                <td className="p-3 text-slate-500">{p.gender || 'Unisex'}</td>
                <td className="p-3 text-ink">
                  {(() => {
                    const pr = pricing(p);
                    return (
                      <span className="flex flex-col">
                        <span>Rs {pr.current.toLocaleString()}</span>
                        {pr.onSale && (
                          <span className="text-[10px] text-red-600 font-semibold">
                            <s className="text-slate-400 mr-1">Rs {pr.price.toLocaleString()}</s> −{pr.discountPct}%
                          </span>
                        )}
                      </span>
                    );
                  })()}
                </td>
                <td className="p-3">
                  {p.inStock ? (
                    <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded">
                      In Stock{Number(p.stock) > 0 ? ` (${Number(p.stock)})` : ''}
                    </span>
                  ) : (
                    <span className="text-xs text-red-500 bg-red-50 px-2 py-0.5 rounded">Out</span>
                  )}
                </td>
                <td className="p-3 space-x-2">
                  <button className="text-gold-dark hover:underline" onClick={() => openEdit(p)}>Edit</button>
                  <button className="text-red-500 hover:underline" onClick={() => remove(p._id)}>Remove</button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr><td colSpan="7" className="p-4 text-center text-slate-400">No products yet.</td></tr>
            )}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
}
