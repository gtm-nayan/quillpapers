import subjects from '$lib/data/subjects.json';
import { QuestionErrorType, type BaseQuestion } from '$lib/utils/types';
import { z } from 'zod';

export const zod_schema = z
	.object({
		subject_code: z
			.number()
			.refine((subject_code) => subjects[subject_code], 'invalid subject_code'),
		series: z.enum(['m', 's', 'w']),
		exam_year: z.number().int(),
		paper_variant: z.number().int(),
		question_number: z.number().int().min(1).max(40),
		error_type: z.union([
			z.literal(QuestionErrorType.BAD_CROPPING),
			z.literal(QuestionErrorType.WRONG_ANSWER),
			z.literal(QuestionErrorType.WRONG_TOPIC),
		]),
		topic_suggestion: z.number().int().optional(),
	})
	.refine(
		(data) =>
			data.error_type !== QuestionErrorType.WRONG_TOPIC ||
			data.topic_suggestion,
		'topic_suggestion is required if error_type is WRONG_TOPIC'
	);

export interface ReportedQuestion extends BaseQuestion {
	error_type: QuestionErrorType;
	topic_suggestion?: number;
}
