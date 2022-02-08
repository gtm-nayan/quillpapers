import pool from '$lib/db';
import { QuestionErrorType, type BaseQuestion } from '$lib/utils/types';
import type { RequestHandler } from '@sveltejs/kit';
import type { PoolClient } from 'pg';

const RANDOM_QUESTION_QUERY = `
SELECT subject_code, series, exam_year, paper_variant, question_number, correct_answer
FROM questions
WHERE subject_code = $1::TEXT AND topic = $2::SMALLINT
ORDER BY RANDOM()
LIMIT 1; 
`;

export const get: RequestHandler = async ({ params, url }) => {
	let client: PoolClient;
	try {
		client = await pool.connect();

		const db_res = await client.query(RANDOM_QUESTION_QUERY, [
			params.subject_code,
			url.searchParams.get('topic_number'),
		]);

		return db_res.rowCount
			? { status: 200, body: db_res.rows[0] }
			: { status: 404 };
	} catch (err) {
		return {
			status: 504,
		};
	} finally {
		client?.release();
	}
};

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

interface ReportedQuestion extends BaseQuestion {
	error_type: QuestionErrorType;
	topic_suggestion?: number;
}

export const post: RequestHandler = async ({ request }) => {
	let client: PoolClient;

	try {
		const body = (await request.json()) as ReportedQuestion;

		const report_params = [
			body.subject_code,
			body.series,
			body.exam_year,
			body.paper_variant,
			body.question_number,
		];
		if (!report_params.every((v) => v)) throw new Error('Malformed question.');

		client = await pool.connect();

		switch (body.error_type) {
			case QuestionErrorType.BAD_CROPPING: {
				await client.query(BAD_CROPPING_FLAG_QUERY, report_params);
				break;
			}

			case QuestionErrorType.WRONG_ANSWER: {
				await client.query(WRONG_ANSWER_FLAG_QUERY, report_params);
				break;
			}

			case QuestionErrorType.WRONG_TOPIC: {
				if (!body.topic_suggestion) {
					throw new Error('Topic suggestion not provided.');
				}

				await client.query(WRONG_TOPIC_FLAG_QUERY, [
					...report_params,
					body.topic_suggestion,
				]);
				break;
			}
		}

		return {
			status: 200,
		};
	} catch (e) {
		return {
			status: 400,
			body: (e as Error).message,
		};
	} finally {
		client?.release();
	}
};
