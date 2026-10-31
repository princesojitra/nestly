import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { sqliteAssetRepository } from '../data/sqliteAssetRepository';
import type { NewAsset } from '../domain/Asset';

const assetsKey = ['assets'] as const;

export function useAssetsQuery() {
  return useQuery({ queryKey: assetsKey, queryFn: sqliteAssetRepository.list });
}

export function useAssetQuery(id: string | undefined) {
  return useQuery({
    queryKey: [...assetsKey, id],
    queryFn: () => sqliteAssetRepository.get(id as string),
    enabled: !!id,
  });
}

export function useCreateAssetMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (asset: NewAsset) => sqliteAssetRepository.create(asset),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: assetsKey }),
  });
}

export function useUpdateAssetMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, asset }: { id: string; asset: NewAsset }) => sqliteAssetRepository.update(id, asset),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: assetsKey }),
  });
}

export function useDeleteAssetMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => sqliteAssetRepository.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: assetsKey }),
  });
}
