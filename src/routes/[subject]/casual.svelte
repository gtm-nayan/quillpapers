<script context="module">
	import subjects from '$lib/data/subjects';

	async function fetchRandomQuestion(subject_code, topic, fetcher) {
		let res = await fetcher(`/api/${subject_code}/normal/${topic}.json`);
		let data = await res.json();

		return data;
	}

	export async function load({ page, fetch }) {
		let sub_code = parseInt(page.params.subject);
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
					subject_code: parseInt(page.params.subject),
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
	import Fa from 'svelte-fa';
	import { faArrowLeft, faArrowRight, faSpinner } from '@fortawesome/free-solid-svg-icons';
	import { setContext } from 'svelte';
	import ErrorModal from '$lib/components/app/ErrorModal/ErrorModal.svelte';
	import { shortcut } from '$lib/helpers/shortcuts';

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

	let imgDiv;
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
			bind:this={imgDiv}
			use:shortcut={{ code: 'KeyI', callback: () => (imgDiv.scrollTop -= 5) }}
			use:shortcut={{ code: 'KeyK', callback: () => (imgDiv.scrollTop += 5) }}
		>
			<img
				src="https://res.cloudinary.com/quillpapers/questions/{currentQuestion.subject_code}_{currentQuestion.series}{currentQuestion.year}_qp_{currentQuestion.variant}_{currentQuestion.questionNo}.png"
				alt="{currentQuestion.subject_code}_{currentQuestion.series}{currentQuestion.year}_qp_{currentQuestion.variant} Question Number:{currentQuestion.questionNo}"
				on:load="{() => isImageLoading = false}"
			/>
		</div>
	</section>

	<section class="ui">
		<div class="settings">
			<select
				name="topic"
				id="select-topic"
				on:input={handleTopicChange}
				use:shortcut={{ code: 'KeyT', focus: true }}
			>
				{#each Object.keys(subjects[subject_code]['topics']) as topicNum}
					<option value={topicNum}>
						{subjects[subject_code]['topics'][topicNum]['topicName']}
					</option>
				{/each}
			</select>
			<span class="qd">
				{subject_code}/{currentQuestion.series}{currentQuestion.year}/{currentQuestion.variant}
			</span>
			<div>
				{#key currentQuestion}
					<ErrorModal />
				{/key}
			</div>
		</div>

		<div class="buttons">
			<button
				disabled={!previousQuestion}
				class="previous"
				on:click={goBack}
				use:shortcut={{ code: 'KeyJ' }}
			>
				<Fa icon={faArrowLeft} size="4x" />
			</button>

			<div class="choices">
				{#each ['A', 'B', 'C', 'D'] as choice}
					<AnswerButton
						isCorrect={currentQuestion.correct == choice}
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
			>
				{#if isLoading}
					<Fa icon={faSpinner} size="3.5x" spin pulse />
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
		flex: 1 1 65%;
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

	img {
		margin: auto;
		max-width: 100%;
	}

	.ui {
		display: flex;
		flex-direction: column;
		background-color: rgb(248, 249, 250);
		padding: 0.5em;
		flex: 1 1 35%;
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
		justify-content: space-between;
		margin-bottom: 0.3em;
		flex-wrap: wrap;
	}

	button {
		border-radius: 0.3em;
	}
</style>
