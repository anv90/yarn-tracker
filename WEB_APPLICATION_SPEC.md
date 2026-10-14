# Yarn Tracker web application specification

## Purpose and scope

Build a single-user web application over the existing PostgreSQL database in this
repository. The application lets a user create, view, edit, and delete:

- yarn inventory (`yarn_stash`)
- yarn products (`yarn_products`)
- patterns (`patterns`)
- finished projects (`finished_projects`)

The application must use the existing schema and foreign keys; it must not make
schema changes or write to `weight_lookup` or `fiber_lookup`. `brand_lookup` is
not presented as an independently editable resource. A new brand may be created
only when the user explicitly chooses **Create new brand** while adding or
editing a yarn product.

The existing server uses TypeScript, Fastify, Drizzle ORM, and PostgreSQL. The
implementation should retain that stack. The project currently has API route
stubs but no registered route modules or frontend; this specification defines
the completed API and web UI.

## Database model and display joins

| Resource | Writable columns | Required read joins |
| --- | --- | --- |
| `yarn_products` | `brand_id`, `name`, `weight_id`, `fiber_id` | `brand_lookup`, `weight_lookup`, `fiber_lookup` |
| `yarn_stash` | `product_id`, `color`, `yards` | `yarn_products`, then its `brand_lookup`, `weight_lookup`, and `fiber_lookup` |
| `patterns` | `name`, `link`, `recommended_weight_id`, `yardage` | `weight_lookup` |
| `finished_projects` | `yarn_id`, `pattern_id`, `notes` | `yarn_stash`, its product, brand, weight, and fiber; `patterns`, and the pattern's recommended weight |

Use inner joins for the required relationships: all of these foreign keys are
non-null. Preserve both IDs and readable names in list and detail responses so
the UI can both render labels and submit updates.

## Pages and user experience

All pages share a navigation bar: **Yarn stash**, **Yarn products**,
**Patterns**, and **Finished projects**. Each page has a list/table, an “Add”
action, and per-row edit and delete actions. Forms may be displayed in a modal,
drawer, or dedicated route, provided errors are kept next to their fields and
the list refreshes after a successful mutation.

Every visible table has an individual search/filter field for every displayed
data column, including ID columns and joined-name columns. Filters combine with
AND semantics; a row is shown only when it matches all non-empty column
filters. Text filters use case-insensitive partial matching, while numeric ID
and numeric quantity filters support exact matching. A clear-filters action
restores the unfiltered table. Filtering may occur in the client for the loaded
list or be translated to equivalent query parameters by the API.

Before displaying an add or edit form, load the existing records needed for its
foreign-key selectors. Keep the relevant table/list accessible alongside the
form (or provide a clearly labelled reference panel) so a user can inspect the
existing entries while deciding what to select. Edit forms pre-populate every
field from the selected row; add forms start blank except for an optional
preselected referenced record when launched from a row action.

## Visual design

Use a warm cream application background (for example, `#FFF7E6`). Tables have
a light-pink surface (for example, `#FCE4EC`) with sufficient contrast for
text, borders, controls, and focus indicators. Alternate table body rows
between two distinguishable light-pink shades (for example, `#FCE4EC` and
`#F8D7E2`) to make rows easier to scan; retain the pattern when a table is
filtered or refreshed.

Navigation buttons use a dark-pink default background (for example, `#B03060`)
and change to a lighter pink (for example, `#D96B93`) on pointer hover. The
same transition should be perceptible but brief, and keyboard focus must remain
clearly visible with a non-color-only focus indicator. Maintain accessible text
contrast in every state.

### Yarn stash (`/stash`)

Show one row per `yarn_stash` record with: color, yards, product name, brand
name, weight name, fiber name, and `yarnId`. This is the fully joined stash
view; it must not require users to infer product attributes from IDs.

The add/edit form contains a required product selector, color text field, and
non-negative whole-number yards field. Product selector labels should include
brand, product name, weight, and fiber. Delete must require confirmation and
show a useful dependency error if that stash entry is used by a finished
project. The existing Yarn products table/reference panel is available while
the form is open, and the product selector is populated from the fully joined
product list.

### Yarn products (`/yarn-products`)

Show product name, brand, weight, fiber, and `productId`. The add/edit form
contains product name, brand name, weight selector, and fiber selector. Weight
and fiber options come only from read-only lookup endpoints. Brand is an
autocomplete/select populated from the existing brand list. Its final option is
**Create new brand**, which reveals a required new-brand-name input; it is not a
link to a brand-management page. The existing brand, weight, and fiber lists
are available as reference data while the form is open.

When an existing brand is selected, the client sends its `brandId` with the
product request. When **Create new brand** is selected, the client first sends
a brand-creation request, then uses the returned `brandId` in the product
request. It refreshes brands, products, and stash selectors after success. A
product cannot be deleted while referenced by stash records.

### Patterns (`/patterns`)

Show name, clickable link, recommended weight name, yardage, and `patternId`.
The add/edit form contains name, an absolute HTTP(S) URL, a weight selector,
and a positive numeric yardage field. A pattern cannot be deleted while
referenced by a finished project. The read-only weight table/reference panel is
available while the form is open.

### Finished projects (`/finished-projects`)

