<script lang="ts">
	import { page } from '$app/stores';
	import subjects from '$lib/data/subjects.json';
	import { Question, QuestionErrorType, SubjectCode } from '$lib/utils/types';
	import { faFlag } from '@fortawesome/free-solid-svg-icons';
	import { getContext } from 'svelte';
	import Fa from 'svelte-fa/src/fa.svelte';
	import type { Writable } from 'svelte/store';

	const current_question: Writable<Question> = getContext('current_question');

	async function handle_submit() {
		try {
			await fetch(`/${subject_code}/casual.json`, {
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
	let subject_code = $page.params.subject_code as SubjectCode;
	let topic_suggestion = '1';
	let show_modal = false;
</script>

<span>
	{#if show_modal}
		<div class="backdrop">
			<div class="content">
				<h4>
					{$current_question.subject_code}
					{$current_question.series}{$current_question.exam_year
						.toString()
						.padStart(2, '0')}
					{$current_question.paper_variant}
					QN: {$current_question.question_number.toString().padStart(2, '0')}
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
								{#each Object.entries(subjects[subject_code].topics) as [topic_number, { title }]}
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
		<Fa icon={faFlag} />

		Flag this question
	</button>
</span>

<style>
	.backdrop {
		position: fixed;
		grid-area: unset;
		background-color: rgb(0 0 0 / 0.5);
		inset: 0;
		z-index: var(--layer-important);
	}

	.content {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		background-color: white;
		padding: 1rem;
		border-radius: 0.5rem;
		width: 80%;
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
