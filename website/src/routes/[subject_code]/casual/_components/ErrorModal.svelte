<script lang="ts">
	import subjects from '$lib/data/subjects.json';
	import { zero_two } from '$lib/utils/pdf_url_gen';
	import { QuestionErrorType, type Question } from '$lib/utils/types';
	import { faFlag } from '@fortawesome/free-solid-svg-icons';
	import { getContext } from 'svelte';
	import { FaSvg, Icon } from 'svelte-yafal';
	import { noop } from 'svelte/internal';
	import type { Writable } from 'svelte/store';
	import subject_code from '../../_subject_code_store';

	const current_question: Writable<Question> = getContext('current_question');

	async function handle_submit() {
		console.log(
			fetch(`/${$subject_code}/casual.json`, {
				method: 'POST',
				body: JSON.stringify({
					...$current_question,
					error_type,
					topic_suggestion,
				}),
			}).catch(noop)
		);
	}

	let error_type: QuestionErrorType = QuestionErrorType.BAD_CROPPING;

	let topic_suggestion = '1';
	let dialog: HTMLDialogElement;

	function modal(show: boolean) {
		// @ts-expect-error
		dialog[show ? 'showModal' : 'close']?.();
	}
</script>

<span>
	<dialog bind:this={dialog}>
		<h4>
			{$current_question.subject_code}
			{$current_question.series}{zero_two($current_question.exam_year)}
			{$current_question.paper_variant}
			QN: {zero_two($current_question.question_number)}
		</h4>
		<form on:submit={handle_submit} method="dialog">
			<fieldset>
				<legend>Error type</legend>
				<select bind:value={error_type}>
					<option value={QuestionErrorType.BAD_CROPPING}>Bad cropping</option>
					<option value={QuestionErrorType.WRONG_ANSWER}>Wrong answer</option>
					<option value={QuestionErrorType.WRONG_TOPIC}>Wrong topic</option>
				</select>
			</fieldset>

			{#if error_type === QuestionErrorType.WRONG_TOPIC}
				<fieldset>
					<legend>Which topic would be better for this question?</legend>
					<select bind:value={topic_suggestion}>
						{#each Object.entries(subjects[$subject_code].topics) as [topic_number, { title }]}
							<option value={topic_number}>{title}</option>
						{/each}
					</select>
				</fieldset>
			{/if}
			<button type="submit">Submit</button>
			<button type="button" on:click={() => modal(false)}>Cancel</button>
		</form>
	</dialog>

	<button
		type="button"
		on:click={() => modal(true)}
		style:color="var(--gray-7)"
	>
		<FaSvg><Icon icon={faFlag} /></FaSvg>
		Flag this question
	</button>
</span>

<style>
	::backdrop {
		background-color: rgb(0 0 0 / 0.5);
	}

	dialog {
		background-color: white;
		padding: 1rem;
		border-radius: 0.5rem;
		border: none;
		width: 90%;
		max-width: 80ch;
	}

	fieldset {
		margin: 2rem;
		border-radius: var(--radius-2);
	}

	legend {
		font-size: large;
	}

	button {
		box-shadow: var(--shadow-2);
		font-size: var(--font-size-1);
		padding: var(--size-1);
	}
</style>
