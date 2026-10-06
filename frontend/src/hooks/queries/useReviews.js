import { useQuery } from '@tanstack/react-query';
import { api } from '../../api';

export function useApprovedReviews(productId) {
  return useQuery({
    queryKey: ['reviews', productId],
    queryFn: () => api.getApprovedReviews(productId),
    staleTime: 30000,
    refetchOnWindowFocus: false,
  });
}

export function useProductRating(productId) {
  return useQuery({
    queryKey: ['rating', productId],
    queryFn: () => api.getProductRating(productId),
    staleTime: 180000,
    refetchOnWindowFocus: false,
  });
}