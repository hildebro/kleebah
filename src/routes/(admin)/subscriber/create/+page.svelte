<script lang="ts">
  import * as m from '$lib/paraglide/messages.js'
  import SubscriberRoleOption from '../SubscriberRoleOption.svelte'
  import { SvelteMap, SvelteSet } from 'svelte/reactivity'

  let { data } = $props()
  // Source of truth for roles. Callbacks in the SubscriberRoleOption will update this.
  let roles = new SvelteSet<string>()
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

    traverse(data.roleTree)
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

<h1 class="mt-12 text-center text-2xl font-bold">{m.subscribers_create()}</h1>
<form class="flex flex-col items-stretch gap-3 rounded p-12 shadow-lg" method="post">
  <label class="text-xs font-semibold" for="username">{m.welcome_username()}</label>
  <input class="flex h-12 rounded px-4 focus:ring-2 focus:outline-none" type="text" name="username" />
  <label class="text-xs font-semibold" for="password">{m.welcome_password()}</label>
  <input type="password" name="password" />
  <div class="text-xs font-semibold">{m.subscribers_roles()}</div>
  {#each data.roleTree as roleNode (roleNode.id)}
    <SubscriberRoleOption
      role={roleNode}
      selectedValues={roles}
      onToggle={handleToggle}
    />

  {/each}
  <button
    class="h-12 w-64 rounded bg-blue-600 text-sm font-semibold text-blue-100 hover:bg-blue-700"
    type="submit"
  >
    {m.subscribers_commit()}
  </button>
</form>