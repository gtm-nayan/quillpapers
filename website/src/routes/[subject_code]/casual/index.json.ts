import pool from '$lib/db';
import { QuestionErrorType, type BaseQuestion } from '$lib/utils/types';
import type { RequestHandler } from '@sveltejs/kit';
import type { PoolClient } from 'pg';

const RANDOM_QUESTION_QUERY = `SELECT * FROM random_casual_question($1::SMALLINT, 1::SMALLINT, $2::SMALLINT)`;

export const get: RequestHandler = async ({ params, url }) => {
	let client!: PoolClient;
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

/**
 * @param {number} $1 - subject_code
 * @param {'m' | 's' | 'w'} $2 - series
 * @param {number} $3 - year
 * @param {number} $4 - paper_variant_major
 * @param {number} $5 - paper_variant_minor
 * @param {number} $6 - question_number
 */
const BAD_CROPPING_FLAG_QUERY = `SELECT increment_bad_cropping_flags($1::SMALLINT, $2::ExamSeries, $3::SMALLINT, $4::SMALLINT, $5::SMALLINT, $6::SMALLINT)`;

/**
 * @param {number} $1 - subject_code
 * @param {'m' | 's' | 'w'} $2 - series
 * @param {number} $3 - year
 * @param {number} $4 - paper_variant_major
 * @param {number} $5 - paper_variant_minor
 * @param {number} $6 - question_number
 */
const WRONG_ANSWER_FLAG_QUERY = `SELECT increment_wrong_answer_flags($1::SMALLINT, $2::ExamSeries, $3::SMALLINT, $4::SMALLINT, $5::SMALLINT, $6::SMALLINT)`;

/**
 * @param {number} $1 - subject_code
 * @param {'m' | 's' | 'w'} $2 - series
 * @param {number} $3 - year
 * @param {number} $4 - paper_variant_major
 * @param {number} $5 - paper_variant_minor
 * @param {number} $6 - question_number
 * @param {number} $7 - topic_number -  The suggested topic number
 */
const WRONG_TOPIC_FLAG_QUERY = `SELECT push_wrong_topic_flags($1::SMALLINT, $2::ExamSeries, $3::SMALLINT, $4::SMALLINT, $5::SMALLINT, $6::SMALLINT, $7::SMALLINT)`;

interface ReportedQuestion extends BaseQuestion {
	error_type: QuestionErrorType;
	topic_suggestion?: number;
}

export const post: RequestHandler = async ({ request }) => {
	let client!: PoolClient;

	try {
		const body = (await request.json()) as ReportedQuestion;

		const report_params = [
			body.subject_code,
			body.series,
			body.exam_year,
			body.paper_variant.toString()[0],
			body.paper_variant.toString()[1],
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
