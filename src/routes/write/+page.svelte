<script lang="ts">
	import { Carta, MarkdownEditor } from 'carta-md';
	import 'carta-md/default.css';
	import DOMPurify from 'isomorphic-dompurify';

	const carta = new Carta({
		sanitizer: DOMPurify.sanitize
	});

	let contentValue = $state('');

	let uploading = []; // To track upload status for UI feedback

	async function handleUpload(event) {
		const files = event.target.files;
		if (!files) return;

		// Iterate over the FileList
		for (const file of files) {
			uploadFile(file);
		}

		// Clear input so the same file can be selected again if needed
		event.target.value = '';
	}

	async function uploadFile(file) {
		// Add to local state for UI feedback
		const uploadId = Math.random().toString(36);
		uploading = [...uploading, { id: uploadId, name: file.name, status: 'Uploading...' }];

		const formData = new FormData();
		formData.append('file', file);

		try {
			const response = await fetch('/api/upload', {
				method: 'POST',
				body: formData
			});

			if (response.ok) {
				updateStatus(uploadId, 'Done');
			} else {
				updateStatus(uploadId, 'Failed');
			}
		} catch (error) {
			updateStatus(uploadId, 'Error');
		}
	}

	function updateStatus(id, status) {
		uploading = uploading.map(u => u.id === id ? { ...u, status } : u);
	}
</script>

<h1 class="font-bold text-2xl text-center mt-12">Write a blog</h1>
<form class="flex flex-col items-stretch bg-white rounded shadow-lg p-12 gap-3" method="post">
	<label class="font-semibold text-xs" for="title">Title</label>
	<input class="flex h-12 px-4 rounded focus:outline-none focus:ring-2"
				 type="text" name="title">
	<label class="font-semibold text-xs " for="description">Description (optional)</label>
	<textarea class="flex h-24 px-4 rounded focus:outline-none focus:ring-2 resize-none"
						name="description"></textarea>
	<div class="uploader">
		<h2>Raw Image Uploader</h2>

		<input
			type="file"
			multiple
			accept="image/*"
			onchange={handleUpload}
		/>

		<ul>
			{#each uploading as item}
				<li class:success={item.status === 'Done'} class:error={item.status === 'Failed' || item.status === 'Error'}>
					{item.name}: <strong>{item.status}</strong>
				</li>
			{/each}
		</ul>
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

    .uploader {
        max-width: 500px;
        margin: 2rem auto;
        font-family: sans-serif;
    }
    input {
        margin-bottom: 1rem;
        padding: 10px;
        border: 1px solid #ccc;
        width: 100%;
    }
    ul {
        list-style: none;
        padding: 0;
    }
    li {
        background: #f4f4f4;
        margin: 5px 0;
        padding: 8px;
        border-radius: 4px;
    }
    .success { color: green; }
    .error { color: red; }
</style>