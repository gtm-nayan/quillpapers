<script lang="ts">
	import subjects from '$lib/data/subjects.json';
	import type { HumanTime } from '$lib/utils/timer';
	import type { SubjectCode } from '$lib/utils/types';
	import { getContext } from 'svelte';
	import type { QuestionStore } from '../../index.svelte';
	import QuestionReport from './QuestionReport.svelte';
	import Fa from 'svelte-fa/src/fa.svelte';
	import { faRedo } from '@fortawesome/free-solid-svg-icons';

	const questions_store = getContext<QuestionStore>('questions_store');
	export let subject_code: SubjectCode;
	export let time: HumanTime;

	type Topic = {
		name: string;
		encountered: number;
		correct: number;
	};

	const res = new Map<number, Topic>();
	let total_correct = 0;

	for (const question of $questions_store) {
		if (!res.has(question.topic_number)) {
			res.set(question.topic_number, {
				name: subjects[subject_code].topics[question.topic_number].title,
				encountered: 0,
				correct: 0,
			});
		}

		const current_topic = res.get(question.topic_number);
		++current_topic.encountered;
		if (question.correct_answer === question.selected) {
			++current_topic.correct;
			++total_correct;
		}
	}
</script>

<main>
	<h2>Summary</h2>
	<p>
		<span>Correctly answered: {total_correct}/40</span>
		<br />
		<span>Your time: {time.minutes}m {time.seconds}.{time.deciseconds}s</span>
	</p>
	<table>
		<thead>
			<th>#</th>
			<th>Name</th>
			<th>#Encountered</th>
			<th>#Correct</th>
		</thead>

		<tbody>
			{#each [...res].sort(([a], [b]) => a - b) as [number, { name, encountered, correct }]}
				<tr>
					<td>{number}</td>
					<td>{name}</td>
					<td>{encountered}</td>
					<td>{correct}</td>
				</tr>
			{/each}
		</tbody>
	</table>

	<div>
		<button on:click>
			<Fa icon={faRedo} flip />
			Restart
		</button>
		{#each $questions_store as question}
			<QuestionReport {question} />
		{/each}
	</div>
</main>

<style>
	td:not(:nth-child(2)) {
		text-align: center;
	}

	div {
		display: flex;
		flex-direction: column;
		padding: 2em;
	}

	table {
		margin: auto;
	}

	button {
		font-size: var(--font-size-fluid-1);
		padding: var(--size-3);
		border-radius: var(--radius-4);
		box-shadow: var(--shadow-4);
		background: var(--gradient-19);
		color: var(--gray-0);
	}
</style>
