<script lang="ts">
  import * as m from '$lib/paraglide/messages'
  import type { RoleWithChildren } from '$lib/roles.ts'
  import { SvelteMap, SvelteSet } from 'svelte/reactivity'
  import RoleTreeCheckbox from '$lib/components/RoleTreeCheckbox.svelte'

  interface Props {
    value?: string[],
    roleTree: RoleWithChildren[];
  }

  let {
    value = [],
    roleTree
  }: Props = $props()

  // Source of truth for roles. Callbacks in the RoleTreeCheckboxes will update this.
  let roles = new SvelteSet(value)

  let maps = $derived.by(() => {
    const parent = new SvelteMap<string, string>()
    const children = new SvelteMap<string, string[]>()

    function traverse(nodes: RoleWithChildren[], parentId: string | null = null) {
      for (const node of nodes) {
        if (parentId) parent.set(node.id, parentId)
        children.set(node.id, node.children.map((c) => c.id))
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

<div class="text-xs font-semibold">{m.roles()}</div>
{#each roleTree as roleNode (roleNode.id)}
  <RoleTreeCheckbox
    role={roleNode}
    selectedValues={roles}
    onToggle={handleToggle}
  />
{/each}