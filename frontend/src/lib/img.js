export const API_BASE = import.meta.env.VITE_API_BASE || '';

export function imgUrl(image) {
  if (!image) return '/assets/hero/figure.svg';
  if (image.startsWith('http')) return optimizeCloudinary(image);
  return `${API_BASE}/uploads/${image}`;
}

export function getProductImages(product) {
  if (product.images && product.images.length > 0) return product.images;
  if (product.image) return [product.image];
  return [];
}

function optimizeCloudinary(url) {
  if (!url.includes('cloudinary.com')) return url;
  if (url.includes('/upload/')) {
    return url.replace('/upload/', '/upload/f_auto,q_auto,w_800/');
  }
  return url;
}
