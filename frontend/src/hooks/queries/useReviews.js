import { useQuery } from '@tanstack/react-query';
import { getApprovedReviews, getProductRating } from '../api';

export function useApprovedReviews(productId) {
  return useQuery({
    queryKey: ['reviews', productId],
    queryFn: () => getApprovedReviews(productId),
    staleTime: 30000,
    refetchOnWindowFocus: false,
  });
}

export function useProductRating(productId) {
  return useQuery({
    queryKey: ['rating', productId],
    queryFn: () => getProductRating(productId),
    staleTime: 180000,
    refetchOnWindowFocus: false,
  });
}