<script context="module" lang="ts">
	import ButtonsRow from '$lib/components/app/ButtonsRow.svelte';
	import QuestionViewer from '$lib/components/app/QuestionViewer.svelte';
	import get_PDF_URL from '$lib/utils/pdf_url_gen';
	import create_timer, { HumanTime } from '$lib/utils/timer';
	import { faStop } from '@fortawesome/free-solid-svg-icons';
	import { createEventDispatcher, getContext, setContext } from 'svelte';
	import Fa from 'svelte-fa/src/fa.svelte';
	import { Document } from 'svelte-pdfjs';
	import type { QuestionStore } from '../index.svelte';
	import { create_current_question_store, create_idx_store } from './stores';
</script>

<script lang="ts">
	interface $$Events {
		end: CustomEvent<HumanTime>;
	}

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
			<select class="timer">
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
			<button
				on:click={() => dispatch('end', $timer)}
				style:color="var(--gray-7)"
			>
				<Fa icon={faStop} />
				End session
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
