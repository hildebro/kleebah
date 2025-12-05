<script lang="ts">
  import { resolve } from '$app/paths'
  import * as m from '$lib/paraglide/messages'

  let { data } = $props()
</script>

<h1>{m.postings()}</h1>
<br />
<a href={resolve('/posting/create')}>{m.create_posting()}</a>
<br />
<br />
{#each data.blogs as blog (blog.id)}
  <div>
    {blog.title}
    <a href={resolve('/read/[id]', { id: blog.id })}>{m.read()}</a>
    <a href={resolve('/(admin)/posting/[id]', { id: blog.id })}>{m.generic_edit()}</a>
  </div>
{/each}
