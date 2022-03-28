<script lang="ts">
	import { faPlay } from '@fortawesome/free-solid-svg-icons';
	import { FaSvg, Icon } from 'svelte-yafal';
</script>

<main>
	<button on:click>
		<FaSvg><Icon icon={faPlay} /></FaSvg>
		Start
	</button>
</main>

<style>
	main {
		display: grid;
		place-items: center;
	}

	button {
		font-size: var(--font-size-fluid-2);
		padding: var(--size-5);
		border-radius: var(--radius-4);
		box-shadow: var(--shadow-4);
		background: var(--gradient-19);
		color: var(--gray-0);
	}
</style>
