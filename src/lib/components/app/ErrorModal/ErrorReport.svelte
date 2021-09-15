<script>
	import { getContext } from 'svelte';
	import subjects from '$lib/data/subjects';

	const { close } = getContext('simple-modal');

	let type = 'BAD_CROPPING';
	let betterTopic = '1';
	let betterAnswer = 'A';

	let question = getContext('currentQuestion');
	let topics = subjects[question['subject_code']]['topics'];

	async function validateAndSend() {
		let reqBody;
		if (type == 'BAD_CROPPING') {
			reqBody = {
				question,
				type
			};
		} else if (type == 'INCORRECT_ANSWER' && ['A', 'B', 'C', 'D'].includes(betterAnswer)) {
			reqBody = {
				question,
				type,
				betterAnswer
			};
		} else if (type == 'INCORRECT_TOPIC' && Object.keys(topics).includes(betterTopic)) {
			reqBody = {
				question,
				type,
				betterTopic: parseInt(betterTopic)
			};
		}

		if (reqBody) {
			try {
				await fetch('/api/flag', {
					method: 'POST',
					body: JSON.stringify(reqBody)
				});
			} catch (error) {
				console.log(error);
			}
		}

		close();
	}
</script>

<div>
	{question.subject_code} {question.series}{question.year} {question.variant} <br>
	Question Number: {question.questionNo}
	<br />
	<h2 style="margin-bottom: 0.3rem">Type of error</h2>
	<select name="type" id="type" bind:value={type}>
		<option value="BAD_CROPPING">Bad cropping</option>
		<option value="INCORRECT_ANSWER">Incorrect answer</option>
		<option value="INCORRECT_TOPIC">Incorrect Topic</option>
	</select>
</div>

{#if type === 'INCORRECT_TOPIC'}
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
{:else if type === 'INCORRECT_ANSWER'}
	<br />
	<hr />
	<br />
	<div>
		<h5>Are you certain? If so, which answer do you think it is?</h5>
		{#each ['A', 'B', 'C', 'D'] as answer}
			<label>
				<input type="radio" value={answer} bind:group={betterAnswer} />
				{answer}
			</label>
			<br />
		{/each}
	</div>
{/if}
<br />

<button on:click={validateAndSend}>Submit</button>
