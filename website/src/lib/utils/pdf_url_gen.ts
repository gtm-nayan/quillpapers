import type { Question } from './types.js';

export function get_PDF_URL(question: Question): string {
	return `https://quillpdfs.netlify.app/${pdf_id(question)}.pdf`;
}

export function pdf_id({
	subject_code,
	series,
	exam_year,
	paper_variant,
}: Question): string {
	return `${subject_code}_${series}${zero_two(exam_year)}_qp_${paper_variant}`;
}

/**
 * Pad a number with leading zeros to make it a string of length 2.
 */
export function zero_two(num: number): string {
	return num.toString().padStart(2, '0');
}
