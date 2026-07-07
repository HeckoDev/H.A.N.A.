import { onMounted, onUnmounted, readonly, ref } from 'vue';

export function useTheme() {
  const theme = ref<'light' | 'dark'>('light');

  const applyTheme = (newTheme: 'light' | 'dark') => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      if (newTheme === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  };

  const initTheme = () => {
    const stored =
      typeof window !== 'undefined' && typeof localStorage !== 'undefined'
        ? (localStorage.getItem('theme') as 'light' | 'dark' | null)
        : null;
    theme.value = stored || 'light';
    applyTheme(theme.value);
  };

  const toggleTheme = () => {
    theme.value = theme.value === 'light' ? 'dark' : 'light';
    applyTheme(theme.value);
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      localStorage.setItem('theme', theme.value);
    }
  };

  initTheme();

  onMounted(() => {
    if (typeof window !== 'undefined') {
      const handleStorageChange = (e: StorageEvent) => {
        if (e.key === 'theme' && e.newValue) {
          theme.value = e.newValue as 'light' | 'dark';
          applyTheme(theme.value);
        }
      };

      window.addEventListener('storage', handleStorageChange);

      onUnmounted(() => {
        window.removeEventListener('storage', handleStorageChange);
      });
    }
  });

  const themeState = {
    get value() {
      return theme.value;
    },
  };

  return {
    theme: themeState,
    toggleTheme,
  };
}
