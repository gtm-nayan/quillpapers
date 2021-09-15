import clientPromise from '$lib/helpers/db';

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function post(req) {
	let { type, question, betterTopic, betterAnswer } = JSON.parse(req.body);
	let updateQuery;

	if (type == 'BAD_CROPPING') {
		updateQuery = {
			$inc: { bad_cropping: 1 }
		};
	} else if (type == 'INCORRECT_ANSWER' && betterAnswer) {
		updateQuery = {
			$push: {
				incorrect_answer: betterAnswer
			}
		};
	} else if (type == 'INCORRECT_TOPIC' && betterTopic) {
		updateQuery = {
			$push: {
				incorrect_label: betterTopic
			}
		};
	}


	if (updateQuery) {
		const coll = (await clientPromise).db().collection('questions');
		coll.updateOne(
			{
				subject_code: question.subject_code,
				year: question.year,
				series: question.series,
				variant: question.variant,
				question_no: question.questionNo
			},
			updateQuery,
		);
        return {
            status: 200,
        }
	}

}
