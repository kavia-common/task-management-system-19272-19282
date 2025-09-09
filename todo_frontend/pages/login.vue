<template>
  <div class="grid grid-cols-2 gap-4">
    <div class="card">
      <h1 class="text-lg font-semibold mb-2">Login</h1>
      <form @submit.prevent="onSubmit">
        <div class="form-row">
          <label for="email">Email</label>
          <input id="email" v-model="email" type="email" required placeholder="you@example.com" />
        </div>
        <div class="form-row">
          <label for="password">Password</label>
          <input id="password" v-model="password" type="password" required placeholder="••••••••" />
        </div>
        <p v-if="errorMsg" class="text-muted mb-2">{{ errorMsg }}</p>
        <button class="btn" type="submit" :disabled="loading">
          {{ loading ? 'Signing in...' : 'Login' }}
        </button>
      </form>
      <p class="mt-4 text-muted">
        No account? <NuxtLink to="/signup">Create one</NuxtLink>
      </p>
    </div>
    <div class="card">
      <h2 class="font-semibold mb-2">Welcome back</h2>
      <p class="text-muted">Log in to manage your tasks.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuth } from '~/composables/useAuth';

definePageMeta({
  title: 'Login',
  middleware: [],
});

const email = ref('');
thePassword: string;
const password = ref('');
const loading = ref(false);
const errorMsg = ref('');
const { login } = useAuth();

async function onSubmit() {
  loading.value = true;
  errorMsg.value = '';
  try {
    await login(email.value.trim(), password.value);
    await navigateTo('/');
  } catch (e: any) {
    errorMsg.value = e?.message || 'Login failed';
  } finally {
    loading.value = false;
  }
}
</script>
