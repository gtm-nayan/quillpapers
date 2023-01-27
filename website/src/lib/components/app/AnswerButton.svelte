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

	$: checked = $current_question.selected === answer;
</script>

<label>
	<input
		type="radio"
		name="answer"
		class="sr-only"
		value={answer}
		{checked}
		on:change={handle_answer_select}
		use:shortcut={{
			code: `Key${answer}`,
			callback(node) {
				handle_answer_select();
				node.focus();
			},
		}}
	/>
	<span
		class="btn-w btn-depress"
		class:correct={show_correct &&
			checked &&
			$current_question.correct_answer === answer}
		class:incorrect={show_correct &&
			checked &&
			$current_question.correct_answer !== answer}
		class:btn-active-blue={!show_correct}>{answer}</span
	>
</label>

<style lang="scss">
	span {
		position: relative;
		width: 10rem;
		font-size: var(--font-size-fluid-1);
		padding: 0.5rem 2rem;
	}

	input:focus-visible ~ span {
		outline: solid 2px var(--border-color);
	}

	input:checked ~ span {
		--border-color: #84d8ff;
		background-color: #ddf4ff;
		color: #1899d6;

		&.correct {
			--border-color: #94ea00;
			background-color: #d7ffb8;
			color: #58a700;
		}

		&.incorrect {
			--border-color: #ffb2b2;
			background-color: #ffdfe0;
			color: #ea2b2b;
		}
	}
</style>
