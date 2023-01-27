import postgres from 'postgres';

export const sql = postgres(import.meta.env.VITE_POSTGRES_URI, {
	idle_timeout: 30,
});
