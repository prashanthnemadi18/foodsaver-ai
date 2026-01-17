import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), '')
	const target = env.VITE_API_BASE || 'http://127.0.0.1:8001'

	return {
		plugins: [react()],
		server: {
			port: 5173,
			open: true,
			proxy: {
				'/api': {
					target,
					changeOrigin: true,
					rewrite: (path) => path.replace(/^\/api/, ''),
				},
			},
		},
	}
})










