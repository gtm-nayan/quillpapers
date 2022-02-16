<script context="module" lang="ts">
	import { browser } from '$app/env';
	import { page } from '$app/stores';
	import ButtonsRow from '$lib/components/app/ButtonsRow.svelte';
	import QuestionViewer from '$lib/components/app/QuestionViewer.svelte';
	import subjects from '$lib/data/subjects.json';
	import get_PDF_URL from '$lib/utils/pdf_url_gen';
	import type { Question, SubjectCode } from '$lib/utils/types.js';
	import type { Load } from '@sveltejs/kit';
	import { setContext } from 'svelte';
	import { shortcut } from 'svelte-actions/dist/shortcut.js';
	import { Document } from 'svelte-pdfjs';
	import { writable } from 'svelte/store';

	async function fetch_random_question(
		subject_code: SubjectCode,
		topic_number: string,
		fetch_function = fetch
	): Promise<Question | null> {
		const res = await fetch_function(
			`/${subject_code}/casual.json?topic_number=${topic_number}`
		);

		if (!res.ok) return null;
		return await res.json();
	}

	const current_question = writable<Question>();

	export const load: Load = async ({ params, fetch }) => {
		const subject_code = params.subject_code as SubjectCode;

		const _initial_question = await fetch_random_question(
			subject_code,
			'1',
			fetch
		);

		if (!_initial_question)
			return {
				status: 504,
				error: new Error('An error occured.'),
			};

		current_question.set(_initial_question);
		return {
			status: 200,
		};
	};
</script>

<script lang="ts">
	import ErrorModal from './_components/ErrorModal.svelte';

	const subject_code = $page.params.subject_code as SubjectCode;

	let previous_question = $current_question;
	setContext('current_question', current_question);

	let topic_number: string = '1';

	async function handle_next_question() {
		const new_question = await fetch_random_question(
			subject_code,
			topic_number
		);
		if (!new_question) return alert('Failed to fetch question.');
		previous_question = $current_question;
		$current_question = new_question;
	}

	function handle_previous_question() {
		const temp = previous_question;
		previous_question = $current_question;
		$current_question = temp;
	}
</script>

<svelte:head>
	<title>
		{subject_code} |
		{subjects[subject_code].name} |
		{subjects[subject_code].topics[topic_number].title}
	</title>
</svelte:head>

<main>
	{#if browser}
		<Document file={get_PDF_URL($current_question)}>
			<QuestionViewer />

			<!-- <section> -->

			<ButtonsRow
				on:back={handle_previous_question}
				on:next={handle_next_question}
				show_correct
			>
				<select
					bind:value={topic_number}
					on:change={handle_next_question}
					use:shortcut={{ code: 'KeyT', callback: (e) => e.focus() }}
				>
					{#each Object.entries(subjects[subject_code].topics) as [topic_number, { title }]}
						<option value={topic_number}>{title}</option>
					{/each}
				</select>
				<code>
					{$current_question.series}{$current_question.exam_year}
					{$current_question.paper_variant}
				</code>
				<ErrorModal />
			</ButtonsRow>

			<!-- </section> -->
		</Document>
	{/if}
</main>

<style>
	main {
		display: grid;
		grid-template-rows: 7fr auto;
	}
</style>
