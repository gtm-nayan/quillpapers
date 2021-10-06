<script context="module">
	import * as pdfjs from 'pdfjs-dist/build/pdf.js';
	const { getDocument, GlobalWorkerOptions } = pdfjs;
	GlobalWorkerOptions.workerSrc =
		'https://cdn.jsdelivr.net/npm/pdfjs-dist@2.9.359/build/pdf.worker.min.js';
	const worker = new pdfjs.PDFWorker();
</script>

<script>
	let canvas;
	let loadingTask;

	function fetchNewDocument(url) {
		busy = true;

		loadingTask = getDocument({ url, worker });
		loadingTask.promise.then(render).catch(() => (busy = false));
	}

	function render(pdf) {
		pdf.getPage(pageNumber).then(function (page) {
			let viewport = page.getViewport({ scale: zoom });

			canvas.height = viewport.height;
			canvas.width = viewport.width;

			let ctx = canvas.getContext('2d');
			page
				.render({
					viewport: viewport,
					canvasContext: ctx
				})
				.promise.then(function () {
					busy = false;
					loadingTask.destroy();
				});
		});
	}

	export let url;
	export let canvasStyles = '';
	export let pageNumber = 1;
	export let zoom = 1;
	export let busy = false;

	$: pageNumber, zoom, fetchNewDocument(url);
</script>

<canvas bind:this={canvas} style={canvasStyles} />
