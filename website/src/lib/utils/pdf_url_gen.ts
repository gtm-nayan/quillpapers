import type { Question } from './types.js';

export default function get_PDF_URL(question: Question): string {
	return `https://quillpdfs.netlify.app/${pdf_id(question)}.pdf`;
}

export function pdf_id(question: Question): string {
	//prettier-ignore
	return `${question.subject_code}_${question.series}${zero_two(question.exam_year)}_qp_${question.paper_variant}`;
}

/**
 * Pad a number with leading zeros to make it a string of length 2.
 */
export function zero_two(num: number): string {
	return num.toString().padStart(2, '0');
}
