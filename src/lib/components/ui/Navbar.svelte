<script>
	import { shortcut } from '$lib/helpers/shortcuts';
	import KofiButton from './KofiButton.svelte';
</script>

<nav>
	<a href="/" use:shortcut={{ shift: true, code: 'KeyH' }}>
		<img src="/apple-touch-icon.png" alt="logo" width="32" height="32" />
		Quill Papers
	</a>
	<div class="kofi-button">
		<KofiButton pText="Donate" pId="gtmnayan" />
	</div>
</nav>

<style>
	nav {
		background-color: rgb(248, 249, 250);
		display: flex;
		align-items: center;
		padding: 0 1rem;
	}

	a {
		text-decoration: none;
		font-size: 1.5rem;
		color: #343a40;
		margin: 0.5rem 0;
		display: flex;
		align-items: center;
	}

	img {
		width: 2rem;
		height: auto;
		margin-right: 0.3rem;
		border-radius: 0.1rem;
	}

	.kofi-button {
		margin-left: auto;
	}
</style>
