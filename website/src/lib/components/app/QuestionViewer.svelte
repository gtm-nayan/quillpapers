<script lang="ts">
	import { shortcut } from '$lib/utils/shortcut';
	import type { Question } from '$lib/utils/types.js';
	import { getContext, onDestroy } from 'svelte';
	import { Page } from 'svelte-pdfjs';
	import { subscribe } from 'svelte/internal';

	let scale = 1.5;
	let num: number;
	onDestroy(
		subscribe(
			getContext('current_question'),
			(q: Question) => (num = q.question_number)
		)
	);
</script>

<section
	use:shortcut={{
		code: 'KeyI',
		callback: (e) => (e.scrollTop -= 10),
	}}
	use:shortcut={{
		code: 'KeyK',
		callback: (e) => (e.scrollTop += 10),
	}}
	use:shortcut={{
		code: 'KeyJ',
		callback: (e) => (e.scrollLeft -= 20),
	}}
	use:shortcut={{
		code: 'KeyL',
		callback: (e) => (e.scrollLeft += 20),
	}}
>
	<Page {num} {scale} />
	<label>
		{scale}x
		<input
			type="range"
			step="0.25"
			min="0.5"
			max="4"
			value={scale}
			on:change={(e) => (scale = e.currentTarget.valueAsNumber)}
			use:shortcut={{
				code: 'KeyI',
				shift: true,
				callback: () => (scale += 0.25),
			}}
			use:shortcut={{
				code: 'KeyK',
				shift: true,
				callback: () => (scale -= 0.25),
			}}
		/>
		<!-- Use change instead of input as a built in "debounce" -->
	</label>
</section>

<style lang="scss">
	section {
		display: grid;
		place-items: center;
		overflow: auto;
		height: 0;
		min-height: 100%;
	}

	section > :global(div) {
		margin: 1em;
	}

	label {
		position: absolute;
		place-self: end;
		border-radius: 0.2em;
		background-color: black;
		color: white;
		padding: 0.3em;
	}

	input {
		accent-color: var(--primary);
	}
</style>
