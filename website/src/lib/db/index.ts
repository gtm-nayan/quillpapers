import pg from 'pg';

const pool = new pg.Pool({
	connectionString: import.meta.env.VITE_POSTGRES_URI as string,
	idleTimeoutMillis: 60_000,
});

export default pool;
