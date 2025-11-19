<script lang="ts">
	import { Carta, MarkdownEditor } from 'carta-md';
	import 'carta-md/default.css';
	import DOMPurify from 'isomorphic-dompurify';

	const carta = new Carta({
		sanitizer: DOMPurify.sanitize
	});

	let value = $state('');
</script>

<h1 class="font-bold text-2xl text-center mt-12">Write a blog</h1>
<form class="flex flex-col items-stretch bg-white rounded shadow-lg p-12 gap-3" method="post">
	<label class="font-semibold text-xs" for="title">Title</label>
	<input class="flex h-12 px-4 rounded focus:outline-none focus:ring-2"
				 type="text" name="title">
	<label class="font-semibold text-xs " for="description">Description (optional)</label>
	<textarea class="flex h-24 px-4 rounded focus:outline-none focus:ring-2 resize-none"
						name="description"></textarea>
	<div class="font-semibold text-xs ">Content</div>
	<MarkdownEditor bind:value {carta} />
	<input type="hidden" name="content" {value} />
	<button class="h-12 w-64 bg-blue-600 rounded font-semibold text-sm text-blue-100 hover:bg-blue-700"
					type="submit">
		Save post
	</button>
</form>

<style>
    @reference "../../app.css";

    /* Set your monospace font */
    /* Required to have the editor working correctly! */
    :global(.carta-font-code) {
        font-family: '...', monospace;
        font-size: 1.1rem;
        line-height: 1.1rem;
        letter-spacing: normal;
    }

    :global(.carta-renderer) {
        @apply prose prose-slate lg:prose-xl;
    }

    :global(.dark .carta-renderer) {
        @apply prose-invert;
    }
</style>