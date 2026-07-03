<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  ariaLabel?: string;
  type?: 'button' | 'submit' | 'reset';
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  type: 'button',
});

const classes = computed(() => [
  // Base
  'inline-flex items-center justify-center rounded-full font-medium transition-all',
  'focus:outline-none focus-visible:ring-4',
  'disabled:opacity-50 disabled:cursor-not-allowed',

  // Variants
  props.variant === 'primary' && 'bg-hana-red text-white hover:opacity-90 focus-visible:ring-hana-red/40',
  props.variant === 'secondary' &&
    'bg-white text-hana-dark border-2 border-hana-dark hover:bg-gray-50 focus-visible:ring-hana-dark/40',
  props.variant === 'ghost' && 'bg-transparent text-gray-700 hover:bg-gray-100 focus-visible:ring-gray-400',

  // Sizes (minimum 44x44px pour AAA)
  props.size === 'sm' && 'h-11 px-4 text-sm',
  props.size === 'md' && 'h-12 px-6 text-base',
  props.size === 'lg' && 'h-14 px-8 text-lg',
]);
</script>

<template>
  <button
    :type="type"
    :disabled="disabled"
    :aria-label="ariaLabel"
    :class="classes"
  >
    <slot />
  </button>
</template>
