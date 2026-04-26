import { defineConfig } from 'vitest/config'

import path from 'node:path'

export default defineConfig({
	test: {
		coverage: {
			provider: 'v8',
			reporter: ['text'],
			enabled: true,
			include: ['src/**/*.ts'],
			exclude: [
				'dist',
				'index.ts',
				'constants.ts',
				'src/**/interfaces/*.ts',
				'src/**/*.module-definition.ts',
			],
		},
		globals: true,
		reporters: ['default', 'junit'],
	},
	plugins: [],
	resolve: {
		alias: {
			src: path.resolve(__dirname, './src'),
		},
	},
})
