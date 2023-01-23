<script lang="ts">
	import Play from '~icons/fa-solid/Play';
</script>

<main>
	<button on:click>
		<Play />
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
