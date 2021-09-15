import clientPromise from '$lib/helpers/db';
import subjects from '$lib/data/subjects';

async function getRandomQuestion(subject_code, topic_number) {
	const client = await clientPromise;
	const coll = client.db().collection('questions');

	const aggCursor = coll.aggregate([
		{ $match: { subject_code, category: topic_number } },
		{ $sample: { size: 1 } }
	]);

	for await (let doc of aggCursor) {
		return JSON.stringify({
			subject_code,
			year: doc.year,
			series: doc.series,
			variant: doc.variant,
			questionNo: doc.question_no,
			correct: doc.answer
		});
	}
}

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */

export async function get({ params }) {
	let code = parseInt(params.subject_code);

	if (subjects[code]?.topics[parseInt(params.topicNo)]) {
		return { body: await getRandomQuestion(code, parseInt(params.topicNo)) };
	} else {
		return {
			status: 404,
			error: "Couldn't find that topic for that subject."
		};
	}
}
