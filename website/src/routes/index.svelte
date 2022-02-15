<script context="module" lang="ts">
	export const prerender = true;

	import Footer from '$lib/components/common/Footer.svelte';
	import KofiButton from '$lib/components/common/KofiButton.svelte';
	import subjects from '$lib/data/subjects.json';
</script>

<svelte:head>
	<title>Quill Papers</title>
</svelte:head>

<main>
	<section>
		<h1>Welcome to Quill Papers</h1>
		<p>Free topical past papers for A Level MCQs.</p>
	</section>
	<hr />
	<section>
		<h2>Subjects</h2>
		<ul>
			{#each Object.entries(subjects) as [subject_code, details]}
				<li><a href="/{subject_code}">{details.name}</a></li>
			{/each}
		</ul>
	</section>

	<section>
		<h2>Keybinds</h2>
		<ul>
			<li>
				<kbd>T</kbd>
				: Focus topic selector
			</li>
			<li>
				<kbd>U/O</kbd>
				: Next/Previous Question
			</li>
			<li>
				<kbd>Shift + I/K</kbd>
				: Zoom in/out
			</li>
			<li>
				<kbd>I, J, K, L</kbd>
				: Move the question around
			</li>
			<li>
				<kbd>A, B, C, D</kbd>
				: Demolish a random building somewhere.... jk, pick one of the options
			</li>
		</ul>
	</section>
	<section>
		<h3>Support Quill Papers</h3>
		<p>
			While this site isn't for profit, hosting the database for the questions
			does incur a cost. Your support would go a long way in ensuring that I
			don't have to resort to ads to keep it running. It'd also allow me to add
			new features on more powerful servers, and questions for more subjects. If
			this site has been helpful to you, consider supporting me through Ko-fi.
		</p>
		<br />
		<KofiButton />
	</section>

	<Footer />
</main>

<style>
	main {
		padding: 2% 10%;
		overflow: auto;
		text-align: justify;
	}

	li {
		margin-block: var(--size-2);
	}

	h1,
	h2 {
		text-align: initial;
	}

	section {
		margin: 1em 0;
	}
</style>
