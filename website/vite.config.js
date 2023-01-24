import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { imagetools } from 'vite-imagetools';

import Icons from 'unplugin-icons/vite';
export default defineConfig({
	plugins: [
		sveltekit(),
		imagetools(),
		Icons({
			compiler: 'svelte',
			autoInstall: true,
		}),
	],
});
