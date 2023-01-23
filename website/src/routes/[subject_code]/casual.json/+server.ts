import { sql } from '$lib/db';
import { QuestionErrorType } from '$lib/utils/types';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { zod_schema, type ReportedQuestion } from './_reported_question.js';

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
	try {
		const body = zod_schema.parse(await request.json()) as ReportedQuestion;

		const args = sql`
			${body.subject_code}::SMALLINT,
			${body.series}::ExamSeries,
			${body.exam_year}::SMALLINT,
			${body.paper_variant.toString()[0]}::SMALLINT,
			${body.paper_variant.toString()[1]}::SMALLINT,
			${body.question_number}::SMALLINT`;

		switch (body.error_type) {
			case QuestionErrorType.BAD_CROPPING:
				await sql`SELECT increment_bad_cropping_flags(${args})`;
				break;

			case QuestionErrorType.WRONG_ANSWER:
				await sql`SELECT increment_wrong_answer_flags(${args})`;
				break;

			case QuestionErrorType.WRONG_TOPIC: {
				await sql`SELECT push_wrong_topic_flags(
					${args},
					${
						// zod_schema's refine guarantees this
						// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
						body.topic_suggestion!
					}::SMALLINT
				)`;
				break;
			}
		}

		return new Response(null, {
			status: 200,
		});
	} catch (err: unknown) {
		throw error(400);
	}
};