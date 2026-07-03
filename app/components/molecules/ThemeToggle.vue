<script setup lang="ts">
const { theme, toggleTheme } = useTheme();
const { t } = useI18n();

const isDark = computed(() => theme.value === 'dark');
</script>

<template>
  <BaseButton
    variant="ghost"
    size="sm"
    :aria-label="t('theme.toggle')"
    :aria-pressed="isDark"
    @click="toggleTheme"
  >
    <BaseIcon
      :name="isDark ? 'moon' : 'sun'"
      aria-hidden="true"
      size="md"
    />
    <span class="sr-only">
      {{ isDark ? t('theme.dark') : t('theme.light') }}
    </span>
  </BaseButton>
</template>
