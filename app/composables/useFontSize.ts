import { onMounted, onUnmounted, readonly, ref } from 'vue';

const isClient =
  typeof window !== 'undefined' &&
  typeof document !== 'undefined' &&
  (typeof process === 'undefined' || process.client !== false);

export function useFontSize() {
  const fontSize = ref<'normal' | 'large' | 'xlarge'>(
    isClient ? (localStorage.getItem('fontSize') as 'normal' | 'large' | 'xlarge' | null) || 'normal' : 'normal',
  );

  const applyFontSize = (size: 'normal' | 'large' | 'xlarge') => {
    if (!isClient) {
      return;
    }

    document.documentElement.style.fontSize = {
      normal: '16px',
      large: '18px',
      xlarge: '20px',
    }[size];
  };

  const setFontSize = (size: 'normal' | 'large' | 'xlarge') => {
    fontSize.value = size;
    if (!isClient) {
      return;
    }

    localStorage.setItem('fontSize', size);
    applyFontSize(size);
  };

  onMounted(() => {
    applyFontSize(fontSize.value);

    if (!isClient) {
      return;
    }

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
  });

  return {
    fontSize: readonly(fontSize),
    setFontSize,
  };
}
