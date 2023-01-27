import subjects from '$lib/data/subjects.json';
import { QuestionErrorType } from '$lib/utils/types';
import { z } from 'zod';

const question = z.object({
	subject_code: z
		.number()
		.refine((subject_code) => subjects[subject_code], 'invalid subject_code'),
	series: z.enum(['m', 's', 'w']),
	exam_year: z.number().int(),
	paper_variant: z.number().int(),
	question_number: z.number().int().min(1).max(40),
});

export const error_report_schema = z.object({
	question,
	error: z.discriminatedUnion('type', [
		z.object({
			type: z.literal(QuestionErrorType.BAD_CROPPING),
		}),
		z.object({
			type: z.literal(QuestionErrorType.WRONG_ANSWER),
		}),
		z.object({
			type: z.literal(QuestionErrorType.WRONG_TOPIC),
			topic_suggestion: z.number().int(),
		}),
	]),
});

export type ReportedQuestion = z.infer<typeof error_report_schema>;
