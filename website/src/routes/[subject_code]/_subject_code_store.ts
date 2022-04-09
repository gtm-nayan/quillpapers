import { page } from '$app/stores';
import { derived } from 'svelte/store';
import type { SubjectCode } from '../../lib/utils/types';

export default derived(
	page,
	($page) => $page.params.subject_code as SubjectCode
);
