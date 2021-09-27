import pool from '$lib/helpers/db_pg';

const RANDOM_QUESTION_QUERY = `
SELECT subject_code, series, exam_year, paper_variant, question_number, correct_answer
FROM questions
WHERE subject_code = $1::TEXT AND topic = $2::SMALLINT
ORDER BY RANDOM()
LIMIT 1; 
`;

export async function get(request) {
	let client = await pool.connect();
	try {
		let result = await client.query(RANDOM_QUESTION_QUERY, [
			request.query.get('subject_code'),
			request.query.get('topic_number')
		]);
		client.release();
		return {
			status: result.rowCount ? 200 : 404,
			body: result.rowCount && result.rows[0]
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
