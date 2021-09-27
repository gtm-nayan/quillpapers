<script>
	import { getContext } from 'svelte';
	import subjects from '$lib/data/subjects';

	const { close } = getContext('simple-modal');

	let error_type = 'BAD_CROPPING';
	let betterTopic = '1';

	let question = getContext('currentQuestion');
	let topics = subjects[question['subject_code']]['topics'];

	async function validateAndSend() {
		let reqBody;
		if (error_type == 'BAD_CROPPING' || error_type == 'WRONG_ANSWER') {
			reqBody = {
				...question,
				error_type
			};
		} else if (error_type == 'WRONG_TOPIC' && Object.keys(topics).includes(betterTopic)) {
			reqBody = {
				...question,
				error_type,
				topic_suggestion: betterTopic
			};
		}

		if (reqBody) {
			try {
				await fetch('/api/errorReport', {
					method: 'POST',
					body: JSON.stringify(reqBody),
					headers: {
						'Content-Type': 'application/json'
					}
				});
			} catch (error) {
				console.log(error);
			}
		}

		close();
	}
</script>

<div>
	{question.subject_code}
	{question.series}{question.exam_year} p{question.paper_variant} <br />
	Question Number: {question.question_number}
	<br />
	<h2 style="margin-bottom: 0.3rem">Type of error</h2>
	<select name="type" id="type" bind:value={error_type}>
		<option value="BAD_CROPPING">Bad cropping</option>
		<option value="WRONG_ANSWER">Wrong answer</option>
		<option value="WRONG_TOPIC">Wrong topic</option>
	</select>
</div>

{#if error_type === 'WRONG_TOPIC'}
	<br />
	<hr />
	<br />
	<div>
		<h5>Which topic do you think it'd fit better in?</h5>
		<select name="betterTopic" id="betterTopic" bind:value={betterTopic}>
			{#each Object.keys(topics) as topicNumber}
				<option value={topicNumber}>{topics[topicNumber]['topicName']}</option>
			{/each}
		</select>
	</div>
{/if}
<br />

<button on:click={validateAndSend}>Submit</button>

<style>
	button {
		border-radius: 0.2rem;
		border: none;
		box-shadow: var(--btn-shadow);
	}
</style>
