<script lang="ts">
	import { zero_two } from '$lib/utils/pdf_url_gen';
	import { QuestionErrorType, type Question } from '$lib/utils/types';
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';
	import {
		subject_code,
		subject_details,
	} from '../../../_subject_code_store.js';

	const current_question: Writable<Question> = getContext('current_question');

	function handle_submit() {
		fetch(`/${$subject_code}/casual.json`, {
			method: 'POST',
			body: JSON.stringify({
				...$current_question,
				error_type,
				topic_suggestion:
					error_type === QuestionErrorType.WRONG_TOPIC
						? +topic_suggestion
						: undefined,
			}),
		}).catch(console.error);
	}

	let error_type: QuestionErrorType = QuestionErrorType.BAD_CROPPING;

	let topic_suggestion = '1';
	let dialog: HTMLDialogElement;

	function modal(show: boolean) {
		dialog[show ? 'showModal' : 'close']();
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
						{#each Object.entries($subject_details.topics) as [topic_number, { title }]}
							<option value={topic_number}>{title}</option>
						{/each}
					</select>
				</fieldset>
			{/if}
			<button type="submit" class="btn-w">Submit</button>
			<button type="button" on:click={() => modal(false)} class="btn-w">Cancel</button>
		</form>
	</dialog>

	<button on:click={() => modal(true)} class="btn-w btn-muted btn-depress">Report</button>
</span>

<style lang="scss">
	::backdrop {
		background-color: #0000007f;
	}

	dialog {
		padding: 1rem;
		border-radius: 0.5rem;
		border: none;
		width: 90%;
		max-width: 80ch;
		margin: auto;
	}

	fieldset {
		margin: 2rem;
		border-radius: var(--radius-2);
	}

	legend {
		font-size: large;
	}

	button {
		padding: 0.5rem 1rem;
	}
</style>
