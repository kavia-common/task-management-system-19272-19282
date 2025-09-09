import { useRuntimeConfig } from '#app';
import { useAuth } from './useAuth';
import type { ApiError } from '~/types';

// PUBLIC_INTERFACE
export function useApi() {
  /** Wrapper around $fetch with baseURL and Authorization header injected. */
  const config = useRuntimeConfig();
  const baseURL = config.public.API_BASE as string;
  const auth = useAuth();

  const api = $fetch.create({
    baseURL,
    onRequest({ options }) {
      const token = auth.token.value;
      if (token) {
        options.headers = {
          ...(options.headers || {}),
          Authorization: `Bearer ${token}`,
        };
      }
      options.headers = {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...(options.headers || {}),
      };
    },
    onResponseError({ response }) {
      // Centralized error handling if needed
      // If unauthorized, clear session
      if (response.status === 401) {
        auth.logout(false);
      }
    },
  });

  async function handle<T>(promise: Promise<T>): Promise<T> {
    try {
      return await promise;
    } catch (e: any) {
      const err: ApiError = e?.data || { message: e?.message || 'Request failed' };
      throw err;
    }
  }

  return { api, handle };
}
