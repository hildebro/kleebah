<script lang="ts">
	import { Carta, Markdown } from 'carta-md';
	import DOMPurify from 'isomorphic-dompurify';

	const carta = new Carta({
		sanitizer: DOMPurify.sanitize
	});

	let { data } = $props();
</script>

{#await data.blog then blog}
	<h1>{blog.title}</h1>
	<p>{blog.description}</p>
	<br />
	<Markdown {carta} value={blog.content} />
{/await}
