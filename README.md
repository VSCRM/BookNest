# 📚 BookNest — Storefront (Frontend)

A full-stack online bookstore front end — catalog, search, cart, checkout,
order history, a saved-books wishlist, a bilingual UI (🇺🇦 UA / 🇬🇧 EN), and a
role-gated admin catalog panel.

[![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React Router](https://img.shields.io/badge/React_Router-7.17-CA4245?logo=reactrouter&logoColor=white)](https://reactrouter.com/)
[![Vite](https://img.shields.io/badge/Vite-8.0-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![Zod](https://img.shields.io/badge/Zod-4.4-3E67B1?logo=zod&logoColor=white)](https://zod.dev/)
[![Axios](https://img.shields.io/badge/Axios-1.17-5A29E4?logo=axios&logoColor=white)](https://axios-http.com/)
[![Vitest](https://img.shields.io/badge/Vitest-4.1-6E9F18?logo=vitest&logoColor=white)](https://vitest.dev/)
[![ESLint](https://img.shields.io/badge/ESLint-10-4B32C3?logo=eslint&logoColor=white)](https://eslint.org/)
[![Prettier](https://img.shields.io/badge/Prettier-3.4-F7B93E?logo=prettier&logoColor=black)](https://prettier.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

**Live demo:** [vscrm.github.io/BookNest](https://vscrm.github.io/BookNest/) —
the deployed build runs against the **real backend** (`VITE_USE_MOCK=false`),
not bundled sample data: the catalog, carts, orders, saved books, and accounts
are live records stored in a **Neon** PostgreSQL database. The backend the
build talks to is configured in `.env.production` (see
[Deployment](#️-deployment)), so the demo shows data whenever that backend is
running and reachable.

**Backend repository:** [BookNest-Backend](https://github.com/VSCRM/BookNest_backend.git)
— a Rails 7 catalog/cart/orders API plus a Spring Boot 4 auth-service, shipped
as one combined Docker image and backed by Neon (serverless PostgreSQL). See
[Running the Full Stack Locally (Docker)](#-running-the-full-stack-locally-docker)
below for how this frontend talks to it, and
[the backend's README](https://github.com/VSCRM/BookNest_backend.git#readme) for
everything that lives on the other side of the wire.

**API docs (once the backend is running locally):**
[Swagger UI — http://localhost:8080/api](http://localhost:8080/api) ·
[raw OpenAPI spec — http://localhost:8080/openapi.yaml](http://localhost:8080/openapi.yaml)

---

## Table of Contents

- [📚 BookNest — Storefront (Frontend)](#-booknest--storefront-frontend)
    - [Table of Contents](#table-of-contents)
    - [✨ Features](#-features)
    - [📸 Pages \& Routes](#-pages--routes)
    - [🚀 Tech Stack](#-tech-stack)
        - [Core](#core)
        - [Data, Validation \& Security](#data-validation--security)
        - [Testing](#testing)
        - [Dev Tooling](#dev-tooling)
    - [Quick Start](#quick-start)
    - [🐳 Running the Full Stack Locally (Docker)](#-running-the-full-stack-locally-docker)
    - [⚙️ Environment Variables](#️-environment-variables)
    - [Running the Test Suite](#running-the-test-suite)
    - [🏗️ Architecture](#️-architecture)
        - [Design principles](#design-principles)
        - [Data flow](#data-flow)
    - [Zod Runtime Validation](#zod-runtime-validation)
        - [Schema files: `src/schemas/`](#schema-files-srcschemas)
    - [🔐 Authentication](#-authentication)
    - [🌍 Internationalization — UA / EN](#-internationalization--ua--en)
    - [Security](#security)
    - [Mock Mode](#mock-mode)
    - [🏗️ Project Structure](#️-project-structure)
    - [Available Scripts](#available-scripts)
    - [☁️ Deployment](#️-deployment)
        - [How the live demo is wired](#how-the-live-demo-is-wired)
    - [📄 License](#-license)

---

## ✨ Features

- 📖 **Catalog** — a browsable, searchable, genre-filterable, price-sortable
  book grid, backed by a debounced search input.
- 🛒 **Cart & checkout** — a guest, session-based cart that seamlessly merges
  into the user's account cart on login/registration (quantities are summed
  for books present in both).
- 📦 **Orders** — order history and a per-order detail/tracking page.
- ❤️ **Saved books** — a per-account wishlist, synced with the backend.
- 👤 **Accounts** — register, log in (email/password or **Google OAuth2**),
  forgot/reset password (a 6-digit e-mail code via EmailJS), and edit
  profile.
- 🛠️ **Admin panel** — role-gated catalog management (create, edit, delete
  books, including cover-image upload) for `role === "admin"` users.
- 🌍 **Bilingual UI** — every UI string and every catalog field switches
  instantly between Ukrainian and English, with no page reload.
- 🧪 **Broad test coverage** — schemas, services, hooks, forms, and
  components all have dedicated Vitest suites.

---

## 📸 Pages & Routes

| Page            | Route              |   Auth   | Description                                               |
| --------------- | ------------------ | :------: | --------------------------------------------------------- |
| Home            | `/`                |    —     | Catalog grid · search · genre filter · price sort         |
| Search          | `/search`          |    —     | Dedicated full-text search results page                   |
| Book detail     | `/book/:id`        |    —     | Full description, cover, add to cart, save                |
| Login           | `/login`           |    —     | Email + password, or "Sign in with Google"                |
| Register        | `/register`        |    —     | Account creation with a real-time password-strength meter |
| Forgot password | `/forgot-password` |    —     | Requests a 6-digit reset code by email                    |
| Reset password  | `/reset-password`  |    —     | Enter code + set a new password                           |
| Cart            | `/cart`            |    —     | Line items, quantities, guest-cart support, checkout      |
| Orders          | `/orders`          |    ✅    | Order history                                             |
| Order detail    | `/orders/:id`      |    ✅    | Line items, status, tracking                              |
| Profile         | `/profile`         |    ✅    | Saved books · edit profile · sign out                     |
| Admin — Books   | `/admin/books`     | 🛡️ Admin | Create / edit / delete catalog entries, cover upload      |
| Not found       | `*`                |    —     | 404 fallback                                              |

> `/welcome` and `/api` are not pages of this SPA — they are the Rails
> backend's own hidden welcome page and Swagger docs. Because GitHub Pages
> can only serve static files, hitting either path here redirects the
> browser straight to the configured backend origin (`VITE_API_URL`) instead
> of 404ing.
>
> **Navigation bar shows:** Home · Search · Cart · Orders · Profile (Admin
> link only for admins). Login and Register are reachable via the account
> menu and form footer links — never shown as primary nav items.

---

## 🚀 Tech Stack

### Core

| Library                                       | Version | Purpose                                                   |
| --------------------------------------------- | :-----: | --------------------------------------------------------- |
| [React](https://react.dev/)                   |  19.2   | UI library                                                |
| [React DOM](https://react.dev/)               |  19.2   | DOM renderer for React                                    |
| [TypeScript](https://www.typescriptlang.org/) |   6.0   | Static typing, strict mode                                |
| [React Router](https://reactrouter.com/)      |  7.17   | Client-side routing, `BrowserRouter` + `basename`         |
| [Vite](https://vite.dev/)                     |   8.0   | Build tool, dev server (HMR), and API proxy for local dev |

### Data, Validation & Security

| Library                                                 | Version | Purpose                                                         |
| ------------------------------------------------------- | :-----: | --------------------------------------------------------------- |
| [Axios](https://axios-http.com/)                        |  1.17   | HTTP client — one shared instance per backend (`api.ts`)        |
| [Zod](https://zod.dev/)                                 |   4.4   | Runtime schema validation + `z.infer` type derivation           |
| [bcrypt-ts](https://github.com/GameMaker2000/bcrypt-ts) |   8.0   | Password hashing — **mock mode only** (see below)               |
| [crypto-js](https://github.com/brix/crypto-js)          |   4.2   | SHA-256 pre-hash — **mock mode only** (see below)               |
| [lucide-react](https://lucide.dev/)                     |  1.16   | Icon set, imported per-icon (tree-shaken)                       |
| [@emailjs/browser](https://www.emailjs.com/)            |   4.4   | Delivers password-reset codes by email straight from the client |

### Testing

| Library                                                                                 | Version | Purpose                                  |
| --------------------------------------------------------------------------------------- | :-----: | ---------------------------------------- |
| [Vitest](https://vitest.dev/)                                                           |   4.1   | Vite-native, Jest-compatible test runner |
| [@testing-library/react](https://testing-library.com/docs/react-testing-library/intro/) |  16.3   | Component rendering & querying           |
| [@testing-library/user-event](https://testing-library.com/docs/user-event/intro/)       |  14.6   | Realistic user interaction simulation    |
| [@testing-library/jest-dom](https://github.com/testing-library/jest-dom)                |   6.9   | Custom DOM matchers                      |
| [@testing-library/dom](https://testing-library.com/docs/dom-testing-library/intro/)     |  10.4   | Underlying DOM query engine              |
| [jsdom](https://github.com/jsdom/jsdom)                                                 |  29.1   | Browser-environment simulation for Node  |

### Dev Tooling

| Tool                                            | Version | Purpose                                                       |
| ----------------------------------------------- | :-----: | ------------------------------------------------------------- |
| [ESLint](https://eslint.org/)                   |  10.2   | Linting, with React Hooks + React Refresh plugins             |
| [Prettier](https://prettier.io/)                |   3.4   | Formatting                                                    |
| [gh-pages](https://github.com/tschaub/gh-pages) |   6.3   | Publishes `dist/` to the `gh-pages` branch (`npm run deploy`) |

---

## Quick Start

```bash
# Install dependencies
npm install

# Run the linter
npm run lint

# Start the dev server (proxies /api, /api/auth, /welcome and /rubyback to
# the local backends — see vite.config.ts)
npm run dev

# Run tests once
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with a coverage report
npm run test:coverage

# Type-check and build production assets into dist/
npm run build

# Preview the production build locally
npm run preview

# Format the codebase
npm run format

# Build and publish dist/ to the gh-pages branch
npm run deploy
```

The dev server starts at **http://localhost:5174** by default (see
`vite.config.ts`'s `server.port` — Vite's own default is `5173`, but this
project is pinned to `5174` to match the backend's CORS allow-list).

> **Full stack:** this repository is the storefront only. To exercise real
> data (catalog, cart, orders, auth), run the
> [BookNest-Backend](https://github.com/VSCRM/BookNest-Backend) stack
> alongside it (see below) — it keeps its data in Neon, so you'll need a free
> Neon database, which the backend README walks you through. Alternatively,
> set `VITE_USE_MOCK=true` to run the UI entirely against bundled sample data
> — no backend or database required. That's handy for offline UI work and
> tests; the [live demo](#-booknest--storefront-frontend) above does not use
> it.

---

## 🐳 Running the Full Stack Locally (Docker)

This repository is **frontend only**. Real data (catalog, cart, orders,
authentication) is served by two backend services that ship together as one
combined Docker image, built from the separate
[BookNest-Backend](https://github.com/VSCRM/BookNest-Backend) repository:

| Service                        | Container port | Published on (host) | Responsibility                                           |
| ------------------------------ | :------------: | :-----------------: | -------------------------------------------------------- |
| Rails app (`BookNest/backend`) |      3000      |  `localhost:8080`   | Book catalog, cart, orders, saved books, Ruby playground |
| Spring Boot `auth-service`     |      9000      |  `localhost:9000`   | Register/login, JWT sessions, Google OAuth2              |

Both backend services store their data in **Neon**, a managed PostgreSQL
service, so there is no database container to run — and the frontend never
touches the database itself, only the backend does. The backend README's
[Database & Neon Setup](https://github.com/VSCRM/BookNest-Backend#-database--neon-setup)
explains how to create the Neon project and its two databases; the tables are
then created automatically the first time the backend starts.

The backend container runs **on the same machine** as the frontend dev server and
publish their ports straight to the host, so the browser reaches them exactly
as if they were local processes:

```bash
# In the backend repo
git clone https://github.com/VSCRM/BookNest-Backend.git
cd BookNest-Backend
cp .env.example .env            # then fill in your Neon connection details, JWT secret, Google OAuth, ...
docker compose up --build --no-deps backend kafka
                                # starts the combined backend container + Kafka; the database is Neon

# In this repo (a separate terminal)
npm install
npm run dev                     # http://localhost:5174
```

With the backend up, set `VITE_USE_MOCK=false` (the default — see
`.env`) and the app talks to `http://localhost:8080` / `http://localhost:9000`
for every request:

- **In development** (`npm run dev` / `npm run preview`), Vite's own dev
  server proxies `/api`, `/api/auth`, `/welcome` and `/rubyback` to those two
  localhost ports for you — see `vite.config.ts`. The browser only ever talks
  to `http://localhost:5174`; Vite's Node process forwards the request to the
  Dockerized backend server-side, so there is no CORS step to configure
  locally.
- **`index.html`'s Content-Security-Policy** explicitly allow-lists
  `http://localhost:8080` and `http://localhost:9000` under `connect-src`
  (and `img-src`, for book covers served by Rails) — this is what lets the
  SPA fetch from and render images hosted by the two local containers in the
  first place.
- **In production**, the containers are typically published behind their own
  domains/reverse proxy instead of raw `localhost` ports; point
  `VITE_API_URL` / `VITE_AUTH_URL` in `.env.production` at those origins (see
  [Environment Variables](#️-environment-variables) and
  [Deployment](#️-deployment)).

Useful Docker commands while developing against the backend stack (run from
the **backend** repo):

```bash
docker compose up --build --no-deps backend kafka   # build (if needed) and start the backend container + Kafka (Neon is the database)
docker compose up -d --no-deps backend kafka        # same, but detached
docker compose ps              # confirm the containers are healthy
docker compose logs -f         # tail every service's logs
docker compose logs -f backend # tail just the combined Rails + auth-service container
docker compose down            # stop and remove the containers (keeps named volumes)
docker compose down -v         # stop and remove containers AND volumes (bundle cache, SQLite scratch storage) — data in Neon is untouched
```

> Don't have Docker or a Neon database, or just want to work on the UI? Set
> `VITE_USE_MOCK=true` and skip this section entirely — every page works
> against the bundled sample dataset (see [Mock Mode](#mock-mode)). The
> [live demo](#-booknest--storefront-frontend) does not use it: it runs
> against the real backend.

---

## ⚙️ Environment Variables

Copy `.env` (already committed for local development) or create your own:

```env
# "true"  -> use the bundled sample dataset (mock/bookData.ts), no backend needed
# "false" -> talk to the real BookNest backends (default)
VITE_USE_MOCK=false

# Rails backend (book catalog, cart, orders, saved books, playground)
VITE_API_URL=/api/v1

# Spring Boot backend (authentication: register/login/JWT)
VITE_AUTH_URL=/api/auth

# Root of the same Spring Boot auth-service (no /api/auth suffix). Used only
# for "Sign in with Google", which redirects the page to
# {VITE_AUTH_ROOT_URL}/oauth2/authorization/google.
VITE_AUTH_ROOT_URL=http://localhost:9000

# Artificial network delay for the mock data path only (ms)
VITE_MOCK_DELAY_MS=600

# EmailJS — password-reset code delivery. Leave blank to fall back to
# displaying the code on-screen (fine for local development).
# Get your keys at https://www.emailjs.com
VITE_EMAILJS_SERVICE_ID=
VITE_EMAILJS_TEMPLATE_ID=
VITE_EMAILJS_PUBLIC_KEY=
```

| Variable                                                   | Description                                                           |
| ---------------------------------------------------------- | --------------------------------------------------------------------- |
| `VITE_USE_MOCK`                                            | Switches between the bundled mock catalog and the real backends       |
| `VITE_API_URL`                                             | Base path/URL for the Rails catalog/cart/orders API                   |
| `VITE_AUTH_URL`                                            | Base path/URL for the Spring Boot auth REST endpoints (`/api/auth/*`) |
| `VITE_AUTH_ROOT_URL`                                       | Auth-service origin, used only for the Google OAuth2 redirect         |
| `VITE_MOCK_DELAY_MS`                                       | Simulated latency for mock mode                                       |
| `VITE_EMAILJS_SERVICE_ID` / `_TEMPLATE_ID` / `_PUBLIC_KEY` | EmailJS credentials for reset-code delivery                           |

In production (`.env.production`), `VITE_API_URL` and `VITE_AUTH_URL` should
point at your deployed backend's absolute origin; in local development
they're left as relative paths (`/api/v1`, `/api/auth`) and resolved by
Vite's dev-server proxy (see `vite.config.ts`), which forwards:

```
/api/auth  →  http://localhost:9000   (Spring Boot auth-service)
/api       →  http://localhost:8080   (Rails backend — also matches the
                                        Swagger redirect at /api)
/welcome   →  http://localhost:8080
/rubyback  →  http://localhost:8080
```

> **Note:** the Rails backend's own `/rubyback` route has actually been
> retired server-side (see the backend README) — the proxy rule above is
> kept for backward compatibility with any old bookmarked links, and simply
> forwards to Rails, which now answers with its normal 404.

A production deployment (e.g. static hosting) needs an equivalent reverse
proxy in front of the built assets, since the Vite proxy only exists for
`npm run dev` / `npm run preview`.

---

## Running the Test Suite

```bash
npm test
```

| Test area                                                                                                                | What it covers                                                                            |
| ------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------- |
| `schemas/schemas.test.ts`                                                                                                | Valid ✅ · invalid ❌ · edge cases for every Zod schema (books, cart, orders, auth, user) |
| `context/CartProvider`, `context/readLocalUser`, `context/mergePendingBook`                                              | Cart context shape, local-storage parsing, guest→account cart merge                       |
| `components/ErrorBoundary`, `components/BookCard`, `components/SortControl`, `components/Toast`, `components/ui/Spinner` | Rendering, interaction, accessibility                                                     |
| `forms/RegisterForm`, `forms/shared/FormInput`, `forms/shared/PasswordInput`                                             | Labels, validation errors, `aria-*` attributes                                            |
| `hooks/useBookActions`, `useCart`, `useSort`, `useValidation`, `useEditProfileForm`, `useLoginForm`, `useRegisterForm`   | Loading/error states, business logic, form validation                                     |
| `pages/HomePage/GenreFilter`, `pages/HomePage/homeHelpers`, `pages/ProfilePage/ProfileInfo`                              | Filtering logic, rendering                                                                |
| `i18n/LocaleContext`                                                                                                     | Provider, `setLocale`, persistence, throws outside provider                               |
| `security/csrf`, `security/inputGuard`, `security/rateLimiter`                                                           | Token handling · XSS/SQLi pattern rejection · brute-force throttling                      |
| `utils/formatDate`, `utils/hashPassword`, `utils/sanitize`, `utils/validation`                                           | Locale-aware formatting · hashing determinism · input sanitization · field validators     |

---

## 🏗️ Architecture

### Design principles

- **Single Responsibility** — every hook does one thing (`useSaveBook` saves,
  `useSearch` filters, `CardImage` renders an image).
- **Interface Segregation** — `AuthContextValue` / `CartContextValue` expose
  only what consumers actually need.
- **DRY** — shared form primitives (`FormInput`, `PasswordInput`,
  `PasswordStrengthHint`); one `useValidation` hook backs every form.
- **Schema-first types** — all domain types are derived from Zod schemas via
  `z.infer`, so a schema change updates both runtime validation and static
  types in one place.

### Data flow

```
UI component
     │
     ▼
custom hook (useBook, useCart, useAdminBooksPage, …)
     │  calls
     ▼
service (bookService, cartService, authService, …)
     │  Axios request via shared api.ts instance
     ▼
Backend (Rails /api/v1/* or Spring /api/auth/*)
     │  JSON response
     ▼
Zod schema.parse(response.data)   ← throws on unexpected shape
     │
     ▼
typed state back in the hook  →  re-render
```

Every data-fetching hook catches both network errors (Axios) and validation
errors (`ZodError`) in the same `catch` block, converting either into a
user-facing error message — the UI never has to distinguish "the network
failed" from "the server sent something we don't trust."

---

## Zod Runtime Validation

### Schema files: `src/schemas/`

```
auth.schema.ts     → AuthResultSchema, TokenSchema
book.schema.ts      → BookSchema, BookListSchema
cart.schema.ts       → CartItemSchema, CartSchema
index.ts             → barrel export
order.schema.ts       → OrderSchema, OrderListSchema, CreatedOrderSchema
storage.schema.ts      → local/session-storage payload schemas
user.schema.ts           → UserSchema
```

All TypeScript types under `src/schemas` and consumed throughout the app are
derived via `z.infer` rather than hand-written — changing a schema updates
both runtime validation and static types simultaneously.

```typescript
// Before — trusting the network blindly
const response = await api.get<Book[]>("/api/v1/books");
return response.data;

// After — Zod validates before the data ever reaches a hook
const response = await api.get<unknown>("/api/v1/books");
return BookListSchema.parse(response.data); // throws ZodError on bad data
```

---

## 🔐 Authentication

Identity is owned entirely by the Spring Boot **auth-service**, not by this
frontend or by Rails:

- **Email + password** — the real (`VITE_USE_MOCK=false`) path sends the
  password straight to `auth-service` over HTTPS, which does all hashing
  (bcrypt) server-side. Only the **mock** implementation
  (`VITE_USE_MOCK=true`) hashes locally — a SHA-256 pre-hash via `crypto-js`
  followed by `bcrypt-ts` — purely so it can plausibly simulate a
  password-hash-and-compare flow against `localStorage` with no backend at
  all; this path is never used against the real API.
- **Google OAuth2** — the "Sign in with Google" button performs a full-page
  redirect to `{VITE_AUTH_ROOT_URL}/oauth2/authorization/google`; the
  auth-service handles the OAuth2 dance and redirects back with the JWT
  cookies set.
- **JWT session** — the auth-service issues a short-lived access token
  (`booknest_jwt`) and a longer-lived refresh token (`booknest_refresh`) as
  HTTP-only cookies. `useAuthSync` keeps the client-side `AuthContext` in
  sync with the current cookie state, and both Rails and this app trust the
  same signed token.
- **Forgot / reset password** — a 6-digit code is emailed via EmailJS (or
  shown on-screen in local dev when EmailJS keys are blank); redeeming the
  code is a two-step form (`useForgotPasswordForm` → `useResetPasswordForm`).
- **Pending actions across login** — an unauthenticated "save book" or
  checkout action is stashed and automatically replayed after a successful
  login/registration (`popPendingBook.ts`, `mergePendingBook.ts`).
- **Route guards** — `PrivateRoute` requires any authenticated session;
  `AdminRoute` additionally requires `role === "admin"`.

---

## 🌍 Internationalization — UA / EN

```
src/i18n/
├── LocaleContext.test.tsx
├── LocaleContext.tsx     ← LocaleProvider + useLocale() hook
└── translations.ts       ← EN + UK dictionaries — single source of truth
```

```tsx
// Wrapped once in App.tsx
<LocaleProvider>…</LocaleProvider>

// Used anywhere in the tree
const {t, locale, setLocale} = useLocale();
<h1>{t.home.heading}</h1>
<button onClick={() => setLocale("en")}>EN</button>
```

Every user-facing string goes through `t.*` — there are no hardcoded UI
strings. Catalog content itself (title, author, genre, description) is
localized **server-side**: the frontend simply appends `?locale=en|uk` to
catalog requests, and Rails returns the matching translation (falling back to
Ukrainian for any book missing an English translation). Switching language
re-fetches the current page's data and re-formats every date via a
locale-aware, per-locale-cached `Intl.DateTimeFormat` instance.

---

## Security

Client-side hardening layered on top of (never replacing) the backend's own
validation:

| Concern                          | Mitigation                                                                                                                     | File                                   |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------- |
| XSS                              | Strict CSP in `index.html`; `sanitize.ts` strips unsafe input before it's ever sent                                            | `index.html`, `security/inputGuard.ts` |
| CSRF                             | Double-submit cookie: `csrf.ts` generates a token, Axios attaches it on every non-safe request                                 | `security/csrf.ts`, `services/api.ts`  |
| Brute-force login                | `rateLimiter.ts` blocks further attempts after repeated failures for a cooldown window                                         | `security/rateLimiter.ts`              |
| Session hijacking                | `sessionGuard.ts` invalidates stale sessions                                                                                   | `security/sessionGuard.ts`             |
| Plaintext passwords in mock mode | The mock auth path (`VITE_USE_MOCK=true`) never stores a raw password in `localStorage` — SHA-256 pre-hash + `bcrypt-ts` first | `utils/hashPassword.ts`                |
| MIME-sniffing / clickjacking     | `X-Content-Type-Options: nosniff`, restrictive `Content-Security-Policy`, `Referrer-Policy`, `Permissions-Policy` meta tags    | `index.html`                           |

> Client-side checks are defense-in-depth only. The backend independently
> validates every input, enforces its own rate limits, and verifies request
> origin via CORS — never rely solely on the frontend.

---

## Mock Mode

Setting `VITE_USE_MOCK=true` swaps every service call for an in-memory
dataset (`src/mock/bookData.ts`) with a simulated network delay
(`VITE_MOCK_DELAY_MS`, via `src/mock/mockDelay.ts`). This lets the entire UI —
catalog, cart, checkout, saved books, even the admin panel — be exercised and
demoed with zero backend services running. It is meant for offline UI work,
tests, and quick demos — the hosted GitHub Pages demo does **not** use it; that
one talks to the real backend and its Neon database.

---

## 🏗️ Project Structure

Every file actually present in the repository (`.git`, `node_modules`, and
build output excluded, as those aren't source), folders first then files,
sorted alphabetically at each level — the same order a file explorer (or VS
Code's Explorer panel) would show.

```
Frontend/
├── public/
│   ├── 404.html                              # GitHub Pages SPA-redirect shim
│   └── favicon.svg                           # Tab icon
│
├── src/
│   ├── assets/
│   │   └── book-placeholder.png              # Default cover shown when a book has none
│   │
│   ├── components/                           # Reusable, presentation-focused UI pieces
│   │   ├── AuthLayout/
│   │   │   ├── AuthLayout.module.css
│   │   │   └── AuthLayout.tsx                # Centered card shell shared by all auth pages
│   │   ├── BookCard/                         # One catalog-grid tile
│   │   │   ├── AddToCartButton.tsx
│   │   │   ├── BookCard.module.css
│   │   │   ├── BookCard.test.tsx
│   │   │   ├── BookCard.tsx
│   │   │   ├── CardActions.tsx               # Save/add-to-cart button row
│   │   │   ├── CardImage.tsx                 # lazy + async cover image
│   │   │   ├── CardMeta.tsx                  # Price, genre, stock badge
│   │   │   └── CardTitle.tsx
│   │   ├── BookLayout/
│   │   │   ├── BookLayout.module.css
│   │   │   └── BookLayout.tsx                # Back-button wrapper for the detail page
│   │   ├── ErrorBoundary/
│   │   │   ├── ErrorBoundary.test.tsx
│   │   │   └── ErrorBoundary.tsx             # Class component; resets on every navigation
│   │   ├── Header/
│   │   │   ├── Header.module.css
│   │   │   ├── Header.tsx                    # Composes Logo + Navigation + TopBar
│   │   │   ├── Logo.tsx
│   │   │   ├── Navigation.tsx                # Nav links, cart badge, admin link
│   │   │   └── TopBar.tsx
│   │   ├── LanguageSwitcher/
│   │   │   └── LanguageSwitcher.tsx          # UA / EN toggle
│   │   ├── Layout/
│   │   │   └── Layout.module.css             # Page wrapper/footer styles used by App.tsx
│   │   ├── SortControl/
│   │   │   ├── SortControl.module.css
│   │   │   ├── SortControl.test.tsx
│   │   │   └── SortControl.tsx               # Price asc/desc toggle
│   │   ├── Toast/
│   │   │   ├── Toast.module.css
│   │   │   ├── Toast.test.tsx
│   │   │   └── Toast.tsx                     # Success/error flash notification
│   │   └── ui/                               # Small, logic-free presentational atoms
│   │       ├── Badge.tsx
│   │       ├── ErrorState.tsx                # Generic "something went wrong" panel
│   │       ├── Spinner.test.tsx
│   │       ├── Spinner.tsx
│   │       └── VisuallyHidden.tsx            # Screen-reader-only text helper
│   │
│   ├── constants/
│   │   └── bookPlaceholder.ts                # Shared default-cover constant (→ assets/book-placeholder.png)
│   │
│   ├── context/                              # React Context providers + their local helpers
│   │   ├── authContext.ts                    # createContext<AuthContextValue>
│   │   ├── AuthProvider.tsx                  # Session state, JWT sync, pending-action replay
│   │   ├── CartContext.tsx                   # createContext<CartContextValue>
│   │   ├── CartProvider.test.tsx
│   │   ├── CartProvider.tsx                  # Wraps the tree with live cart state
│   │   ├── mergePendingBook.test.ts
│   │   ├── mergePendingBook.ts               # Folds a pre-login "save" into the real account
│   │   ├── popPendingBook.ts                 # Reads/clears a stashed pending action
│   │   ├── readLocalUser.test.ts
│   │   ├── readLocalUser.ts                  # Zod-validated read of the cached user record
│   │   └── readSavedBooks.ts
│   │
│   ├── forms/                                # One folder per multi-field form
│   │   ├── EditProfileForm/
│   │   │   ├── EditProfileForm.module.css
│   │   │   ├── EditProfileForm.test.tsx
│   │   │   ├── EditProfileForm.tsx
│   │   │   ├── NicknameField.tsx
│   │   │   ├── ProfileFormActions.tsx        # Save / cancel buttons
│   │   │   └── ProfilePasswordField.tsx      # Optional password-change field
│   │   ├── ForgotPasswordForm/
│   │   │   ├── CodeSentNotice.tsx
│   │   │   ├── DevCodeNotice.tsx             # Shows the code on-screen when EmailJS is unset
│   │   │   ├── ForgotPasswordForm.module.css
│   │   │   └── ResetCodeDisplay.tsx
│   │   ├── LoginForm/
│   │   │   ├── LoginForm.module.css
│   │   │   ├── LoginForm.tsx
│   │   │   ├── LoginFormFooter.tsx           # "Forgot password?" / "No account?" links
│   │   │   └── ResetSuccessBanner.tsx
│   │   ├── RegisterForm/
│   │   │   ├── RegisterForm.test.tsx
│   │   │   └── RegisterForm.tsx
│   │   ├── ResetPasswordForm/
│   │   │   └── ResetPasswordForm.module.css
│   │   └── shared/                           # Primitives reused across every form above
│   │       ├── FormError.tsx
│   │       ├── forms.module.css
│   │       ├── FormInput.test.tsx
│   │       ├── FormInput.tsx
│   │       ├── GoogleLoginButton.tsx         # Redirects to the OAuth2 authorization URL
│   │       ├── PasswordInput.test.tsx
│   │       ├── PasswordInput.tsx             # Show/hide toggle
│   │       ├── PasswordStrengthHint.module.css
│   │       ├── PasswordStrengthHint.tsx      # Live strength meter + rule checklist
│   │       └── SubmitButton.tsx
│   │
│   ├── hooks/                                # Custom hooks — one responsibility each
│   │   ├── useAdminBooksPage.ts              # Admin CRUD state: list/create/update/delete
│   │   ├── useAuth.ts                        # Thin accessor for AuthContext
│   │   ├── useAuthSync.ts                    # Keeps AuthContext in sync with the JWT cookie
│   │   ├── useBook.ts                        # Single-book fetch for the detail page
│   │   ├── useBookActions.test.ts
│   │   ├── useBookActions.ts                 # Add-to-cart / save-book actions from a card
│   │   ├── useBookDetail.ts
│   │   ├── useCart.test.tsx
│   │   ├── useCart.ts                        # Thin accessor for CartContext
│   │   ├── useEditProfileForm.test.tsx
│   │   ├── useEditProfileForm.ts
│   │   ├── useForgotPasswordForm.ts
│   │   ├── useLogin.ts
│   │   ├── useLoginForm.test.tsx
│   │   ├── useLoginForm.ts                   # Real-time validation + resolveAuthError
│   │   ├── useProfilePage.ts
│   │   ├── useRegister.ts
│   │   ├── useRegisterForm.test.tsx
│   │   ├── useRegisterForm.ts
│   │   ├── useResetPasswordForm.ts
│   │   ├── useSaveBook.ts                    # Wishlist add/remove
│   │   ├── useSearch.ts                      # Debounced search + URL sync
│   │   ├── useSort.test.ts
│   │   ├── useSort.ts
│   │   ├── useUpdateUser.ts
│   │   ├── useValidation.test.tsx
│   │   └── useValidation.ts                  # Shared field-validation engine for every form
│   │
│   ├── i18n/
│   │   ├── LocaleContext.test.tsx
│   │   ├── LocaleContext.tsx                 # LocaleProvider + useLocale() hook
│   │   └── translations.ts                   # Full EN + UK dictionaries — single source of truth
│   │
│   ├── mock/
│   │   ├── bookData.ts                       # Bundled sample catalog (VITE_USE_MOCK=true)
│   │   └── mockDelay.ts                      # Simulated network latency for mock mode
│   │
│   ├── pages/                                # One folder per route (see Pages & Routes)
│   │   ├── AdminBooksPage/
│   │   │   ├── AdminBooksPage.module.css
│   │   │   └── AdminBooksPage.tsx            # Catalog CRUD table + cover upload
│   │   ├── BookDetailPage/
│   │   │   ├── BookDetailPage.module.css
│   │   │   ├── BookDetailPage.tsx
│   │   │   ├── BookMeta.tsx
│   │   │   ├── DetailLoading.tsx
│   │   │   ├── DetailNotFound.tsx
│   │   │   └── SaveButton.tsx
│   │   ├── CartPage/
│   │   │   ├── CartPage.module.css
│   │   │   └── CartPage.tsx
│   │   ├── ForgotPasswordPage/
│   │   │   └── ForgotPasswordPage.tsx
│   │   ├── HomePage/
│   │   │   ├── GenreFilter.module.css
│   │   │   ├── GenreFilter.test.tsx
│   │   │   ├── GenreFilter.tsx
│   │   │   ├── homeHelpers.test.ts
│   │   │   ├── homeHelpers.ts                # filterByGenre / sort helpers
│   │   │   ├── HomeError.tsx
│   │   │   ├── HomeGrid.tsx
│   │   │   ├── HomeLoading.tsx
│   │   │   ├── HomePage.module.css
│   │   │   ├── HomePage.tsx
│   │   │   ├── HomeResultCount.tsx
│   │   │   └── HomeSearchBar.tsx
│   │   ├── NotFoundPage/
│   │   │   ├── NotFoundPage.module.css
│   │   │   └── NotFoundPage.tsx
│   │   ├── OrdersPage/
│   │   │   ├── OrderDetailPage.tsx
│   │   │   ├── OrdersPage.module.css
│   │   │   └── OrdersPage.tsx
│   │   ├── ProfilePage/
│   │   │   ├── ProfileInfo.module.css
│   │   │   ├── ProfileInfo.test.tsx
│   │   │   ├── ProfileInfo.tsx
│   │   │   ├── ProfilePage.module.css
│   │   │   ├── ProfilePage.tsx
│   │   │   ├── SavedBookItem.tsx
│   │   │   ├── SavedBooksEmpty.tsx
│   │   │   ├── SavedBooksList.module.css
│   │   │   └── SavedBooksList.tsx
│   │   ├── ResetPasswordPage/
│   │   │   └── ResetPasswordPage.tsx
│   │   └── SearchPage/
│   │       ├── SearchFilters.tsx
│   │       ├── SearchPage.module.css
│   │       ├── SearchPage.tsx
│   │       └── SearchResults.tsx
│   │
│   ├── router/
│   │   ├── AdminRoute.tsx                    # Requires role === "admin"
│   │   └── PrivateRoute.tsx                  # Requires any authenticated session
│   │
│   ├── schemas/                              # Zod schemas — single source of truth for types
│   │   ├── auth.schema.ts
│   │   ├── book.schema.ts
│   │   ├── cart.schema.ts
│   │   ├── index.ts                          # Barrel export
│   │   ├── order.schema.ts
│   │   ├── schemas.test.ts
│   │   ├── storage.schema.ts
│   │   └── user.schema.ts
│   │
│   ├── security/
│   │   ├── csrf.test.ts
│   │   ├── csrf.ts                           # Double-submit CSRF token generation
│   │   ├── inputGuard.test.ts
│   │   ├── inputGuard.ts                     # XSS / SQLi pattern + payload-size rejection
│   │   ├── rateLimiter.test.ts
│   │   ├── rateLimiter.ts                    # Client-side login-attempt throttling
│   │   └── sessionGuard.ts                   # Stale-session invalidation
│   │
│   ├── services/                             # One file per backend resource; all Axios calls live here
│   │   ├── adminBooksService.ts              # multipart/form-data cover upload
│   │   ├── api.ts                            # Shared Axios instances (Rails + auth-service) + CSRF/refresh interceptors
│   │   ├── authService.ts                    # mockAuth / apiAuth — selected by config.USE_MOCK
│   │   ├── bookService.ts
│   │   ├── cartService.ts
│   │   ├── emailService.ts                   # EmailJS wrapper for reset-code delivery
│   │   ├── orderService.ts
│   │   ├── savedBooksService.ts
│   │   └── storage.ts                        # localStorage/sessionStorage read/write helpers
│   │
│   ├── styles/
│   │   └── global.css                        # Design tokens, CSS reset, shared utility classes
│   │
│   ├── tests/
│   │   ├── setup.ts                          # jest-dom matchers, global test setup
│   │   └── testHelpers.tsx                   # Custom render() wrapped with all providers
│   │
│   ├── utils/
│   │   ├── formatDate.test.ts
│   │   ├── formatDate.ts                     # Locale-aware, per-locale-cached Intl formatter
│   │   ├── hashPassword.test.ts
│   │   ├── hashPassword.ts                   # SHA-256 pre-hash — mock mode only
│   │   ├── logger.ts                         # Suppressed in production builds
│   │   ├── resolveAuthError.ts               # Decodes backend error codes → localized string
│   │   ├── sanitize.test.ts
│   │   ├── sanitize.ts                       # Email/nickname input sanitization
│   │   ├── validation.test.ts
│   │   └── validation.ts                     # Field-level validators (email, password rules, …)
│   │
│   ├── App.tsx                               # Providers → routes; every page lazy-loaded
│   ├── config.ts                             # Central config read from Vite env vars
│   ├── env.d.ts                              # Vite env variable TypeScript declarations
│   └── main.tsx                              # Entry point — createRoot, mounts <App />
│
├── .env                                      # Local development config (see Environment Variables)
├── .env.production                           # Production config — absolute backend origins
├── .gitignore
├── .prettierignore
├── .prettierrc.json
├── eslint.config.js
├── index.html                                # CSP + security headers, favicon, title
├── LICENSE
├── package-lock.json
├── package.json
├── README.md
├── tsconfig.json
└── vite.config.ts                            # Build config, dev-server proxy, manual chunking
```

---

## Available Scripts

| Command                 | Description                                         |
| ----------------------- | --------------------------------------------------- |
| `npm run dev`           | Start the Vite dev server with HMR + API proxy      |
| `npm run build`         | Type-check and build production assets into `dist/` |
| `npm run preview`       | Serve the production build locally                  |
| `npm run lint`          | Run ESLint across the project                       |
| `npm run format`        | Format the codebase with Prettier                   |
| `npm run format:check`  | Check formatting without writing changes            |
| `npm test`              | Run the full test suite once (CI mode)              |
| `npm run test:watch`    | Run tests in watch mode                             |
| `npm run test:coverage` | Run tests with a V8 coverage report                 |
| `npm run deploy`        | Build and publish `dist/` to the `gh-pages` branch  |

---

## ☁️ Deployment

The production bundle is a static site (`dist/`) and can be hosted anywhere
that serves static files. The project's own `npm run deploy` script publishes
it to GitHub Pages via `gh-pages`, which is how
[vscrm.github.io/BookNest](https://vscrm.github.io/BookNest/) is served. Two
things need to be true for any deployment target:

1. **`.env.production`** — set `VITE_API_URL` and `VITE_AUTH_URL` to your
   deployed backend's absolute origin (relative paths only work behind the
   local Vite dev-server proxy).
2. **Reverse proxy / CORS** — either put a reverse proxy in front of the
   static site that forwards `/api/*` to your backend (mirroring the dev
   proxy rules above), or call the backend's absolute URL directly and make
   sure its `CORS_ALLOWED_ORIGINS` includes your deployed frontend's origin
   (see the [backend README](https://github.com/VSCRM/BookNest-Backend)).

```bash
npm run build
# then upload/publish the contents of dist/, or:
npm run deploy
```

### How the live demo is wired

The published build is compiled in real mode (`VITE_USE_MOCK=false`). Its
`.env.production` currently points `VITE_API_URL`, `VITE_AUTH_URL` and
`VITE_AUTH_ROOT_URL` at `http://localhost:8080/api/v1`,
`http://localhost:9000/api/auth` and `http://localhost:9000` — the BookNest
backend container running on the same machine as the browser — and that
backend reads and writes a Neon PostgreSQL database. In practice this means:

- **Data is persistent.** Accounts, orders, saved books, and catalog edits
  live in Neon, not in the browser or in the container, so they survive
  restarts and `docker compose down -v`.
- **The demo needs its backend.** Pages show real data only while the backend
  container is running and reachable at those origins.
- **Pointing the demo at a hosted backend** takes four changes: set the three
  URLs above to the backend's public HTTPS origin in `.env.production`, add
  that origin to `connect-src` (and `img-src`, for book covers) in
  `index.html`'s Content-Security-Policy, add `https://vscrm.github.io` to the
  backend's `CORS_ALLOWED_ORIGINS`, and run `npm run deploy` again.

---

## 📄 License

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
