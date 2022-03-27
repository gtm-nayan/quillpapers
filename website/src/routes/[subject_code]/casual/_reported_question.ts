import yup from 'yup';
import subjects from '$lib/data/subjects.json';
import { QuestionErrorType, type BaseQuestion } from '$lib/utils/types';

export const schema = yup.object({
	subject_code: yup
		.number()
		.required()
		.oneOf(Object.keys(subjects).map(Number)),
	series: yup.string().required().oneOf(['m', 's', 'w']),
	exam_year: yup.number().required(),
	paper_variant: yup.number().required(),
	question_number: yup.number().required(),
	error_type: yup
		.number()
		.required()
		.oneOf([
			QuestionErrorType.BAD_CROPPING,
			QuestionErrorType.WRONG_ANSWER,
			QuestionErrorType.WRONG_TOPIC,
		]),
	topic_suggestion: yup.number(),
});

export interface ReportedQuestion extends BaseQuestion {
	error_type: QuestionErrorType;
	topic_suggestion?: number;
}
