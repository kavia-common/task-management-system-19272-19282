<template>
  <div>
    <div class="card mb-4">
      <h1 class="text-lg font-semibold mb-2">Your Tasks</h1>
      <form class="grid gap-4" @submit.prevent="onCreate">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label for="title">Title</label>
            <input id="title" v-model="form.title" placeholder="Task title" required />
          </div>
          <div>
            <label for="due">Due Date</label>
            <input id="due" v-model="form.dueDate" type="date" />
          </div>
        </div>
        <div>
          <label for="desc">Description</label>
          <textarea id="desc" v-model="form.description" rows="2" placeholder="What needs to be done?"></textarea>
        </div>
        <div class="actions">
          <button class="btn" type="submit" :disabled="creating">{{ creating ? 'Adding...' : 'Add Task' }}</button>
          <button class="btn-outline" type="button" @click="refresh" :disabled="loading">Refresh</button>
        </div>
        <p v-if="error" class="text-muted mt-2">Error: {{ error }}</p>
      </form>
    </div>

    <div class="grid gap-4">
      <div v-if="loading" class="card">Loading tasks...</div>
      <div v-else-if="!tasks.length" class="card">No tasks yet. Add your first one!</div>
      <div v-else v-for="t in tasks" :key="t.id" class="card task-row">
        <div>
          <div class="flex items-center gap-3">
            <input type="checkbox" :checked="t.completed" @change="toggleComplete(t)" />
            <div>
              <div class="font-semibold">{{ t.title }}</div>
              <div class="text-muted" v-if="t.description">{{ t.description }}</div>
              <div class="text-muted" v-if="t.dueDate">
                Due: {{ formatDate(t.dueDate) }}
              </div>
            </div>
          </div>
        </div>
        <div class="actions">
          <button class="btn-outline" @click="startEdit(t)">Edit</button>
          <button class="btn" style="background:#dc2626" @click="onDelete(t.id)">Delete</button>
        </div>
      </div>
    </div>

    <dialog ref="editDialog">
      <form class="card" method="dialog" @submit.prevent="onSaveEdit">
        <h2 class="font-semibold mb-2">Edit Task</h2>
        <div class="form-row">
          <label for="etitle">Title</label>
          <input id="etitle" v-model="editForm.title" required />
        </div>
        <div class="form-row">
          <label for="edesc">Description</label>
          <textarea id="edesc" v-model="editForm.description" rows="2"></textarea>
        </div>
        <div class="form-row">
          <label for="edue">Due Date</label>
          <input id="edue" type="date" v-model="editForm.dueDate" />
        </div>
        <div class="form-row">
          <label>
            <input type="checkbox" v-model="editForm.completed" />
            <span class="ml-2">Completed</span>
          </label>
        </div>
        <div class="actions mt-2">
          <button class="btn" type="submit" :disabled="saving">Save</button>
          <button class="btn-outline" type="button" @click="closeEdit">Cancel</button>
        </div>
      </form>
    </dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useTasks } from '~/composables/useTasks';
import type { Task } from '~/types';

const { items, list, create, update, remove, loading, error } = useTasks();

const tasks = items;
const creating = ref(false);

const form = ref({
  title: '',
  description: '',
  dueDate: '',
});

function toISODate(dateStr: string | null | undefined): string | null {
  if (!dateStr) return null;
  // Need to convert yyyy-mm-dd to ISO midnight
  try {
    const d = new Date(dateStr);
    // preserve date only
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}T00:00:00.000Z`;
  } catch {
    return null;
  }
}

async function onCreate() {
  creating.value = true;
  try {
    await create({
      title: form.value.title.trim(),
      description: form.value.description?.trim() || undefined,
      dueDate: toISODate(form.value.dueDate),
      completed: false,
    });
    form.value.title = '';
    form.value.description = '';
    form.value.dueDate = '';
  } finally {
    creating.value = false;
  }
}

function formatDate(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString();
  } catch {
    return iso;
  }
}

async function refresh() {
  await list();
}

onMounted(async () => {
  await list();
});

// Editing
const editDialog = ref<HTMLDialogElement | null>(null);
const editing = ref<Task | null>(null);
const editForm = ref({
  title: '',
  description: '',
  dueDate: '',
  completed: false,
});
const saving = ref(false);

function startEdit(task: Task) {
  editing.value = task;
  editForm.value.title = task.title;
  editForm.value.description = task.description || '';
  editForm.value.dueDate = task.dueDate ? new Date(task.dueDate).toISOString().slice(0, 10) : '';
  editForm.value.completed = task.completed;
  if (editDialog.value && typeof editDialog.value.showModal === 'function') {
    editDialog.value.showModal();
  }
}

function closeEdit() {
  if (editDialog.value && typeof editDialog.value.close === 'function') {
    editDialog.value.close();
  }
  editing.value = null;
}

async function onSaveEdit() {
  if (!editing.value) return;
  saving.value = true;
  try {
    await update(editing.value.id, {
      title: editForm.value.title.trim(),
      description: editForm.value.description?.trim() || undefined,
      dueDate: toISODate(editForm.value.dueDate),
      completed: editForm.value.completed,
    });
    closeEdit();
  } finally {
    saving.value = false;
  }
}

async function onDelete(id: string) {
  if (!confirm('Delete this task?')) return;
  await remove(id);
}

async function toggleComplete(task: Task) {
  await update(task.id, { completed: !task.completed });
}
</script>
