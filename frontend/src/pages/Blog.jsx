import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import api from '../api';
import { imgUrl } from '../lib/img';

export default function Blog() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    api.getBlogCategories().then(setCategories).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (category) params.category = category;
    api
      .getBlogs(params)
      .then((r) => setBlogs(r.blogs || r))
      .finally(() => setLoading(false));
  }, [category]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <SEO
        title="Blog — Streetwear Pakistan"
        description="Read the latest streetwear tips, style guides, and updates from Wear Out. Pakistan's boldest streetwear brand."
        keywords="streetwear blog Pakistan, fashion blog Pakistan, Wear Out blog, style guide Pakistan, clothing tips Pakistan"
        url="/blog"
      />

      <h1 className="font-display text-4xl sm:text-5xl text-metallic tracking-wider mb-2">BLOG</h1>
      <p className="text-slate-500 mb-8">Streetwear tips, style guides & updates from Wear Out.</p>

      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setCategory('')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              !category ? 'bg-black text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                category === cat ? 'bg-black text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-white border border-gold/20 rounded-xl overflow-hidden animate-pulse">
              <div className="aspect-[16/9] bg-slate-200" />
              <div className="p-5 space-y-3">
                <div className="h-4 bg-slate-200 rounded w-3/4" />
                <div className="h-3 bg-slate-200 rounded w-full" />
                <div className="h-3 bg-slate-200 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : blogs.length === 0 ? (
        <p className="text-slate-400">No blog posts yet. Check back soon!</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <Link
              key={blog._id}
              to={`/blog/${blog.slug}`}
              className="bg-white border border-gold/20 rounded-xl overflow-hidden hover:border-gold/40 transition-colors group"
            >
              {blog.image && (
                <div className="aspect-[16/9] overflow-hidden bg-slate-100">
                  <img
                    src={imgUrl(blog.image)}
                    alt={blog.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              )}
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs text-gold font-medium uppercase tracking-wider">{blog.category}</span>
                  <span className="text-xs text-slate-300">•</span>
                  <span className="text-xs text-slate-400">{new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>
                <h2 className="font-display text-xl text-ink tracking-wide mb-2 group-hover:text-gold transition-colors">{blog.title}</h2>
                <p className="text-slate-500 text-sm leading-relaxed line-clamp-3">{blog.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
