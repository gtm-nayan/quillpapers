import { sql } from '$lib/db';
import { QuestionErrorType } from '$lib/utils/types';
import type { RequestHandler } from '.svelte-kit/types/src/routes/[subject_code]/casual/index.json';
import { ZodError } from 'zod';
import { zod_schema, type ReportedQuestion } from './_reported_question';

export const get: RequestHandler = async ({ params, url }) => {
	try {
		const res = await sql`SELECT * FROM random_casual_question(
			${params.subject_code}::SMALLINT,
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

		return {
			status: 200,
		};
	} catch (err: unknown) {
		const errors =
			err instanceof ZodError
				? err.errors.map((i) => i.message)
				: [(err as Error).message];
		console.error(err);
		return {
			status: 400,
			body: errors,
		};
	}
};
