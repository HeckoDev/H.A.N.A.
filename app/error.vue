<script setup lang="ts">
const props = defineProps<{
  error: {
    statusCode: number;
    message: string;
  };
}>();

const { t } = useI18n();

function handleClear() {
  clearError({ redirect: '/' });
}
</script>

<template>
  <NuxtLayout>
    <main id="main-content" class="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <h1 class="mb-4 text-6xl font-black text-hana-red">
        {{ props.error.statusCode }}
      </h1>
      <p class="mb-8 text-xl text-gray-700">
        {{ props.error.message }}
      </p>
      <button
        class="rounded-full bg-hana-red px-8 py-3 font-medium text-white transition-opacity hover:opacity-90 focus:outline-none focus:ring-4 focus:ring-hana-red/40"
        @click="handleClear"
      >
        {{ t('error.back_home') || "Retour à l'accueil" }}
      </button>
    </main>
  </NuxtLayout>
</template>
