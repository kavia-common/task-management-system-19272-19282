import { ref } from 'vue';
import { useApi } from './useApi';
import type { Task, CreateTaskPayload, UpdateTaskPayload } from '~/types';

// PUBLIC_INTERFACE
export function useTasks() {
  /** Provides list state and CRUD actions for tasks. */
  const items = ref<Task[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const { api, handle } = useApi();

  async function list() {
    loading.value = true;
    error.value = null;
    try {
      const res = await handle<Task[]>(api('/tasks', { method: 'GET' }));
      items.value = res;
    } catch (e: any) {
      error.value = e?.message || 'Failed to fetch tasks';
    } finally {
      loading.value = false;
    }
  }

  async function create(payload: CreateTaskPayload) {
    const created = await handle<Task>(api('/tasks', { method: 'POST', body: payload }));
    items.value.unshift(created);
    return created;
  }

  async function update(id: string, payload: UpdateTaskPayload) {
    const updated = await handle<Task>(api(`/tasks/${id}`, { method: 'PUT', body: payload }));
    const idx = items.value.findIndex(t => t.id === id);
    if (idx !== -1) items.value[idx] = updated;
    return updated;
  }

  async function remove(id: string) {
    await handle(api(`/tasks/${id}`, { method: 'DELETE' }));
    items.value = items.value.filter(t => t.id !== id);
  }

  return { items, loading, error, list, create, update, remove };
}
