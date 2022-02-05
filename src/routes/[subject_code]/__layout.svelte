<script context="module" lang="ts">
	import subjects from '$lib/data/subjects.json';
	import type { Load } from '@sveltejs/kit';

	export const load: Load = async ({ params }) => {
		if (!subjects[params.subject_code])
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
