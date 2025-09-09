<template>
  <div class="grid grid-cols-2 gap-4">
    <div class="card">
      <h1 class="text-lg font-semibold mb-2">Sign up</h1>
      <form @submit.prevent="onSubmit">
        <div class="form-row">
          <label for="name">Name</label>
          <input id="name" v-model="name" type="text" required placeholder="Your name" />
        </div>
        <div class="form-row">
          <label for="email">Email</label>
          <input id="email" v-model="email" type="email" required placeholder="you@example.com" />
        </div>
        <div class="form-row">
          <label for="password">Password</label>
          <input id="password" v-model="password" type="password" required minlength="6" placeholder="••••••••" />
        </div>
        <p v-if="errorMsg" class="text-muted mb-2">{{ errorMsg }}</p>
        <button class="btn" type="submit" :disabled="loading">
          {{ loading ? 'Creating...' : 'Create account' }}
        </button>
      </form>
      <p class="mt-4 text-muted">
        Already have an account? <NuxtLink to="/login">Login</NuxtLink>
      </p>
    </div>
    <div class="card">
      <h2 class="font-semibold mb-2">Join us</h2>
      <p class="text-muted">Create an account to track your tasks efficiently.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuth } from '~/composables/useAuth';

definePageMeta({
  title: 'Sign up',
  middleware: [],
});

const name = ref('');
const email = ref('');
const password = ref('');
const loading = ref(false);
const errorMsg = ref('');
const { signup } = useAuth();

async function onSubmit() {
  loading.value = true;
  errorMsg.value = '';
  try {
    await signup(name.value.trim(), email.value.trim(), password.value);
    await navigateTo('/');
  } catch (e: any) {
    errorMsg.value = e?.message || 'Signup failed';
  } finally {
    loading.value = false;
  }
}
</script>
