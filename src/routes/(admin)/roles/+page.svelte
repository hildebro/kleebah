<script lang="ts">
  import * as m from '$lib/paraglide/messages.js'
  import { resolve } from '$app/paths'
  import RoleListItem from './RoleListItem.svelte'

  let { data } = $props()
</script>

<h1 class="text-2xl font-bold">{m.roles()}</h1>
<div class="mt-4 mb-8">
  <a href={resolve('/roles/create')}>{m.roles_create()}</a>
</div>
{#if data.roleTree.length === 0}
  <div class="text-gray-500 italic">-</div>
{/if}
<ul class="space-y-2">
  {#each data.roleTree as role (role.id)}
    <RoleListItem {role} />
  {/each}
</ul>
