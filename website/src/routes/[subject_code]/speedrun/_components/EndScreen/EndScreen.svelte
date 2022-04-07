<script lang="ts">
	import subjects from '$lib/data/subjects.json';
	import type { HumanTime } from '$lib/utils/timer';
	import type { SubjectCode } from '$lib/utils/types';
	import { faRedo } from '@fortawesome/free-solid-svg-icons';
	import { getContext } from 'svelte';
	import { FaSvg, Icon } from 'svelte-yafal';
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
			// @ts-expect-error casting topic_number is verbose but safe
			name: subjects[subject_code].topics[topic_number].title,
			encountered: 0,
			correct: 0,
		};
		res.set(topic_number, obj);
		return obj;
	}

	for (const question of questions) {
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

	<div>
		<button on:click>
			<FaSvg><Icon icon={faRedo} flipX /></FaSvg> Restart
		</button>
		{#each questions as question}
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
