<script lang="ts">
	import AnswerButton from '$lib/components/app/AnswerButton.svelte';
	import { shortcut } from '$lib/utils/shortcut';
	import { POSSIBLE_ANSWERS } from '$lib/utils/types';
	import {
		faArrowLeft,
		faArrowRight,
		faCircleNotch,
	} from '@fortawesome/free-solid-svg-icons';
	import { createEventDispatcher, getContext, onDestroy } from 'svelte';
	import { key } from 'svelte-pdfjs';
	import { FaSvg, Icon } from 'svelte-yafal';
	import { subscribe } from 'svelte/internal';

	const dispatch = createEventDispatcher<{ back: void; next: void }>();

	let is_doc_loading = false;
	onDestroy(
		// returns unsubscriber which is called on destroy
		subscribe(getContext(key), (doc: any) => (is_doc_loading = doc == null))
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
		<FaSvg><Icon icon={faArrowLeft} /></FaSvg>
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
		<FaSvg spin={is_doc_loading}>
			<Icon icon={is_doc_loading ? faCircleNotch : faArrowRight} />
		</FaSvg>
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
</style>
