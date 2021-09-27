<script>
	import { getContext } from 'svelte';
	import ErrorReport from './ErrorReport.svelte';
	import { shortcut } from '$lib/helpers/shortcuts';

	const { open } = getContext('simple-modal');

	function showModal() {
		open(ErrorReport);
	}
</script>

<button on:click={showModal} use:shortcut={{ shift: true, code: 'KeyE' }}>
	📣 Something wrong with the question?
</button>

<style>
	button {
		border-radius: 0.2em;
		box-shadow: var(--btn-shadow);
		border: none;
	}
</style>
