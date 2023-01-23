<script lang="ts">
	import AnswerButton from '$lib/components/app/AnswerButton.svelte';
	import { shortcut } from '$lib/utils/shortcut';
	import { POSSIBLE_ANSWERS } from '$lib/utils/types';
	import { createEventDispatcher, getContext, onDestroy } from 'svelte';
	import { subscribe } from 'svelte/internal';
	import fa_arrow_left from '~icons/fa-solid/arrow-left?raw';
	import fa_arrow_right from '~icons/fa-solid/arrow-right?raw';
	import fa_spinner from '~icons/fa-solid/circle-notch?raw';

	const dispatch = createEventDispatcher<{ back: void; next: void }>();

	let is_doc_loading = false;
	onDestroy(
		subscribe(
			getContext('svelte_pdfjs_doc'),
			(doc: any) => (is_doc_loading = doc == null)
		)
	);
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
		<span>{@html fa_arrow_left}</span>
	</button>

	<div class="answers">
		{#each POSSIBLE_ANSWERS as answer}
			<AnswerButton {answer} />
		{/each}
	</div>

	<button
		style:grid-area="n"
		disabled={is_doc_loading}
		on:click={() => dispatch('next')}
		use:shortcut={{ code: 'KeyO' }}
	>
		<span class:spin={!is_doc_loading}>
			{@html is_doc_loading ? fa_spinner : fa_arrow_right}
		</span>
	</button>
</section>

<style lang="scss">
	.controls {
		grid-area: c;
		display: flex;
		justify-content: space-evenly;
		margin-top: var(--size-2);

		// @todo
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
		font-size: 3.5em;
	}

	@keyframes spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}

	.spin {
		animation: spin 2s infinite linear;
	}
</style>
