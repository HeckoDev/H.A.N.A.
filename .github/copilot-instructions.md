# HANA — Copilot Instructions

**HANA** (Hecko Accessible Navigation Assistant) est un moteur de recherche web
accessible WCAG AAA, minimaliste, conçu pour les seniors et personnes en situation de handicap.

---

## 🛠️ Stack technique

- **Framework** : Nuxt 4 (Vue 3 + TypeScript strict)
- **CSS** : Tailwind CSS (utility-first)
- **API Recherche** : Tavily (proxy serveur Nuxt)
- **Tests a11y** : axe-core + Vitest
- **Déploiement** : Vercel

---

## 📁 Structure des dossiers

```
app/
├── components/
│   ├── atoms/          # Éléments de base : bouton, input, icône
│   ├── molecules/      # Combinaisons : SearchBar, ResultItem
│   └── organisms/      # Blocs complets : SearchResults, Pagination
├── composables/        # Logique réutilisable : useSearch, useTheme, useFontSize
├── pages/              # Routes Nuxt : index.vue, search.vue
├── layouts/            # Layouts globaux : default.vue
└── utils/              # Fonctions utilitaires pures
server/
└── api/
    └── search.get.ts   # Proxy Tavily (ne jamais exposer la clé côté client)
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

Composables prévus :

- `useSearch(query)` — appel API, état chargement, résultats
- `useTheme()` — bascule dark/light, persistance localStorage
- `useFontSize()` — tailles A/A+/A++, persistance localStorage
- `useAnnouncer()` — annonces aria-live pour les lecteurs d'écran

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
| **Atoms**     | `components/atoms/`     | `BaseButton.vue`, `BaseInput.vue`, `BaseIcon.vue` |
| **Molecules** | `components/molecules/` | `SearchBar.vue`, `SearchResultItem.vue`           |
| **Organisms** | `components/organisms/` | `SearchResults.vue`, `Pagination.vue`             |

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

## ♿ Règles d'accessibilité (WCAG AAA) — non négociables

1. **Jamais `outline: none`** — personnaliser le focus mais toujours visible
2. **Chaque `<input>` a un `<label>`** — pas de placeholder seul
3. **`role="search"`** sur tous les formulaires de recherche
4. **`aria-live="polite"`** pour annoncer les résultats et états de chargement
5. **Boutons ≥ 44×44px** (WCAG 2.5.5)
6. **Contraste ≥ 7:1** (WCAG AAA) — vérifier avec WebaIM Contrast Checker
7. **`lang="fr"`** sur `<html>`, titres de page dynamiques via `useSeoMeta()`
8. **Icônes décoratives** : `aria-hidden="true"` ; icônes fonctionnelles : `aria-label`
9. **Skip link** en premier élément du DOM : `<a href="#main-content">Aller au contenu</a>`
10. **Mode sombre/clair** : détection automatique + bouton de bascule avec `aria-pressed`

---

## 📝 Conventions de code

- **`<script setup lang="ts">`** obligatoire sur tous les composants Vue
- **TypeScript strict** — pas de `any`, pas de `@ts-ignore`
- **Imports triés** par `eslint-plugin-simple-import-sort`
- **Nommage** :
  - Composants : `PascalCase` (ex. `SearchBar.vue`)
  - Composables : `camelCase` préfixé `use` (ex. `useSearch.ts`)
  - Repositories : `camelCase` suffixé `Repository` (ex. `searchRepository.ts`)
- **Commits** : format Conventional Commits (`feat:`, `fix:`, `a11y:`, `refactor:`)
- **CSS** : Tailwind uniquement — pas de CSS inline, pas de `<style scoped>` sauf exceptions justifiées

---

## 🚫 Ce que Copilot ne doit pas faire

- Ajouter des fonctionnalités non demandées (widgets, news, suggestions auto non accessibles)
- Utiliser `document.querySelector` au lieu des refs Vue
- Créer des composants sans attributs ARIA appropriés
- Exposer la clé API Tavily côté client
- Supprimer ou contourner les hooks Husky/ESLint
- Utiliser `any` en TypeScript
- Ajouter copilot en colaborateur dans les commits ou PRs
