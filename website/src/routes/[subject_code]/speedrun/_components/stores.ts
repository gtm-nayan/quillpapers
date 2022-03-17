import type { Question } from '$lib/utils/types';
import {
	derived,
	get,
	writable,
	type Readable,
	type Writable,
} from 'svelte/store';

export type QuestionStore = Writable<Question[]>;
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function create_idx_store() {
	const { set, subscribe, update } = writable(0);

	function wrapping_clamp(n: number) {
		// mod != remainder in js so we have to do this weird dance
		const num_questions = 40;
		return ((n % num_questions) + num_questions) % num_questions;
	}

	return {
		subscribe,
		/**
		 * Set a value clamped between 0 and 39.
		 */
		set: (val: number) => {
			set(wrapping_clamp(val >> 0));
		},
		/**
		 * Increment the index by 1. (Wrap around at 40)
		 */
		increment: () => {
			update((n) => wrapping_clamp(n + 1));
		},
		/**
		 * Decrement the index by 1. (Wrap around to 39 at -1)
		 */
		decrement: () => {
			update((n) => wrapping_clamp(n - 1));
		},
	};
}

/**
 * Create a proxy store to a certain question in the questions_store containing an array of questions.
 *
 * @param {Readable<number>} idx_store The store that has the index of the question.
 * @param {QuestionStore} questions_store
 */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function create_current_question_store(
	idx_store: Readable<number>,
	questions_store: QuestionStore
) {
	const { subscribe } = derived(
		[idx_store, questions_store],
		([$idx_store, $questions_store]) => $questions_store[$idx_store]
	);

	return {
		subscribe,
		set: (val: Question) => {
			questions_store.update((a) => {
				a[get(idx_store)] = val;
				return a;
			});
		},
	};
}
