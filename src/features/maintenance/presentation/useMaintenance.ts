import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { sqliteMaintenanceRepository } from '../data/sqliteMaintenanceRepository';
import type { MaintenanceTask, NewMaintenanceTask } from '../domain/Maintenance';

const tasksKey = ['maintenanceTasks'] as const;
const completionsKey = ['maintenanceCompletions'] as const;

export function useMaintenanceTasksQuery() {
  return useQuery({ queryKey: tasksKey, queryFn: sqliteMaintenanceRepository.list });
}

export function useMaintenanceTaskQuery(id: string | undefined) {
  return useQuery({
    queryKey: [...tasksKey, id],
    queryFn: () => sqliteMaintenanceRepository.get(id as string),
    enabled: !!id,
  });
}

export function useMaintenanceCompletionsQuery(taskId: string | undefined) {
  return useQuery({
    queryKey: [...completionsKey, taskId],
    queryFn: () => sqliteMaintenanceRepository.listCompletions(taskId as string),
    enabled: !!taskId,
  });
}

export function useAllMaintenanceCompletionsQuery() {
  return useQuery({ queryKey: [...completionsKey, 'all'], queryFn: sqliteMaintenanceRepository.listAllCompletions });
}

export function useCreateMaintenanceTaskMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (task: NewMaintenanceTask) => sqliteMaintenanceRepository.create(task),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: tasksKey }),
  });
}

export function useUpdateMaintenanceTaskMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, task }: { id: string; task: NewMaintenanceTask }) => sqliteMaintenanceRepository.update(id, task),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: tasksKey }),
  });
}

export function useDeleteMaintenanceTaskMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => sqliteMaintenanceRepository.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: tasksKey }),
  });
}

export function useCompleteMaintenanceTaskMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ task, completedAt, cost, notes }: { task: MaintenanceTask; completedAt: string; cost: number | null; notes: string | null }) =>
      sqliteMaintenanceRepository.complete(task, completedAt, cost, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tasksKey });
      queryClient.invalidateQueries({ queryKey: completionsKey });
    },
  });
}
