# HANA — Copilot Instructions

**HANA** (Hecko Accessible Navigation Assistant) est un moteur de recherche web
accessible WCAG AAA, minimaliste, conçu pour les seniors.

---

## 🛠️ Stack technique

- **Framework** : Nuxt 4 (Vue 3 + TypeScript strict)
- **CSS** : Tailwind CSS (utility-first)
- **API Recherche** : Tavily (proxy serveur Nuxt)
- **Tests unitaires** : Vitest + Vue Test Utils (201 tests, 96.95% couverture)
- **Tests E2E** : Playwright (38 tests sur Chromium/Firefox/WebKit)
- **Linting/Format** : Biome (remplace ESLint + Prettier)
- **CI/CD** : GitHub Actions (lint, tests, SonarCloud, couverture ≥80%)
- **i18n** : `@nuxtjs/i18n` (fr, en)
- **Déploiement** : Vercel

---

## 📁 Structure des dossiers

```
app/
├── components/
│   ├── atoms/          # Éléments de base : BaseButton, BaseInput, BaseIcon, BaseSpinner
│   ├── molecules/      # SearchBar, SearchResultItem, ThemeToggle, FontSizeSelector
│   └── organisms/      # SearchResults, ErrorBanner, PaginationNav
├── composables/        # useSearch, useTheme, useFontSize
├── pages/              # index.vue, search.vue
├── layouts/            # default.vue
└── utils/              # Fonctions utilitaires pures
server/
└── api/
    └── search.get.ts   # Proxy Tavily (ne jamais exposer la clé côté client)
tests/
├── unit/               # Tests unitaires Vitest (201 tests)
│   ├── components/     # Tests des composants
│   └── composables/    # Tests des composables
└── e2e/                # Tests E2E Playwright (38 tests)
    ├── home-page.spec.ts
    ├── search-flow.spec.ts
    ├── accessibility.spec.ts
    └── future/         # Tests pour fonctionnalités futures
```

---

## 🧩 Design Patterns à respecter

### 1. Composable Pattern

Toute logique réutilisable ou avec état doit être dans un composable `useXxx()`.

```ts
// ✅ Correct
const { results, isLoading, search } = useSearch();

// ❌ Interdit — logique dans le composant
const results = ref([]);
async function search(q: string) {
  /* ... */
}
```

Composables implémentés :

- `useSearch()` — appel API Tavily, état chargement, gestion d'erreurs
- `useTheme()` — bascule dark/light, persistance localStorage, cross-tab sync
- `useFontSize()` — tailles A/A+/A++, persistance localStorage, cross-tab sync

### 2. Repository Pattern

Les appels API sont isolés dans `/app/repositories/`. Les composables consomment
les repositories, jamais `$fetch` directement dans les composants.

```ts
// app/repositories/searchRepository.ts
export const searchRepository = {
  async search(query: string, page = 1): Promise<SearchResponse> {
    return $fetch('/api/search', { query: { q: query, page } });
  },
};

// app/composables/useSearch.ts
import { searchRepository } from '~/repositories/searchRepository';

export function useSearch() {
  const results = ref<SearchResult[]>([]);
  const isLoading = ref(false);

  async function search(query: string) {
    isLoading.value = true;
    try {
      const data = await searchRepository.search(query);
      results.value = data.results;
    } finally {
      isLoading.value = false;
    }
  }

  return { results, isLoading, search };
}
```

### 3. Atomic Design

Les composants sont organisés en trois niveaux :

| Niveau        | Dossier                 | Exemples                                          |
| ------------- | ----------------------- | ------------------------------------------------- |
| **Atoms**     | `components/atoms/`     | `BaseButton.vue`, `BaseInput.vue`, `BaseIcon.vue`, `BaseSpinner.vue` |
| **Molecules** | `components/molecules/` | `SearchBar.vue`, `SearchResultItem.vue`, `ThemeToggle.vue`, `FontSizeSelector.vue` |
| **Organisms** | `components/organisms/` | `SearchResults.vue`, `ErrorBanner.vue`, `PaginationNav.vue` |

Les atoms ne dépendent d'aucun autre composant. Les molecules assemblent des atoms.
Les organisms assemblent des molecules.

### 4. Proxy Server Pattern

**Toujours** passer par une route `/server/api/` pour les appels externes.
La clé `TAVILY_API_KEY` ne doit **jamais** apparaître côté client.

