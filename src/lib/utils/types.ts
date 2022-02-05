import type subjects from '$lib/data/subjects.json';

export type Answer = 'A' | 'B' | 'C' | 'D';

export const POSSIBLE_ANSWERS: Array<Answer> = ['A', 'B', 'C', 'D'];

export interface BaseQuestion {
	subject_code: SubjectCode;
	series: 'm' | 's' | 'w';
	exam_year: number;
	paper_variant: number;
	question_number: number;
}

export interface Question extends BaseQuestion {
	correct_answer: Answer;
	selected?: Answer;
	topic_number?: number;
}

export type SubjectCode = keyof typeof subjects;

export interface SubjectDetails {
	name: string;
	notes: string;
	topics: { [topic_number: string]: { title: string; count: number } };
}

export const enum QuestionErrorType {
	BAD_CROPPING,
	WRONG_ANSWER,
	WRONG_TOPIC,
}
