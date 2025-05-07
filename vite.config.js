import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: 'localhost',
    https: {
      key: fs.readFileSync(path.join(__dirname, 'cert.key')),
      cert: fs.readFileSync(path.join(__dirname, 'cert.crt'))
    }
  },
  build: {
    target: 'esnext'
  }
})
