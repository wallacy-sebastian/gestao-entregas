# gestao-entregas

Single-page Vue 3 delivery route manager (Portuguese, browser only).

## Stack

- Vue 3 + TypeScript 6 + Vite 8
- Tailwind CSS 4 (`@import 'tailwindcss'` in `src/assets/main.css`, installed as `@tailwindcss/vite` plugin)
- Pinia (`src/stores/delivery.ts` — domain state and business logic; persistence and UI state in composables)
- `vite-plugin-vue-devtools` enabled in dev
- No router, no tests, no SSR

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | Vite dev server |
| `npm run build` | `type-check` + `build-only` in parallel via `run-p` |
| `npm run build-only` | `vite build` |
| `npm run type-check` | `vue-tsc --build` (uses tsconfig project references) |
| `npm run lint` | oxlint (`--fix`) **then** ESLint (`--fix --cache`) via `run-s` |
| `npm run format` | Prettier `--write --experimental-cli src/` |

**Lint order matters** — sequential via `run-s`. Run individually:
- `npm run lint:oxlint` — Rust-based, fast
- `npm run lint:eslint` — Vue/TS rules

## Structure

```
src/
  main.ts                 — createApp + Pinia + mount
  App.vue                 — wires components to store
  stores/delivery.ts      — domain state, types, business logic only
  assets/
    main.css              — @import 'tailwindcss', @custom-variant dark
    transitions.css       — Vue <Transition> classes (backdrop, dialog, panel-content, toast)
  utils/
    format.ts             — date/number formatting, day-of-week constants
    persistence.ts        — localStorage read/write
    validation.ts         — form validation, duplicate detection
  composables/
    useDeliveryActions.ts — orchestrator wiring store ↔ UI state
    useUIState.ts         — panel/modal state and actions
    useCopy.ts            — clipboard copy with feedback
  components/
    ActionButtons.vue
    AddDeliveryModal.vue
    RemoveDeliveryModal.vue
    DeliveryList.vue
    DeliveryInfoPanel.vue
    DeliveryInfoList.vue       — delivery list display inside info panel
    DeliveryInfoReport.vue     — report stats display inside info panel
    ToastNotification.vue
    ResolveDuplicateDialog.vue
    DeliveryAttributeToggle.vue — toggles (manhã/brinde/ap) in add form
    DeliveryEmptyState.vue
    ConfirmNewListDialog.vue     — confirmation for clearing existing list
    IconSprite.vue
```

## Conventions

- `<script setup lang="ts">` in all SFCs
- No semicolons, single quotes, 100-char print width (Prettier)
- `@/` alias for `src/` (Vite + tsconfig)
- Base URL: `/gestao-entregas/`
- `Delivery`, `DeliveryFormData` types defined in `src/stores/delivery.ts`
- `noUncheckedIndexedAccess` enabled in `tsconfig.app.json` (array lookups return `T | undefined`)
- localStorage keys: `delivery_list`, `delivery_date`, `delivery_limit`

## Developer workflow

1. `npm run dev`
2. `npm run lint` before commits
3. `npm run type-check`
4. `npm run build` → output in `dist/`

## Gotchas

- All business logic lives **in the Pinia store**, not in components. Components are thin view layers.
- Store exposes reactive state only — all rendering is in Vue components (no DOM manipulation, no `innerHTML` in the store).
- Toast notifications live in `ToastNotification.vue` (watches `store.toastMessage`).
- Duplicate name resolution opens `ResolveDuplicateDialog.vue` (auto-shown when `store.pendingDuplicate` is set).
- `vue-tsc --build` uses tsconfig project references (`tsconfig.app.json` + `tsconfig.node.json`).
- Node `^20.19.0 \|\| >=22.12.0`.
