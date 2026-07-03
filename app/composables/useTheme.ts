export function useTheme() {
  const theme = ref<'light' | 'dark'>('light');

  const initTheme = () => {
    if (process.client) {
      const stored = localStorage.getItem('theme') as 'light' | 'dark' | null;
      theme.value = stored || 'light';
      applyTheme(theme.value);
    }
  };

  const applyTheme = (newTheme: 'light' | 'dark') => {
    if (process.client) {
      const root = document.documentElement;
      if (newTheme === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  };

  const toggleTheme = () => {
    theme.value = theme.value === 'light' ? 'dark' : 'light';
    applyTheme(theme.value);
    if (process.client) {
      localStorage.setItem('theme', theme.value);
    }
  };

  onMounted(() => {
    initTheme();

    if (process.client) {
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

  return {
    theme: readonly(theme),
    toggleTheme,
  };
}
