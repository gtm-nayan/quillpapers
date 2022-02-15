import pool from '$lib/db';
import type { RequestHandler } from '@sveltejs/kit';
import type { PoolClient } from 'pg';

const RANDOM_QUESTIONS_QUERY = `SELECT * FROM random_speedrun_questions($1::SMALLINT, 1::SMALLINT)`;

export const get: RequestHandler = async ({ params }) => {
	let client: PoolClient;
	try {
		client = await pool.connect();

		const db_res = await client.query(RANDOM_QUESTIONS_QUERY, [
			params.subject_code,
		]);

		return db_res.rowCount
			? { status: 200, body: db_res.rows }
			: { status: 404 };
	} catch (err) {
		return {
			status: 504,
		};
	} finally {
		client?.release();
	}
};
