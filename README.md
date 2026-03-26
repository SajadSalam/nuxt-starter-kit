# Admin Vue — Nuxt 3 Admin Starter Kit

A production-ready admin panel starter kit built with Nuxt 3, TypeScript, and the Tairo UI kit. Designed for feature-based, scalable enterprise admin applications with full Arabic/English i18n support.

---

## Table of Contents

- [Stack](#stack)
- [Installation](#installation)
- [UI Kit](#ui-kit)
- [Architecture](#architecture)
- [Features](#features)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)

---

## Stack

| Concern          | Technology                                          |
| ---------------- | --------------------------------------------------- |
| Framework        | [Nuxt 3](https://nuxt.com) — SPA mode (`ssr: false`) |
| Language         | TypeScript + Vue 3 `<script setup>`                 |
| State Management | [Pinia](https://pinia.vuejs.org) (setup-store style) |
| HTTP Client      | [Axios](https://axios-http.com) — shared instance with interceptors |
| Styling          | Tailwind CSS + Sass                                 |
| Validation       | [Vuelidate](https://vuelidate-next.netlify.app) via a custom `Validator<T>` wrapper |
| Internationalization | [vue-i18n](https://vue-i18n.intlify.dev) — Arabic & English |
| Charts           | [ApexCharts](https://apexcharts.com) via vue3-apexcharts |
| Date Picker      | vue-flatpickr-component + @vuepic/vue-datepicker    |
| Maps             | @vue-leaflet/vue-leaflet                            |
| Animations       | @vueuse/motion                                      |
| Package Manager  | [pnpm](https://pnpm.io)                             |

---

## Installation

### Option 1 — Scaffold with npx (recommended)

Use the interactive CLI to create a new project in one command:

```bash
npx nuxt-starter-kit@latest
```

The CLI will prompt you for:
- **App name** — the folder name and package name for your project
- **API base URL** — your backend REST API URL

It scaffolds the project, patches `package.json`, and writes a `.env` file automatically.

You can also pass arguments directly to skip the prompts:

```bash
npx nuxt-starter-kit my-app --api-url https://api.example.com/
```

Then start developing:

```bash
cd my-app
npm install
npm run dev
```

---

### Option 2 — Clone manually

### Prerequisites

- [Node.js](https://nodejs.org) >= 18
- [pnpm](https://pnpm.io) >= 9 (`npm install -g pnpm`)

```bash
# 1. Clone the repository
git clone <repo-url>
cd admin-vue

# 2. Set up environment variables
cp .env.example .env
# Edit .env and set VITE_BASE_URL to your API base URL

# 3. Install dependencies
pnpm install

# 4. Start the development server
pnpm dev
```

The app will be available at `http://localhost:3000`.

### Build for Production

```bash
pnpm build
```

### Preview Production Build

```bash
pnpm preview
```

### Other Commands

```bash
pnpm generate    # Static site generation
pnpm clean       # Clean Nuxt cache
pnpm lint        # Run ESLint
pnpm lint:fix    # Auto-fix lint errors
```
---
## UI Kit

This project uses **[Tairo](https://tairo.cssninja.io)** — a premium Nuxt admin UI kit loaded as Nuxt layers.

| Layer                        | Purpose                                               |
| ---------------------------- | ----------------------------------------------------- |
| `@shuriken-ui/nuxt`          | Base component library (`Base*` components, Tailwind CSS, color mode) |
| `tairo`                      | Core Tairo layer — ApexCharts adapter, color utilities |
| `tairo-layout-collapse`      | Collapsible sidebar layout (default layout used)      |
| `tairo-layout-iconnav`       | Icon-based navigation layout (available as alternative) |

**Icon set:** [Phosphor Icons](https://phosphoricons.com) — referenced as `ph:<icon>-duotone`

**Color modes:** Light / Dark, toggled via `@nuxtjs/color-mode`

**Notifications:** `@cssninja/nuxt-toaster` for toast notifications

---

## Architecture

The project follows a **feature-based modular architecture**. Each domain lives in its own isolated folder under `features/`, with a strict layer separation:

```
features/<feature>/
├── index.ts              # Table column definitions (tableHeader())
├── types/index.ts        # All TypeScript types and DTOs
├── service/index.ts      # HTTP calls only — no store imports, no toasts
├── store/index.ts        # Pinia store — state, actions, dialog flags
├── components/
│   ├── FeatureCreate.vue # Create dialog
│   └── FeatureEdit.vue   # Edit dialog
└── routes/
    └── feature.vue       # Thin route component — wires store to shared UI
```

### Layer Responsibilities

| Layer         | Rule                                                                                             |
| ------------- | ------------------------------------------------------------------------------------------------ |
| `types/`      | Define all shapes first. Everything else imports from here.                                      |
| `service/`    | HTTP only. Never import store. Never show toasts (Axios interceptor handles it automatically).   |
| `store/`      | Calls service, manages reactive state, owns dialog-open flags. Re-throws errors for form-level handling. |
| `components/` | Feature-specific dialogs and forms only. Generic UI comes from `common/components/`.             |
| `routes/`     | Thin orchestration only — no business logic.                                                     |

### Shared Axios Client

- Attaches `Authorization: Bearer <token>` and `Accept-Language` on every request automatically.
- Shows **success toasts** automatically on POST / PUT / DELETE — do not add them in service methods.
- Shows **error toasts** automatically and redirects to `/login` on 401.
- Strips `null` / `undefined` filter params automatically.

### Auth & Permissions

- JWT token stored in `localStorage` via `useAuthStore`.
- All routes are protected globally by `middleware/auth.global.ts` — no per-page setup needed.
- Permission-aware navigation: sidebar items with a `permission` field are hidden from unauthorized users.
- Check permissions anywhere: `useUserStore().hasPermission('Feature.action')`.

### Routing

- Routes are auto-registered from `features/<feature>/routes/*.vue`.
- Dynamic segments use brackets: `[id].vue` → `/feature/:id`.
- Sidebar navigation is configured in `navigation/index.ts` and wired into `app.config.ts`.

---

## Features

- **Authentication** — Login and registration flows with JWT token management.
- **Permission-based sidebar** — Navigation items shown/hidden based on user permissions.
- **Generic CRUD scaffolding** — `AppCrud` + `AppTable` + `AppCrudActions` provide a full CRUD page with minimal boilerplate.
- **Data table** — Sortable columns, column visibility toggle, multi-row selection, skeleton loading, empty state, and striped rows.
- **Form validation** — Typed `Validator<T>` class wrapping Vuelidate with support for server-side field errors.
- **Multi-language forms** — `AppInputMultiLang` / `AppTextAreaMultiLang` for Arabic + English input in a single field.
- **File uploads** — `AppFileUploaderButton` and chunked upload support.
- **Autocomplete fields** — API-backed combobox with search-on-type.
- **Map field** — Interactive map input via Leaflet.
- **Charts** — ApexCharts integration via `ChartCard` wrapper and `useApexCharts` composable.
- **i18n** — Full Arabic (RTL) and English (LTR) support via vue-i18n.
- **Dark / Light mode** — System-aware color mode toggle.
- **Toast notifications** — Success, error, and info toasts auto-triggered by the Axios interceptor.
- **Pagination** — `BasePagination` component wired to store filters.
- **Breadcrumbs** — `AppBreadcrumb` component auto-populated from route meta.

---

## Environment Variables

Copy `.env.example` to `.env` and fill in the values:

| Variable           | Description                                 | Example                              |
| ------------------ | ------------------------------------------- | ------------------------------------ |
| `VITE_BASE_URL`    | Base URL of the backend REST API            | `https://api.example.com/`           |
| `VITE_APP_VERSION` | Application version string                  | `0.1.0`                              |

---

## Project Structure

```
admin-vue/
│
├── nuxt.config.ts            # Nuxt config — layers, Pinia, i18n, Vite plugins
├── app.config.ts             # Wires navigation items into the Tairo sidebar layout
├── tailwind.config.ts
│
├── assets/                   # Global CSS, fonts, and static images
├── public/                   # Static assets served at root (favicon, logo, avatars)
│
├── middleware/
│   └── auth.global.ts        # Global auth guard — redirects to /login if no token
│
├── navigation/
│   └── index.ts              # Sidebar menu items array
│
├── common/                   # All shared / reusable code
│   ├── components/
│   │   ├── app-chart/        # ChartCard wrapper (ApexCharts)
│   │   ├── app-crud/         # CRUD page shell (AppCrud, AppCrudActions, DeleteModal)
│   │   ├── app-dialog/       # Base modal wrapper (AppDialog)
│   │   ├── app-field/        # Form field components (input, autocomplete, file, map…)
│   │   ├── app-table/        # Generic data table (AppTable, AppCard)
│   │   └── global/           # Layout-level globals (toasts, header, sidebar footer…)
│   ├── composables/          # Global composables (toaster, tailwind colors, apexcharts)
│   ├── layers/               # Tairo UI kit Nuxt layers — do not modify
│   ├── layouts/default.vue   # Default app layout
│   ├── locales/              # ar.json, en.json translation files
│   ├── plugins/              # Nuxt plugins (i18n setup)
│   ├── services/
│   │   ├── app-client/       # Axios instance with interceptors
│   │   ├── validation.ts     # Vuelidate rule factories
│   │   └── validator.ts      # Typed Validator<T> class
│   ├── stores/user.ts        # Global user store (profile, permissions)
│   └── utils/
│       └── types/            # Shared TypeScript types (ApiResponses, BaseDto, filters)
│
└── features/                 # Feature modules — one folder per domain
    ├── auth/                 # Login, register, auth store
    ├── departments/          # Departments CRUD (example feature)
    └── home/                 # Dashboard home page
```

---

## License

MIT
