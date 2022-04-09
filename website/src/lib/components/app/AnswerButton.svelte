<script lang="ts">
	import type { Answer, Question } from '$lib/utils/types';
	import { shortcut } from '$lib/utils/shortcut';
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';

	export let answer: Answer;

	function handle_answer_select() {
		$current_question.selected =
			$current_question.selected === answer ? undefined : answer;
	}

	const current_question = getContext<Writable<Question>>('current_question');
	const show_correct = getContext<boolean>('show_correct');
</script>

<button
	on:click={handle_answer_select}
	class:correct={show_correct && $current_question.correct_answer === answer}
	class:incorrect={show_correct && $current_question.correct_answer !== answer}
	class:selected={$current_question.selected === answer}
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
			background-color: var(--green-7);
			--sign: '\2713';
		}

		&.incorrect {
			background-color: var(--red-7);
			--sign: '\2715';
		}
	}
</style>
