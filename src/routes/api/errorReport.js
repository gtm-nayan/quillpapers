import pool from '$lib/helpers/db_pg';

const BAD_CROPPING_FLAG_QUERY = `
UPDATE questions SET bad_cropping_flags = bad_cropping_flags + 1
WHERE
    subject_code = $1::TEXT AND
    series = $2::exam_series AND
    exam_year = $3::SMALLINT AND
    paper_variant = $4::SMALLINT AND
    question_number = $5::SMALLINT;
`;

const WRONG_ANSWER_FLAG_QUERY = `
UPDATE questions SET wrong_answer_flags = wrong_answer_flags + 1
WHERE
    subject_code = $1::TEXT AND
    series = $2::exam_series AND
    exam_year = $3::SMALLINT AND
    paper_variant = $4::SMALLINT AND
    question_number = $5::SMALLINT;
`;

const WRONG_TOPIC_FLAG_QUERY = `
UPDATE questions SET wrong_topic_flags = wrong_topic_flags || $6::SMALLINT
WHERE
    subject_code = $1::TEXT AND
    series = $2::exam_series AND
    exam_year = $3::SMALLINT AND
    paper_variant = $4::SMALLINT AND
    question_number = $5::SMALLINT;
`;

export async function post(request) {
	let client = await pool.connect();

	let report_params = [
		request.body.subject_code,
		request.body.series,
		request.body.exam_year,
		request.body.paper_variant,
		request.body.question_number
	];

	try {
		switch (request.body.error_type) {
			case 'BAD_CROPPING':
				await client.query(BAD_CROPPING_FLAG_QUERY, report_params);
				break;

			case 'WRONG_ANSWER':
				await client.query(WRONG_ANSWER_FLAG_QUERY, report_params);
				break;

			case 'WRONG_TOPIC':
				if (!request.body.topic_suggestion) {
					throw new Error('Bad request');
				}

				await client.query(WRONG_TOPIC_FLAG_QUERY, [
					...report_params,
					request.body.topic_suggestion
				]);
				break;

			default:
				throw new Error('Bad request');
		}
		client.release();
		return {
			status: 200
		};
	} catch (error) {
		client.release();
		console.log(error, request);
		return {
			status: 400
		};
	}
}
