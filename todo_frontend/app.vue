<template>
  <div class="min-h-screen bg-gray-50 text-gray-800">
    <header class="border-b bg-white">
      <nav class="container mx-auto px-4 py-3 flex items-center justify-between">
        <NuxtLink to="/" class="font-semibold text-lg">Todo</NuxtLink>
        <div class="flex items-center gap-3">
          <template v-if="isAuthenticated">
            <span class="text-sm text-gray-600" v-if="user?.email">Hello, {{ user.email }}</span>
            <button @click="logout" class="btn">Logout</button>
          </template>
          <template v-else>
            <NuxtLink to="/login" class="btn">Login</NuxtLink>
            <NuxtLink to="/signup" class="btn-outline">Sign up</NuxtLink>
          </template>
        </div>
      </nav>
    </header>
    <main class="container mx-auto px-4 py-6">
      <NuxtPage />
    </main>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '~/composables/useAuth';
const { isAuthenticated, user, logout } = useAuth();
</script>

<style>
/* Minimal utility styles without external deps */
.container { max-width: 960px; }
.btn {
  background: #2563eb;
  color: white;
  padding: 0.5rem 0.8rem;
  border-radius: 0.375rem;
  font-weight: 600;
}
.btn:hover { background: #1d4ed8; }
.btn-outline {
  border: 1px solid #2563eb;
  color: #2563eb;
  padding: 0.5rem 0.8rem;
  border-radius: 0.375rem;
  font-weight: 600;
}
.btn-outline:hover { background: #eff6ff; }
input, textarea, select {
  width: 100%;
  border: 1px solid #d1d5db;
  padding: 0.5rem 0.6rem;
  border-radius: 0.375rem;
}
label { display: block; font-weight: 600; margin-bottom: 0.25rem; }
.card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 1rem;
}
.form-row { display: grid; gap: 0.5rem; margin-bottom: 0.75rem; }
.task-row { display: grid; gap: 0.5rem; grid-template-columns: 1fr auto; align-items: center; }
.badge { font-size: 0.75rem; padding: 0.1rem 0.4rem; border-radius: 0.375rem; }
.badge-green { background: #ecfdf5; color: #065f46; border: 1px solid #a7f3d0; }
.badge-gray { background: #f3f4f6; color: #374151; border: 1px solid #e5e7eb; }
.actions { display: flex; gap: 0.5rem; }
.text-muted { color: #6b7280; }
.min-h-screen { min-height: 100vh; }
.bg-gray-50 { background: #f9fafb; }
.bg-white { background: #fff; }
.border-b { border-bottom: 1px solid #e5e7eb; }
.px-4 { padding-left: 1rem; padding-right: 1rem; }
.py-3 { padding-top: 0.75rem; padding-bottom: 0.75rem; }
.py-6 { padding-top: 1.5rem; padding-bottom: 1.5rem; }
.mx-auto { margin-left: auto; margin-right: auto; }
.font-semibold { font-weight: 600; }
.text-lg { font-size: 1.125rem; }
.text-gray-600 { color: #4b5563; }
.text-gray-800 { color: #1f2937; }
.flex { display: flex; }
.items-center { align-items: center; }
.justify-between { justify-content: space-between; }
.gap-3 { gap: 0.75rem; }
.rounded { border-radius: 0.375rem; }
.mt-2 { margin-top: 0.5rem; }
.mt-4 { margin-top: 1rem; }
.mb-2 { margin-bottom: 0.5rem; }
.mb-4 { margin-bottom: 1rem; }
.grid { display: grid; }
.grid-cols-2 { grid-template-columns: repeat(2, minmax(0,1fr)); }
.gap-4 { gap: 1rem; }

@media (max-width: 640px) {
  .grid-cols-2 { grid-template-columns: 1fr; }
}
</style>
