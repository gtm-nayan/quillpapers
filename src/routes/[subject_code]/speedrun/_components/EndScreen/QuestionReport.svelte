<script lang="ts">
	import get_PDF_URL from '$lib/utils/pdf_url_gen';

	import type { Question } from '$lib/utils/types';
	import { Document, Page } from 'svelte-pdfjs';

	export let question: Question;
</script>

<details>
	<summary>
		<code>
			{question.subject_code}
			{question.series}{question.exam_year.toString().padStart(2, '0')}
			{question.paper_variant}
			QN: {question.question_number.toString().padStart(2, '0')}
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

<style>
	details[open] {
		padding-bottom: 1em;
	}
</style>
