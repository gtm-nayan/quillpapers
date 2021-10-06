/// <reference types="@sveltejs/kit" />

interface SpeedrunQuestion {
	subject_code: string;
	exam_year: number;
	series: 'm' | 's' | 'w';
    question_number: number;
	paper_variant: number;
	correct_answer: 'A' | 'B' | 'C' | 'D';
	selected?: 'A' | 'B' | 'C' | 'D' | '';
}
