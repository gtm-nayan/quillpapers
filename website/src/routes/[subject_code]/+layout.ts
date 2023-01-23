import subjects from '$lib/data/subjects.json';
import type { SubjectCode } from '$lib/utils/types';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = ({ params }) => {
	subjects[params.subject_code as SubjectCode]
		? { status: 200 }
		: {
				status: 404,
				error: new Error('No matching subject found for that code.'),
		  };
};
