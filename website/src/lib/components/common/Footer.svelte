<script lang="ts">
	import { faDiscord, faGithub } from '@fortawesome/free-brands-svg-icons';
	import { FaSvg, Icon } from 'svelte-yafal';
</script>

<footer>
	<hr />
	&copy; gtmnayan 2021-{new Date().getFullYear()}
	<br />
	All questions are provided for educational purposes only. They're subject to the
	same copyright as specified in their source question papers.
	<br />
	You can reach me through discord for any queries.
	<br />
	<a href="https://discordapp.com/users/339731096793251854" rel="external">
		<FaSvg><Icon icon={faDiscord} color="#7289DA" /></FaSvg>
	</a>
	<a href="https://github.com/gtm-nayan/quillpapers">
		<FaSvg><Icon icon={faGithub} color="#333" /></FaSvg>
	</a>
</footer>

<style>
	a {
		font-size: 1.5em;
	}
	footer {
		text-align: center;
		margin-top: auto;
	}
</style>
