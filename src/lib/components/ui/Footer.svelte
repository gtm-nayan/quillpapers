<script>
    import Fa from 'svelte-fa';
    import { faDiscord, faGithub } from "@fortawesome/free-brands-svg-icons";
</script>

<footer>
	<hr />
	&copy; gtmnayan {new Date().getFullYear()}
	<br />
	All questions are subject to the same conditions as those specified in their source question papers.
	<br />
	<a href="https://discordapp.com/users/339731096793251854" rel="external">
    <Fa icon={faDiscord} color="#7289DA" size="1.5x"/>
    </a> <a href="https://github.com/698969">
    <Fa icon={faGithub} color="#333" size="1.5x"/>
    </a>
</footer>

<style>
	footer {
		text-align: center;
	}
</style>
