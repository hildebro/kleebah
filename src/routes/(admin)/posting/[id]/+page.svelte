<script lang="ts">
  import { Carta, MarkdownEditor } from 'carta-md'
  import 'carta-md/default.css'
  import DOMPurify from 'isomorphic-dompurify'
  import { invalidateAll } from '$app/navigation'
  import { resolve } from '$app/paths'
  import * as m from '$lib/paraglide/messages'

  let { data } = $props()

  const carta = new Carta({
    sanitizer: DOMPurify.sanitize
  })

  let titleValue = $state(data.posting.title)
  let descriptionValue = $state(data.posting.description)
  let contentValue = $state(data.posting.content)
  let visibilityValue = $state(data.posting.visibility)

  const addToContent = (filename: string) => {
    const apiRoute = resolve(`/cdn/${data.posting.id}/${filename}`)
    contentValue += `\n![Alt Text](${apiRoute})`
  }

  let uploading = $state(false)
  let uploadError = $state('')

  async function handleUpload(event) {
    const files = event.target.files
    if (!files) return

    // Iterate over the FileList
    for (const file of files) {
      await uploadFile(file)
    }

    // Clear input so the same file can be selected again if needed
    event.target.value = ''
  }

  async function uploadFile(file) {
    uploading = true

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        // Force reload data.
        await invalidateAll()
      } else {
        uploadError = response.statusText
      }
    } catch (error) {
      uploadError = error as string
    } finally {
      uploading = false
    }
  }
</script>

<h1 class="mt-12 text-center text-2xl font-bold">{m.create_posting()}</h1>
<form
  class="flex flex-col items-stretch gap-3 rounded p-12 shadow-lg"
  method="post"
  action="?/update"
>
  <input type="hidden" name="id" value={data.posting.id} />
  <label class="text-xs font-semibold" for="title">{m.create_posting_title()}</label>
  <input
    class="flex h-12 rounded px-4 focus:ring-2 focus:outline-none"
    type="text"
    name="title"
    value={titleValue}
  />
  <label class="text-xs font-semibold" for="description">{m.create_posting_description()}</label>
  <textarea
    class="flex h-24 resize-none rounded px-4 focus:ring-2 focus:outline-none"
    name="description">{descriptionValue}</textarea
  >
  <label
    class="w-36 rounded bg-blue-500 px-3 py-1 text-center text-xs font-semibold text-blue-100 hover:cursor-pointer hover:bg-blue-700 focus:ring-2 focus:outline-none"
  >
    <span>{m.create_posting_upload()}</span>
    <input type="file" multiple accept="image/*" onchange={handleUpload} class="sr-only" />
  </label>

  <div>
    {#if uploading}
      <div>{m.create_posting_upload_in_progress()}</div>
    {/if}
    {#if uploadError}
      <div>{uploadError}</div>
    {/if}

    {#if data.filenames.length > 0}
      {m.create_posting_upload_list()}
      <div class="flex flex-col gap-2">
        {#each data.filenames as filename (filename)}
          <button
            type="button"
            class="bg-gray-100 hover:bg-gray-200"
            onclick={() => addToContent(filename)}
          >
            {filename}
          </button>
        {/each}
      </div>
    {/if}
  </div>
  <div class="text-xs font-semibold">{m.create_posting_content()}</div>
  <MarkdownEditor bind:value={contentValue} {carta} />
  <input type="hidden" name="content" value={contentValue} />
  <div class="text-xs font-semibold">{m.create_posting_visibility()}</div>
  <div class="flex flew-row gap-2">
    <label class="flex h-12 cursor-pointer items-center gap-3 rounded px-4 ring-1 ring-gray-200 transition hover:bg-gray-50 has-[:checked]:ring-2 has-[:checked]:ring-blue-500">
      <input
        type="radio"
        name="visibility"
        value="public"
        checked={visibilityValue === 'public'}
        class="h-4 w-4 border-gray-300 text-blue-600 focus:ring-offset-0 focus:outline-none"
      />
      <span class="text-sm">{m.visibility_public()}</span>
    </label>
    <label class="flex h-12 cursor-pointer items-center gap-3 rounded px-4 ring-1 ring-gray-200 transition hover:bg-gray-50 has-[:checked]:ring-2 has-[:checked]:ring-blue-500">
      <input
        type="radio"
        name="visibility"
        value="subscribers"
        checked={visibilityValue === 'subscribers'}
        class="h-4 w-4 border-gray-300 text-blue-600 focus:ring-offset-0 focus:outline-none"
      />
      <span class="text-sm">{m.visibility_subscribers()}</span>
    </label>
  </div>
  <div class="flex justify-between">
    <button
      class="h-12 w-64 rounded bg-blue-600 text-sm font-semibold text-blue-100 hover:bg-blue-700"
      type="submit"
    >
      {m.create_posting_save()}
    </button>
    <button
      class="h-12 w-64 rounded bg-red-600 text-sm font-semibold text-red-100 hover:bg-red-700"
      type="submit"
      formaction="?/delete"
    >
      {m.posting_delete()}
    </button>
  </div>
</form>

<style>
  @reference "../../../../app.css";

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
