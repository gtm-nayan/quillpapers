import type { Question, SubjectCode } from '$lib/utils/types.js';
import { error } from '@sveltejs/kit';
import { writable } from 'svelte/store';
import type { PageLoad } from './$types';

export async function _fetch_random_question(
	subject_code: SubjectCode,
	topic_number: string,
	fetch_function = fetch
) {
	const res = await fetch_function(
		`/${subject_code}/casual.json?topic_number=${topic_number}`
	);

	if (!res.ok) return null;

	return (await res.json()) as Question;
}

export const load: PageLoad = async ({ params, fetch }) => {
	const _initial_question = await _fetch_random_question(
		params.subject_code as SubjectCode,
		'1',
		fetch
	);

	if (!_initial_question) throw error(504, "Couldn't fetch question.");

	return {
		current_question: writable(_initial_question),
	};
};
