<script context="module" lang="ts">
	import { get_PDF_URL } from '$lib/utils/pdf_url_gen';
	import type { PageData } from './$types';
</script>

<script lang="ts">
	import QuestionViewer from '$lib/components/app/QuestionViewer.svelte';
	import { Document } from 'svelte-pdfjs';
	import { setContext } from 'svelte';
	import ButtonsRow from '$lib/components/app/ButtonsRow.svelte';
	import { subject_code, subject_details } from '../../_subject_code_store';
	import { _fetch_random_question } from './+page';
	import Seo from '$lib/components/common/SEO.svelte';
	import ErrorModal from './_components/ErrorModal.svelte';

	export let data: PageData;
	let { current_question } = data;
	$: ({ current_question } = data);

	setContext('current_question', current_question);
	setContext('show_correct', true);
	let prev_question = $current_question;

	let topic_number = '1';

	async function handle_next_question() {
		const new_question = await _fetch_random_question(
			$subject_code,
			topic_number
		);
		if (!new_question) return alert('Failed to fetch question.');
		prev_question = $current_question;
		$current_question = new_question;
	}

	function handle_previous_question() {
		const temp = prev_question;
		prev_question = $current_question;
		$current_question = temp;
	}
</script>

<!-- prettier-ignore -->
<Seo
	title="{$subject_code} | {$subject_details.name} | {$subject_details.topics[topic_number].title}"
/>

<main>
	<Document file={get_PDF_URL($current_question)}>
		<QuestionViewer />

		<ButtonsRow
			on:back={handle_previous_question}
			on:next={handle_next_question}
		>
			<select bind:value={topic_number} on:change={handle_next_question}>
				{#each Object.entries($subject_details.topics) as [topic_number, { title }]}
					<option value={topic_number}>{title}</option>
				{/each}
			</select>

			<code>
				{$current_question.series}{$current_question.exam_year}
				{$current_question.paper_variant}
			</code>
			<ErrorModal />
		</ButtonsRow>
	</Document>
</main>

<style lang="scss">
	main {
		display: grid;
		grid-template-rows: 7fr auto;
	}
</style>
