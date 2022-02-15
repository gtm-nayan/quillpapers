import { type Readable, readable } from 'svelte/store';

export interface HumanTime {
	minutes: number;
	seconds: number;
	deciseconds: number;
}

function time_diff(t1: number, t2: number): HumanTime {
	const diff = t2 - t1;
	const minutes = Math.floor(diff / 1000 / 60);
	const seconds = Math.floor(diff / 1000) - minutes * 60;
	const deciseconds = Math.floor(diff / 100) - (minutes * 60 + seconds) * 10;

	return { minutes, seconds, deciseconds };
}

export default function create_timer(): Readable<HumanTime> {
	return readable<HumanTime>(
		{ minutes: 0, seconds: 0, deciseconds: 0 },
		(set) => {
			const initial_time = Date.now();
			const interval = setInterval(() => {
				set(time_diff(initial_time, Date.now()));
			}, 100);
			return () => clearInterval(interval);
		}
	);
}
