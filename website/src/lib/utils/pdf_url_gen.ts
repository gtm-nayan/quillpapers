import type { Question } from './types.js';

export default function get_PDF_URL(question: Question): string {
	// prettier-ignore
	return `https://quillpdfs.netlify.app/${question.subject_code}_${question.series}${question.exam_year.toString().padStart(2, '0')}_qp_${question.paper_variant}.pdf`;
}
