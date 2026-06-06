<script setup lang="ts">
const { t } = useI18n();
const { query, search } = useSearch();
</script>

<template>
  <main id="main-content" class="relative flex min-h-screen flex-col bg-hana-gradient">
    <!-- Header -->
    <header class="flex items-center justify-between px-8 py-6">
      <div class="flex items-center gap-3">
        <span class="text-4xl" role="img" :aria-label="t('nav.logo_alt')">🔍</span>
        <div class="leading-tight">
          <span class="text-xl font-black tracking-widest text-white">{{ t('nav.acronym') }}</span>
          <p class="text-xs font-medium text-white/70">{{ t('nav.full_name') }}</p>
        </div>
      </div>

      <!-- Sélecteur de langue -->
      <NuxtLinkLocale
        :to="{ name: 'index' }"
        :locale="$i18n.locale === 'fr' ? 'en' : 'fr'"
        class="flex items-center gap-2 rounded-full border border-white/30 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10 focus:outline-none focus:ring-4 focus:ring-white/40"
        :aria-label="t('nav.switch_lang')"
      >
        <span aria-hidden="true">{{ $i18n.locale === 'fr' ? '🇬🇧' : '🇫🇷' }}</span>
        {{ t('nav.switch_lang') }}
      </NuxtLinkLocale>
    </header>

    <!-- Hero -->
    <section
      class="flex flex-1 flex-col items-center justify-center px-6 pb-24 text-center"
      aria-labelledby="hero-title"
    >
      <h1
        id="hero-title"
        class="mb-10 max-w-3xl text-5xl font-black leading-tight tracking-tight text-white md:text-6xl"
      >
        {{ t('home.title') }}
      </h1>

      <form role="search" class="w-full max-w-2xl" :aria-label="t('home.search_label')" @submit.prevent="search">
        <label for="search-input" class="sr-only">{{ t('home.search_label') }}</label>
        <div class="relative">
          <input
            id="search-input"
            v-model="query"
            type="search"
            autocomplete="off"
            :placeholder="t('home.search_placeholder')"
            class="w-full rounded-full border-0 bg-white/95 py-5 pl-7 pr-16 text-lg text-gray-900 shadow-2xl placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-white/60"
          />
          <button
            type="submit"
            :aria-label="t('home.search_button')"
            class="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-hana-red text-white transition-colors hover:opacity-90 focus:outline-none focus:ring-4 focus:ring-white/60"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2.5"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
              />
            </svg>
          </button>
        </div>
      </form>
    </section>

    <!-- Indicateur scroll -->
    <div class="absolute bottom-8 left-1/2 -translate-x-1/2" aria-hidden="true">
      <div class="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white/40 text-white/60">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  </main>
</template>
