<script lang="ts">
	import KofiButton from './KofiButton.svelte';
	// @ts-expect-error ts won't recognize the import signature for image tools
	import logo from '../../styles/logo.png?w=32';
</script>

<svelte:head>
	<link rel="shortcut icon" href={logo} />
</svelte:head>

<nav>
	<a href="/">
		<span style:--icon-mask="url('{logo}')" />
		Quill Papers
	</a>
	<div class="kofi-button">
		<KofiButton />
	</div>
</nav>

<style lang="scss">
	nav {
		background: var(--primary);
		display: flex;
		align-items: center;
		padding: 0.5em;
	}

	a {
		text-decoration: none;
		font-size: 1.5rem;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem;
		color: white;
	}

	span {
		background-color: white;
		mask-image: var(--icon-mask);
		aspect-ratio: 1;
		height: 1.5em;
		mask-size: 100%;
	}

	.kofi-button {
		margin-left: auto;
	}
</style>
