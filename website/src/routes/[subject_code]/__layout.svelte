<script context="module" lang="ts">
	import subjects from '$lib/data/subjects.json';
	import type { SubjectCode } from '$lib/utils/types';
	import type { Load } from '@sveltejs/kit';

	export const load: Load = async ({ params }) => {
		const subject_code = params.subject_code as SubjectCode;

		if (!subjects[subject_code])
			return {
				status: 404,
				error: new Error('No matching subject found for that code.'),
			};
		return {
			status: 200,
		};
	};
</script>

<slot />
