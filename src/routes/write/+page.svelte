<script lang="ts">
	import { Carta, MarkdownEditor } from 'carta-md';
	import 'carta-md/default.css';
	import DOMPurify from 'isomorphic-dompurify';

	const carta = new Carta({
		sanitizer: DOMPurify.sanitize
	});

	let value = $state('');
</script>

<h1>Write a blog</h1>
<br/>
<form method="post">
	<input type="hidden" name="content" {value} />
	<button type="submit">Save post</button>
</form>
<MarkdownEditor bind:value {carta} />

<style>
    /* Or in global stylesheet */
    /* Set your monospace font */
    /* Required to have the editor working correctly! */
    :global(.carta-font-code) {
        font-family: '...', monospace;
        font-size: 1.1rem;
        line-height: 1.1rem;
        letter-spacing: normal;
    }
</style>