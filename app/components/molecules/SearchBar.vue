<script setup lang="ts">
import { toRefs } from 'vue';
import { useI18n } from 'vue-i18n';
import BaseButton from '~/components/atoms/BaseButton.vue';
import BaseIcon from '~/components/atoms/BaseIcon.vue';
import BaseSpinner from '~/components/atoms/BaseSpinner.vue';

interface Props {
  modelValue: string;
  placeholder?: string;
  isLoading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Rechercher...',
  isLoading: false,
});

const emit = defineEmits<{
  'update:modelValue': [value: string];
  search: [];
}>();

const { modelValue, placeholder, isLoading } = toRefs(props);
const { t } = useI18n();

function handleSubmit() {
  if (modelValue.value.trim()) {
    emit('search');
  }
}
</script>

<template>
  <form
    role="search"
    :aria-label="t('search.label')"
    class="relative w-full"
    @submit.prevent="handleSubmit"
  >
    <div class="relative">
      <label for="search-input" class="sr-only">
        {{ t("search.label") }}
      </label>
      <input
        id="search-input"
        :value="modelValue"
        type="search"
        :placeholder="placeholder"
        autocomplete="off"
        class="w-full rounded-full border-0 bg-white py-4 pl-6 pr-16 text-lg shadow-lg placeholder:text-gray-400 focus:outline-none focus-visible:ring-4 focus-visible:ring-hana-red/40"
        @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      />

      <BaseButton
        type="submit"
        variant="primary"
        size="sm"
        :aria-label="t('search.button')"
        :disabled="isLoading"
        class="absolute right-2 top-1/2 -translate-y-1/2"
        @click="handleSubmit"
      >
        <BaseSpinner v-if="isLoading" size="sm" :label="t('search.loading')" />
        <BaseIcon v-else name="search" aria-hidden="true" />
      </BaseButton>
    </div>
  </form>
</template>
