/// <reference types="@sveltejs/kit" />
/// <reference types="unplugin-icons/types/svelte" />

interface ImportMetaEnv {
	readonly VITE_POSTGRES_URI: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
