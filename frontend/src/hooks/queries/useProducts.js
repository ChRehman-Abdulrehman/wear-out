import { useQuery } from '@tanstack/react-query';
import { getProducts, getFeaturedProducts, getProduct } from '../api';

export function useProducts(params = {}) {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => getProducts(params),
    staleTime: 30000,
    refetchOnWindowFocus: false,
  });
}

export function useFeaturedProducts() {
  return useQuery({
    queryKey: ['featured-products'],
    queryFn: () => getFeaturedProducts(),
    staleTime: 120000,
  });
}

export function useProduct(id) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => getProduct(id),
    staleTime: 300000,
    enabled: !!id,
  });
}