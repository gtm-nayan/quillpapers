<script lang="ts">
	import KofiButton from './KofiButton.svelte';
	// @ts-expect-error
	import logo from '../../styles/logo.png?w=32';
</script>

<svelte:head>
	<link rel="shortcut icon" href={logo} />
</svelte:head>

<nav>
	<a href="/">
		<img src={logo} alt="logo" width="32" height="32" />
		Quill Papers
	</a>
	<div class="kofi-button">
		<KofiButton />
	</div>
</nav>

<style>
	nav {
		background: var(--gradient-19);
		display: flex;
		align-items: center;
		padding: 0.5em;
	}

	a {
		text-decoration: none;
		font-size: 1.5rem;
		margin: 0.5rem 0;
		display: flex;
		color: var(--gray-8);
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
