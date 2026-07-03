<script setup lang="ts">
interface Result {
  title: string;
  url: string;
  description: string;
}

interface Props {
  results: Result[];
  isLoading: boolean;
  query: string;
}

const props = defineProps<Props>();
const { t } = useI18n();
</script>

<template>
  <section aria-labelledby="results-heading" class="w-full max-w-4xl mx-auto">
    <header class="mb-6">
      <h2 id="results-heading" class="text-2xl font-bold text-gray-900">
        {{ t('search.resultsFor', { query }) }}
      </h2>
      <p v-if="!isLoading && results.length > 0" class="mt-2 text-base text-gray-600">
        {{ t('search.resultsCount', { count: results.length }) }}
      </p>
    </header>
    
    <div v-if="isLoading" class="flex justify-center py-12">
      <BaseSpinner size="lg" :label="t('search.loading')" />
    </div>
    
    <ul v-else-if="results.length > 0" class="space-y-4">
      <li v-for="(result, index) in results" :key="index">
        <SearchResultItem
          :title="result.title"
          :url="result.url"
          :description="result.description"
        />
      </li>
    </ul>
    
    <div v-else role="status" class="flex flex-col items-center gap-4 py-12 text-center">
      <BaseIcon name="alert" size="lg" class="text-gray-400" aria-hidden="true" />
      <p class="text-lg text-gray-600">
        {{ t('search.noResults', { query }) }}
      </p>
    </div>
  </section>
</template>
