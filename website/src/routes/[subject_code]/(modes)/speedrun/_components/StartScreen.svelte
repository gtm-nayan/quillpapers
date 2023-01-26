<script lang="ts">
	import Play from '~icons/fa-solid/Play';
</script>

<main>
	<button on:click class="btn-w btn-depress btn-muted">
		<Play />
		Start
	</button>
</main>

<style lang="scss">
	main {
		display: grid;
		place-items: center;
	}

	button {
		font-size: 2rem;
		padding: 2rem;
	}
</style>
