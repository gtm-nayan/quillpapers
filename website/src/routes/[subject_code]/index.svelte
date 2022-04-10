<script context="module" lang="ts">
	export const prerender = true;

	import Footer from '$lib/components/common/Footer.svelte';
	import Seo from '$lib/components/common/SEO.svelte';
	import { subject_code, subject_details } from './_subject_code_store';
</script>

<Seo title="{$subject_code} | {$subject_details.name}" />

<main>
	<h2>{$subject_code}: {$subject_details.name}</h2>
	<hr />
	<section>
		<h3>Start Practising</h3>
		<ul>
			<li>
				<a href="/{$subject_code}/casual">Casual Mode</a>
				<p>
					Pick a topic and work through the questions available for it. You'll
					get live feedback on whether your answer was correct or not.
				</p>
			</li>
			<li>
				<a href="/{$subject_code}/speedrun">Speedrun Mode</a>
				<p>
					Go through 40 random questions as fast as possible without any help.
					If you think you're fast enough and you can get at least 38 correct
					record your attempt and send it to [@todo] to get featured on the
					leaderboard.
				</p>
			</li>
		</ul>
	</section>
	<hr />

	{#if $subject_details.notes}
		<section>
			<p>{$subject_details.notes}</p>
		</section>
		<hr />
	{/if}

	<section>
		The collection of questions, answers and their segregation into topics were
		automated using a combination of AI and rule based methods. There might be
		some flaws such as a question being cropped with some text missing, or
		having other questions inside the image, or the question might fit better in
		another topic. If you encounter any such cases in casual mode, use the
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
