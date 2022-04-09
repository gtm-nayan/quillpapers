<script lang="ts">
	export let title: string;
	export let desc = '';
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={desc} />
</svelte:head>
