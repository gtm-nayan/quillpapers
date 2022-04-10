import { sql } from '$lib/db';
import { QuestionErrorType, type SubjectCode } from '$lib/utils/types';
import type { RequestHandler } from '@sveltejs/kit';
import { ValidationError } from 'yup';
import { schema, type ReportedQuestion } from './_reported_question';

export const get: RequestHandler = async ({ params, url }) => {
	try {
		const res = await sql`SELECT * FROM random_casual_question(
			${params.subject_code as SubjectCode}::SMALLINT,
			1::SMALLINT,
			${url.searchParams.get('topic_number') ?? 1}::SMALLINT
		)`;

		return res.length ? { status: 200, body: res.at(0) } : { status: 404 };
	} catch (err) {
		return {
			status: 504,
		};
	}
};

export const post: RequestHandler = async ({ request }) => {
	try {
		const body = (await request.json()) as ReportedQuestion;
		schema.validateSync(body);

		switch (body.error_type) {
			case QuestionErrorType.BAD_CROPPING:
				await sql`SELECT increment_bad_cropping_flags(
					${body.subject_code}::SMALLINT, 
					${body.series}::ExamSeries, 
					${body.exam_year}::SMALLINT, 
					${body.paper_variant.toString()[0]}::SMALLINT, 
					${body.paper_variant.toString()[1]}::SMALLINT, 
					${body.question_number}::SMALLINT
				)`;
				break;

			case QuestionErrorType.WRONG_ANSWER:
				await sql`SELECT increment_wrong_answer_flags(
					${body.subject_code}::SMALLINT, 
					${body.series}::ExamSeries, 
					${body.exam_year}::SMALLINT, 
					${body.paper_variant.toString()[0]}::SMALLINT, 
					${body.paper_variant.toString()[1]}::SMALLINT, 
					${body.question_number}::SMALLINT
				)`;
				break;

			case QuestionErrorType.WRONG_TOPIC: {
				if (!body.topic_suggestion) {
					throw new Error('Topic suggestion not provided.');
				}

				await sql`SELECT push_wrong_topic_flags(
					${body.subject_code}::SMALLINT, 
					${body.series}::ExamSeries, 
					${body.exam_year}::SMALLINT, 
					${body.paper_variant.toString()[0]}::SMALLINT, 
					${body.paper_variant.toString()[1]}::SMALLINT, 
					${body.question_number}::SMALLINT,
					${body.topic_suggestion}::SMALLINT
				)`;
				break;
			}
		}

		return {
			status: 200,
		};
	} catch (e) {
		console.error((e as Error)?.message ?? e);
		return {
			status: 400,
			body:
				e instanceof ValidationError ? e.errors : ["Couldn't report question."],
		};
	}
};
