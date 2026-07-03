<script setup lang="ts">
interface Props {
  message: string;
  dismissible?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  dismissible: true,
});

const emit = defineEmits<{
  dismiss: [];
}>();

const { t } = useI18n();
</script>

<template>
  <div
    role="alert"
    class="flex items-start gap-4 rounded-lg border-2 border-red-600 bg-red-50 p-4"
  >
    <BaseIcon name="alert" size="md" class="flex-shrink-0 text-red-600" aria-hidden="true" />
    
    <p class="flex-1 text-base font-medium text-red-900">
      {{ message }}
    </p>
    
    <BaseButton
      v-if="dismissible"
      variant="ghost"
      size="sm"
      :aria-label="t('error.dismiss')"
      class="flex-shrink-0 text-red-600 hover:bg-red-100"
      @click="emit('dismiss')"
    >
      <BaseIcon name="close" aria-hidden="true" />
    </BaseButton>
  </div>
</template>
