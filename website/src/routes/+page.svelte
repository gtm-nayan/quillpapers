<script context="module" lang="ts">
	import Footer from '$lib/components/common/Footer.svelte';
	import KofiButton from '$lib/components/common/KofiButton.svelte';
	import Seo from '$lib/components/common/SEO.svelte';
	import subjects from '$lib/data/subjects.json';
</script>

<Seo title="Quill Papers" />

<main>
	<section>
		<h1>Welcome to Quill Papers</h1>
		<p>Free topical past papers for A Level MCQs.</p>
	</section>
	<hr />
	<section>
		<h2>Subjects</h2>
		<ul>
			{#each Object.entries(subjects) as [subject_code, { name }]}
				<li><a href="/{subject_code}">{name}</a></li>
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
				: Previous/Next Question
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
	<section>
		Found a bug or have a feature request? <a
			href="https://github.com/gtm-nayan/quillpapers/issues"
		>
			File an issue on github
		</a>
	</section>

	<Footer />
</main>

<style lang="scss">
	main {
		padding: var(--size-7) clamp(1em, 6em, 10%);
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
