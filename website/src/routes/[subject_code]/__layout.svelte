<script context="module" lang="ts">
	import subjects from '$lib/data/subjects.json';
	import type { SubjectCode } from '$lib/utils/types';
	import type { Load } from '@sveltejs/kit';

	export const load: Load = ({ params }) =>
		subjects[params.subject_code as SubjectCode]
			? { status: 200 }
			: {
					status: 404,
					error: new Error('No matching subject found for that code.'),
			  };
</script>

<slot />
