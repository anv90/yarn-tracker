# Yarn Tracker implementation plan

## Goal

Implement the application described in
[WEB_APPLICATION_SPEC.md](WEB_APPLICATION_SPEC.md) using the existing
PostgreSQL schema, Fastify server, and Drizzle ORM. No database schema migration
is needed: the work is API completion, a web UI, validation, and tests.

## Technology stack

| Area | Technology | Use in this project |
| --- | --- | --- |
| Runtime and language | Node.js and TypeScript | Runs both the Fastify API and the browser application with typed request, response, and data models. |
| HTTP API | Fastify 5 | Registers `/health` and all `/api` routes, performs JSON-schema request validation, and serves the production frontend. |
| Database | Existing PostgreSQL database | Persists the existing `yarn_stash`, `yarn_products`, `patterns`, `finished_projects`, and lookup tables; no schema changes are planned. |
| Data access | Drizzle ORM with `pg` | Executes typed reads, joins, CRUD operations, and PostgreSQL error handling. |
| Configuration | `dotenv` | Loads `DATABASE_URL` locally without committing credentials. |
| Frontend | React with TypeScript, built by Vite | Provides the single-page UI, page routing, forms, table filtering, API calls, and the required cream/pink visual design. |
| Frontend routing | React Router | Maps `/stash`, `/yarn-products`, `/patterns`, and `/finished-projects` to their screens and supports direct navigation. |
| Styling | CSS Modules or a single global CSS layer | Defines reusable CSS custom properties and component styles without adding a design-system dependency. |
| API tests | Vitest, Fastify `inject`, and a dedicated PostgreSQL test database | Tests routes without opening a network port and verifies real PostgreSQL constraints. |
| UI tests | Vitest and React Testing Library | Tests forms, filters, conditional brand creation, reference panels, and error states in the browser UI. |
| Quality checks | TypeScript compiler and ESLint | Type-checks and lints both the API and frontend source. |

React, Vite, React Router, Vitest, and React Testing Library are implementation
dependencies to add; the rest of the backend stack is already present in
`package.json`. Keep dependencies small: do not add a component library, ORM,
or state-management framework because the required screens can use React state,
the Fetch API, and CSS.

## 1. Establish the application structure

1. Confirm `DATABASE_URL` points to the intended PostgreSQL database and start
   from the existing Drizzle schema rather than recreating tables.
2. Consolidate the server's schema imports so routes use one canonical Drizzle
   table definition.
3. Create a Fastify application factory separate from the listen/start code.
   This makes route tests able to instantiate and close the app without binding
   port 3000.
4. Register all API route modules under `/api` in `src/server.ts` (or the app
   factory): products, stash, patterns, finished projects, brands, and lookups.
5. Add a React + TypeScript frontend built with Vite, React Router for the four
   pages, and configure Fastify to serve its production assets and history
   fallback so direct UI-route navigation works.

**Done when:** the server starts, `GET /health` works, and a browser can load
the app shell plus each of `/stash`, `/yarn-products`, `/patterns`, and
`/finished-projects`.

## 2. Build shared backend foundations

1. Define TypeScript request/response types for each resource and joined read
   model. Represent PostgreSQL `numeric` yardage as a string in API responses.
2. Add reusable validation helpers for positive IDs, non-empty PATCH bodies,
   string length, HTTP(S) URLs, non-negative integer yards, and positive decimal
   yardage.
3. Add a shared error handler that returns:

   - `404` for missing records;
   - `422` with field-level validation errors for malformed data or a missing
     selected foreign-key record;
   - `409` for duplicate brand names and foreign-key delete restrictions;
   - safe messages without raw PostgreSQL error text.

4. Translate PostgreSQL unique and foreign-key constraint errors through that
   handler as a race-condition safeguard.
5. Add select helpers for the canonical joined shapes:

   - product + brand + weight + fiber;
   - stash + product + brand + weight + fiber;
   - pattern + recommended weight;
   - finished project + stash + product + brand + product weight + fiber +
     pattern + pattern recommended weight.

**Done when:** all read and mutation handlers can reuse typed validation,
error handling, and joined response queries.

## 3. Implement lookup and brand endpoints

1. Implement `GET /api/lookups/weights`, `GET /api/lookups/fibers`, and
   `GET /api/lookups/brands`, each returning `{ id, name }` sorted by name.
2. Implement `POST /api/brands` with `{ name }`, trimmed 1–255-character
   validation, `201` response, and `409` for an existing name.
3. Register no mutation route for weight or fiber and no brand PATCH, PUT, or
   DELETE route.
4. Keep the brand endpoint out of navigation and do not build a standalone
   brand-management screen.

**Done when:** the frontend can populate all selects, and the only possible
brand mutation is creation through `POST /api/brands`.

## 4. Implement product and stash APIs

1. Replace/complete `GET /api/yarn-products` to return the product’s complete
   brand, weight, and fiber join.
