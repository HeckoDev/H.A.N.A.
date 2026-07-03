<script setup lang="ts">
const { fontSize, setFontSize } = useFontSize();
const { t } = useI18n();

const sizes = [
  { value: 'normal' as const, label: 'A', ariaLabel: t('fontSize.normal') },
  { value: 'large' as const, label: 'A+', ariaLabel: t('fontSize.large') },
  { value: 'xlarge' as const, label: 'A++', ariaLabel: t('fontSize.xlarge') },
];
</script>

<template>
  <div
    role="group"
    :aria-label="t('fontSize.label')"
    class="inline-flex gap-1 rounded-lg border-2 border-gray-300 p-1"
  >
    <button
      v-for="size in sizes"
      :key="size.value"
      type="button"
      :aria-label="size.ariaLabel"
      :aria-pressed="fontSize === size.value"
      :class="[
        'flex h-9 w-9 items-center justify-center rounded font-bold transition-colors',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-hana-red/40',
        fontSize === size.value
          ? 'bg-hana-red text-white'
          : 'bg-transparent text-gray-700 hover:bg-gray-100',
      ]"
      @click="setFontSize(size.value)"
    >
      {{ size.label }}
    </button>
  </div>
</template>