```ts
// ✅ server/api/search.get.ts
export default defineEventHandler(async event => {
  const config = useRuntimeConfig();
  // config.tavilyApiKey est disponible UNIQUEMENT côté serveur
});

// ❌ Interdit — appel direct depuis un composant
const data = await $fetch('https://api.tavily.com/search', {
  body: { api_key: 'tvly-...' }, // clé exposée !
});
```

---

## ♿ Règles d'accessibilité (WCAG 2.2 AA/AAA) — non négociables

### Standards obligatoires

1. **Jamais `outline: none`** — personnaliser le focus mais toujours visible
2. **Chaque `<input>` a un `<label>`** — pas de placeholder seul
3. **`role="search"`** sur tous les formulaires de recherche
4. **`aria-live="polite"`** pour annoncer les résultats et états de chargement
5. **Boutons ≥ 44×44px** (WCAG 2.5.5 AAA)
6. **Contraste ≥ 7:1** (WCAG AAA) — vérifier avec WebAIM Contrast Checker
7. **`lang="fr"`** sur `<html>`, titres de page dynamiques via `useSeoMeta()`
8. **Icônes décoratives** : `aria-hidden="true"` ; icônes fonctionnelles : `aria-label`
9. **Skip link** en premier élément du DOM : `<a href="#main-content">Aller au contenu</a>`
10. **Landmarks sémantiques** : `<main>`, `<header>`, `<nav>`, `<footer>`

### Navigation clavier

- **Tab** : Focus sur l'élément interactif suivant
- **Shift+Tab** : Focus sur l'élément interactif précédent
- **Enter** : Activer un bouton ou lien
- **Space** : Activer un bouton (pas sur les liens)
- **Escape** : Fermer un modal/dialog

### ARIA Best Practices

- Préférer le HTML sémantique à ARIA : `<button>` plutôt que `<div role="button">`
- Tous les éléments interactifs doivent avoir un nom accessible
- Les états dynamiques utilisent `aria-live` ou `role="status"`/`role="alert"`
- Pas de `aria-hidden="true"` sur des éléments focusables
- Les icônes SVG décoratives ont `aria-hidden="true"`

---

## 🧪 Tests — Standards et patterns

### Tests unitaires (Vitest)

**Couverture actuelle** : 201 tests, 96.95% (lines), 92.17% (functions), 95.23% (branches)

**Seuils obligatoires** (dans `vitest.config.ts`) :
```ts
coverage: {
  lines: 80,
  functions: 80,
  branches: 80,
  statements: 80,
}
```

**Patterns de test** :

#### Composables avec lifecycle hooks
```ts
import { mount } from '@vue/test-utils';
import { defineComponent, h } from 'vue';

const TestComponent = defineComponent({
  setup() {
    return useFontSize();
  },
  render() {
    return h('div');
  },
});

const wrapper = mount(TestComponent);
expect(wrapper.vm.fontSize.value).toBe('normal');
```

#### Composants avec i18n
```ts
import { createI18n } from 'vue-i18n';

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: { en: {} },
});

const wrapper = mount(ErrorBanner, {
  props: { message: 'Error occurred' },
  global: { plugins: [i18n] },
});
```

#### Composables mockés
```ts
vi.mock('~/composables/useFontSize', () => ({
  useFontSize: () => ({
    fontSize: ref('normal'),
    setFontSize: mockSetFontSize,
  }),
}));
```

### Tests E2E (Playwright)

**Couverture actuelle** : 38 tests sur Chromium, Firefox, WebKit

**Configuration** : Locale `fr-FR`, timezone `Europe/Paris`, serveur Nuxt auto-start

**Sélecteurs prioritaires** :
1. `getByRole('button', { name: /rechercher/i })` — Rôle ARIA + nom accessible
2. `getByPlaceholder(/posez une question/i)` — Placeholder visible
3. `getByText(/texte visible/i)` — Texte visible
4. `locator('selector')` — Sélecteur CSS en dernier recours

**Structure de test** :
```ts
test.describe('Feature', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should do something', async ({ page }) => {
    const element = page.getByRole('button', { name: /click/i });
    await element.click();
    await expect(page).toHaveURL(/success/);
  });
});
```

---

## 📝 Conventions de code

### TypeScript

- **`<script setup lang="ts">`** obligatoire sur tous les composants Vue
- **TypeScript strict** — pas de `any`, pas de `@ts-ignore`
- Les refs sont typées : `ref<string>('value')` ou `ref('')` (inféré)
- Les props utilisent `defineProps<Props>()` avec interface

### Nommage

