<script context="module">
	import subjects from '$lib/data/subjects.json';
	async function fetchRandomQuestion(subject_code, topic, fetcher) {
		let res = await fetcher(
			`/api/randomQuestion?subject_code=${subject_code}&topic_number=${topic}`
		);
		if (res.ok) return res.json();
	}

	export async function load({ page, fetch }) {
		let sub_code = page.params.subject;

		if (subjects[sub_code]?.topics) {
			let q;
			try {
				q = await fetchRandomQuestion(page.params.subject, 1, fetch);
			} catch (error) {
				console.log(error);
			}

			return {
				status: q ? 200 : 504,
				props: {
					subject_code: page.params.subject,
					currentQuestion: q
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
	import AnswerButton from '$lib/components/app/AnswerButton.svelte';
	import Fa from 'svelte-fa/src/fa.svelte';
	import { faArrowLeft, faArrowRight, faCircleNotch } from '@fortawesome/free-solid-svg-icons';
	import { setContext } from 'svelte';
	import ErrorModal from '$lib/components/app/ErrorModal/ErrorModal.svelte';
	import PdfViewer from '$lib/components/app/PdfViewer.svelte?client';
	import { shortcut } from '$lib/helpers/shortcuts';
	import { browser } from '$app/env';

	export let subject_code;
	export let currentQuestion;

	$: setContext('currentQuestion', currentQuestion);

	let previousQuestion = currentQuestion;
	let selected = '';
	let topic = '1';
	let isFetchingQuestion = false;
	let isImageLoading = false;
	$: isLoading = isImageLoading || isFetchingQuestion;

	async function handleTopicChange(e) {
		topic = e.target.value;
		document.activeElement.blur();
		await getNewQuestion();
	}

	async function getNewQuestion() {
		isFetchingQuestion = true;

		try {
			let newQuestion = await fetchRandomQuestion(subject_code, topic, fetch);
			previousQuestion = currentQuestion;
			currentQuestion = newQuestion;
			selected = '';
			isImageLoading = true;
		} catch (error) {
			console.error(error);
		}
		isFetchingQuestion = false;
	}

	function goBack() {
		let t = currentQuestion;
		currentQuestion = previousQuestion;
		previousQuestion = t;
		selected = '';
	}

	function handleChoose(event) {
		selected = event.detail;
	}

	let questionScale = 2;
</script>

<svelte:head>
	<title>
		{subject_code} |
		{subjects[subject_code].subName} |
		{subjects[subject_code]['topics'][topic]['topicName']}
	</title>
</svelte:head>

<main>
	<section class="question-img">
		<div
			use:shortcut={{ code: 'KeyI', callback: (e) => (e.scrollTop -= 10) }}
			use:shortcut={{ code: 'KeyK', callback: (e) => (e.scrollTop += 10) }}
		>
			{#if browser}
				<PdfViewer
					url="https://quillpdfs.netlify.app/{currentQuestion.subject_code}_{currentQuestion.series}{currentQuestion.exam_year}_qp_{currentQuestion.paper_variant}.pdf"
					canvasStyles="margin: auto;"
					pageNumber={currentQuestion.question_number}
					zoom={questionScale}
					bind:busy={isImageLoading}
				/>
			{/if}

			<label style="position: absolute; bottom: 1em; right: 1em;">
				{questionScale}x
				<input type="range" min="0.5" max="4" bind:value={questionScale} step="0.5" />
			</label>
		</div>
	</section>

	<section class="ui">
		<div class="settings">
			<select
				name="topic"
				id="select-topic"
				on:input={handleTopicChange}
				use:shortcut={{ code: 'KeyT', callback: (e) => e.focus() }}
			>
				{#each Object.keys(subjects[subject_code]['topics']) as topicNum}
					<option value={topicNum}>
						{subjects[subject_code]['topics'][topicNum]['topicName']}
					</option>
				{/each}
			</select>
			<span class="qd">
				{currentQuestion.series}{currentQuestion.exam_year} p{currentQuestion.paper_variant}
			</span>
			<div>
				{#key currentQuestion}
					<ErrorModal />
				{/key}
			</div>
		</div>

		<div class="buttons">
			<button
				disabled={!previousQuestion || isLoading}
				class="previous"
				on:click={goBack}
				use:shortcut={{ code: 'KeyJ' }}
				aria-label="previous"
			>
				<Fa icon={faArrowLeft} size="4x" />
			</button>

			<div class="choices">
				{#each ['A', 'B', 'C', 'D'] as choice}
					<AnswerButton
						isCorrect={currentQuestion.correct_answer == choice}
						isSelected={selected == choice}
						option={choice}
						on:choose={handleChoose}
					/>
				{/each}
			</div>

			<button
				class="next"
				on:click={getNewQuestion}
				disabled={isLoading}
				use:shortcut={{ code: 'KeyL' }}
				aria-label="next"
			>
				{#if isLoading}
					<Fa icon={faCircleNotch} size="3.5x" spin />
				{:else}
					<Fa icon={faArrowRight} size="4x" />
				{/if}
			</button>
		</div>
	</section>
</main>

<style>
	main {
		flex-grow: 1;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	.question-img {
		flex: 1 1 75%;
		position: relative;
	}

	.question-img > div {
		height: 0;
		width: 0;
		overflow: auto;
		min-height: 100%;
		min-width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.ui {
		display: flex;
		flex-direction: column;
		background-color: rgb(248, 249, 250);
		padding: 0.5em;
		flex: 1 1 27.5%;
	}

	.choices {
		display: flex;
		justify-content: space-around;
		align-items: center;
		flex-grow: 1;
		flex-wrap: wrap;
		gap: 0.5em;
	}

	.qd {
		font-family: monospace;
	}

	.buttons {
		display: flex;
		justify-content: space-between;
		flex-grow: 1;
	}

	.settings {
		display: flex;
		gap: 0.2rem;
		justify-content: space-between;
		margin-bottom: 0.3em;
		flex-wrap: wrap;
	}

	button {
		border-radius: 0.3em;
		border: none;
		box-shadow: var(--btn-shadow);
	}
</style>
