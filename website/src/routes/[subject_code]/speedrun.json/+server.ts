import { sql } from '$lib/db';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params }) => {
	const res = await sql`SELECT * FROM random_speedrun_questions(
			${params.subject_code}::SMALLINT,
			1::SMALLINT
		)`;

	if (res.length) {
		return json(res);
	}

	throw error(404);
};
