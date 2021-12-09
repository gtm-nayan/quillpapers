<script>
	import AnswerButton from '$lib/components/app/AnswerButton.svelte';
	import Fa from 'svelte-fa/src/fa.svelte';
	import { faArrowLeft, faArrowRight, faCircleNotch } from '@fortawesome/free-solid-svg-icons';
	import { shortcut } from '$lib/helpers/shortcuts';
	import { createTimer } from '$lib/helpers/timer';
	import PDFViewer from 'svelte-pdfjs';

	export let questionStore;
	export let endFunction;

	let unsafeCurrentQuestionIdx;
	let isImageLoading = false;
	let questionScale = 2;
	let timer = createTimer();

	function mod(n, m) {
		return ((n % m) + m) % m;
	}

	function getValidQuestionIdx(input) {
		var invalidValues = [NaN, null, undefined, Infinity, -Infinity];
		return invalidValues.includes(parseInt(input))
			? 0
			: mod(parseInt(input), $questionStore.length);
	}

	function handleChoose(e) {
		$questionStore[safeCurrentQuestionIdx].selected =
			$questionStore[safeCurrentQuestionIdx].selected == e.detail ? '' : e.detail;
	}

	$: safeCurrentQuestionIdx = getValidQuestionIdx(unsafeCurrentQuestionIdx);
</script>

<section class="question-img">
	<div
		use:shortcut={{ code: 'KeyI', callback: (e) => (e.scrollTop -= 10) }}
		use:shortcut={{ code: 'KeyK', callback: (e) => (e.scrollTop += 10) }}
	>
		<PDFViewer
			pdfUrl="https://quillpdfs.netlify.app/{$questionStore[safeCurrentQuestionIdx]
				.subject_code}_{$questionStore[safeCurrentQuestionIdx].series}{$questionStore[
				safeCurrentQuestionIdx
			].exam_year}_qp_{$questionStore[safeCurrentQuestionIdx].paper_variant}.pdf"
			pageNumber={$questionStore[safeCurrentQuestionIdx].question_number}
			zoomLevel={questionScale}
		/>

		<label style="position: absolute; bottom: 1em; right: 1em;">
			{questionScale}x
			<input type="range" min="0.5" max="4" bind:value={questionScale} step="0.5" />
		</label>
	</div>
</section>

<section class="ui">
	<div class="settings">
		<select>
			<option value="">{$timer.h}h {$timer.m}m</option>
			<option value="">{$timer.h}h {$timer.m}m {$timer.s}.{$timer.ds}s</option>
			<option value="">We get there when we get there</option>
		</select>

		<select
			name="question_index"
			on:blur={(e) => (unsafeCurrentQuestionIdx = e.target.value)}
			value={safeCurrentQuestionIdx}
		>
			{#each $questionStore as question, i (i)}
				<option value={i}
					>{i + 1}
					{#if question.selected}
						| Answered
					{/if}
				</option>
			{/each}
		</select>

		<button on:click={() => endFunction($timer)}> Submit </button>
	</div>

	<div class="buttons">
		<button
			disabled={isImageLoading}
			class="previous"
			on:click={() => (unsafeCurrentQuestionIdx = safeCurrentQuestionIdx - 1)}
			use:shortcut={{ code: 'KeyJ' }}
			aria-label="previous"
		>
			<Fa icon={faArrowLeft} size="4x" />
		</button>

		<div class="choices">
			{#each ['A', 'B', 'C', 'D'] as choice}
				<AnswerButton
					isSelected={$questionStore[safeCurrentQuestionIdx].selected == choice}
					option={choice}
					on:choose={handleChoose}
					showResult={false}
				/>
			{/each}
		</div>

		<button
			class="next"
			on:click={() => (unsafeCurrentQuestionIdx = safeCurrentQuestionIdx + 1)}
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

<style>
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

	select {
		width: 17ch;
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
		justify-content: space-evenly;
		margin-bottom: 0.3em;
		flex-wrap: wrap;
	}
</style>
