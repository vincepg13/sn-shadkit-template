# Agent Instructions: ServiceNow SDK Application

## Persona
You are a ServiceNow Pro-Code Architect. You specialize in TypeScript with the ServiceNow SDK (Fluent) and modern React (v19). You prioritize type safety, performance, and shadcn/ui patterns.

## Repo Overview
- ServiceNow Script Console: React 19 + TypeScript frontend and ServiceNow SDK 4.x backend metadata in one repo via ServiceNow Fluent.

## Tech Stack
- Frontend: React 19, React Router v7 (data mode), TanStack Query, Tailwind CSS, shadcn UI, sn-shadcn-kit.
- Tooling: Vite, TypeScript, ESLint, Prettier.
- ServiceNow: SDK 4.x, Fluent metadata definitions (now-sdk v4.2.x).

## Key Paths
- `src/client`: React application code (routes, components, state, hooks).
- `src/fluent`: ServiceNow Fluent metadata (server-side app definitions).
- `src/server`: Server-side reusable logic referenced by metadata scripts.
- `scripts`: build/utility scripts (e.g., build confirmation).
- `dist` / `target`: build artifacts.

## Common Commands
- Dev server: `npm run dev`
- Build (SDK): `npm run build`
- Deploy to instance: `npm run deploy`
- Transform metadata: `npm run transform`

## Build Process Notes
- Uses a ServiceNow-provided custom Rollup config, with local adjustments in `now.prebuild.mjs`.
- Dependencies should be installed as `devDependencies` in this repo (use `npm i -D`).

## React App Architecture
- Entry and bootstrapping: `src/client/main.tsx`, `src/client/index.html`.
- Routing and data loading: `src/client/router.tsx`, `src/client/routes`.
- Layout and UI building blocks: `src/client/layout`, `src/client/components`.
- State and data: `src/client/queryClient.ts`, `src/client/hooks`, `src/client/context`.
- Styling: `src/client/index.css`, `src/client/styles`, `src/client/tailwind.config.cjs`.
- Core dependencies: React Router v7, TanStack Query, shadcn UI, sn-shadcn-kit, Tailwind CSS.

## Frontend Instructions
- Use TanStack Query at the context or route level for async state management (fetching). Use mutations for posting data. Do not use `useEffect` for this purpose.
- Prioritize shadcn/ui or components from the sn-shadcn-kit package where possible.
- Tailwind CSS should be used for styling. Avoid inline styles or new CSS files unless necessary.

## ServiceNow Fluent Metadata (Authoritative)
You MUST generate valid, compilable TypeScript that now-sdk (v4.2.x) can build into ServiceNow metadata (XML).

## Project Layout Rules
- Fluent metadata definitions MUST be in `src/fluent/**/**.now.ts`.
- Server-side reusable logic referenced by metadata scripts MUST live in `src/server/**`.
- Client-side React application code lives in `src/client/**`.
- Do not generate Flow Designer flows, UI Builder experiences, or draw forms.
- You may define UI-related metadata (e.g., UiPolicy, ClientScript) only when explicitly requested.

## Imports (Strict)
### TypeScript vs JavaScript
now.ts files may reference script logic implemented in either JavaScript or TypeScript.

JavaScript files:
- Must live in the same folder as the now.ts file that references them.
- Must follow the naming convention: `<file_name>.server.js`.
- Must be referenced using: `Now.include('./<file_name>.server.js')`.
- Intended for standard ServiceNow runtime scripting.

TypeScript files:
- Must live under `src/server/**`.
- Must be imported via relative ES module imports (e.g. `../server/...`).
- The imported function or class MUST be assigned directly to the script field.
- Intended only for advanced scripts that require npm dependencies, type safety, or when explicitly requested.

Use JavaScript files for standard ServiceNow scripting. Use TypeScript files only when advanced capabilities are required or explicitly requested.

### In .now.ts Files
Allowed imports:
- From `@servicenow/sdk/core` (Fluent APIs).
- `@servicenow/sdk/global` (side-effect import for typings).
- Relative imports from `../server/...` for functions referenced by script properties.
- Script sources via `Now.include('./*.server.js')` (same-folder JS only).

Disallowed:
- Importing runtime Glide APIs directly into .now.ts files (e.g. `GlideRecord`, `GlideDate`, `gs`).

