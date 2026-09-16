import { useState, useEffect, useRef } from 'react';
import api from '../../api';
import { imgUrl } from '../../lib/img';

const EMPTY = { title: '', slug: '', excerpt: '', metaDescription: '', content: '', image: '', category: 'Streetwear', tags: '', published: false };

export default function BlogManager() {
  const [blogs, setBlogs] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [msg, setMsg] = useState('');
  const [uploading, setUploading] = useState(false);
  const contentRef = useRef(null);
  const fileInputRef = useRef(null);

  const load = () => api.adminGetBlogs().then(setBlogs).catch(() => {});
  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditing('new'); setForm(EMPTY); setMsg(''); };
  const openEdit = (b) => {
    setEditing(b._id);
    setForm({
      title: b.title, slug: b.slug, excerpt: b.excerpt, metaDescription: b.metaDescription || '',
      content: b.content, image: b.image || '', category: b.category || 'Streetwear',
      tags: (b.tags || []).join(', '), published: b.published,
    });
    setMsg('');
  };

  const submit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        tags: form.tags,
        published: form.published,
      };
      if (editing && editing !== 'new') await api.adminUpdateBlog(editing, payload);
      else await api.adminCreateBlog(payload);
      setMsg(editing && editing !== 'new' ? 'Updated successfully' : 'Created successfully');
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

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const result = await api.adminUploadBlogImage(file);
      const markdown = `\n<img src="${result.url}" alt="blog image" className="w-full rounded-lg my-4" />\n`;
      insertAtCursor(markdown);
    } catch (err) {
      setMsg('Image upload failed: ' + (err?.response?.data?.message || err.message));
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const insertAtCursor = (text) => {
    const ta = contentRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const before = form.content.substring(0, start);
    const after = form.content.substring(end);
    setForm({ ...form, content: before + text + after });
    setTimeout(() => {
      ta.focus();
      ta.selectionStart = ta.selectionEnd = start + text.length;
    }, 0);
  };

  const isFormOpen = editing !== null;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold text-ink">Blog Posts</h1>
        <button className="btn-gold" onClick={openAdd}>+ New Post</button>
      </div>

      {msg && <p className="text-sm text-gold-dark mb-3">{msg}</p>}

      {isFormOpen && (
        <form onSubmit={submit} className="admin-surface p-5 mb-6 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Title *</label>
              <input className="input-field w-full" placeholder="Blog post title" value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            </div>
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Slug</label>
              <input className="input-field w-full" placeholder="auto-generated from title" value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })} />
            </div>
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Category</label>
              <input className="input-field w-full" placeholder="e.g. Streetwear, Guide" value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })} />
            </div>
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Tags (comma separated)</label>
              <input className="input-field w-full" placeholder="e.g. shirts, trends, pakistan" value={form.tags}
                onChange={(e) => setForm({ ...form, tags: e.target.value })} />
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-500 mb-1 block">Featured Image URL</label>
            <input className="input-field w-full" placeholder="https://res.cloudinary.com/..." value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })} />
          </div>

          <div>
            <label className="text-xs text-slate-500 mb-1 block">Excerpt (short summary for cards) *</label>
            <textarea className="input-field w-full min-h-[60px]" placeholder="Brief summary shown on blog cards" value={form.excerpt}
              onChange={(e) => setForm({ ...form, excerpt: e.target.value })} required />
          </div>

          <div>
            <label className="text-xs text-slate-500 mb-1 block">Meta Description (for SEO — appears in Google results) *</label>
            <textarea className="input-field w-full min-h-[60px]" placeholder="This text appears in Google search results. Keep it under 160 characters." value={form.metaDescription}
              onChange={(e) => setForm({ ...form, metaDescription: e.target.value })} required />
            <p className="text-xs text-slate-400 mt-1">{form.metaDescription.length}/160 characters</p>
          </div>

          <div>
            <label className="text-xs text-slate-500 mb-1 block">Content (HTML) *</label>
            <div className="flex items-center gap-2 mb-2">
              <label className="btn-outline !py-1.5 !px-3 text-xs cursor-pointer">
                {uploading ? 'Uploading…' : '📷 Insert Image'}
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
              </label>
              <span className="text-xs text-slate-400">Image will be inserted at cursor position</span>
            </div>
            <textarea
              ref={contentRef}
              className="input-field w-full min-h-[400px] font-mono text-sm leading-relaxed"
              placeholder="<h2>Heading</h2>&#10;<p>Your article content here. You can use HTML tags.</p>&#10;<img src='url' alt='description' />"
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              required
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-slate-600">
              <input type="checkbox" checked={form.published}
                onChange={(e) => setForm({ ...form, published: e.target.checked })} /> Published
            </label>
            <div className="flex gap-3">
              <button type="submit" className="btn-gold">Save</button>
              <button type="button" className="btn-outline" onClick={() => { setEditing(null); setForm(EMPTY); }}>Cancel</button>
            </div>
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
