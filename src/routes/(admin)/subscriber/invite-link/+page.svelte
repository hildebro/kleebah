<script lang="ts">
  import * as m from '$lib/paraglide/messages.js'
  import RoleTreeMultiSelect from '$lib/components/RoleTreeMultiSelect.svelte'
  import { SvelteMap, SvelteSet } from 'svelte/reactivity'

  let { data } = $props()

  // Source of truth for roles. Callbacks in the SubscriberRoleOption will update this.
  let roles = new SvelteSet([])

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

<h1 class="mt-12 text-center text-2xl font-bold">{m.subscribers_invite_link_generate()}</h1>
<form
  class="flex flex-col items-stretch gap-3 rounded p-12 shadow-lg"
  method="post"
>
  <div class="text-xs font-semibold">{m.roles()}</div>
  {#each data.roleTree as roleNode (roleNode.id)}
    <RoleTreeMultiSelect
      role={roleNode}
      selectedValues={roles}
      onToggle={handleToggle}
    />
  {/each}
  <label class="text-xs font-semibold" for="password">{m.subscribers_invite_link_generate_expiry()}</label>
  <select name="expiry">
    <option value="short">{m.subscribers_invite_link_generate_expiry_short()}</option>
    <option value="medium">{m.subscribers_invite_link_generate_expiry_medium()}</option>
    <option value="long">{m.subscribers_invite_link_generate_expiry_long()}</option>
    <option value="none">{m.subscribers_invite_link_generate_expiry_none()}</option>
  </select>
  <button
    class="h-12 w-64 rounded bg-blue-600 text-sm font-semibold text-blue-100 hover:bg-blue-700"
    type="submit"
  >
    {m.subscribers_invite_link_generate()}
  </button>
</form>