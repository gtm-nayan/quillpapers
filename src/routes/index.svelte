<script context="module">
	export const prerender = true;
</script>

<script>
	import Footer from '$lib/components/ui/Footer.svelte';

	import subjects from '$lib/data/subjects';
</script>

<svelte:head>
	<title>Quill Papers</title>
</svelte:head>

<main>
	<section>
		<h1>Welcome to Quill Papers</h1>
		<p>Free topical past papers for A Level MCQs.</p>
		<hr />
	</section>

	<section>
		<h2>Subjects</h2>
		<ul>
			{#each Object.keys(subjects) as subject_code}
				<li><a href="/{subject_code}">{subjects[subject_code]['subName']} ({subject_code})</a></li>
			{/each}
		</ul>
	</section>

	<section>
		<h2>Keybinds <subtitle style="font-size: xx-small;">if you wanna use em</subtitle></h2>
		
		<code>A, B, C, D</code> : Well....<br />
		<code>L</code> : Next Question <br />
		<code>J</code> : Previous Question <br />
		<code>K</code> : Scroll the question down<br />
		<code>I</code> : Scroll the question up<br />
		<code>T</code> : Focus topic selector<br />
		<code>Shift+E</code> : Open error report <br />
		<code>Shift+H</code> : Back to this page <br>
	</section>

	<section>
		<h2>How do I use the site?</h2>
		<p>
			For each subject there are two modes, casual and testing.
			<br />
			<br />
			In casual mode you can pick a topic for the subject and work through all the questions available
			for it. You'll get live feedback on whether your answer was correct or not. The back arrow will
			cycle between your current and your previous question. The forward arrow will load a new question.
			<br />
			<br />
			In testing mode, you'll get 40 random questions that you have to solve in one go without any feedback.
			You can submit your answers and the result will be evaluated along with your stats for each topic.
			If you get all correct while logged in, you will get featured on the speedrun leaderboard for that
			subject (if you're fast enough).
		</p>
	</section>

	<section>
		<h3>Mobile when?</h3>
		I ripped a lot of my hair out trying to write CSS for decently-sized screens, so maybe when it grows
		back.
	</section>

	<Footer />
</main>

<style>
	main {
		padding: 2% 10%;
		overflow: auto;
		text-align: justify;
	}

	h1,
	h2 {
		text-align: initial;
	}

	section {
		margin: 2em 0;
	}
</style>
