<script setup lang="ts">
interface Props {
  id: string;
  label: string;
  modelValue: string;
  type?: 'text' | 'email' | 'search' | 'url';
  placeholder?: string;
  error?: string;
  required?: boolean;
  autocomplete?: string;
  hideLabel?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  hideLabel: false,
});

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

const errorId = computed(() => (props.error ? `${props.id}-error` : undefined));
</script>

<template>
  <div class="flex flex-col gap-2">
    <label
      :for="id"
      :class="['text-sm font-medium text-gray-900', { 'sr-only': hideLabel }]"
    >
      {{ label }}
      <span v-if="required" aria-label="requis" class="ml-1 text-hana-red">*</span>
    </label>
    
    <input
      :id="id"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :required="required"
      :autocomplete="autocomplete"
      :aria-invalid="!!error"
      :aria-describedby="errorId"
      :class="[
        'w-full rounded-lg border-2 px-4 py-3 text-base',
        'focus:outline-none focus-visible:ring-4',
        'placeholder:text-gray-400',
        error
          ? 'border-red-600 focus-visible:ring-red-600/40'
          : 'border-gray-300 focus-visible:ring-hana-red/40',
      ]"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
    
    <span v-if="error" :id="errorId" class="text-sm font-medium text-red-600" role="alert">
      {{ error }}
    </span>
  </div>
</template>
