import { useState, useEffect } from 'react';
import api from '../../api';

const EMPTY = { title: '', slug: '', excerpt: '', content: '', image: '', category: 'Streetwear', tags: '', published: false };

export default function BlogManager() {
  const [blogs, setBlogs] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [msg, setMsg] = useState('');

  const load = () => api.adminGetBlogs().then(setBlogs).catch(() => {});
  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditing(null); setForm(EMPTY); };
  const openEdit = (b) => {
    setEditing(b._id);
    setForm({
      title: b.title, slug: b.slug, excerpt: b.excerpt, content: b.content,
      image: b.image || '', category: b.category || 'Streetwear',
      tags: (b.tags || []).join(', '), published: b.published,
    });
  };

  const submit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        tags: form.tags,
        published: form.published,
      };
      if (editing) await api.adminUpdateBlog(editing, payload);
      else await api.adminCreateBlog(payload);
      setMsg(editing ? 'Updated successfully' : 'Created successfully');
      setEditing(null);
      setForm(EMPTY);
      await load();
    } catch (err) {
      setMsg('Error: ' + (err?.response?.data?.message || 'Save failed'));
    }
  };

  const remove = async (id) => {
    if (!confirm('Delete this blog post?')) return;
    await api.adminDeleteBlog(id);
    await load();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold text-ink">Blog Posts</h1>
        <button className="btn-gold" onClick={openAdd}>+ New Post</button>
      </div>

      {msg && <p className="text-sm text-gold-dark mb-3">{msg}</p>}

      {editing !== null && (
        <form onSubmit={submit} className="admin-surface p-5 mb-6 grid md:grid-cols-2 gap-3">
          <input className="input-field" placeholder="Title" value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          <input className="input-field" placeholder="Slug (auto-generated)" value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })} />
          <input className="input-field" placeholder="Category" value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })} />
          <input className="input-field" placeholder="Tags (comma separated)" value={form.tags}
            onChange={(e) => setForm({ ...form, tags: e.target.value })} />
          <div className="md:col-span-2">
            <input className="input-field" placeholder="Featured Image URL" value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })} />
          </div>
          <div className="md:col-span-2">
            <textarea className="input-field min-h-[60px]" placeholder="Excerpt (short summary)" value={form.excerpt}
              onChange={(e) => setForm({ ...form, excerpt: e.target.value })} required />
          </div>
          <div className="md:col-span-2">
            <textarea className="input-field min-h-[200px] font-mono text-sm" placeholder="Content (HTML supported)" value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })} required />
          </div>
          <label className="flex items-center gap-2 text-sm text-slate-600">
            <input type="checkbox" checked={form.published}
              onChange={(e) => setForm({ ...form, published: e.target.checked })} /> Published
          </label>
          <div className="md:col-span-2 flex gap-3">
            <button type="submit" className="btn-gold">Save</button>
            <button type="button" className="btn-outline" onClick={() => { setEditing(null); setForm(EMPTY); }}>Cancel</button>
          </div>
        </form>
      )}

      <div className="admin-surface overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[700px]">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="text-left p-3">Title</th>
                <th className="text-left p-3">Category</th>
                <th className="text-left p-3">Status</th>
                <th className="text-left p-3">Views</th>
                <th className="text-left p-3">Date</th>
                <th className="text-left p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {blogs.map((b) => (
                <tr key={b._id} className="border-t border-slate-100">
                  <td className="p-3 text-ink font-medium">{b.title}</td>
                  <td className="p-3 text-slate-500">{b.category}</td>
                  <td className="p-3">
                    {b.published
                      ? <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded">Published</span>
                      : <span className="text-xs text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded">Draft</span>}
                  </td>
                  <td className="p-3 text-slate-500">{b.views || 0}</td>
                  <td className="p-3 text-slate-400 text-xs">{new Date(b.createdAt).toLocaleDateString()}</td>
                  <td className="p-3 space-x-2">
                    <button className="text-gold-dark hover:underline" onClick={() => openEdit(b)}>Edit</button>
                    <button className="text-red-500 hover:underline" onClick={() => remove(b._id)}>Delete</button>
                  </td>
                </tr>
              ))}
              {blogs.length === 0 && (
                <tr><td colSpan="6" className="p-4 text-center text-slate-400">No blog posts yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