2. Implement product POST, PATCH, and DELETE. Accept `brandId`, `weightId`, and
   `fiberId`; validate that every selected lookup row exists; return the joined
   product after create/update.
3. Do not create brands inside a product handler and do not use a transaction
   to couple the two writes.
4. Implement `GET /api/yarn-stash` with the transitive product/brand/weight/
   fiber join, plus stash POST, PATCH, and DELETE.
5. Pre-check whether a product has stash children before product deletion and
   whether a stash entry has finished-project children before stash deletion;
   retain database constraints as the final safeguard.

**Done when:** products and stash have complete CRUD APIs, list results contain
human-readable joined fields, and invalid/dependent operations receive the
specified response status.

## 5. Implement pattern and finished-project APIs

1. Implement pattern list/create/update/delete with the recommended-weight
   join and URL/yardage validation.
2. Implement the finished-project list with every required direct and
   transitive relationship joined.
3. Implement finished-project create/update/delete, validating selected stash
   and pattern records and preserving nullable notes.
4. Return the same complete joined record after each successful creation or
   update.
5. Convert pattern-delete restriction failures to `409` when a finished project
   references the pattern.

**Done when:** all four writable resources have full CRUD and every display
endpoint has its required joins.

## 6. Build shared frontend behavior and styling

1. Create the React app shell with the four navigation buttons and React Router
   client-side routing.
2. Define design tokens for the cream page background, light-pink table surface,
   two alternating pink row colors, dark-pink navigation default, and lighter
   pink hover state.
3. Apply alternating row styling to table bodies after filtering as well as on
   the initial list. Add a visible keyboard-focus indicator and verify text
   contrast in default, hover, and focus states.
4. Create reusable components/utilities for API calls, loading and error states,
   confirmation dialogs, editable forms, reference panels, and table rendering.
5. Display API field errors next to form inputs and `409` dependency errors in
   a clear, actionable message.

**Done when:** each route uses the specified visual system and common loading,
error, delete-confirmation, and accessibility behavior.

## 7. Build the four resource pages

### Yarn Products

1. Render columns for ID, name, brand, weight, and fiber.
2. Load product data and lookup options when the page/form opens.
3. Implement an existing-brand selector plus **Create new brand** option.
4. For a new brand, call `POST /api/brands`; on `201`, call the product POST or
   PATCH with the returned `brandId`. If the product call fails, retain the new
   selection and show the product error. If brand creation returns `409`, reload
   brands and ask the user to select the existing one.
5. Keep brand, weight, and fiber reference data visible while the form is open.

### Yarn Stash

1. Render ID, color, yards, product, brand, weight, and fiber from the complete
   stash join.
2. Populate the product selector using complete product labels and keep the
   joined Yarn Products reference list available in the form.
3. Implement add, edit (pre-filled), and confirmed delete.

### Patterns

1. Render ID, name, linked URL, recommended weight, and yardage.
2. Populate the recommended-weight selector and retain the weight reference
   panel in the form.
3. Implement add, edit (pre-filled), and confirmed delete.

### Finished Projects

1. Render every specified joined field: project ID, pattern/link/recommended
   weight, stash color/yards, product/brand/product weight/fiber, and notes.
2. Populate selectors from the fully joined stash list and pattern list; retain
   both reference panels while the form is open.
3. Implement add, edit (pre-filled), and confirmed delete.

**Done when:** every page has functional CRUD controls and forms give users
enough existing data to choose valid relationships without memorizing IDs.

## 8. Add per-column table search

1. Include one filter field for every visible data column on each of the four
   resource tables; do not omit IDs or joined-name columns.
2. Implement case-insensitive substring matching for text and exact matching
   for numeric IDs and quantities.
3. Combine populated filters with AND semantics and provide a clear-filters
   action.
4. Apply filtering after each list refresh and ensure alternating row styles are
   based on the currently displayed result set.

**Done when:** any combination of column filters narrows the visible table
correctly and clearing filters restores the full list.

## 9. Test and verify

1. Add backend route tests using an isolated test database or transactions that
   roll back after each test. Cover CRUD success paths, 404s, validation errors,
   joined response shapes, and `409` delete dependencies.
2. Add targeted tests proving weight/fiber mutation routes do not exist and
   brand PATCH/DELETE routes do not exist.
3. Test the two-call brand workflow: successful new brand then product write,
   duplicate brand handling, and a product failure after successful brand
   creation.
4. Add frontend tests for pre-populated edit forms, reference panels, all
   column filters, create-new-brand behavior, delete confirmation, and API error
   display.
5. Run TypeScript compilation, linting, API tests, frontend tests, and a manual
   browser smoke test across all four pages and direct URL loads.

## Delivery sequence

Implement in this order to keep dependencies clear:

1. App factory, route registration, shared validation/errors, and lookup APIs.
2. Product and stash APIs, then pattern and finished-project APIs.
3. Frontend shell, design tokens, and shared table/form components.
4. Yarn Products, Yarn Stash, Patterns, and Finished Projects pages.
5. Per-column filtering, automated tests, and final end-to-end verification.
