<script>
	const images = ['Boom', 'Fire', 'Help', 'Rage', 'Stare'];

	function getRandomImage() {
		return images[Math.floor(Math.random() * images.length)];
	}
</script>

<svelte:head>
	<title>Error</title>
</svelte:head>

<main>
	<div class="">
		<p>Couldn't find that page, only topics 01 through 15 are available</p>
		<img src="/roo{getRandomImage()}.gif" alt="404" />
	</div>
</main>

<style>
	main {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;
	}

	div {
		display: flex;
		align-items: center;
		flex-direction: column;
	}
</style>
