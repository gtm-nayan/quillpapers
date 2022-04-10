<script context="module" lang="ts">
	import ButtonsRow from '$lib/components/app/ButtonsRow.svelte';
	import QuestionViewer from '$lib/components/app/QuestionViewer.svelte';
	import { get_PDF_URL } from '$lib/utils/pdf_url_gen';
	import create_timer, { type HumanTime } from '$lib/utils/timer';
	import { faStop } from '@fortawesome/free-solid-svg-icons';
	import { createEventDispatcher, getContext, setContext } from 'svelte';
	import { Document } from 'svelte-pdfjs';
	import { FaSvg, Icon } from 'svelte-yafal';
	import {
		create_current_question_store,
		create_idx_store,
		type QuestionStore,
	} from './stores';
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

		<ButtonsRow on:next={question_idx.inc} on:back={question_idx.dec}>
			<select>
				<option>
					{$timer.minutes}m {$timer.seconds}.{$timer.deciseconds}s
				</option>
				<option>{$timer.minutes}m</option>
				<option>Hawaii Time</option>
			</select>

			<select bind:value={$question_idx}>
				{#each $questions_store as question, i (question)}
					<option value={i}>
						{i + 1}{question.selected ? ' | Answered' : ''}
					</option>
				{/each}
			</select>
			<button
				on:click={() => dispatch('end', $timer)}
				style:color="var(--gray-7)"
			>
				<FaSvg><Icon icon={faStop} /></FaSvg>
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
