<script context="module" lang="ts">
	import ButtonsRow from '$lib/components/app/ButtonsRow.svelte';
	import QuestionViewer from '$lib/components/app/QuestionViewer.svelte';
	import { get_PDF_URL } from '$lib/utils/pdf_url_gen';
	import create_timer, { type HumanTime } from '$lib/utils/timer';
	import Stop from '~icons/fa-solid/stop';
	import { createEventDispatcher, getContext, setContext } from 'svelte';
	import { Document } from 'svelte-pdfjs';

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
			<select class="btn-w">
				<option>
					{$timer.minutes}m {$timer.seconds}.{$timer.deciseconds}s
				</option>
				<option>{$timer.minutes}m</option>
				<option>Hawaii Time</option>
			</select>

			<select bind:value={$question_idx} class="btn-w">
				{#each $questions_store as question, i (question)}
					<option value={i}>
						{i + 1}{question.selected ? ' | Answered' : ''}
					</option>
				{/each}
			</select>
			<button
				on:click={() => dispatch('end', $timer)}
				class="btn-w btn-depress"
			>
				<Stop />
				<span>End session</span>
			</button>
		</ButtonsRow>
	</Document>
</main>

<style lang="scss">
	main {
		display: grid;
		grid-template-rows: 7fr auto;
	}

	span {
		margin-inline: 0.5rem;
	}

	button {
		color: var(--primary);
	}
</style>
