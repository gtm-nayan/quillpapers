<script context="module" lang="ts">
	import Seo from '$lib/components/common/SEO.svelte';
	import { get_PDF_URL } from '$lib/utils/pdf_url_gen';
	import type { HumanTime } from '$lib/utils/timer';
	import type { Question, SubjectCode } from '$lib/utils/types';
	import { setContext } from 'svelte';
	import { writable } from 'svelte/store';
	import { subject_code, subject_details } from '../../_subject_code_store';
	import EndScreen from './_components/EndScreen/EndScreen.svelte';
	import MainSpeedrunScreen from './_components/MainSpeedrunScreen.svelte';
	import StartScreen from './_components/StartScreen.svelte';
	import type { QuestionStore } from './_components/stores';

	async function get_questions(subject_code: SubjectCode) {
		const res = await fetch(`/${subject_code}/speedrun.json`);

		if (!res.ok) throw Error("Couldn't fetch questions");

		return (await res.json()) as Question[];
	}
</script>

<script lang="ts">
	const enum SpeedrunState {
		START,
		ONGOING,
		DONE,
	}

	let speedrun_state = SpeedrunState.START; // @hmr:keep
	let time: HumanTime; // @hmr:keep

	const questions_store: QuestionStore = writable([]); // @hmr:keep
	setContext('questions_store', questions_store);

	async function handle_start() {
		try {
			questions_store.set(await get_questions($subject_code));
			speedrun_state = SpeedrunState.ONGOING;
		} catch {
			alert("Couldn't fetch questions.");
		}
	}
</script>

<Seo title="{$subject_code} | {$subject_details.name} | Speedrun" />

<svelte:head>
	{#each $questions_store as question (question)}
		<link rel="prefetch" href={get_PDF_URL(question)} />
	{/each}
</svelte:head>

{#if speedrun_state === SpeedrunState.START}
	<StartScreen on:click={handle_start} />
{:else if speedrun_state === SpeedrunState.ONGOING}
	<MainSpeedrunScreen
		on:end={(e) => {
			speedrun_state = SpeedrunState.DONE;
			time = e.detail;
		}}
	/>
{:else}
	<EndScreen
		subject_code={$subject_code}
		{time}
		on:click={() => (speedrun_state = SpeedrunState.START)}
	/>
{/if}
