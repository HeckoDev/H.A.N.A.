<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import BaseButton from '~/components/atoms/BaseButton.vue';
import BaseIcon from '~/components/atoms/BaseIcon.vue';
import { useTheme } from '~/composables/useTheme';

const { theme, toggleTheme } = useTheme();
const { t } = useI18n();

const isDark = computed(() => theme.value === 'dark');
const iconName = computed(() => (isDark.value ? 'sun' : 'moon'));
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
      :name="iconName"
      aria-hidden="true"
      size="md"
    />
    <span class="sr-only">
      {{ isDark ? t('theme.dark') : t('theme.light') }}
    </span>
  </BaseButton>
</template>
