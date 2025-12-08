<script lang="ts">
  import * as m from '$lib/paraglide/messages.js'
  import { resolve } from '$app/paths'
  import RoleListItem from './RoleListItem.svelte'
  import type { RoleWithChildren } from '$lib/roles.ts'

  let { role }: { role: RoleWithChildren } = $props()
</script>

<li class="my-1">
  <div class="flex items-center gap-3">
    <span class="font-medium">{role.name}</span>

    <a
      href={resolve('/(admin)/roles/[id]', { id: role.id })}
      class="text-sm text-blue-600 hover:underline"
    >
      {m.generic_edit()}
    </a>
  </div>

  {#if role.children.length > 0}
    <ul class="mt-1 ml-4 border-l-2 border-gray-200 pl-4">
      {#each role.children as child (child.id)}
        <RoleListItem role={child} />
      {/each}
    </ul>
  {/if}
</li>
