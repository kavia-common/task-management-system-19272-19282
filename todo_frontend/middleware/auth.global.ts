import type { NavigationGuard } from 'vue-router';
import { useAuth } from '~/composables/useAuth';

// PUBLIC_INTERFACE
const guard: NavigationGuard = async (to) => {
  const auth = useAuth();

  if (!auth.userLoaded.value) {
    await auth.fetchMe();
  }

  const isPublic = ['/login', '/signup'].includes(to.path);
  if (!auth.isAuthenticated.value && !isPublic) {
    return '/login';
  }
  if (auth.isAuthenticated.value && isPublic) {
    return '/';
  }
};

export default guard;
