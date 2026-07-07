# H.A.N.A. — Hecko Accessible Navigation Assistant

**HANA** est un moteur de recherche web accessible WCAG AAA, minimaliste et optimisé pour les seniors.

[![Tests CI](https://github.com/HeckoDev/H.A.N.A./workflows/CI/badge.svg)](https://github.com/HeckoDev/H.A.N.A./actions)
[![Coverage](https://img.shields.io/badge/coverage-96.95%25-brightgreen)](./coverage)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)

---

## 🌟 Fonctionnalités

- ✅ **Accessibilité WCAG AAA** : Navigation clavier complète, support lecteurs d'écran, contraste 7:1
- ✅ **Moteur de recherche Tavily** : API de recherche sémantique avec résultats pertinents
- ✅ **Interface minimaliste** : Design épuré, sans distractions, optimisé pour les seniors
- ✅ **Internationalisation** : Support français et anglais avec `nuxt/i18n`
- ✅ **Responsive Design** : Optimisé mobile, tablette et desktop
- 🚧 **Thème clair/sombre** : Détection automatique + bascule manuelle (à venir)
- 🚧 **Taille de police** : A/A+/A++ avec persistance localStorage (à venir)
- 🚧 **Pagination** : Navigation entre les pages de résultats (à venir)

---

## 🛠️ Stack technique

| Catégorie | Technologies |
|-----------|-------------|
| **Framework** | Nuxt 4 (Vue 3 + TypeScript strict) |
| **CSS** | Tailwind CSS (utility-first) |
| **API Recherche** | Tavily (proxy serveur Nuxt) |
| **Tests unitaires** | Vitest + Vue Test Utils + Testing Library |
| **Tests E2E** | Playwright (Chromium, Firefox, WebKit) |
| **Linting/Format** | Biome (remplace ESLint + Prettier) |
| **CI/CD** | GitHub Actions (lint, tests, SonarCloud) |
| **Déploiement** | Vercel (à configurer) |
| **i18n** | `@nuxtjs/i18n` (fr, en) |

---

## 📊 Tests et Couverture

### Tests unitaires (Vitest)
- **201 tests** passent avec **96.95% de couverture** (lines)
- Seuil minimum : **80%** (lines, functions, branches, statements)
- Tests pour tous les composables (`useSearch`, `useTheme`, `useFontSize`)
- Tests pour tous les composants (atoms, molecules, organisms)

```bash
npm run test              # Lancer les tests une fois
npm run test:watch        # Mode watch (HMR)
npm run test:coverage     # Avec rapport de couverture
npm run test:ui           # Interface UI Vitest
```

### Tests E2E (Playwright)
- **38 tests** passent sur Chromium, Firefox et WebKit
- Tests de navigation clavier, ARIA, lecteurs d'écran
- Tests du flux de recherche complet
- Tests d'accessibilité WCAG AAA

```bash
npm run test:e2e          # Lancer les tests E2E
npm run test:e2e:ui       # Interface UI Playwright
npm run test:e2e:headed   # Mode navigateur visible
npm run test:e2e:debug    # Mode debug
npm run test:e2e:report   # Rapport HTML
```

---

## 📁 Architecture des dossiers

```
H.A.N.A./
├── .github/
│   ├── workflows/
│   │   ├── ci.yml              # Pipeline CI/CD (lint, tests, SonarCloud)
│   │   └── playwright.yml      # Tests E2E Playwright (à intégrer)
│   └── copilot-instructions.md # Instructions pour GitHub Copilot
├── app/
│   ├── components/
│   │   ├── atoms/              # BaseButton, BaseInput, BaseIcon, BaseSpinner
│   │   ├── molecules/          # SearchBar, SearchResultItem, ThemeToggle, FontSizeSelector
│   │   └── organisms/          # SearchResults, ErrorBanner, PaginationNav
│   ├── composables/            # useSearch, useTheme, useFontSize
│   ├── pages/                  # index.vue, search.vue
│   ├── layouts/                # default.vue
│   └── utils/                  # Fonctions utilitaires pures
├── server/
│   └── api/
│       └── search.get.ts       # Proxy Tavily API
├── tests/
│   ├── unit/                   # 201 tests unitaires (Vitest)
│   │   ├── components/         # Tests des composants
│   │   └── composables/        # Tests des composables
│   └── e2e/                    # 38 tests E2E (Playwright)
│       ├── home-page.spec.ts
│       ├── search-flow.spec.ts
│       ├── accessibility.spec.ts
│       └── future/             # Tests pour fonctionnalités futures
├── i18n/
│   └── locales/
│       ├── fr.json             # Traductions françaises
│       └── en.json             # Traductions anglaises
├── coverage/                   # Rapports de couverture
├── playwright.config.ts        # Configuration Playwright
├── vitest.config.ts            # Configuration Vitest
├── biome.json                  # Configuration Biome
├── nuxt.config.ts              # Configuration Nuxt
├── tailwind.config.ts          # Configuration Tailwind
└── package.json                # Dépendances et scripts
```

---

## 🚀 Démarrage rapide

### Prérequis
- Node.js 22.12+ ou 24.11+ ou 26+ (pour Nuxt 4)
- npm 9+ ou pnpm 8+ ou yarn 3+

### Installation

```bash
# Cloner le repo
git clone https://github.com/HeckoDev/H.A.N.A..git
cd H.A.N.A.

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env
# Ajouter TAVILY_API_KEY dans .env

# Lancer le serveur de développement
npm run dev
```

Le serveur démarre sur **http://localhost:3000**

---

## 📜 Scripts disponibles

### Développement
```bash
npm run dev           # Serveur de développement (port 3000)
npm run build         # Build de production
npm run preview       # Aperçu du build de production
```

### Tests
```bash
npm run test              # Tests unitaires (Vitest)
npm run test:watch        # Tests en mode watch
npm run test:coverage     # Tests avec couverture
npm run test:ui           # Interface UI Vitest

npm run test:e2e          # Tests E2E (Playwright)
npm run test:e2e:ui       # Interface UI Playwright
npm run test:e2e:headed   # Tests E2E navigateur visible
npm run test:e2e:debug    # Mode debug Playwright
npm run test:e2e:report   # Rapport HTML Playwright
```

### Qualité de code
```bash
npm run lint              # Lint avec Biome
npm run lint:fix          # Lint et fix automatique
npm run format            # Check formatage
npm run format:write      # Formater le code
npm run check             # Lint + format check
npm run fix:all           # Lint + format fix
npm run fix:unsafe        # Fix avec transformations unsafe
```

---

## 🎨 Design Patterns utilisés

### 1. Composable Pattern
Toute logique réutilisable dans des composables `useXxx()` :
- `useSearch()` — API Tavily, état de chargement, gestion d'erreurs
- `useTheme()` — Bascule dark/light, persistance localStorage
- `useFontSize()` — Tailles A/A+/A++, persistance, cross-tab sync

### 2. Repository Pattern
Appels API isolés dans `/app/repositories/` :
- `searchRepository.ts` — Interface avec l'API Tavily

### 3. Atomic Design
Composants organisés en 3 niveaux :
- **Atoms** : BaseButton, BaseInput, BaseIcon, BaseSpinner
- **Molecules** : SearchBar, SearchResultItem, ThemeToggle
- **Organisms** : SearchResults, ErrorBanner, PaginationNav

### 4. Proxy Server Pattern
Clé API **jamais exposée** côté client. Toutes les routes API dans `/server/api/`.

---

## ♿ Accessibilité (WCAG 2.2 AA/AAA)

### Conformité WCAG
- ✅ **Niveau AA** : Contraste 4.5:1, navigation clavier, landmarks ARIA
- ✅ **Niveau AAA** : Contraste 7:1, boutons 44×44px, tailles de police réglables

### Fonctionnalités d'accessibilité
- Skip link en premier élément du DOM
- `role="search"` sur le formulaire de recherche
- Labels sur tous les inputs (visibles ou `sr-only`)
- `aria-live` pour annoncer les états de chargement
- Navigation clavier complète (Tab, Shift+Tab, Enter, Space, Escape)
- Indicateurs de focus visibles (ring Tailwind)
- Landmarks sémantiques (`<main>`, `<header>`, `<nav>`)
- Hiérarchie de headings correcte (h1 → h2 → h3)
- `aria-hidden="true"` sur éléments décoratifs
- Support lecteurs d'écran (NVDA, JAWS, VoiceOver)

### Tests d'accessibilité
- **22 tests E2E** de navigation clavier et ARIA
- Tests automatisés avec Playwright
- Validation manuelle avec lecteurs d'écran

---

## 🌍 Internationalisation (i18n)

Support de 2 langues via `@nuxtjs/i18n` :
- **Français** (fr) — langue par défaut
- **Anglais** (en)

Tous les textes utilisent des clés i18n (`t('key')`). Les traductions sont dans `i18n/locales/`.

---

## 🔒 Sécurité

- ✅ Clé API Tavily **jamais exposée** côté client
- ✅ Variables d'environnement dans `.env` (non versionnées)
- ✅ Proxy serveur Nuxt pour toutes les API externes
- ✅ Pas de secrets dans le code source
- ✅ SonarCloud scan activé dans la CI/CD

---

## 🤝 Contribution

### Workflow Git
1. Créer une branche depuis `develop` : `git checkout -b feat/ma-feature`
2. Développer et commiter (format Conventional Commits)
3. Pousser et créer une Pull Request vers `develop`
4. Attendre la validation CI (lint, tests, couverture)
5. Merge après review

### Conventional Commits
```
feat: Nouvelle fonctionnalité
fix: Correction de bug
a11y: Amélioration d'accessibilité
refactor: Refactoring sans changement de comportement
test: Ajout ou modification de tests
docs: Documentation
chore: Tâches de maintenance
```

### Standards de qualité
- ✅ Tous les tests doivent passer (unitaires + E2E)
- ✅ Couverture ≥ 80% (seuil obligatoire)
- ✅ Lint Biome sans erreur
- ✅ Accessibilité WCAG AA minimum
- ✅ TypeScript strict (pas de `any`)

---

## 📝 Licence

MIT License - voir [LICENSE](./LICENSE)

---

## 👥 Auteurs

- **Hecko** — Développeur principal

---

## 🙏 Remerciements

- [Nuxt](https://nuxt.com) — Framework Vue.js
- [Tailwind CSS](https://tailwindcss.com) — Framework CSS
- [Tavily](https://tavily.com) — API de recherche
- [Playwright](https://playwright.dev) — Tests E2E
- [Vitest](https://vitest.dev) — Tests unitaires
- [Biome](https://biomejs.dev) — Linting et formatage
