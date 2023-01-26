<script lang="ts">
	import { get_PDF_URL, zero_two } from '$lib/utils/pdf_url_gen';
	import type { Question } from '$lib/utils/types';
	import { Document, Page } from 'svelte-pdfjs';

	export let question: Question;
</script>

<details>
	<summary>
		<code>
			{question.subject_code}
			{question.series}{zero_two(question.exam_year)}
			{question.paper_variant}
			QN: {zero_two(question.question_number)}
			|
			<span>
				<!-- Normal space gets collapsed so use a &ensp; -->
				Your answer: {question.selected ?? ' '}
			</span>
			|
			<span>Correct answer: {question.correct_answer}</span>
		</code>
	</summary>

	<div>
		<Document file={get_PDF_URL(question)}>
			<Page num={question.question_number} />
		</Document>
	</div>
</details>

<style lang="scss">
	details[open] {
		padding-bottom: 1em;
	}

	div {
		padding-block: 1rem;
	}
</style>
