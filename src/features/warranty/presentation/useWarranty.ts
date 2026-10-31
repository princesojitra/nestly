import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { sqliteWarrantyRepository } from '../data/sqliteWarrantyRepository';
import type { NewWarranty } from '../domain/Warranty';

const warrantyKey = ['warranty'] as const;

export function useWarrantyQuery(assetId: string | undefined) {
  return useQuery({
    queryKey: [...warrantyKey, assetId],
    queryFn: () => sqliteWarrantyRepository.getForAsset(assetId as string),
    enabled: !!assetId,
  });
}

export function useUpsertWarrantyMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (warranty: NewWarranty) => sqliteWarrantyRepository.upsert(warranty),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: warrantyKey }),
  });
}

export function useDeleteWarrantyMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (assetId: string) => sqliteWarrantyRepository.remove(assetId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: warrantyKey }),
  });
}
