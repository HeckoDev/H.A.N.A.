<script setup lang="ts">
interface Props {
  currentPage: number;
  totalPages: number;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  'page-change': [page: number];
}>();

const { t } = useI18n();

const visiblePages = computed(() => {
  const delta = 2;
  const range: number[] = [];

  for (
    let i = Math.max(2, props.currentPage - delta);
    i <= Math.min(props.totalPages - 1, props.currentPage + delta);
    i++
  ) {
    range.push(i);
  }

  if (props.currentPage - delta > 2) range.unshift(-1);
  if (props.currentPage + delta < props.totalPages - 1) range.push(-1);

  range.unshift(1);
  if (props.totalPages > 1) range.push(props.totalPages);

  return range;
});

function goToPage(page: number) {
  if (page !== props.currentPage && page >= 1 && page <= props.totalPages) {
    emit('page-change', page);
  }
}
</script>

<template>
  <nav :aria-label="t('pagination.label')" class="flex items-center justify-center gap-2">
    <BaseButton
      variant="secondary"
      size="sm"
      :disabled="currentPage === 1"
      :aria-label="t('pagination.previous')"
      @click="goToPage(currentPage - 1)"
    >
      <BaseIcon name="chevron-left" aria-hidden="true" />
      <span class="sr-only">{{ t('pagination.previous') }}</span>
    </BaseButton>
    
    <ol class="flex gap-1">
      <li v-for="(page, index) in visiblePages" :key="index">
        <span
          v-if="page === -1"
          aria-hidden="true"
          class="flex h-11 w-11 items-center justify-center text-gray-400"
        >
          ...
        </span>
        
        <button
          v-else
          type="button"
          :aria-label="t('pagination.page', { page })"
          :aria-current="page === currentPage ? 'page' : undefined"
          :class="[
            'flex h-11 w-11 items-center justify-center rounded font-medium transition-colors',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-hana-red/40',
            page === currentPage
              ? 'bg-hana-red text-white'
              : 'bg-transparent text-gray-700 hover:bg-gray-100',
          ]"
          @click="goToPage(page)"
        >
          {{ page }}
        </button>
      </li>
    </ol>
    
    <BaseButton
      variant="secondary"
      size="sm"
      :disabled="currentPage === totalPages"
      :aria-label="t('pagination.next')"
      @click="goToPage(currentPage + 1)"
    >
      <BaseIcon name="chevron-right" aria-hidden="true" />
      <span class="sr-only">{{ t('pagination.next') }}</span>
    </BaseButton>
  </nav>
</template>
