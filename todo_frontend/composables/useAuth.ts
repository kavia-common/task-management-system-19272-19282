import { ref, computed } from 'vue';
import { useApi } from './useApi';
import type { LoginResponse, User } from '~/types';

const TOKEN_KEY = 'todo_jwt_token';

const _token = ref<string | null>(process.client ? localStorage.getItem(TOKEN_KEY) : null);
const _user = ref<User | null>(null);
const _loadedUser = ref(false);

// PUBLIC_INTERFACE
export function useAuth() {
  /** Provides authentication state and actions for login, signup, fetch profile, and logout. */
  const { api, handle } = useApi();

  async function login(email: string, password: string) {
    const data = await handle<LoginResponse>(api('/auth/login', {
      method: 'POST',
      body: { email, password },
    }));
    setToken(data.token);
    await fetchMe();
  }

  async function signup(name: string, email: string, password: string) {
    await handle(api('/auth/register', {
      method: 'POST',
      body: { name, email, password },
    }));
    // After signup, directly login
    await login(email, password);
  }

  async function fetchMe() {
    if (!_token.value) {
      _user.value = null;
      _loadedUser.value = true;
      return;
    }
    try {
      const me = await api<User>('/auth/me', { method: 'GET' });
      _user.value = me;
    } catch {
      // If failed (e.g., 401), clear token
      clearToken();
      _user.value = null;
    } finally {
      _loadedUser.value = true;
    }
  }

  function setToken(token: string) {
    _token.value = token;
    if (process.client) {
      localStorage.setItem(TOKEN_KEY, token);
    }
  }

  function clearToken() {
    _token.value = null;
    if (process.client) {
      localStorage.removeItem(TOKEN_KEY);
    }
  }

  function logout(redirect = true) {
    clearToken();
    _user.value = null;
    if (redirect) {
      navigateTo('/login');
    }
  }

  const token = computed(() => _token.value);
  const user = computed(() => _user.value);
  const isAuthenticated = computed(() => !!_token.value && !!_user.value);
  const userLoaded = computed(() => _loadedUser.value);

  return {
    token,
    user,
    isAuthenticated,
    userLoaded,
    login,
    signup,
    logout,
    fetchMe,
  };
}
