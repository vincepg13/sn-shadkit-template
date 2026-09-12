import { build } from 'vite'
import tailwind from '@tailwindcss/vite'
import { glob } from '@servicenow/isomorphic-rollup'
import { servicenowVitePlugins } from '@servicenow/isomorphic-rollup/vite'

const MAX_CHUNK_SIZE_BYTES = 3_000_000
const FONT_EXTENSIONS = new Set(['.eot', '.otf', '.ttf', '.woff', '.woff2'])

const normalizeModuleId = (id) => id.split('\\').join('/')

const createManualChunks = (id) => {
  if (!normalizeModuleId(id).includes('/node_modules/')) return

  const normalizedId = normalizeModuleId(id)

  if (
    normalizedId.includes('/node_modules/@tiptap/') ||
    normalizedId.includes('/node_modules/prosemirror-') ||
    normalizedId.includes('/node_modules/lowlight/')
  ) {
    return 'tiptap'
  }

  if (
    normalizedId.includes('/node_modules/@codemirror/') ||
    normalizedId.includes('/node_modules/@uiw/codemirror') ||
    normalizedId.includes('/node_modules/@replit/codemirror-')
  ) {
    return 'codemirror'
  }

  if (
    normalizedId.includes('/node_modules/eslint-linter-browserify') ||
    normalizedId.includes('/node_modules/@eslint/js') ||
    normalizedId.includes('/node_modules/espree')
  ) {
    return 'eslint'
  }

  if (
    normalizedId.includes('/node_modules/react/') ||
    normalizedId.includes('/node_modules/react-dom/') ||
    normalizedId.includes('/node_modules/react-router/') ||
    normalizedId.includes('/node_modules/scheduler/')
  ) {
    return 'react-runtime'
  }

  if (
    normalizedId.includes('/node_modules/recharts/') ||
    normalizedId.includes('/node_modules/d3-') ||
    normalizedId.includes('/node_modules/victory-vendor/')
  ) {
    return 'charts'
  }

  if (
    normalizedId.includes('/node_modules/@base-ui/') ||
    normalizedId.includes('/node_modules/@radix-ui/') ||
    normalizedId.includes('/node_modules/lucide-react/') ||
    normalizedId.includes('/node_modules/radix-ui/')
  ) {
    return 'ui-components'
  }

  if (normalizedId.includes('/node_modules/sn-shadcn-kit/')) {
    return 'sn-shadcn-kit'
  }

  if (
    normalizedId.includes('/node_modules/prettier/') ||
    normalizedId.includes('/node_modules/postcss/') ||
    normalizedId.includes('/node_modules/htmlparser2/')
  ) {
    return 'formatting'
  }
}

const assertChunkSizes = (buildResult) => {
  const buildOutputs = Array.isArray(buildResult) ? buildResult : [buildResult]
  const oversizedChunks = buildOutputs
    .flatMap((output) => output.output ?? [])
    .filter((output) => output.type === 'chunk')
    .map((chunk) => ({ fileName: chunk.fileName, size: Buffer.byteLength(chunk.code) }))
    .filter(({ size }) => size >= MAX_CHUNK_SIZE_BYTES)

  if (!oversizedChunks.length) return

  const details = oversizedChunks.map(({ fileName, size }) => `${fileName} (${size} bytes)`).join(', ')
  throw new Error(`ServiceNow JavaScript chunks must be smaller than ${MAX_CHUNK_SIZE_BYTES} bytes: ${details}`)
}

export default async ({ rootDir, config, fs, path, logger, registerExplicitId }) => {
  const clientDir = path.join(rootDir, config.clientDir)
  const htmlFilePattern = path.join('**', '*.html')
  const htmlFiles = await glob(htmlFilePattern, { cwd: clientDir, fs })

  if (!htmlFiles.length) {
    logger.warn(`No HTML files found in ${clientDir}, skipping UI build.`)
    return
  }

  const staticContentDir = path.join(rootDir, config.staticContentDir)
  fs.rmSync(staticContentDir, { recursive: true, force: true })

  const serviceNowPlugins = await servicenowVitePlugins({
    scope: config.scope,
    rootDir: clientDir,
    registerExplicitId,
    enableCacheBusting: true,
  })

  const buildResult = await build({
    root: clientDir,
    envDir: rootDir,
    configFile: false,
    esbuild: false,
    publicDir: false,
    plugins: [tailwind(), ...serviceNowPlugins],
    resolve: {
      alias: {
        '@': clientDir,
      },
      dedupe: ['eslint-linter-browserify', '@eslint/js', 'espree'],
    },
    build: {
      outDir: staticContentDir,
      emptyOutDir: true,
      sourcemap: true,
      assetsInlineLimit(filePath) {
        return FONT_EXTENSIONS.has(path.extname(filePath).toLowerCase()) || undefined
      },
      rollupOptions: {
        input: path.join(clientDir, '**', '*.html'),
        output: {
          manualChunks: createManualChunks,
        },
      },
    },
  })

  assertChunkSizes(buildResult)
}
