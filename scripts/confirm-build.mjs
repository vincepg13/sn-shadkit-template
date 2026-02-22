#!/usr/bin/env node
/* eslint-disable @servicenow/sdk-app-plugin/no-unsupported-node-builtins */
/* eslint-disable no-console */
import { spawnSync } from 'node:child_process'

const proceedSilently =
  process.env.CI === 'true' ||
  process.env.YARN_ENABLE_IMMUTABLE_INSTALLS === 'true' ||
  process.env.NONINTERACTIVE === '1'

if (!process.stdout.isTTY || proceedSilently) process.exit(0)

const message = [
  'STOP AND THINK. Prior to building, do you need to run a transform?',
  'Press ENTER to build.',
  'Press T to transform now, then build.',
  'Press ESC to cancel.'
].join('\n')

process.stdout.write(message + '\n')

const cleanupAndExit = (code = 0) => {
  try {
    if (process.stdin.isTTY) process.stdin.setRawMode(false)
  } catch {}
  process.stdin.pause()
  process.exit(code)
}

process.stdin.setRawMode(true)
process.stdin.resume()
process.stdin.setEncoding('utf8')

process.stdin.on('data', key => {
  // ENTER (\r or \n)
  if (key === '\r' || key === '\n') {
    console.log('Proceeding with build…')
    cleanupAndExit(0)
    return
  }

  // 'T' or 't' -> run transform first
  if (key.toLowerCase() === 't') {
    console.log('\nRunning transform…')
    const result = spawnSync('npx', ['@servicenow/sdk', 'transform'], {
      stdio: 'inherit',
      shell: true,
    })
    if (result.status !== 0) {
      console.error('Transform failed or aborted. Build cancelled.')
      cleanupAndExit(result.status || 1)
    } else {
      console.log('Transform complete. Proceeding with build…')
      cleanupAndExit(0)
    }
  }

  // ESC, q, or Ctrl+C -> cancel
  if (key === '\x1b' || key === 'q' || key === '\u0003') {
    console.log('\nBuild cancelled.')
    cleanupAndExit(1)
  }
})
