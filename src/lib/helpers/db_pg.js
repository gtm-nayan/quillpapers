import pg_pkg from 'pg';
const { Pool } = pg_pkg;
let pool = new Pool({
	connectionString: import.meta.env.VITE_POSTGRES_URI,
	idleTimeoutMillis: 60000
});
export default pool;