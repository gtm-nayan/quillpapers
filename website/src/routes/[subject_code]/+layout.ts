import subjects from '$lib/data/subjects.json';
import type { SubjectCode } from '$lib/utils/types';
import { error } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = ({ params }) => {
	if (!subjects[params.subject_code as SubjectCode]) {
		throw error(404, 'No matching subject found for that code.')
	}		
};
