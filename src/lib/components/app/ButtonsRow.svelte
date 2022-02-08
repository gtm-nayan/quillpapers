<script lang="ts">
	import AnswerButton from '$lib/components/app/AnswerButton.svelte';
	import { Answer, POSSIBLE_ANSWERS, Question } from '$lib/utils/types';
	import {
		faArrowLeft,
		faArrowRight,
		faCircleNotch,
	} from '@fortawesome/free-solid-svg-icons';
	import { createEventDispatcher, getContext } from 'svelte';
	import { shortcut } from 'svelte-actions/dist/shortcut.js';
	import Fa from 'svelte-fa/src/fa.svelte';
	import type { PDFJS } from 'svelte-pdfjs';
	import type { Writable } from 'svelte/store';

	let current_doc = getContext<Writable<PDFJS.PDFDocumentProxy>>(
		'svelte_pdf_current_doc'
	);
	let current_question = getContext<Writable<Question>>('current_question');

	export let show_correct: boolean = false;

	const dispatch =
		createEventDispatcher<{ back: undefined; next: undefined }>();

	function handle_answer_select(answer: Answer) {
		$current_question.selected =
			$current_question.selected === answer ? undefined : answer;
	}

	$: is_doc_loading = $current_doc == null;
</script>

<section>
	<div class="controls">
		<slot />
	</div>

	<button
		style:grid-area="b"
		disabled={is_doc_loading}
		on:click={() => dispatch('back')}
		use:shortcut={{ code: 'KeyU' }}
	>
		<Fa icon={faArrowLeft} size="4x" />
	</button>

	<div class="answers">
		{#each POSSIBLE_ANSWERS as answer}
			<AnswerButton
				{answer}
				{show_correct}
				selected={$current_question.selected === answer}
				correct_answer={$current_question.correct_answer}
				on:click={() => handle_answer_select(answer)}
			/>
		{/each}
	</div>

	<button
		style:grid-area="n"
		disabled={is_doc_loading}
		on:click={() => dispatch('next')}
		use:shortcut={{ code: 'KeyO' }}
	>
		<Fa
			icon={is_doc_loading ? faCircleNotch : faArrowRight}
			size="{is_doc_loading ? 3.5 : 4}x"
			spin={is_doc_loading}
		/>
	</button>
</section>

<style lang="scss">
	.controls {
		grid-area: c;
		display: flex;
		justify-content: space-evenly;
		margin-top: var(--size-2);

		> :global(*) {
			font-size: var(--font-size-fluid-0);
		}

		> :global(select),
		:global(button) {
			width: var(--size-content-1);
		}
	}

	section {
		display: grid;
		grid-template-areas:
			'c c'
			'a a'
			'b n';

		@media (orientation: landscape) {
			grid-template-areas:
				'. c .'
				'b a n';
			grid-template-columns: auto 1fr auto;
		}
	}

	.answers {
		grid-area: a;
		display: grid;
		grid-template: 1fr 1fr / 1fr 1fr;
		gap: var(--size-2);
		padding: var(--size-2);
	}

	button {
		overflow: hidden;
		background-color: transparent;
		color: var(--yellow-5);
	}
</style>
