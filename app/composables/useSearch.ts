import { ref } from 'vue';
import { useRouter } from 'vue-router';

export function useSearch() {
  const router = useRouter();
  const query = ref('');
  const isLoading = ref(false);

  function search() {
    if (!query.value.trim()) {
      return;
    }
    router.push({ path: '/search', query: { q: query.value.trim() } });
  }

  return {
    query,
    isLoading,
    search,
  };
}
