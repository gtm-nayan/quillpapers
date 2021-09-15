<script>
	import { shortcut } from "$lib/helpers/shortcuts";
</script>

<nav>
	<a href="/" use:shortcut={{shift: true, code:'KeyH'}}>
		<img src="/apple-touch-icon.png" alt="logo" />
		Quill Papers
	</a>
</nav>

<style>
	nav {
		background-color: rgb(248, 249, 250);
		display: flex;
		align-items: center;
	}

	a {
		padding-left: 1rem;
		text-decoration: none;
		font-size: 1.5rem;
		color: #343a40;
		margin: 0.5rem 0;
		display: flex;
		align-items: center;
	}

	img {
		width: 2rem;
		margin-right: 0.3rem;
		border-radius: 0.1rem;
	}
</style>
