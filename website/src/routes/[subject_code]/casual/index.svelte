<script context="module" lang="ts">
	import { browser } from '$app/env';
	import ButtonsRow from '$lib/components/app/ButtonsRow.svelte';
	import QuestionViewer from '$lib/components/app/QuestionViewer.svelte';
	import Seo from '$lib/components/common/SEO.svelte';
	import { get_PDF_URL } from '$lib/utils/pdf_url_gen';
	import { shortcut } from '$lib/utils/shortcut';
	import type { Question, SubjectCode } from '$lib/utils/types.js';
	import { setContext } from 'svelte';
	import { Document } from 'svelte-pdfjs';
	import { writable, type Writable } from 'svelte/store';
	import type { Load } from '.';
	import { subject_code, subject_details } from '../_subject_code_store';
	import ErrorModal from './_components/ErrorModal.svelte';

	async function fetch_random_question(
		subject_code: SubjectCode,
		topic_number: string,
		fetch_function = fetch
	) {
		return fetch_function(
			`/${subject_code}/casual.json?topic_number=${topic_number}`
		).then((res) => (res.ok ? (res.json() as Promise<Question>) : null));
	}

	export const load: Load = async ({ params, fetch }) => {
		const _initial_question = await fetch_random_question(
			params.subject_code as SubjectCode,
			'1',
			fetch
		);

		if (!_initial_question)
			return {
				status: 504,
				error: new Error("Couldn't fetch question."),
			};

		return {
			status: 200,
			props: {
				current_question: writable(_initial_question),
			},
		};
	};
</script>

<script lang="ts">
	export let current_question: Writable<Question>;

	let prev_question = $current_question;
	setContext('current_question', current_question);
	setContext('show_correct', true); // Tells AnswerButton to show whether answer was correct or not

	let topic_number = '1';

	async function handle_next_question() {
		const new_question = await fetch_random_question(
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
	{/if}
</main>

<style>
	main {
		display: grid;
		grid-template-rows: 7fr auto;
	}
</style>
