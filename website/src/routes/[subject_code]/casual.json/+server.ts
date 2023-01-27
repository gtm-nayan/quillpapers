import { sql } from '$lib/db/index.server';
import { QuestionErrorType } from '$lib/utils/types';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { error_report_schema, type ReportedQuestion } from './_reported_question.js';

export const GET: RequestHandler = async ({ params, url }) => {
	const res = await sql`SELECT * FROM random_casual_question(
			${params.subject_code}::SMALLINT,
			1::SMALLINT,
			${url.searchParams.get('topic_number') ?? 1}::SMALLINT
		)`;

	if (res.length) {
		return json(res[0]);
	}

	throw error(404);
};

export const POST: RequestHandler = async ({ request }) => {
	const parsed_question = error_report_schema.safeParse(await request.json());

	if (!parsed_question.success) {
		throw error(400);
	}

	try {
		const { question, error } = parsed_question.data as ReportedQuestion;
		const args = sql`
			${question.subject_code}::SMALLINT,
			${question.series}::ExamSeries,
			${question.exam_year}::SMALLINT,
			${question.paper_variant.toString()[0]}::SMALLINT,
			${question.paper_variant.toString()[1]}::SMALLINT,
			${question.question_number}::SMALLINT`;

		switch (error.type) {
			case QuestionErrorType.BAD_CROPPING:
				await sql`SELECT increment_bad_cropping_flags(${args})`;
				break;

			case QuestionErrorType.WRONG_ANSWER:
				await sql`SELECT increment_wrong_answer_flags(${args})`;
				break;

			case QuestionErrorType.WRONG_TOPIC: {
				await sql`SELECT push_wrong_topic_flags(
					${args},
					${error.topic_suggestion}::SMALLINT
				)`;
				break;
			}
		}

		return new Response(null, {
			status: 200,
		});
	} catch (err: unknown) {
		throw error(500);
	}
};
