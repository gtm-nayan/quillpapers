import type { RequestHandler } from '@sveltejs/kit';
import pool from '$lib/db';
import type { PoolClient } from 'pg';

const RANDOM_QUESTIONS_QUERY = `
SELECT subject_code, series, exam_year, paper_variant, question_number, correct_answer, topic as topic_number
FROM questions
WHERE subject_code = $1::TEXT
ORDER BY RANDOM()
LIMIT 40;
`;

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
