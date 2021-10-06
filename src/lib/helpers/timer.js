import { readable } from 'svelte/store';

function msToTime(duration) {
	let ds = Math.floor((duration % 1000) / 100),
		seconds = Math.floor((duration / 1000) % 60),
		minutes = Math.floor((duration / (1000 * 60)) % 60),
		hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

	return { h: hours, m: minutes, s: seconds, ds };
}

export function createTimer() {
	return readable({ h: 0, m: 0, s: 0, ds: 0 }, function start(set) {
		let initTime = Date.now();
		const interval = setInterval(() => {
			set(msToTime(Date.now() - initTime));
		}, 100);
		return function stop() {
			clearInterval(interval);
		};
	});
}
