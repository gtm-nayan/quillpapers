/// <reference types="@sveltejs/kit" />

interface ImportMetaEnv {
	readonly VITE_POSTGRES_URI: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
