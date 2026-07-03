<script setup lang="ts">
type IconName = 'search' | 'close' | 'sun' | 'moon' | 'chevron-left' | 'chevron-right' | 'alert' | 'check';

interface Props {
  name: IconName;
  size?: 'sm' | 'md' | 'lg';
  ariaLabel?: string;
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
});

const sizeMap = { sm: 'w-4 h-4', md: 'w-5 h-5', lg: 'w-6 h-6' };

const paths: Record<IconName, string> = {
  search: 'M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z',
  close: 'M6 18L18 6M6 6l12 12',
  sun: 'M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z',
  moon: 'M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z',
  'chevron-left': 'M15 19l-7-7 7-7',
  'chevron-right': 'M9 5l7 7-7 7',
  alert:
    'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
  check: 'M5 13l4 4L19 7',
};
</script>

<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :class="['inline-block', sizeMap[size]]"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    stroke-width="2"
    :aria-hidden="!ariaLabel ? 'true' : undefined"
    :aria-label="ariaLabel"
    :role="ariaLabel ? 'img' : undefined"
  >
    <path stroke-linecap="round" stroke-linejoin="round" :d="paths[name]" />
  </svg>
</template>
