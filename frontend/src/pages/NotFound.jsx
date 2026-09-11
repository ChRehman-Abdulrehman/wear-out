import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

export default function NotFound() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-24 text-center">
      <SEO
        title="404 — Page Not Found"
        description="The page you're looking for doesn't exist. Browse Wear Out — Pakistan's premium streetwear brand."
        url=""
      />
      <h1 className="font-display text-7xl sm:text-9xl text-gold mb-4">404</h1>
      <p className="font-display text-2xl text-metallic tracking-wider mb-2">PAGE NOT FOUND</p>
      <p className="text-slate-500 mb-8 max-w-md mx-auto">
        The page you're looking for doesn't exist or has been moved. Let's get you back on track.
      </p>
      <Link
        to="/"
        className="inline-block btn-gold px-8 py-3 text-sm font-semibold tracking-wider uppercase"
      >
        Back to Home
      </Link>
    </div>
  );
}
