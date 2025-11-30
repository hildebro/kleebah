<script lang="ts">
  import * as m from '$lib/paraglide/messages.js'
  import { resolve } from '$app/paths'

  let { data } = $props()
</script>

<h1>{m.subscribers()}</h1>
<br />
<a href={resolve('/subscriber/create')}>{m.subscribers_create()}</a>
<br />
<br />
<h2>{m.subscribers_list()}</h2>
<ul>
  {#each data.subscribers as subscriber (subscriber.id)}
    <li>
      {subscriber.user.username}
      <a href={resolve('/subscriber/[id]', { id: subscriber.id })}>{m.generic_edit()}</a>
    </li>
  {/each}
</ul>
