<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  title: string;
  url: string;
  description: string;
}

const props = defineProps<Props>();

function isValidUrl(value: string) {
  try {
    const parsed = new URL(value);
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch {
    return false;
  }
}

const validUrl = computed(() => (isValidUrl(props.url) ? props.url : '#'));

const displayUrl = computed(() => {
  try {
    return new URL(props.url).hostname;
  } catch {
    return props.url;
  }
});
</script>

<template>
  <article
    class="rounded-lg border-2 border-gray-200 bg-white p-4 transition-shadow hover:shadow-md focus-within:ring-2 focus-within:ring-hana-red/40"
  >
    <a
      :href="validUrl"
      target="_blank"
      rel="noopener noreferrer"
      class="block text-lg font-bold text-hana-red hover:underline focus:outline-none"
    >
      {{ title }}
    </a>

    <span class="mt-1 block text-sm text-gray-600">{{ displayUrl }}</span>

    <p class="mt-2 text-base text-gray-900 line-clamp-2">
      {{ description }}
    </p>
  </article>
</template>
