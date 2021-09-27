/** @type {import('@sveltejs/kit').Config} */
import adapter from '@sveltejs/adapter-node';
import { isoImport } from 'vite-plugin-iso-import';

const config = {
	kit: {
		// hydrate the <div id="svelte"> element in src/app.html
		target: '#svelte',
		adapter: adapter({precompress: true}),
		vite: {
			plugins: [isoImport()]
		}
	}
};

export default config;
