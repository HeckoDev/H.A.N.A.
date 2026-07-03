<script setup lang="ts">
interface Props {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  label: 'Chargement en cours...',
});

const sizeMap = {
  sm: 'w-4 h-4 border-2',
  md: 'w-6 h-6 border-2',
  lg: 'w-8 h-8 border-3',
};
</script>

<template>
  <div
    role="status"
    :aria-label="label"
    :class="[
      'inline-block animate-spin rounded-full',
      'border-current border-solid border-r-transparent',
      sizeMap[size],
    ]"
  >
    <span class="sr-only">{{ label }}</span>
  </div>
</template>
