import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { imagetools } from 'vite-imagetools';

import Icons from 'unplugin-icons/vite';
export default defineConfig({
	build: {
		rollupOptions: {
			output: {
				experimentalMinChunkSize: 8192,
			},
		},
	},
	plugins: [
		sveltekit(),
		imagetools(),
		Icons({
			compiler: 'svelte',
			autoInstall: true,
		}),
	],
});
