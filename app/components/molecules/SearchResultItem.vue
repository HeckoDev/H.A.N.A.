<script setup lang="ts">
interface Props {
  title: string;
  url: string;
  description: string;
}

const props = defineProps<Props>();

const displayUrl = computed(() => {
  try {
    return new URL(props.url).hostname;
  } catch {
    return props.url;
  }
});
</script>

<template>
  <article class="rounded-lg border-2 border-gray-200 bg-white p-4 transition-shadow hover:shadow-md focus-within:ring-2 focus-within:ring-hana-red/40">
    <a
      :href="url"
      target="_blank"
      rel="noopener noreferrer"
      class="block text-lg font-bold text-hana-red hover:underline focus:outline-none"
    >
      {{ title }}
    </a>
    
    <span class="mt-1 block text-sm text-gray-600">{{ displayUrl }}</span>
    
    <p class="mt-2 text-base text-gray-900 line-clamp-3">
      {{ description }}
    </p>
  </article>
</template>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
