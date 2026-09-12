import { createServer } from 'vite'
import react from '@vitejs/plugin-react'
import tailwind from '@tailwindcss/vite'
import {
  DEFAULT_PROXY_PATHS,
  createViteProxy,
  servicenowVitePlugins,
} from '@servicenow/isomorphic-rollup/vite'

const EXTRA_PROXY_PATHS = [
  '/uxasset',
  '/angular.do',
  '/sys_script.do',
  '/sys_attachment.do',
  '/xmlhttp.do',
  '/sn_va_web_client_login.do',
  '/sn_va_web_client_app_embed.do',
  '^/[^/?]+_list\\.do(?:\\?|$)',
  '^/[^/]+\\.(gif|png|jpg|jpeg|svg|webp|ico|iix)$',
]

const addWebSocketAuthentication = async (proxy, credential, instanceUrl) => {
  const ambProxy = proxy['/amb']

  if (!ambProxy) return

  const headers = await credential.getHeaders()
  const configureAmbProxy = ambProxy.configure

  ambProxy.headers = {
    ...ambProxy.headers,
    Origin: instanceUrl.origin,
  }
  ambProxy.configure = (proxyServer, options) => {
    configureAmbProxy?.(proxyServer, options)
    proxyServer.on('proxyReqWs', (proxyRequest) => {
      Object.entries(headers).forEach(([name, value]) => proxyRequest.setHeader(name, value))
    })
  }
}

export default async ({ rootDir, config, path, logger, credential }) => {
  if (!credential) {
    throw new Error('A ServiceNow credential is required to run the Vite development server.')
  }

  const clientDir = path.join(rootDir, config.clientDir)
  const instanceUrl = credential.getUrl()
  const serviceNowPlugins = await servicenowVitePlugins({
    scope: config.scope,
    rootDir: clientDir,
    credential,
  })
  const proxyPaths = [...new Set([...DEFAULT_PROXY_PATHS, ...EXTRA_PROXY_PATHS])]
  const proxy = await createViteProxy(credential, proxyPaths)

  await addWebSocketAuthentication(proxy, credential, instanceUrl)

  const server = await createServer({
    root: clientDir,
    envDir: rootDir,
    configFile: false,
    publicDir: false,
    plugins: [react(), tailwind(), ...serviceNowPlugins],
    define: {
      'import.meta.env.VITE_INSTANCE_URL': JSON.stringify(instanceUrl.href.replace(/\/$/, '')),
    },
    resolve: {
      alias: {
        '@': clientDir,
      },
      dedupe: ['eslint-linter-browserify', '@eslint/js', 'espree'],
    },
    server: {
      port: 5173,
      strictPort: true,
      proxy,
    },
  })

  await server.listen()
  logger.info(`Vite dev server running at http://localhost:${server.config.server.port}`)

  return new Promise(() => {})
}
