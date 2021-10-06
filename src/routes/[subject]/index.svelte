<script context="module">
	export const prerender = true;
	import subjects from '$lib/data/subjects';

	export async function load({ page }) {
		if (subjects[parseInt(page.params.subject)]) {
			return {
				props: {
					subject_code: parseInt(page.params.subject)
				}
			};
		} else {
			return {
				status: 404,
				error: new Error('Not found.')
			};
		}
	}
</script>

<script>
	import Footer from '$lib/components/ui/Footer.svelte';
	export let subject_code;
</script>

<svelte:head>
	<title>
		{subject_code} |
		{subjects[subject_code].subName}
	</title>
</svelte:head>

<main>
	<h2>{subject_code}: {subjects[subject_code]['subName']}</h2>
	<hr />
	<section>
		<h3>Start Practising</h3>
		<ul>
			<li><a href="/{subject_code}/casual">Casual Mode</a></li>
			<li><a href="/{subject_code}/speedrun">Speedrun Mode</a></li>
		</ul>
	</section>
	<hr />

	{#if subjects[subject_code]['subNotes']}
		<section>
			<p>
				{subjects[subject_code]['subNotes']}
			</p>
		</section>
		<hr />
	{/if}

	<section>
		The collection of questions, answers and their segregation into topics were automated using a
		combination of AI and rule based methods. There might be some flaws such as a question being
		cropped with some text missing, or having other questions inside the image, or the question
		might fit better in another topic. If you encounter any such cases in casual mode, use the
		appropriate buttons to flag the questions.
	</section>

	<Footer />
</main>

<style>
	main {
		padding: 2% 10%;
		text-align: justify;
		overflow: auto;
		flex-grow: 1;
		display: flex;
		flex-direction: column;
	}

	h2 {
		text-align: initial;
	}

	section {
		margin: 2em 0;
	}
</style>
