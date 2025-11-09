<!-- OPENSPEC:START -->
# OpenSpec Instructions

These instructions are for AI assistants working in this project.

Always open `@/openspec/AGENTS.md` when the request:
- Mentions planning or proposals (words like proposal, spec, change, plan)
- Introduces new capabilities, breaking changes, architecture shifts, or big performance/security work
- Sounds ambiguous and you need the authoritative spec before coding

Use `@/openspec/AGENTS.md` to learn:
- How to create and apply change proposals
- Spec format and conventions
- Project structure and guidelines

Keep this managed block so 'openspec update' can refresh the instructions.

<!-- OPENSPEC:END -->

# Repository Guidelines

## Project Structure & Module Organization
- App source: `src/app` (Next.js App Router). Route segments are lower‑case; client components belong near their routes; shared UI/utils can live under `src/app` or `src/lib`.
- Supabase integration: `src/lib/supabase/*.ts` (client, server, middleware). Database assets live in `supabase/` (`migrations/`, `seed.sql`).
- Styles: `src/app/globals.css` with Tailwind CSS v4.
- Tests: colocated under `__tests__` folders (e.g., `src/app/.../__tests__/*.test.tsx`).
- Docs & plans: `doc/` for design/requirements, `tasks/` for plans.

## Build, Test, and Development Commands
- `yarn dev` — run the app locally at `http://localhost:3000`.
- `yarn build` — create a production build (Next.js).
- `yarn start` — run the production server.
- `yarn lint` — lint with ESLint (`eslint-config-next`).
- `yarn test` — run Vitest in CI mode.
- `yarn test:ui` — open Vitest UI for focused runs.
- `yarn test:coverage` — generate coverage report.
Node is pinned via Volta to `20.19.5` (see `package.json`).

## Coding Style & Naming Conventions
- Language: TypeScript. Indent with 2 spaces, use semicolons.
- Components: PascalCase files (e.g., `PropertyInfoCard.tsx`). Hooks: `useCamelCase.ts`.
- Route segments and folders under `src/app`: lower‑case (`properties`, `[id]`).
- Prefer functional components and React hooks; avoid unnecessary state.
- Run `yarn lint` before pushing; fix or annotate intentional deviations.

## Testing Guidelines
- Frameworks: Vitest + React Testing Library + jsdom. See `vitest.config.ts` and `vitest.setup.ts`.
- Place tests in `__tests__` with `*.test.tsx` names matching the component/page under test.
- Aim for meaningful coverage on critical logic and rendering states; snapshots only when stable.
- Run `yarn test` locally; add new tests for bug fixes and new features.

### Common Pitfalls (and how to avoid them)
- Mantine context: Components from `@mantine/core` must be wrapped in `MantineProvider` in tests. For tabs, mount panels inside `<Tabs value="...">` — `Tabs.Panel` reads context and will throw if missing.
- Async Server Components: Treat pages that fetch on the server as async. In tests, `const Page = await PageFn(...)` then render `<Suspense fallback={<div />}>{Page}</Suspense>` (or render the resolved element directly if no Suspense is needed). Do not render the function itself synchronously.
- Next.js search params: When a component/page uses `useSearchParams()`, wrap the render tree with a `Suspense` boundary to satisfy App Router requirements.
- Debounced effects/state updates: Components with delayed effects (e.g., `setTimeout`/debounce) can cause act warnings. In tests, prefer `waitFor`/`findBy*` to let effects settle rather than hard sleeping. If you must, use `vi.useFakeTimers()` + `advanceTimersByTimeAsync`, but avoid coupling tests to exact delays.
- Router mocks and spy hoisting: `vi.mock()` factories are hoisted. Do not reference top‑level variables from inside the factory. Instead, create spies inside the factory and expose them via `globalThis` (e.g., `(globalThis as any).__replaceSpy = vi.fn()`), then read them in tests. This prevents “Cannot access 'x' before initialization.”
- URL assertions with router.replace: State transitions may call `router.replace` multiple times. Assert against the last call (`replaceSpy.mock.calls.at(-1)`) rather than assuming index `0`.
- user-event in CI: Prefer built-in RTL `fireEvent` for simple interactions. Avoid adding `@testing-library/user-event` unless it is already in the repo, to keep tests hermetic under network restrictions.
- Provider-required components: If you see `MantineProvider was not found` or similar, wrap the unit under test with the minimal required providers (Mantine, theme, etc.).
- Encoding: Author tests and UI strings in UTF-8 (LF). Garbled multibyte text can break queries like `getByText`.

## Commit & Pull Request Guidelines
- Commits: concise, imperative summaries. Conventional prefixes (e.g., `feat:`, `fix:`) are welcome but not required.
- PRs: include a clear description, linked issues, test evidence (output or screenshots), and UI screenshots for visual changes. Note any Supabase or env impacts.

## Security & Configuration Tips
- Required env: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `AUTH_STATE_SECRET`. Do not commit `.env*` files.
- Be mindful of server vs. client modules when handling secrets (see `src/lib/supabase/server.ts`).

