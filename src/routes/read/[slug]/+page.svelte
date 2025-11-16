<script lang="ts">
	import { Carta, Markdown } from 'carta-md';
	import DOMPurify from 'isomorphic-dompurify';

	const carta = new Carta({
		sanitizer: DOMPurify.sanitize
	});

	let { data } = $props();
</script>

{#await data.blog then blog}
	<h1>{blog.id}</h1>
	<br />
	<Markdown {carta} value={blog.content} />
{/await}
