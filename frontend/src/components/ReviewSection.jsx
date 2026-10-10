import { useState, useEffect } from 'react';
import api from '../api';

function Stars({ value, size = 18 }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} style={{ color: n <= value ? '#c9a24b' : '#444' }} className="text-lg" aria-hidden>
          ★
        </span>
      ))}
    </div>
  );
}

export default function ReviewSection({ productId }) {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState({ avg: 0, count: 0 });
  const [form, setForm] = useState({ author: '', comment: '', stars: 5 });
  const [photos, setPhotos] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState('');

  const onPickPhotos = (e) => {
    const files = Array.from(e.target.files || []).slice(0, 3 - photos.length);
    files.forEach((f) => {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          const max = 480;
          const scale = Math.min(1, max / Math.max(img.width, img.height));
          const canvas = document.createElement('canvas');
          canvas.width = Math.round(img.width * scale);
          canvas.height = Math.round(img.height * scale);
          canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
          const data = canvas.toDataURL('image/jpeg', 0.7);
          setPhotos((p) => (p.length >= 3 ? p : [...p, data]));
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(f);
    });
    e.target.value = '';
  };

  const load = async () => {
    const r = await api.getApprovedReviews(productId);
    const rt = await api.getProductRating(productId);
    setReviews(r);
    setRating(rt);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line
  }, [productId]);

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMsg('');
    try {
      await api.submitReview({
        product: productId,
        author: form.author,
        rating: form.stars,
        comment: form.comment,
        photos,
      });
      setMsg('Thanks! Your review is awaiting approval.');
      setForm({ author: '', comment: '', stars: 5 });
      setPhotos([]);
      await load();
    } catch {
      setMsg('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-10 border-t border-gold/15 pt-8">
      <div className="flex items-center gap-4 mb-6">
        <h2 className="font-display text-3xl text-slate-800">Reviews</h2>
        <div className="flex items-center gap-2">
          <Stars value={Math.round(rating.avg)} />
          <span className="text-slate-500 text-sm">
            {rating.avg ? `${rating.avg.toFixed(1)} (${rating.count})` : 'No ratings yet'}
          </span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          {reviews.length === 0 && <p className="text-slate-400">Be the first to leave a review.</p>}
          {reviews.map((rv) => (
            <div key={rv._id} className="bg-white border border-gold/20 rounded-lg p-4 shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <span className="text-slate-800 font-semibold">{rv.author}</span>
                <Stars value={rv.rating} />
              </div>
              <p className="text-slate-600 text-sm">{rv.comment}</p>
              {Array.isArray(rv.photos) && rv.photos.length > 0 && (
                <div className="flex gap-2 mt-3">
                  {rv.photos.map((ph, i) => (
                    <a key={i} href={ph} target="_blank" rel="noopener noreferrer">
                      <img src={ph} alt={`Review photo ${i + 1}`} className="h-16 w-16 rounded-md object-cover border border-gold/20 hover:border-gold" />
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <form onSubmit={submit} className="bg-white border border-gold/20 rounded-lg p-4 space-y-3 shadow-sm">
          <h3 className="text-gold font-semibold">Write a review</h3>
          {msg && <p className="text-sm text-gold/80">{msg}</p>}
          <input
            className="input-field"
            placeholder="Your name (optional)"
            value={form.author}
            onChange={(e) => setForm({ ...form, author: e.target.value })}
          />
          <div className="flex items-center gap-2">
            <span className="text-slate-600 text-sm">Rating:</span>
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                type="button"
                key={n}
                onClick={() => setForm({ ...form, stars: n })}
                className="text-2xl"
                style={{ color: n <= form.stars ? '#c9a24b' : '#444' }}
                aria-label={`${n} star`}
              >
                ★
              </button>
            ))}
          </div>
          <textarea
            required
            className="input-field min-h-[90px]"
            placeholder="Share your experience..."
            value={form.comment}
            onChange={(e) => setForm({ ...form, comment: e.target.value })}
          />
          <div className="flex items-center gap-2 flex-wrap">
            {photos.map((ph, i) => (
              <div key={i} className="relative">
                <img src={ph} alt="" className="h-14 w-14 rounded-md object-cover border border-gold/30" />
                <button type="button" onClick={() => setPhotos(photos.filter((_, j) => j !== i))}
                  className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-red-500 text-white text-xs leading-none">×</button>
              </div>
            ))}
            {photos.length < 3 && (
              <label className="cursor-pointer text-xs border border-dashed border-gold/40 text-slate-500 hover:text-gold hover:border-gold rounded-md px-3 py-3">
                + Photo
                <input type="file" accept="image/*" multiple className="hidden" onChange={onPickPhotos} />
              </label>
            )}
          </div>
          <button type="submit" disabled={submitting} className="btn-gold w-full">
            {submitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      </div>
    </div>
  );
}
