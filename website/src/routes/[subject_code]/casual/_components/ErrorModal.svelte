<script lang="ts">
	import subjects from '$lib/data/subjects.json';
	import { zero_two } from '$lib/utils/pdf_url_gen';
	import subject_code from '../../_subject_code_store';
	import { QuestionErrorType, type Question } from '$lib/utils/types';
	import { faFlag } from '@fortawesome/free-solid-svg-icons';
	import { getContext } from 'svelte';
	import { FaSvg, Icon } from 'svelte-yafal';
	import type { Writable } from 'svelte/store';

	const current_question: Writable<Question> = getContext('current_question');

	async function handle_submit() {
		try {
			await fetch(`/${$subject_code}/casual.json`, {
				method: 'POST',
				body: JSON.stringify({
					...$current_question,
					error_type,
					topic_suggestion,
				}),
			});
		} finally {
			show_modal = false;
		}
	}

	let error_type: QuestionErrorType = QuestionErrorType.BAD_CROPPING;

	let topic_suggestion = '1';
	let show_modal = false;
</script>

<span>
	{#if show_modal}
		<div class="backdrop">
			<div class="content">
				<h4>
					{$current_question.subject_code}
					{$current_question.series}{zero_two($current_question.exam_year)}
					{$current_question.paper_variant}
					QN: {zero_two($current_question.question_number)}
				</h4>
				<form on:submit|preventDefault={handle_submit}>
					<fieldset>
						<legend>Error type</legend>
						<select bind:value={error_type}>
							<option value={QuestionErrorType.BAD_CROPPING}>
								Bad cropping
							</option>
							<option value={QuestionErrorType.WRONG_ANSWER}>
								Wrong answer
							</option>
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
					<button type="button" on:click={() => (show_modal = false)}>
						Cancel
					</button>
				</form>
			</div>
		</div>
	{/if}

	<button
		type="button"
		on:click={() => (show_modal = true)}
		style:color="var(--gray-7)"
	>
		<FaSvg><Icon icon={faFlag} /></FaSvg>
		Flag this question
	</button>
</span>

<style>
	.backdrop {
		position: fixed;
		background-color: rgb(0 0 0 / 0.5);
		inset: 0;
		z-index: var(--layer-important);
		display: grid;
		place-items: center;
	}

	.content {
		background-color: white;
		padding: 1rem;
		border-radius: 0.5rem;
		width: minmax(90%, var(--size-content-3));
	}

	fieldset {
		margin: 2rem;
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
