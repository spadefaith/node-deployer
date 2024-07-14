import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		port: 8990,
		watch: {
			ignored: ['db/**/*', 'apps/**/*']
		}
	}
});
