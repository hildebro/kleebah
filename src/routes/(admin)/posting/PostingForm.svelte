<script lang="ts">
  import { Carta, MarkdownEditor } from 'carta-md'
  import 'carta-md/default.css'
  import DOMPurify from 'isomorphic-dompurify'
  import { invalidateAll } from '$app/navigation'
  import { resolve } from '$app/paths'
  import * as m from '$lib/paraglide/messages'
  import RoleTreeMultiSelect from '$lib/components/RoleTreeMultiSelect.svelte'
  import type { RoleWithChildren } from '$lib/roles.ts'
  import { SvelteMap, SvelteSet } from 'svelte/reactivity'

  interface PostingData {
    id?: string;
    title: string;
    description: string | null;
    content: string;
    visibility: string;
    roles: string[];
  }

  interface Props {
    posting?: PostingData;
    filenames: string[];
    formAction: string;
    roleTree: RoleWithChildren[];
  }

  let {
    posting = {
      title: '',
      description: '',
      content: '',
      visibility: 'public',
      roles: []
    },
    filenames,
    formAction,
    roleTree
  }: Props = $props()

  const carta = new Carta({
    sanitizer: DOMPurify.sanitize
  })

  // --- State ---
  // We initialize state with the passed prop or defaults
  let titleValue = $state(posting.title)
  let descriptionValue = $state(posting.description)
  let contentValue = $state(posting.content)
  let visibilityValue = $state(posting.visibility)

  let uploading = $state(false)
  let uploadError = $state('')

  // --- Logic ---
  // Determine if we are editing an existing post
  const isEditMode = $derived(!!posting.id)

  // Dynamic path helper
  const addToContent = (filename: string) => {
    const resourceId = posting.id ?? 'new'
    const apiRoute = resolve(`/cdn/${resourceId}/${filename}`)
    contentValue += `\n![Alt Text](${apiRoute})`
  }

  async function handleUpload(event: Event) {
    const input = event.target as HTMLInputElement
    const files = input.files
    if (!files) return

    for (const file of files) {
      await uploadFile(file)
    }
    input.value = ''
  }

  async function uploadFile(file: File) {
    uploading = true
    const formData = new FormData()
    formData.append('file', file)

    try {
      // Use a consistent upload endpoint, or pass this as a prop if they strictly differ
      // Assuming your backend can handle the context based on route or session
      const response = await fetch(resolve('/(admin)/api/upload'), {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
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

  // Source of truth for roles. Callbacks in the SubscriberRoleOption will update this.
  let roles = new SvelteSet(posting.roles)

  let maps = $derived.by(() => {
    const parent = new SvelteMap<string, string>()
    const children = new SvelteMap<string, string[]>()

    function traverse(nodes: any[], parentId: string | null = null) {
      for (const node of nodes) {
        if (parentId) parent.set(node.id, parentId)
        children.set(node.id, node.children.map((c: any) => c.id))
        if (node.children.length > 0) traverse(node.children, node.id)
      }
    }

    traverse(roleTree)
    return { parent, children }
  })

  function handleToggle(toggledId: string, isChecked: boolean) {
    if (isChecked) {
      // Add self
      roles.add(toggledId)

      // Cascade UP: Add all ancestors
      let currentId = toggledId
      while (maps.parent.has(currentId)) {
        const parentId = maps.parent.get(currentId)!
        roles.add(parentId)
        currentId = parentId
      }

    } else {
      // Remove self
      roles.delete(toggledId)

      // Cascade DOWN: Remove all descendants
      let queue = [toggledId]
      while (queue.length > 0) {
        const currentId = queue.pop()!
        const kids = maps.children.get(currentId) || []

        for (const childId of kids) {
          if (roles.has(childId)) {
            roles.delete(childId)
            queue.push(childId)
          }
        }
      }
    }
  }
</script>

<h1 class="">{m.create_posting()}</h1>
<form
  class=""
  method="post"
  action={formAction}
>
  {#if posting.id}
    <input type="hidden" name="id" value={posting.id} />
  {/if}

  <label class="" for="title">{m.create_posting_title()}</label>
  <input
    class=""
    type="text"
    name="title"
    bind:value={titleValue}
  />

  <label class="" for="description">{m.create_posting_description()}</label>
  <textarea
    name="description"
    bind:value={descriptionValue}
    rows={3}
  ></textarea>

  <label
    class="uploader-label"
  >
    <span>{m.create_posting_upload()}</span>
    <input type="file" multiple accept="image/*" onchange={handleUpload} class="uploader-input" />
  </label>

  <div>
    {#if uploading}
      <div>{m.create_posting_upload_in_progress()}</div>
    {/if}
    {#if uploadError}
      <div>{uploadError}</div>
    {/if}

    {#if filenames.length > 0}
      {m.create_posting_upload_list()}
      <div class="">
        {#each filenames as filename (filename)}
          <button
            type="button"
            class=""
            onclick={() => addToContent(filename)}
          >
            {filename}
          </button>
        {/each}
      </div>
    {/if}
  </div>

  <div class="">{m.create_posting_content()}</div>

  <div class="classless-isolation">
    <MarkdownEditor bind:value={contentValue} {carta} />
  </div>

  <input type="hidden" name="content" value={contentValue} />

  <div class="">{m.create_posting_visibility()}</div>
  <div class="">
    <label
      class="">
      <input
        type="radio"
        name="visibility"
        value="public"
        bind:group={visibilityValue}
        class=""
      />
      <span class="">{m.visibility_public()}</span>
    </label>
    <label
      class="">
      <input
        type="radio"
        name="visibility"
        value="subscribers"
        bind:group={visibilityValue}
        class=""
      />
      <span class="">{m.visibility_subscribers()}</span>
    </label>
    <label
      class="">
      <input
        type="radio"
        name="visibility"
        value="roles"
        bind:group={visibilityValue}
        class=""
      />
      <span class="">{m.visibility_roles()}</span>
    </label>
  </div>

  {#if visibilityValue === 'roles'}
    <div class="classless-isolation">
      <div class="">{m.roles()}</div>
      {#each roleTree as roleNode (roleNode.id)}
        <RoleTreeMultiSelect
          role={roleNode}
          selectedValues={roles}
          onToggle={handleToggle}
        />
      {/each}
    </div>
  {/if}

  <div class="">
    <button
      class=""
      type="submit"
    >
      {m.create_posting_save()}
    </button>

    {#if isEditMode}
      <button
        class=""
        type="submit"
        formaction="?/delete"
      >
        {m.posting_delete()}
      </button>
    {/if}
  </div>
</form>

<style>
  @reference "../../../app.css";

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

  /* Make the uploader label look like a button */
  .uploader-label {
    font: var(--font-h);
    font-weight: bold;
    display: inline-block;
    cursor: pointer;

    margin: .5em;
    padding: .4em 1em;
    border: 1.5px solid var(--clink);
    color: var(--clink);
    background-color: var(--clight);
    border-radius: 4px;

    font-size: 85%;
    letter-spacing: .1em;
    text-align: center;
  }

  .uploader-label:hover {
    filter: brightness(92%);
    color: var(--cemph);
    border-color: var(--cemph);
  }

  /* Display only for screen readers, replaces Tailwind's sr-only */
  .uploader-input {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }
</style>