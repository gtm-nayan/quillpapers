import { page } from '$app/stores';
import subjects from '$lib/data/subjects.json';
import { derived } from 'svelte/store';
import type { SubjectCode } from '$lib/utils/types';

export const subject_code = derived(
	page,
	($page) => $page.params.subject_code as SubjectCode
);

export const subject_details = derived(subject_code, ($subject_code) => subjects[$subject_code]);