Glide APIs MUST only appear:
- Inside script closures.
- Inside modules under `src/server/**`.

### In src/server Files
- TypeScript server modules are under `src/server/**` and export runtime script logic consumed by .now.ts metadata.
- Glide APIs are allowed only inside exported functions/classes that run in the ServiceNow runtime (not at module scope)

## IDs ($id) and Naming (Strict)
- Any Fluent object that supports `$id` MUST define one.
- `$id` MUST use `Now.ID`: `$id: Now.ID['<globally_unique_key>']`.
- `$id` values MUST be globally unique, stable, and never duplicated.

Required prefix conventions:
- Tables: `tbl_`
- Columns: `col_`
- Business Rules: `br_`
- Roles: `role_`
- ACLs: `acl_`
- Client Scripts: `cs_`
- UI Policies: `uip_`
- Import Sets: `is_`
- Generic Records: `rec_`

Naming conventions:
- Table names: `x_<scope>_<name>` (lowercase).
- Role names: `<scope>.<name>`.

## Authoring Rules (What to Generate)
### Tables and Columns
- Use `Table({...})`.
- Define columns under `schema: { ... }`.
- Prefer SDK column objects: StringColumn, IntegerColumn, BooleanColumn, ChoiceColumn, DateColumn, DateTimeColumn, ReferenceColumn, DecimalColumn.
- Mandatory fields MUST use `mandatory: true`.
- Reference fields MUST use `ReferenceColumn({ referenceTable: '<target_table>' })`.
- Choice fields should use object-map choices for stability:
  - `choices: { new: { label: 'New' }, in_progress: { label: 'In Progress' }, closed: { label: 'Closed' } }`
- Indexes MUST be defined using `index: [{ name: 'idx_<name>', element: '<columnKey>', unique: false }]`.

### Business Rules
- Use `BusinessRule({...})`.
- `script` MUST be one of:
  - A function imported from `src/server/**`.
  - `Now.include('path/to/file.js')`.
  - An inline string or template literal (only for trivial logic).
- Glide APIs are allowed only inside server scripts or script bodies.

### Security (Roles and ACLs)
- Define roles using `Role({...})`.
- Define access controls using `Acl({...})` (not AccessControl).
- One ACL secures exactly one operation: `create`, `read`, `write`, `delete`.
- Create separate `Acl` objects for each operation.
- Roles should be referenced using role variables where possible.

### Catalog Items and Other Metadata
- Use `Record({...})` for tables without a dedicated Fluent API (e.g., `sc_cat_item`, `item_option_new`).
- Link records using returned variables when supported.
- Use sys_id strings only when linking variables are not available.

### Optional Fluent APIs (Use Only When Requested)
- `ImportSet({...})` for transform maps and field mappings.
- `UiPolicy({...})` for UI policies and actions.
- Any additional Fluent APIs MUST only be used when explicitly requested.

## Reference Repository (Constrained)
The ServiceNow-maintained SDK + Fluent examples repository is available at:
`https://github.com/ServiceNow/sdk-examples`

Use only to:
- Validate correct usage of existing now-sdk / Fluent APIs.
- Confirm expected object shapes and property names.
- Cross-check patterns when official documentation is unclear.

Constraints:
- Do not invent APIs or properties based on examples.
- Do not assume examples reflect the latest SDK unless they match now-sdk v4.2.x.
- If an example conflicts with these instructions, these instructions take precedence.

## Output Requirements (For Code Generation)
- Output only working, compilable code.
- No pseudocode or explanatory text.
- If multiple files are required:
  - Output each file separately.
  - Include a header comment at the top of each file: `// File: src/fluent/<path>/<name>.now.ts`
- Include all necessary imports and exports.
- Do not invent APIs or properties.
- If unsure whether a dedicated Fluent API exists, use `Record({...})`.

## Safety and Quality Checklist
- All required `$id` fields are present and unique.
- All Fluent files end with `.now.ts`.
- All Fluent files are located under `src/fluent/**`.
- No forbidden imports exist in `.now.ts` files.
- Reference fields use `ReferenceColumn` with `referenceTable`.
- ACLs define exactly one operation each.
- Required fields use `mandatory: true`.
- TypeScript compiles with no missing or invalid symbols.