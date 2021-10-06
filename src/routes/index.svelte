<script context="module">
	export const prerender = true;
</script>

<script>
	import Footer from '$lib/components/ui/Footer.svelte';
	import subjects from '$lib/data/subjects.json';
	import KofiButton from '$lib/components/ui/KofiButton.svelte';
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

	<section style="line-height: 1.6;">
		<h2>Keybinds <subtitle style="font-size: xx-small;">if you wanna use em</subtitle></h2>

		<kbd>A</kbd>, <kbd>B</kbd>, <kbd>C</kbd>, <kbd>D</kbd> : Well....<br />
		<kbd>L</kbd> : Next Question <br />
		<kbd>J</kbd> : Previous Question <br />
		<kbd>K</kbd> : Scroll the question down<br />
		<kbd>I</kbd> : Scroll the question up<br />
		<kbd>T</kbd> : Focus topic selector<br />
		<kbd>Shift</kbd>+<kbd>E</kbd> : Open error report <br />
		<kbd>Shift</kbd>+<kbd>H</kbd> : Back to this page <br />
	</section>

	<section>
		<h2>How do I use the site?</h2>
		<p>
			For each subject there are two modes, casual and speedrun.
			<br />
			<br />
			In casual mode you can pick a topic for the subject and work through all the questions available
			for it. You'll get live feedback on whether your answer was correct or not. The back arrow will
			cycle between your current and your previous question. The forward arrow will load a new question.
			<br />
			<br />
			In speedrun mode, you'll get 40 random questions that you have to solve in one go without any feedback.
			You can submit your answers and the result will be evaluated along with your stats for each topic.
			If you get all correct while logged in, you will get featured on the speedrun leaderboard for that
			subject (if you're fast enough).
		</p>
	</section>

	<section>
		<h3>Support Quillpapers</h3>
		<p>
			While quillpapers isn't for profit, hosting the database for the questions does incur a cost.
			Your support would go a long way in ensuring that I don't have to resort to ads to keep it
			running. It'd also allow me to add new features on more powerful servers, and questions for
			more subjects. If this site has been helpful to you, consider supporting me through Ko-fi.
		</p>
		<br />
		<KofiButton pText="Donate" pId="gtmnayan" />
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
		margin: 1em 0;
	}
</style>
