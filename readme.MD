# ⚡ Shadcn Kit React Template

This repository provides a ready-to-use template for quickly bootstrapping a React application, running it locally, and deploying it to ServiceNow via SDK 4.

The template comes pre-installed with everything you need to build a full-stack TypeScript-based React application:

- **Vite** – Fast development server.
- **Tailwind CSS** – Utility-first CSS framework.  
- **Shadcn UI** – Accessible, customizable React components.  
- **Shadcn-Kit** – Shadcn components tailored for ServiceNow.  
- **TanStack Query** – Asynchronous state management and caching.  

Once combined with your ServiceNow development expertise, you can deliver modern full-stack applications to your users in no time.

**PLEASE NOTE:** Building this template will only work in a local node environment e.g. via VS Code. Support for ServiceNow IDE is not currently included.

---

## 🖥️ Local Development

Start by getting the template running locally:

1. Clone or fork this repository, then cd into it.
2. If you cloned it and want a fresh base, delete the `.git` folder.  
3. Install dependencies:  
   - Run: `npm install`  
4. Create a `.env` file in the project root with the required variables (see below).  
5. Start the dev server:  
   - Run: `npm run dev`

If successful, you should see the following preview:

![shad-kit template preview](/src/client/assets/preview/shad-kit-template.png)

---

### 🔑 Environment Variables

The `.env` file provides Vite with the details it needs to run locally and authenticate with your ServiceNow instance. Each variable is defined on its own line, wrapped in single quotes (e.g., `VITE_TEST_VARIABLE='Testing'`).

**Required variable:**
- `VITE_DEV_URL` – The full URL of the ServiceNow instance to connect to (e.g. `https://xxx.service-now.com/`).

**Authentication options (choose one):**
1. **🔐 Basic Authentication**  
   - `VITE_REACT_APP_USER` – Username of the ServiceNow profile (e.g. `abel.tuter`).  
   - `VITE_REACT_APP_PASSWORD` – Password for that profile.  

   ⚠️ Basic auth is quick but only works with local accounts without MFA. Some ServiceNow endpoints do not accept it.

2. **🍪 Cookie-based Authentication**  
You will need to be logged into a ServiceNow instance and use your browsers developer console to retrieve the below values.
   - `VITE_SPOOF_TOKEN` – In the console type in `window.g_ck` and copy the result.  
   - `VITE_SPOOF_COOKIE` – Open the network tab, find a ServiceNow bound network request (e.g. the *presence* request), Copy the full `Cookie` request header.  

   Cookies last as long as the active ServiceNow session. If you’re logged out, you’ll need to repeat this step. Although less convenient, cookie auth works with all accounts and replicates the behavior of running inside ServiceNow.

These variables are used **only** by the dev server. They are not included in the ServiceNow build. In production, the app only has access to baseline variables (mode/dev/prod/baseUrl).

---

## 🚀 Build & Deploy to ServiceNow
Once local development is working, prepare to build and deploy to your ServiceNow instance:

1. Authenticate with the SDK:  
   - Run: `npx @servicenow/sdk auth --add <instance>`  
   - Follow the prompts to connect and save an authentication profile.

2. Configure `now.config.json` in the project root:  
   - `name` – The name of the scoped application in ServiceNow (e.g. *"Shadcn Kit Example"*).  
   - `scope` – The scope name, starting with **x_<company_key>**.  
     - Find your company key in either *sn_appauthor.all_company_keys* or *glide.appcreator.company.code* system properties.  
     - Example: if your company code is *shadkit*, then the scope can be `x_shadkit_react`.  
   - `scopeId` – A valid sys_id for the application. You can generate one with a background script by running `gs.info(gs.generateGUID());`

3. Update `shadcn.now.ts` (rename if desired, but keep the **.now.ts** suffix):  
   - Set the UI page endpoint (must start with your app scope and end with **.do**, e.g. `x_shadkit_react_template.do`).  
   - Adjust other fields as needed for your app.

4. Build the app for ServiceNow:  
   - Run: `npm run build`

5. Deploy to your instance:  
   - Run: `npm run deploy`

After deployment, you should see a new scoped application in your instance. Navigate to its UI page endpoint to confirm the app is running.

---

## 🛠️ Prebuild Modifications

To make Vite, Tailwind, and Shadcn work with ServiceNow’s Rollup build process, the following adjustments were made in `now.prebuild.mjs`:

- **Tailwind** – Compile `index.css` into `index.build.css`, which is then bundled.  
- **Environment Variables** – Include baseline variables (mode/dev/prod/baseUrl) for use inside ServiceNow.  
- **Alias Plugin** – Map `@` to `src/client` for cleaner imports.  
- **nodeResolve Plugin** – Handle resolution of hoisted dependencies in `node_modules`.  
- **url Plugin** – Map image imports from `src/client/assets` to their deployed counterparts.
- **Manual Chunking** - Manually chunked some of the larger dependencies sn-shadcn-kit makes use of into their own jsdbx files. These chunks will only apply if you import any components that require them.

*Quick note on tailwind* - If you find when deploying to ServiceNow some tailwind classes you have added to your app do not get applied, then go to the sys_app record for your scope and find the index.build.css application file and delete it, then re-deploy the app. I have noticed sometimes this file doesn't get refreshed when changes have been made to it and i'm not sure why.

---

## 🧹 Cleaning Up
Once you’re happy with the template and ready to transform it into your own application, clean up any unnecessary files:
- Clear the `src/client/assets` folder. (Use this folder for any media assets to be sent to ServiceNow.)  
- Clear the `src/client/routes` folder and create your own route pages.  
- Update `src/client/router.tsx` with your own route components.  
- Configure `src/client/queryClient.ts` to set your preferred TanStack Query options.  
- Update the `<title>` in `src/client/index.html`.  
- Update `package.json` with an appropriate name for your application.
- update `AGENTS.md` with any specific context for your chosen AI model to assist you in building out your application.
