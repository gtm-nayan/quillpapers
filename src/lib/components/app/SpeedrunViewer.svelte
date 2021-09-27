<script>
	import AnswerButton from '$lib/components/app/AnswerButton.svelte';
	import Fa from 'svelte-fa/src/fa.svelte';
	import { faArrowLeft, faArrowRight, faCircleNotch } from '@fortawesome/free-solid-svg-icons';
	import PdfViewer from '$lib/components/app/PdfViewer.svelte?client';
	import { shortcut } from '$lib/helpers/shortcuts';
	import { browser } from '$app/env';

	export let questions;

	let unsafeCurrentQuestionIdx;
	let isImageLoading = false;
	let questionScale = 2;

	function mod(n, m) {
		return ((n % m) + m) % m;
	}

	function getValidQuestionIdx(input) {
		var invalidValues = [NaN, null, undefined, Infinity, -Infinity];
		return invalidValues.includes(parseInt(input)) ? 0 : mod(parseInt(input), 40);
	}

    function handleChoose(e){
        questions[safeCurrentQuestionIdx] = questions[safeCurrentQuestionIdx] == e.detail ? '' : e.detail
    }

	$: safeCurrentQuestionIdx = getValidQuestionIdx(unsafeCurrentQuestionIdx);
</script>

<main>
	<section class="question-img">
		<div
			use:shortcut={{ code: 'KeyI', callback: (e) => (e.scrollTop -= 10) }}
			use:shortcut={{ code: 'KeyK', callback: (e) => (e.scrollTop += 10) }}
		>
			{#if browser}
				<PdfViewer
					url="https://quillpdfs.netlify.app/{questions[safeCurrentQuestionIdx]
						.subject_code}_{questions[safeCurrentQuestionIdx].series}{questions[
						safeCurrentQuestionIdx
					].exam_year}_qp_{questions[safeCurrentQuestionIdx].paper_variant}.pdf"
					canvasStyles="margin: auto;"
					pageNumber={questions[safeCurrentQuestionIdx].question_number}
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
		<div class="settings" />

		<div class="buttons">
			<button
				disabled={isImageLoading}
				class="previous"
				on:click={() => unsafeCurrentQuestionIdx = safeCurrentQuestionIdx - 1}
				use:shortcut={{ code: 'KeyJ' }}
				aria-label="previous"
			>
				<Fa icon={faArrowLeft} size="4x" />
			</button>

			<div class="choices">
				{#each ['A', 'B', 'C', 'D'] as choice}
					<AnswerButton
						isSelected={questions[safeCurrentQuestionIdx] == choice}
						option={choice}
						on:choose={handleChoose}
					/>
				{/each}
			</div>

			<button
				class="next"
				on:click={() => unsafeCurrentQuestionIdx = safeCurrentQuestionIdx + 1}
				disabled={isImageLoading}
				use:shortcut={{ code: 'KeyL' }}
				aria-label="next"
			>
				{#if isImageLoading}
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
