<script lang="ts">
  import { resolve } from '$app/paths'
  import * as m from '$lib/paraglide/messages'

  let { data } = $props()
</script>

<h1>{m.posting_edit()}</h1>
<br />
{#await data.blogs then blogs}
  {#each blogs as blog (blog.id)}
    <div>
      <a href={resolve('/posting/[id]', { id: blog.id })}>{blog.title}</a>
    </div>
  {/each}
{/await}