- **Composants** : `PascalCase` (ex. `SearchBar.vue`)
- **Composables** : `camelCase` préfixé `use` (ex. `useSearch.ts`)
- **Repositories** : `camelCase` suffixé `Repository` (ex. `searchRepository.ts`)
- **Types/Interfaces** : `PascalCase` (ex. `SearchResult`, `Props`)

### Commits

Format **Conventional Commits** :
```
feat: Nouvelle fonctionnalité
fix: Correction de bug
a11y: Amélioration d'accessibilité
refactor: Refactoring sans changement de comportement
test: Ajout ou modification de tests
docs: Documentation
chore: Tâches de maintenance
perf: Amélioration de performance
ci: Modification CI/CD
```

### CSS

- **Tailwind uniquement** — pas de CSS inline, pas de `<style scoped>` sauf exceptions justifiées
- Classes utilitaires Tailwind pour tous les styles
- Couleurs du thème dans `tailwind.config.ts`
- Responsive avec préfixes : `md:`, `lg:`, `xl:`
- Dark mode avec `dark:` (quand implémenté)

---

## 🔧 Linting et formatage (Biome)

### Configuration Biome

Biome remplace ESLint + Prettier. Configuration dans `biome.json`.

**Règles spéciales** :
- `noUnusedImports: "off"` pour les fichiers `.vue` (Biome ne détecte pas les composants utilisés dans `<template>`)
- `noConsole: "warn"` (autorisé en dev, désactivé dans les tests)

### Scripts

```bash
npm run lint              # Vérifier le code
npm run lint:fix          # Fix automatique
npm run format            # Check formatage
npm run format:write      # Formater le code
npm run fix:all           # Lint + format
npm run fix:unsafe        # Avec transformations unsafe
```

### Hooks Git (Husky + lint-staged)

- **Pre-commit** : Lint + format automatique sur les fichiers staged
- **Commit-msg** : Validation du format Conventional Commits

---

## 🚀 CI/CD (GitHub Actions)

### Pipeline CI (`.github/workflows/ci.yml`)

Jobs parallèles :
1. **build-test** : Build Nuxt + tests unitaires avec couverture
2. **biome_lint** : Lint Biome
3. **biome_format** : Check formatage Biome
4. **test_unit** : Tests unitaires avec seuil de couverture ≥80%
5. **sonarcloud** : Analyse SonarCloud (qualité, sécurité, dette technique)

**Déclencheurs** :
- Push sur `main` ou `develop`
- Pull Request vers `main` ou `develop`

**Artifacts** :
- Rapports de couverture (text, json, html, lcov)
- Upload Codecov (optionnel)

---

## 🚫 Ce que Copilot ne doit PAS faire

### Interdictions strictes

1. ❌ Ajouter des fonctionnalités non demandées (widgets, news, suggestions auto non accessibles)
2. ❌ Utiliser `document.querySelector` au lieu des refs Vue
3. ❌ Créer des composants sans attributs ARIA appropriés
4. ❌ Exposer la clé API Tavily côté client
5. ❌ Supprimer ou contourner les hooks Husky/lint-staged
6. ❌ Utiliser `any` en TypeScript
7. ❌ Ajouter du CSS inline ou `<style scoped>` sans justification
8. ❌ Ignorer les seuils de couverture (≥80%)
9. ❌ Créer des composants non testables
10. ❌ Supprimer des imports utilisés dans les templates Vue (Biome ne les détecte pas)

### Bonnes pratiques obligatoires

1. ✅ Tous les nouveaux composants doivent avoir des tests unitaires
2. ✅ Tous les nouveaux composables doivent avoir des tests unitaires
3. ✅ Toute nouvelle fonctionnalité UI doit avoir des tests E2E
4. ✅ Respecter l'architecture Atomic Design (atoms/molecules/organisms)
5. ✅ Utiliser les composables existants avant d'en créer de nouveaux
6. ✅ Valider l'accessibilité avec les tests E2E Playwright
7. ✅ Documenter les fonctions complexes avec JSDoc
8. ✅ Préfixer les fonctions utilitaires avec leur intention (ex: `formatDate`, `validateEmail`)

---

## 📚 Ressources

- [Nuxt 4 Documentation](https://nuxt.com/docs)
- [Vue 3 Documentation](https://vuejs.org/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Vitest](https://vitest.dev/)
- [Playwright](https://playwright.dev/)
- [Biome](https://biomejs.dev/)
- [WCAG 2.2 Quick Reference](https://www.w3.org/WAI/WCAG22/quickref/)
- [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [Tavily API Documentation](https://docs.tavily.com/)
