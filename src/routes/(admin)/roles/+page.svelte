<script lang="ts">
  import * as m from '$lib/paraglide/messages.js'
  import { resolve } from '$app/paths'

  let { data } = $props()
</script>

<h1>{m.roles()}</h1>
<br />
<a href={resolve('/roles/create')}>{m.roles_create()}</a>
<br />
<br />
{#if data.roles.length === 0}-{/if}
<ul>
  {#each data.roles as role (role.id)}
    <li>
      {role.name}
      <a href={resolve('/(admin)/roles/[id]', { id: role.id })}>{m.generic_edit()}</a>
    </li>
  {/each}
</ul>
