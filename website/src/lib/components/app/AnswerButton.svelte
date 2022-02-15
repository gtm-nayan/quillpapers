<script lang="ts">
	import type { Answer } from '$lib/utils/types';
	import { shortcut } from 'svelte-actions/dist/shortcut.js';

	export let answer: Answer;
	export let selected: boolean;
	export let show_correct: boolean;
	export let correct_answer: Answer = undefined;

	$: correct = show_correct && correct_answer === answer;
	$: incorrect = show_correct && correct_answer !== answer;
</script>

<button
	on:click
	class:correct
	class:incorrect
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
		}
	}

	.selected {
		color: white;
		background-color: var(--yellow-5);
		border: none;

		&.correct {
			background-color: var(--green-6);

			&::before {
				content: '\2713';
			}
		}

		&.incorrect {
			background-color: var(--red-6);

			&::before {
				content: '\2715';
			}
		}
	}
</style>
