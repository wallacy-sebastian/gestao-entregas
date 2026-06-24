# gestao-entregas

Single-page Vue 3 delivery route manager (Portuguese, browser only).

## Stack

- Vue 3 + TypeScript 6 + Vite 8
- Tailwind CSS 4 (`@import 'tailwindcss'` in `src/assets/main.css`, `@tailwindcss/vite` plugin)
- Pinia in `src/stores/delivery.ts` — domain state and business logic; persistence and UI state in composables
- No router, no tests, no SSR

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | Vite dev server (vue-devtools enabled in dev) |
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
  main.ts                          — createApp + Pinia + mount (imports main.css & transitions.css)
  App.vue                          — wires composables to components
  stores/delivery.ts               — Pinia store: types, state, business logic
  assets/
    main.css                       — @import 'tailwindcss', @custom-variant dark
    transitions.css                — Vue <Transition> classes (backdrop, dialog, panel-content, toast)
  utils/
    format.ts                      — date/number formatting, day-of-week constants
    persistence.ts                 — localStorage read/write
    validation.ts                  — form validation, duplicate name detection
  composables/
    useDeliveryActions.ts          — orchestrator wiring store ↔ UI state
    useUIState.ts                  — panel/modal/dialog state (not persisted)
    useNotification.ts             — module-level refs consumed by ToastNotification.vue
    useDarkMode.ts                 — dark mode toggle (localStorage + system pref)
    useAnimationToggle.ts          — animation toggle (localStorage)
    useBodyScrollLock.ts           — modal body scroll lock
    useFocusTrap.ts                — keyboard focus trapping for dialogs
    useCopy.ts                     — clipboard copy with feedback
  components/
    ActionButtons.vue
    AddDeliveryModal.vue
    NewListModal.vue
    ConfirmNewListDialog.vue
    ConfirmRemoveDeliveryDialog.vue
    DeliveryList.vue
    DeliveryInfoPanel.vue
    DeliveryInfoList.vue
    DeliveryInfoReport.vue
    ToastNotification.vue
    ResolveDuplicateDialog.vue
    DeliveryAttributeToggle.vue
    DeliveryEmptyState.vue
    IconSprite.vue
```

## Conventions

- `<script setup lang="ts">` in all SFCs
- No semicolons, single quotes, 100-char print width (Prettier)
- `@/` alias for `src/` (Vite + tsconfig)
- Base URL: `/gestao-entregas/`
- `Delivery`, `DeliveryFormData` types in `src/stores/delivery.ts`
- `noUncheckedIndexedAccess` enabled in `tsconfig.app.json` (array lookups return `T | undefined`)

## Developer workflow

1. `npm run dev`
2. `npm run lint` before commits
3. `npm run type-check`
4. `npm run build` → output in `dist/`

## Gotchas

- All business logic lives **in the Pinia store**, not in components. Components call through `useDeliveryActions` orchestrator.
- Store does NOT touch the DOM — side effects go through `useNotification` (module-level refs) which `ToastNotification.vue` watches (3200ms auto-dismiss).
- Duplicate name resolution opens `ResolveDuplicateDialog.vue` (auto-shown when `store.duplicataPendente` is set).
- localStorage keys: `delivery_list`, `delivery_date`, `delivery_limit` (persistence), `delivery_dark_mode` (dark mode), `delivery_animations` (animation toggle).
- `vue-tsc --build` uses tsconfig project references (`tsconfig.app.json` + `tsconfig.node.json`). Build info in `node_modules/.tmp/`.
- Node `^20.19.0 \|\| >=22.12.0`.
