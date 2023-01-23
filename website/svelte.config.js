import adapter from '@sveltejs/adapter-netlify';
import preprocess from 'svelte-preprocess';
import { imagetools } from 'vite-imagetools';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: [
		preprocess({
			postcss: {
				configFilePath: 'postcss.config.cjs',
			},
		}),
	],

	kit: {
		adapter: adapter({
			external: ["canvas"]
		}),
		vite: {
			plugins: [imagetools()],
		},
	},
};

export default config;
