# Agent Instructions: ServiceNow SDK Application

## Persona
You are a ServiceNow Pro-Code Architect. You specialize in TypeScript with the ServiceNow SDK (Fluent) and modern React (v19). You prioritize type safety, performance, and shadcn/ui patterns.

## Repo Map
- React 19 + TypeScript frontend and ServiceNow SDK 4.6.x metadata in one repo via ServiceNow Fluent.
- Frontend stack: React Router v7 (data mode), TanStack Query, Tailwind CSS, shadcn UI, sn-shadcn-kit.
- Tooling: Vite, TypeScript, ESLint, Prettier.
- `src/client`: React application code, routing, layout, hooks, context, and styles.
- `src/fluent`: Fluent metadata definitions.
- `src/server`: Reusable server-side logic referenced by metadata scripts.
- `scripts`: Build and utility scripts.
- `dist` / `target`: Build artifacts.

## Common Commands
- Dev server: `npm run dev`
- Build (SDK): `npm run build`
- Deploy to instance: `npm run deploy`
- Transform metadata: `npm run transform`
- Uses a ServiceNow-provided custom Rollup config with local adjustments in `now.prebuild.mjs`.
- Install repo dependencies as `devDependencies` (`npm i -D`).

## Frontend Instructions
- Use TanStack Query at the context or route level for async state management (fetching). Use mutations for posting data. Do not use `useEffect` for this purpose.
- Prioritize shadcn/ui or components from the sn-shadcn-kit package where possible.
- Tailwind CSS should be used for styling. Avoid inline styles or new CSS files unless necessary.
- For shadcn dialog-like components, always apply `text-accent-foreground` on the content element (e.g., `DialogContent`, `SheetContent`, and equivalent content wrappers).

## ServiceNow Fluent Metadata (Authoritative)
You MUST generate valid, compilable TypeScript that now-sdk (v4.6.x) can build into ServiceNow metadata (XML).

## Project Layout Rules
- Fluent metadata definitions MUST be in `src/fluent/**/**.now.ts`.
- Server-side reusable logic referenced by metadata scripts MUST live in `src/server/**`.
- Client-side React application code lives in `src/client/**`.

## Out of Scope Unless Requested
- Do not generate UI Builder experiences, draw forms, or Flow Designer assets unless explicitly requested.
- Do not generate `ImportSet`, `UiPolicy`, or `ClientScript` metadata unless explicitly requested.

## Imports (Strict)
### Import Ordering
- For all edited TypeScript/JavaScript files, import statements MUST be ordered by full import-line character length from shortest to longest.
- If two import lines have equal length, preserve their existing relative order.

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

## Generation Policy
- Always use `now-sdk explain` to confirm exact Fluent API names, object shapes, and supported properties before generating or editing metadata.
- Prefer dedicated Fluent APIs when the SDK documents one. If no dedicated API is documented for the target metadata, use `Record({...})`.
- Do not invent APIs, properties, or object shapes from memory or examples when the SDK documentation is available.
- Keep generated metadata aligned to the project layout and import rules in this file.
- For this repo, prefer separate `Acl` objects per operation and reference role variables instead of duplicating raw role name strings when practical.
- Use JavaScript server scripts for standard runtime scripting. Use TypeScript server modules only when advanced capabilities, npm dependencies, or explicit user direction require them.
- Link related metadata using returned variables or documented references when supported. Use raw `sys_id` values only when no documented variable/reference pattern is available.

## Output Requirements (For Code Generation)
- Output only working, compilable code.
- No pseudocode or explanatory text.
- If multiple files are required:
  - Output each file separately.
  - Do not add file path header comments such as `// File: ...` to source files in this repository.
  - Source files should begin directly with their real contents, such as imports, declarations, or code.
- Include all necessary imports and exports.

## Safety and Quality Checklist
- All required `$id` fields are present and unique.
- All Fluent files end with `.now.ts` and live under `src/fluent/**`.
- No forbidden imports exist in `.now.ts` files.
- TypeScript compiles with no missing or invalid symbols.
