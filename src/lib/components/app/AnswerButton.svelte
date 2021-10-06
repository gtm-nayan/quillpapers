<script>
	import { createEventDispatcher } from 'svelte';
	import { shortcut } from '$lib/helpers/shortcuts';

	export let isCorrect = false;
	export let isSelected = false;
	export let showResult = true;
	export let option;

	$: correct = isCorrect && showResult;
	$: incorrect = !isCorrect && showResult;

	const dispatch = createEventDispatcher();
</script>

<button
	aria-label={option}
	class:correct
	class:incorrect
	class:isSelected
	on:click={() => dispatch('choose', option)}
	type="button"
	use:shortcut={{ code: 'Key' + option }}
>
	{option}
</button>

<style>
	.isSelected {
		background-color: rgb(0, 128, 255);
		color: white;
	}

	.isSelected.correct {
		background-color: green;
	}

	.isSelected.correct::before {
		content: '\2713';
		position: absolute;
		left: 0.5em;
	}

	.isSelected.incorrect {
		background-color: red;
	}

	.isSelected.incorrect::before {
		content: '\2715';
		position: absolute;
		left: 0.5em;
	}

	button {
		width: 20%;
		font-size: x-large;
		border-radius: 10px;
		border: none;
		cursor: pointer;
		height: 3rem;
		flex: 0 1 80%;
		margin-bottom: 0.1em;
		box-shadow: rgba(0, 0, 0, 0.2) 0em 0.15em 0.1em;
		transition: background-color 200ms;
		position: relative;
	}

	button:active {
		transform: translate(0em, 0.1em);
		box-shadow: none;
	}

	@media screen and (min-width: 425.02px) {
		button {
			flex: 0 1 40%;
		}
	}

	@media screen and (min-width: 768.02px) {
		button {
			flex: 0 1 20%;
		}
	}
</style>