Show project ID, pattern name and link, pattern recommended weight, the selected
stash color and yards, plus product name, brand, product weight, product fiber,
and notes. This is the fully joined finished-project view.

The add/edit form contains a stash selector, pattern selector, and optional
notes field. Stash option labels include color and the complete product label;
pattern labels include name and yardage. The fully joined stash and pattern
tables/reference panels remain available while the form is open. Deletion
requires confirmation.

## Read-only lookup data

Expose the following GET-only endpoints for populating forms:

- `GET /api/lookups/weights`
- `GET /api/lookups/fibers`
- `GET /api/lookups/brands`

Responses contain `{ id, name }` items ordered by name. There are no POST,
PATCH, PUT, or DELETE routes for weight or fiber lookup tables. There are no
brand edit or delete controls. The sole permitted brand mutation is the
create-only endpoint below, invoked by the Yarn product form after the user has
selected **Create new brand**; route registration and authorization must
enforce these rules rather than relying on the UI alone.

- `POST /api/brands` accepts `{ name }` and returns the created brand with
  `201`. It is called only by the Yarn product create/edit workflow, never
  exposed as a standalone brand-management UI. A duplicate name returns `409`
  so the UI can reload the brand options and ask the user to select it.

## API contract

All JSON request bodies reject unknown fields. Identifiers are positive integer
path parameters. Successful creates return `201`; reads and updates return
`200`; deletes return `204` with no body. A nonexistent item returns `404`.

### Yarn products

- `GET /api/yarn-products` returns products joined to brand, weight, and fiber.
- `POST /api/yarn-products` accepts `{ name, brandId, weightId, fiberId }`.
- `PATCH /api/yarn-products/:productId` accepts any non-empty subset of those
  fields.
- `DELETE /api/yarn-products/:productId` deletes the product if unreferenced.

For a new brand, the client trims and validates the new name (1–255 characters),
calls `POST /api/brands`, then calls the product endpoint with the returned
`brandId`. These are separate requests; do not use a transaction that combines
brand creation and product creation. If product creation fails after the brand
request succeeds, show the product error and retain the newly created brand as
the selected option so the user can correct and retry. The endpoint returns the
joined product.

`name` is 1–255 characters. `weightId` and `fiberId` must reference existing
lookup rows; their tables are never mutated. An invalid foreign key produces
`422` with a field-level error.

### Yarn stash

- `GET /api/yarn-stash` returns the complete stash join described above.
- `POST /api/yarn-stash` accepts `{ productId, color, yards }`.
- `PATCH /api/yarn-stash/:yarnId` accepts a non-empty subset of those fields.
- `DELETE /api/yarn-stash/:yarnId` deletes an unreferenced stash entry.

`color` is 1–255 characters, `yards` is an integer greater than or equal to
zero, and `productId` must exist.

### Patterns

- `GET /api/patterns` returns patterns joined to their recommended weight.
- `POST /api/patterns` accepts `{ name, link, recommendedWeightId, yardage }`.
- `PATCH /api/patterns/:patternId` accepts a non-empty subset of those fields.
- `DELETE /api/patterns/:patternId` deletes an unreferenced pattern.

`name` is 1–255 characters, `link` is an absolute HTTP(S) URL no longer than
2,048 characters, `recommendedWeightId` must exist, and `yardage` is a
positive decimal. Return yardage as a string to avoid JSON floating-point loss.

### Finished projects

- `GET /api/finished-projects` returns the complete finished-project join.
- `POST /api/finished-projects` accepts `{ yarnId, patternId, notes? }`.
- `PATCH /api/finished-projects/:finishedProjectId` accepts a non-empty subset
  of those fields.
- `DELETE /api/finished-projects/:finishedProjectId` deletes the project.

`yarnId` and `patternId` must exist. `notes` is nullable/optional text. The
created and updated response uses the same fully joined representation as the
GET response.

## Error handling and integrity

Validation failures return `422` in the shape
`{ "message": "Validation failed", "errors": [{ "field": "yards", "message": "…" }] }`.
Foreign-key restriction failures return `409` with a human-readable message,
for example, “This yarn cannot be deleted because it is used by a finished
project.” Do not expose raw PostgreSQL messages.

Database restrictions remain the final integrity safeguard. The API should
pre-check referenced IDs for clear form errors, while still translating a race
condition or database constraint failure to `409` or `422` as appropriate.

## Implementation and acceptance criteria

- Register every route module in `src/server.ts` under `/api`; the current
  route files alone are insufficient because they are not registered.
- Use Drizzle joins for every display endpoint, including transitive joins for
  stash and finished projects.
- Use the two-request conditional-brand flow: create the brand first only when
  **Create new brand** is selected, then create or update the product with its
  returned ID. Do not wrap both writes in one transaction.
- Implement all four CRUD resource groups, three GET lookup groups, and the
  create-only brand endpoint used by the product flow.
- Do not add any weight or fiber mutation endpoint, or brand update/delete
  endpoint.
- Use the actual `finished_projects` table and `finishedProjectId` naming in
  code, while presenting “Finished projects” in the UI.
- Add automated route tests for normal CRUD, joined response shapes, immutable
  weight/fiber lookup routes, the two-request conditional brand flow, validation,
  404s, and the three deletion dependency conflicts.
