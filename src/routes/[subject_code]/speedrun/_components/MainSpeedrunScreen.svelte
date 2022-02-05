<script context="module" lang="ts">
	import ButtonsRow from '$lib/components/app/ButtonsRow.svelte';
	import QuestionViewer from '$lib/components/app/QuestionViewer.svelte';
	import get_PDF_URL from '$lib/utils/pdf_url_gen';
	import create_timer from '$lib/utils/timer';
	import type { Question } from '$lib/utils/types';
	import { faStop } from '@fortawesome/free-solid-svg-icons';
	import { createEventDispatcher, getContext, setContext } from 'svelte';
	import { Document } from 'svelte-pdfjs';
	import { derived, get, writable, type Readable } from 'svelte/store';
	import type { QuestionStore } from '../index.svelte';
	import Fa from 'svelte-fa/src/fa.svelte';

	function create_idx_store() {
		const { set, subscribe, update } = writable(0);

		return {
			subscribe,
			/**
			 * Set a value clamped between 0 and 39.
			 */
			set: (val: number) => {
				const t = Math.trunc(val);
				set(Math.max(0, Math.min(isNaN(t) ? 0 : t, 39)));
			},
			/**
			 * Increment the index by 1. (Wrap around at 40)
			 */
			increment: () => {
				update((v) => (v === 39 ? 0 : v + 1));
			},
			/**
			 * Decrement the index by 1. (Wrap around to 39 at -1)
			 */
			decrement: () => {
				update((v) => (v === 0 ? 39 : v - 1));
			},
		};
	}

	/**
	 * Create a proxy store to a certain question in the questions_store containing an array of questions.
	 *
	 * @param {Readable<number>} idx_store The store that has the index of the question.
	 * @param {QuestionStore} questions_store
	 */
	function create_current_question_store(
		idx_store: Readable<number>,
		questions_store: QuestionStore
	) {
		const { subscribe } = derived(
			[idx_store, questions_store],
			([$idx_store, $questions_store]) => $questions_store[$idx_store]
		);

		return {
			subscribe,
			set: (val: Question) => {
				questions_store.update((a) => {
					a[get(idx_store)] = val;
					return a;
				});
			},
		};
	}
</script>

<script lang="ts">
	const dispatch = createEventDispatcher();
	const timer = create_timer();
	const question_idx = create_idx_store();
	const questions_store = getContext<QuestionStore>('questions_store');
	const current_question = create_current_question_store(
		question_idx,
		questions_store
	);
	setContext('current_question', current_question);
</script>

<main>
	<Document file={get_PDF_URL($current_question)}>
		<QuestionViewer />

		<ButtonsRow
			on:next={question_idx.increment}
			on:back={question_idx.decrement}
		>
			<select
				class="timer"
				title="Change it to hawaii time if you don't wanna feel the pressure of a ticking clock"
			>
				<option>
					{$timer.minutes}m {$timer.seconds}.{$timer.deciseconds}s
				</option>
				<option>{$timer.minutes}m</option>
				<option>Hawaii Time</option>
			</select>

			<select bind:value={$question_idx} class="select-qn">
				{#each $questions_store as question, i (i)}
					<option value={i}>
						{i + 1}
						{#if question.selected}
							| Answered
						{/if}
					</option>
				{/each}
			</select>
			<button on:click={() => dispatch('end', $timer)}>
				<Fa icon={faStop} />
				End
			</button>
		</ButtonsRow>
	</Document>
</main>

<style>
	main {
		display: grid;
		grid-template-rows: 7fr auto;
	}
</style>
