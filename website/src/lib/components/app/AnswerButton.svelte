<script lang="ts">
	import type { Answer } from '$lib/utils/types';
	import { shortcut } from '$lib/utils/shortcut';
	import { getContext } from 'svelte';

	export let answer: Answer;
	export let selected: boolean;
	const show_correct = getContext<boolean>('show_correct');
	export let correct_answer: Answer;
</script>

<button
	on:click
	class:correct={show_correct && correct_answer === answer}
	class:incorrect={show_correct && correct_answer !== answer}
	class:selected
	use:shortcut={{ code: `Key${answer}` }}
>
	{answer}
</button>

<style lang="scss">
	button {
		font-size: x-large;
		position: relative; /* To position the cross/checkmark */
		border-radius: var(--radius-conditional-3);
		padding-block: var(--size-2);
		padding-inline: var(--size-fluid-3);

		&::before {
			position: absolute;
			left: 0.5em;
			content: var(--sign);
		}
	}

	.selected {
		color: white;
		background-color: var(--yellow-5);
		border: none;

		&.correct {
			background-color: var(--green-6);
			--sign: '\2713';
		}

		&.incorrect {
			background-color: var(--red-6);
			--sign: '\2715';
		}
	}
</style>
