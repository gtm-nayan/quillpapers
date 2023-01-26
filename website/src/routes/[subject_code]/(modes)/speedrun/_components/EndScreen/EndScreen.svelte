<script lang="ts">
	import subjects from '$lib/data/subjects.json';
	import type { HumanTime } from '$lib/utils/timer';
	import type { SubjectCode } from '$lib/utils/types';
	import Redo from '~icons/fa-solid/redo';
	import { getContext } from 'svelte';

	import { get } from 'svelte/store';
	import type { QuestionStore } from '../stores';
	import QuestionReport from './QuestionReport.svelte';

	export let subject_code: SubjectCode;
	export let time: HumanTime;

	type Topic = {
		name: string;
		encountered: number;
		correct: number;
	};

	const questions = get(getContext<QuestionStore>('questions_store'));
	const res = new Map<number, Topic>();
	let total_correct = 0;

	function get_or_new_entry(topic_number: number) {
		let obj = res.get(topic_number);
		if (obj) return obj;
		obj = {
			name: subjects[subject_code].topics[topic_number].title,
			encountered: 0,
			correct: 0,
		};
		res.set(topic_number, obj);
		return obj;
	}

	for (const question of questions) {
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- question.topic is never undefined in speedrun mode
		const topic = get_or_new_entry(question.topic_number!);
		++topic.encountered;
		if (question.correct_answer === question.selected) {
			++topic.correct;
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

	<section>
		<div>
			<button on:click class="btn-w btn-depress btn-muted">
				<Redo />
				<span class="restart">Restart</span>
			</button>
		</div>
		{#each questions as question}
			<QuestionReport {question} />
		{/each}
	</section>
</main>

<style lang="scss">
	td:not(:nth-child(2)) {
		text-align: center;
	}

	section {
		display: flex;
		flex-direction: column;
		padding: 2em;
	}

	table {
		margin: auto;
	}

	div {
		display: flex;
	}

	button {
		font-size: var(--font-size-fluid-1);
		padding: var(--size-3);
		margin: auto;
		color: var(--primary);
	}

	.restart {
		margin: 0.5rem;
	}

	main {
		padding: var(--size-7) clamp(1em, 6em, 10%);
	}
</style>
