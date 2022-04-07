import { page } from '$app/stores';
import { derived } from 'svelte/store';
import type { SubjectCode } from './types';

export default derived(
	page,
	($page) => $page.params.subject_code as SubjectCode
);
