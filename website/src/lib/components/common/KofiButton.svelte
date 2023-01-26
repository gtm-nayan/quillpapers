<div>
	<a
		title="Support me on ko-fi.com"
		href="https://ko-fi.com/gtmnayan"
		target="_blank"
		rel="noopener noreferrer"
		class="btn-w"
	>
		<span class="kofitext">
			<img
				src="https://storage.ko-fi.com/cdn/cup-border.png"
				alt="Ko-fi donations"
			/>
			Donate
		</span>
	</a>
</div>

<style lang="scss">
	img {
		display: initial;
		vertical-align: middle;
		height: 13px;
		width: 20px;
		padding-block: 0;
		border: none;
		margin: 0 5px 0 3px;
	}
	img::after {
		vertical-align: middle;
		height: 25px;
		padding-block: 0;
		border: none;
		margin: 0 6px 0 4px;
		content: url('https://storage.ko-fi.com/cdn/whitelogo.svg');
	}
	div {
		display: inline-block;
		white-space: nowrap;
		min-width: 160px;
	}
	span {
		font-family: cursive;
		color: var(--primary);
		letter-spacing: -0.15px;
		vertical-align: middle;
		line-height: 33px;
		padding: 0;
		text-align: center;
		text-decoration: none;
		text-shadow: 0 1px 1px rgba(34, 34, 34, 0.05);
	}

	img {
		height: 15px;
		width: 22px;
		display: initial;
		animation: wiggle 3s infinite;
	}
	@keyframes wiggle {
		0% {
			transform: rotate(0) scale(1);
		}
		60% {
			transform: rotate(0) scale(1);
		}
		75% {
			transform: rotate(0) scale(1.12);
		}
		80% {
			transform: rotate(0) scale(1.1);
		}
		84% {
			transform: rotate(-10deg) scale(1.1);
		}
		88% {
			transform: rotate(10deg) scale(1.1);
		}
		92% {
			transform: rotate(-10deg) scale(1.1);
		}
		96% {
			transform: rotate(10deg) scale(1.1);
		}
		100% {
			transform: rotate(0) scale(1);
		}
	}
</style>
