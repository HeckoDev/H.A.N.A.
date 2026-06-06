<template>
  <div class="min-h-screen">
    <!-- Skip link WCAG AAA obligatoire -->
    <a
      href="#main-content"
      class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-violet-900 focus:outline-none focus:ring-4 focus:ring-violet-300"
    >
      Aller au contenu principal
    </a>

    <slot />
  </div>
</template>
