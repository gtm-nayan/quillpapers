import { sql } from '$lib/db';
import type { RequestHandler } from '@sveltejs/kit';

export const get: RequestHandler = async ({ params }) => {
	try {
		const res = await sql`SELECT * FROM random_speedrun_questions(
			${params.subject_code}::SMALLINT,
			1::SMALLINT
		)`;

		return res.length ? { status: 200, body: res } : { status: 404 };
	} catch (err) {
		return {
			status: 504,
		};
	}
};
