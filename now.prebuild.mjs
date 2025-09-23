/* eslint-disable @servicenow/sdk-app-plugin/no-unsupported-node-builtins */
import dotenv from "dotenv";
import url from "@rollup/plugin-url";
import * as nodepath from "node:path";
import alias from "@rollup/plugin-alias";
import { createRequire } from "node:module";
import replace from "@rollup/plugin-replace";
import { execFileSync } from "node:child_process";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import { servicenowFrontEndPlugins, rollup, glob } from "@servicenow/isomorphic-rollup";

export default async ({ rootDir, config, fs, path, logger, registerExplicitId }) => {
  const require = createRequire(import.meta.url);
  const clientDir = path.join(rootDir, config.clientDir);
  const htmlFiles = await glob(path.join("**", "*.html"), {
    cwd: clientDir,
    fs,
  });

  if (!htmlFiles.length) {
    logger.warn(`No HTML files found in ${clientDir}, skipping UI build.`);
    return;
  }

  const staticContentDir = path.join(rootDir, config.staticContentDir);
  fs.rmSync(staticContentDir, { recursive: true, force: true });

  // --- Tailwind via PostCSS CLI (index.css -> index.build.css) ---
  try {
    const postcssPkgPath = require.resolve("postcss-cli/package.json", {
      paths: [rootDir],
    });
    const postcssBinRel = JSON.parse(fs.readFileSync(postcssPkgPath, "utf8")).bin.postcss;
    const postcssBin = nodepath.resolve(nodepath.dirname(postcssPkgPath), postcssBinRel);

    const cssIn = path.join(clientDir, "index.css");
    const cssOut = path.join(clientDir, "index.build.css");

    execFileSync(process.execPath, [postcssBin, cssIn, "-o", cssOut, "--no-map", "--config", clientDir], {
      stdio: "inherit",
      cwd: rootDir,
      env: {
        ...process.env,
        NODE_ENV: "production",
        TAILWIND_CONFIG: path.join(clientDir, "tailwind.config.cjs"),
      },
    });

    logger.info("Tailwind built: index.css -> index.build.css");
  } catch (e) {
    logger.warn(`Tailwind/PostCSS build failed: ${e?.message || e}`);
  }
  // --- end Tailwind step ---

  // --- Vite ENV generation step ---
  dotenv.config({
    path: path.join(rootDir, ".env.production"),
    override: true,
  });
  dotenv.config({ path: path.join(rootDir, ".env"), override: false });

  const envForClient = {
    MODE: "production",
    DEV: false,
    PROD: true,
    BASE_URL: "./",
  };
  // --- end vite step ---

  /**
   * Rollup Bundle Changes
   * - Added @ alias for mapping component imports
   * - Added replace plugin to inject vite base env variables
   * - Added nodeResolve plugin to handle module resolution, hoisted deps
   * - Added url to link images in the assets folder to the name they get given on platform
   */
  const rollupBundle = await rollup({
    fs,
    input: path.join(clientDir, "**", "*.html"),
    plugins: [
      alias({
        entries: [{ find: /^@\//, replacement: clientDir + "/" }],
      }),
      nodeResolve({
        browser: true,
        preferBuiltins: false,
        exportConditions: ["production", "browser", "module", "default"],
        extensions: [".mjs", ".js", ".jsx", ".ts", ".tsx", ".json"],
        jail: rootDir,
        dedupe: ["eslint-linter-browserify", "@eslint/js", "espree"],
      }),
      url({
        include: ["**/*.png", "**/*.jpg", "**/*.jpeg", "**/*.gif", "**/*.webp", "**/*.avif", "**/*.svg"],
        limit: 0,
        fileName: `assets/[name][extname]`,
        publicPath: `${config.scope}/`,
      }),
      replace({
        preventAssignment: true,
        values: {
          "import.meta.env.MODE": JSON.stringify(envForClient.MODE),
          "import.meta.env": JSON.stringify(envForClient),
        },
      }),
      ...servicenowFrontEndPlugins({
        scope: config.scope,
        rootDir: clientDir,
        registerExplicitId,
      }),
    ],
  });

  // Added manualChunks to optimize large libraries into their own js files
  const rollupOutput = await rollupBundle.write({
    dir: staticContentDir,
    sourcemap: false,
    manualChunks(id) {
      if (!id.includes(`${path.sep}node_modules${path.sep}`)) return;
      const norm = id.split(path.sep).join("/");

      // Group TipTap + ProseMirror + lowlight into one chunk
      if (
        norm.includes("/node_modules/@tiptap/") ||
        norm.includes("/node_modules/prosemirror-") ||
        norm.includes("/node_modules/lowlight/")
      ) {
        return "tiptap";
      }

      // Group all CodeMirror related modules into one chunk
      if (
        norm.includes("/node_modules/@codemirror/") ||
        norm.includes("/node_modules/@uiw/codemirror") ||
        norm.includes("/node_modules/@replit/codemirror-")
      ) {
        return "codemirror";
      }

      // Group all ESLint related modules into one chunk
      if (
        norm.includes("/node_modules/eslint-linter-browserify") ||
        norm.includes("/node_modules/@eslint/js") ||
        norm.includes("/node_modules/espree")
      ) {
        return "eslint";
      }
    },
  });

  // Print the build results
  rollupOutput.output.forEach((file) => {
    if (file.type === "asset") {
      logger.info(`Bundled asset: ${file.fileName} (${file.source.length} bytes)`);
    } else if (file.type === "chunk") {
      logger.info(`Bundled chunk: ${file.fileName} (${file.code.length} bytes)`);
    }
  });
};
