import { defineConfig } from 'vite'
import dns from 'node:dns'
import react from '@vitejs/plugin-react-swc'
import tsconfigPaths from 'vite-tsconfig-paths'

dns.setDefaultResultOrder('verbatim')

export default defineConfig({
	server: {
		host: 'localhost',
		port: 3000,
	},
	build: {
		outDir: 'build',
	},
	plugins: [react(), tsconfigPaths()],
	optimizeDeps: {
		// Exclude the following packages from being bundled into your library
		// @preflower/barcode-detector-polyfill is react-barcode-scanner's dependency. Ref: https://reactbarcodescanner.vercel.app/docs/install
		exclude: ['@preflower/barcode-detector-polyfill'],
	},
})
