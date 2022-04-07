<script context="module" lang="ts">
	import { browser } from '$app/env';
	import ButtonsRow from '$lib/components/app/ButtonsRow.svelte';
	import QuestionViewer from '$lib/components/app/QuestionViewer.svelte';
	import subjects from '$lib/data/subjects.json';
	import { get_PDF_URL } from '$lib/utils/pdf_url_gen';
	import { shortcut } from '$lib/utils/shortcut';
	import subject_code from '$lib/utils/subject_code_store';
	import type { Question, SubjectCode } from '$lib/utils/types.js';
	import type { Load } from '@sveltejs/kit';
	import { setContext } from 'svelte';
	import { Document } from 'svelte-pdfjs';
	import { writable, type Writable } from 'svelte/store';
	import ErrorModal from './_components/ErrorModal.svelte';

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
				error: new Error("Couldn't fetch question."),
			};

		const current_question = writable<Question>();
		return {
			status: 200,
			props: {
				current_question,
			},
		};
	};
</script>

<script lang="ts">
	export let current_question: Writable<Question>;

	let previous_question = $current_question;
	setContext('current_question', current_question);
	setContext('show_correct', true); // Show whether answer was correct or not

	let topic_number: keyof typeof subjects[SubjectCode]['topics'] = '1';

	async function handle_next_question() {
		const new_question = await fetch_random_question(
			$subject_code,
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
		{$subject_code} |
		{subjects[$subject_code].name} |
		{subjects[$subject_code].topics[topic_number].title}
	</title>
</svelte:head>

<main>
	{#if browser}
		<Document file={get_PDF_URL($current_question)}>
			<QuestionViewer />
			<ButtonsRow
				on:back={handle_previous_question}
				on:next={handle_next_question}
			>
				<select
					bind:value={topic_number}
					on:change={handle_next_question}
					use:shortcut={{ code: 'KeyT', callback: (e) => e.focus() }}
				>
					{#each Object.entries(subjects[$subject_code].topics) as [topic_number, { title }]}
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
	{/if}
</main>

<style>
	main {
		display: grid;
		grid-template-rows: 7fr auto;
	}
</style>
