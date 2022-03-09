import type { Question } from './types.js';

export default function get_PDF_URL(question: Question): string {
	return `https://quillpdfs.netlify.app/${pdf_id(question)}.pdf`;
}

export function pdf_id(question: Question): string {
	//prettier-ignore
	return `${question.subject_code}_${question.series}${question.exam_year.toString().padStart(2, '0')}_qp_${question.paper_variant}`;
}
