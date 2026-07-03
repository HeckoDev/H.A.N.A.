import { onMounted, onUnmounted, readonly, ref } from 'vue';

export function useFontSize() {
  const fontSize = ref<'normal' | 'large' | 'xlarge'>(
    process.client ? (localStorage.getItem('fontSize') as 'normal' | 'large' | 'xlarge' | null) || 'normal' : 'normal',
  );

  const applyFontSize = (size: 'normal' | 'large' | 'xlarge') => {
    if (process.client) {
      document.documentElement.style.fontSize = {
        normal: '16px',
        large: '18px',
        xlarge: '20px',
      }[size];
    }
  };

  const setFontSize = (size: 'normal' | 'large' | 'xlarge') => {
    fontSize.value = size;
    if (process.client) {
      localStorage.setItem('fontSize', size);
      applyFontSize(size);
    }
  };

  onMounted(() => {
    applyFontSize(fontSize.value);

    if (process.client) {
      const handleStorageChange = (e: StorageEvent) => {
        if (e.key === 'fontSize' && e.newValue) {
          fontSize.value = e.newValue as 'normal' | 'large' | 'xlarge';
          applyFontSize(fontSize.value);
        }
      };

      window.addEventListener('storage', handleStorageChange);

      onUnmounted(() => {
        window.removeEventListener('storage', handleStorageChange);
      });
    }
  });

  return {
    fontSize: readonly(fontSize),
    setFontSize,
  };
}