## Build Pitfalls & Prevention
- Encoding: Save files as UTF‑8 (LF). Garbled multibyte text breaks JSX. If editing Japanese copy, verify diffs render correctly. If in doubt, prefer ASCII in identifiers and keep UI strings centralized.
- Next.js App Router:
  - `useSearchParams()` requires a `Suspense` boundary in pages. Wrap page content: `<Suspense fallback={<div />}>…</Suspense>`.
  - Route Handlers: follow Next.js signatures. If typegen flags `ParamCheck` errors, type `params` as `Promise<{ id: string }>` and `await` it, or import the official `RouteContext` type.
- Linting/types: Avoid `any` in catches. Use `unknown` and narrow to `Error` for messages. Address unused vars (prefix `_`), and heed `react-hooks/exhaustive-deps`.
- Pre‑merge checks: Run `yarn build` and `yarn lint` locally. For schema changes, run Supabase migrations before UI work to catch API/DB shape mismatches early.

### Type Safety Rules (build error prevention)
- Ban `any` in app code and tests. Prefer `unknown` then narrow, or define minimal interfaces for the data actually used by the UI.
- For API Route Handlers:
  - Define explicit response item types (e.g., `type ListItem = { id: string; name: string; ... }`).
  - Cast external data as `unknown` first, then to the target type: `const items: ListItem[] = (data ?? []) as unknown as ListItem[];` and add sanity transforms if needed.
  - When doing multi-query enrichment, define row types (e.g., `type ScoreRow = { property_id: string; value: number; computed_at: string }`) and avoid `any`.
  - Prefer `const` whenever reassignment isn’t required; address ESLint `prefer-const` proactively.
- For Supabase queries when no generated types are present:
  - Select only needed columns; create matching TS types; avoid `select("*")` in routes/pages.
  - If you must coerce, go through `unknown` and keep coercion localized.
- React Hooks hygiene:
  - Satisfy `react-hooks/exhaustive-deps`. Include stable references (e.g., `form`) when used inside effects, or refactor to callbacks.
  - Remove unused state/setters to satisfy `no-unused-vars`.
- Tests and mocks:
  - Mock modules with `unknown` casts instead of `any` (e.g., `as unknown` / `as unknown as typeof fetch`).
  - For Next.js helpers (`next/navigation`) provide minimal typed facades; avoid leaking `any` into app code.
- Public types for props:
  - Export prop item types from components (e.g., `export type PropertyItem = ...`) and import them where props are constructed to keep casts centralized and safe.

## Server-Only Supabase Policy (No NEXT_PUBLIC_*)

- Goal: Do not initialize Supabase in the browser. Client components call internal APIs only; all data access/auth happens on the server using private env vars.
- Client rules:
  - Do not import or use `src/lib/supabase/client.ts` in client components.
  - Use `httpFetch('/api/...')` from client components/pages to interact with data (do not call global `fetch` directly).
- Server rules:
  - Use `createSupabaseServerClient` from `src/lib/supabase/server.ts` in Route Handlers/Server Components.
  - Use only server env vars: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `AUTH_STATE_SECRET`. Avoid `NEXT_PUBLIC_*`.
  - Middleware client (`src/lib/supabase/middleware.ts`) must also read `SUPABASE_URL` and `SUPABASE_ANON_KEY` (not `NEXT_PUBLIC_*`).
- Auth flow:
  - Initiate OAuth on the server via `GET /api/auth/start?provider=google|azure` which sets `oauth_state` and 302-redirects to Supabase authorize with `redirect_to=/auth/callback`.
  - Keep `/auth/callback` verifying state and finalizing session using the server client.
- Documentation/env:
  - `.env.example`/README should list `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `AUTH_STATE_SECRET` as required. `NEXT_PUBLIC_*` is optional/unused.
- Testing:
  - Login page test asserts buttons link to `/api/auth/start?...` instead of using a browser Supabase client.
  - Continue API route tests (`/api/properties` etc.) with server-side client mocks.
- Migration hygiene:
  - Remove remaining references to `createClient` once call sites are updated.
  - Clean up CI/CD env to drop `NEXT_PUBLIC_*` after migration window.

## HTTP Requests (httpFetch)

- Use `httpFetch` from `src/lib/http/fetch.ts` for all HTTP calls in `src/**/*` instead of global `fetch`.
- Import style: `import { httpFetch } from '@/lib/http/fetch';`
- Rationale: centralize timeouts/retries (via up-fetch), consistent error handling, and easier mocking.
- ESLint: `no-restricted-globals` forbids direct `fetch` usage in app code. Exceptions: `src/lib/http/fetch.ts` and tests (`**/__tests__/**`, `vitest.setup.ts`).
- Tests: existing stubs of `globalThis.fetch` keep working because `httpFetch` delegates to it. For finer control, prefer `vi.mock('@/lib/http/fetch', () => ({ httpFetch: vi.fn() }))` and assert calls on that mock.
- Migration note: `httpFetch` currently delegates to platform `fetch`. We may swap internals to `up-fetch` without changing call sites.
