<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import BaseIcon from '~/components/atoms/BaseIcon.vue';
import BaseSpinner from '~/components/atoms/BaseSpinner.vue';
import SearchResultItem from '~/components/molecules/SearchResultItem.vue';

interface Result {
  title: string;
  url: string;
  snippet: string;
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
  <section aria-labelledby="results-heading" class="w-full">
    <div class="w-full max-w-4xl mx-auto flex flex-col gap-6">
      <header class="mb-6">
        <h2 id="results-heading" class="text-2xl font-bold text-gray-900">
          {{ t('search.resultsFor', { query: props.query }) }}
        </h2>
        <p
          v-if="!props.isLoading && props.results.length > 0"
          class="mt-2 text-base text-gray-600"
          role="status"
          aria-live="polite"
        >
          {{ t('search.resultsCount', { count: props.results.length }) }}
        </p>
      </header>

      <div v-if="props.isLoading" class="flex justify-center py-12" role="status" aria-live="polite">
        <BaseSpinner size="lg" :label="t('search.loading')" />
      </div>

      <ol v-else-if="props.results.length > 0" class="space-y-6" role="list">
        <li v-for="result in props.results" :key="`${result.url}-${result.title}`">
          <SearchResultItem :result="result" />
        </li>
      </ol>

      <div v-else role="status" class="flex flex-col items-center gap-4 py-12 text-center">
        <BaseIcon name="alert" size="lg" class="text-gray-400" aria-hidden="true" />
        <p class="text-lg text-gray-600">
          {{ t('search.noResults', { query: props.query }) }}
        </p>
        <p class="text-base text-gray-600">
          {{ t('search.tryDifferentKeywords') }}
        </p>
      </div>
    </div>
  </section>
</template>
