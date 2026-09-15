import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import SEO from '../components/SEO';
import api from '../api';
import { imgUrl } from '../lib/img';

export default function BlogDetail() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api
      .getBlogBySlug(slug)
      .then(setBlog)
      .catch(() => setBlog(null))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="max-w-3xl mx-auto px-4 py-12"><p className="text-slate-400">Loading…</p></div>;
  if (!blog) return <div className="max-w-3xl mx-auto px-4 py-12"><p className="text-slate-400">Blog post not found.</p></div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <SEO
        title={blog.title}
        description={blog.excerpt}
        keywords={`${blog.title}, Wear Out blog, streetwear Pakistan, ${blog.category}`}
        image={blog.image}
        url={`/blog/${blog.slug}`}
        type="article"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: blog.title,
          description: blog.excerpt,
          image: blog.image || undefined,
          datePublished: blog.createdAt,
          dateModified: blog.updatedAt,
          author: { '@type': 'Organization', name: 'Wear Out' },
          publisher: {
            '@type': 'Organization',
            name: 'Wear Out',
            logo: { '@type': 'ImageObject', url: 'https://wearout.shop/assets/logo.webp' },
          },
        }}
      />

      <Link to="/blog" className="text-gold text-sm hover:underline mb-6 inline-block">← Back to Blog</Link>

      <div className="flex items-center gap-2 mb-4">
        <span className="text-xs text-gold font-medium uppercase tracking-wider">{blog.category}</span>
        <span className="text-xs text-slate-300">•</span>
        <span className="text-xs text-slate-400">{new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
        {blog.views > 0 && (
          <>
            <span className="text-xs text-slate-300">•</span>
            <span className="text-xs text-slate-400">{blog.views} views</span>
          </>
        )}
      </div>

      <h1 className="font-display text-3xl sm:text-5xl text-metallic tracking-wider mb-6">{blog.title}</h1>

      {blog.image && (
        <div className="rounded-xl overflow-hidden mb-8 bg-slate-100">
          <img src={imgUrl(blog.image)} alt={blog.title} className="w-full object-cover max-h-[400px]" />
        </div>
      )}

      {blog.tags && blog.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {blog.tags.map((tag, i) => (
            <span key={i} className="px-3 py-1 bg-slate-100 text-slate-500 text-xs rounded-full">{tag}</span>
          ))}
        </div>
      )}

      <div
        className="prose prose-slate max-w-none text-slate-700 leading-relaxed
          prose-headings:font-display prose-headings:text-ink
          prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4
          prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3
          prose-p:mb-4 prose-p:leading-relaxed
          prose-li:mb-2
          prose-strong:text-ink
          prose-a:text-gold prose-a:no-underline hover:prose-a:underline
          prose-img:rounded-lg"
        dangerouslySetInnerHTML={{ __html: blog.content }}
      />
    </div>
  );
}
