<script lang="ts">
  import { resolve } from '$app/paths'
  import * as m from '$lib/paraglide/messages'

  let { data } = $props()
</script>

<h1>{m.read_postings()}</h1>
<br />
{#await data.blogs then blogs}
  {#each blogs as blog (blog.id)}
    <div>
      <a href={resolve('/read/[slug]', { slug: blog.id })}>{blog.title}</a>
    </div>
  {/each}
{/await}
