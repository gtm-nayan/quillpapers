import pool from '$lib/helpers/db_pg';

const RANDOM_QUESTION_QUERY = `
SELECT subject_code, series, exam_year, paper_variant, question_number, correct_answer, topic
FROM questions
WHERE subject_code = $1::TEXT
ORDER BY RANDOM()
LIMIT 40; 
`;

export async function get(request) {
	let client = await pool.connect();
	try {
		let result = await client.query(RANDOM_QUESTION_QUERY, [request.query.get('subject_code')]);
		client.release();
		return {
			status: result.rowCount ? 200 : 404,
			body: result.rows
		};
	} catch (error) {
		client.release();
		console.log(error);
		return {
			status: 400,
			body: `ERR: NOT FOUND`
		};
	}
}
