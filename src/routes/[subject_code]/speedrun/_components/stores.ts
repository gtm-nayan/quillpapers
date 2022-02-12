import type { Question } from '$lib/utils/types';
import { derived, get, writable, type Readable } from 'svelte/store';
import type { QuestionStore } from '../index.svelte';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function create_idx_store() {
	const { set, subscribe, update } = writable(0);

	return {
		subscribe,
		/**
		 * Set a value clamped between 0 and 39.
		 */
		set: (val: number) => {
			// Abuse js whack to get val as an integer.
			set(Math.max(0, Math.min(val >> 0, 39)));
		},
		/**
		 * Increment the index by 1. (Wrap around at 40)
		 */
		increment: () => {
			update((v) => (v >= 39 ? 0 : v + 1));
		},
		/**
		 * Decrement the index by 1. (Wrap around to 39 at -1)
		 */
		decrement: () => {
			update((v) => (v <= 0 ? 39 : v - 1));
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
