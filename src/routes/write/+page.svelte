<script lang="ts">
	import { Carta, MarkdownEditor } from 'carta-md';
	import 'carta-md/default.css';
	import DOMPurify from 'isomorphic-dompurify';
	import { invalidateAll } from '$app/navigation';
	import { resolve } from '$app/paths';

	const carta = new Carta({
		sanitizer: DOMPurify.sanitize
	});

	let contentValue = $state('');

	const addToContent = (filename: string) => {
		const apiRoute = resolve(`/cdn/new/${filename}`);
		contentValue += `\n![Alt Text](${apiRoute})`;
	};

	let uploading = $state(false);
	let uploadError = $state('');

	async function handleUpload(event) {
		const files = event.target.files;
		if (!files) return;

		// Iterate over the FileList
		for (const file of files) {
			await uploadFile(file);
		}

		// Clear input so the same file can be selected again if needed
		event.target.value = '';
	}

	async function uploadFile(file) {
		uploading = true;

		const formData = new FormData();
		formData.append('file', file);

		try {
			const response = await fetch('/api/upload', {
				method: 'POST',
				body: formData
			});

			if (response.ok) {
				// Force reload data.
				await invalidateAll();
			} else {
				uploadError = response.statusText;
			}
		} catch (error) {
			uploadError = error as string;
		} finally {
			uploading = false;
		}
	}

	let { data } = $props();
</script>

<h1 class="font-bold text-2xl text-center mt-12">Write a blog</h1>
<form class="flex flex-col items-stretch rounded shadow-lg p-12 gap-3" method="post">
	<label class="font-semibold text-xs" for="title">Title</label>
	<input class="flex h-12 px-4 rounded focus:outline-none focus:ring-2"
				 type="text" name="title">
	<label class="font-semibold text-xs " for="description">Description (optional)</label>
	<textarea class="flex h-24 px-4 rounded focus:outline-none focus:ring-2 resize-none"
						name="description"></textarea>
	<label
		class="w-36 py-1 px-3 rounded bg-blue-500 text-blue-100 hover:bg-blue-700 text-xs font-semibold focus:outline-none focus:ring-2 hover:cursor-pointer text-center"
	>
		<span>Upload an image</span>
		<input
			type="file"
			multiple
			accept="image/*"
			onchange={handleUpload}
			class="sr-only"
		/>
	</label>

	<div>
		{#if uploading}
			<div>Uploading...</div>
		{/if}
		{#if uploadError}
			<div>{uploadError}</div>
		{/if}

		Uploaded images: {#if data.filenames.length === 0}none{/if}
		<div class="flex flex-col gap-2">
			{#each data.filenames as filename}
				<button
					type="button"
					class="bg-gray-100 hover:bg-gray-200"
					onclick={() => addToContent(filename)}
				>
					{filename}
				</button>
			{/each}
		</div>
	</div>
	<div class="font-semibold text-xs ">Content</div>
	<MarkdownEditor bind:value={contentValue} {carta} />
	<input type="hidden" name="content" value={contentValue} />
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