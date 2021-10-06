<script context="module">
	import subjects from '$lib/data/subjects.json';

	export async function load({ page }) {
		let sub_code = page.params.subject;

		if (subjects[sub_code]) {
			return {
				status: 200,
				props: {
					subject_code: page.params.subject
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
	import SpeedrunViewer from '$lib/components/app/SpeedrunViewer.svelte';
	import { writable } from 'svelte/store';
	import Footer from '$lib/components/ui/Footer.svelte';
	import PdfViewer from '$lib/components/app/PdfViewer.svelte?client';
	import Fa from 'svelte-fa/src/fa.svelte';
	import { faPlay } from '@fortawesome/free-solid-svg-icons';

	export let subject_code;

	/** @type {('START' | 'ONGOING' | 'RESULTS')}*/
	let status = 'START';
	let results = {};

	let q = writable([]);

	async function startSpeedrun() {
		let questions = await (await fetch(`/api/speedrun?subject_code=${subject_code}`)).json();
		$q = questions;
		status = 'ONGOING';
	}

	function endSpeedrun(t) {
		status = 'RESULTS';
		results.time = t;
		results.score = 0;
		results.topics = JSON.parse(JSON.stringify(subjects[subject_code].topics));

		for (let topic_number of Object.keys(results.topics)) {
			results.topics[topic_number].encountered = 0;
			results.topics[topic_number].correct = 0;
		}

		for (const question of $q) {
			++results.topics[question.topic].encountered;
			if (question.correct_answer == question.selected) {
				++results.score;
				++results.topics[question.topic].correct;
			}
		}
	}
</script>

<svelte:head>
	<title>
		{subject_code} |
		{subjects[subject_code].subName} | Speedrun
	</title>
</svelte:head>

{#each $q as question}
	<link
		rel="prefetch"
		as="fetch"
		crossorigin="anonymous"
		href="https://quillpdfs.netlify.app/{question.subject_code}_{question.series}{question.exam_year}_qp_{question.paper_variant}.pdf"
	/>
{/each}

<main>
	{#if status == 'START'}
		<div class="centralize">
			<button on:click={startSpeedrun}>
				<h4>
					<Fa icon={faPlay} />
					Start
				</h4>
			</button>

			<p>
				If you'd like a more accurate display of your time, or if you'd rather not be pressured by
				the continuously ticking clock, you can change how the timer is shown.
			</p>
		</div>
		<Footer />
	{:else if status == 'ONGOING'}
		<SpeedrunViewer questionStore={q} endFunction={endSpeedrun} />
	{:else if status == 'RESULTS'}
		<div class="results-page">
			<section>
				<h2>Your time: {results.time.h}h {results.time.m}m {results.time.s}.{results.time.ds}s</h2>
				<h2>Your score: {results.score}</h2>
				<hr />
				<table>
					<thead>
						<th>S.N.</th>
						<th>Topic Name</th>
						<th>#Encountered</th>
						<th>#Correct</th>
					</thead>
					<tbody>
						{#each Object.keys(results.topics) as topic_number}
							<tr>
								<td style="text-align: center;">{topic_number}</td>
								<td>{results.topics[topic_number]['topicName']}</td>
								<td style="text-align: center;">{results.topics[topic_number]['encountered']}</td>
								<td style="text-align: center;">{results.topics[topic_number]['correct']}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</section>
			<hr />
			<section>
				{#each $q as question}
					<br />
					<h5>
						{question.subject_code}_{question.series}{question.exam_year}_qp_{question.paper_variant}
					</h5>
					<br />
					<PdfViewer
						url="https://quillpdfs.netlify.app/{question.subject_code}_{question.series}{question.exam_year}_qp_{question.paper_variant}.pdf"
						canvasStyles="margin: auto; display: block;"
						pageNumber={question.question_number}
						zoom={1.5}
					/>
					<br />
					Correct answer: {question.correct_answer}<br />
					Your answer: {question.selected || 'None'}
					<hr />
				{/each}
			</section>
			<br />
			<div class="centralize">
				<button on:click={() => (status = 'START')}> Start another </button>
			</div>
			<br />
			<Footer />
		</div>
	{/if}
</main>

<style>
	main {
		flex-grow: 1;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		overflow: auto;
	}

	.centralize {
		display: flex;
		flex-direction: column;
		flex: 1;
		align-items: center;
		justify-content: center;
	}

	.results-page {
		padding: 2% 10%;
	}

	th {
		padding: 0 1em;
	}

	button {
		padding: 0.5em;
	}

	p {
		max-width: 60ch;
	}
</style>
