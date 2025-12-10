<script lang="ts">
  import type { RoleWithChildren } from '$lib/roles.ts'
  import { SvelteSet } from 'svelte/reactivity'
  import SubscriberRoleOption from './SubscriberRoleOption.svelte'

  let {
    role,
    selectedValues, // Now expects a SvelteSet<string>
    depth = 0,
    onToggle
  }: {
    role: RoleWithChildren;
    selectedValues: SvelteSet<string>;
    depth?: number;
    onToggle: (id: string, checked: boolean) => void
  } = $props()
</script>

<div style="padding-left: {depth * 1.5}rem;">
  <label
    class="flex h-12 cursor-pointer items-center gap-3 rounded px-4 ring-1 ring-gray-200 transition hover:bg-gray-50 has-[:checked]:ring-2 has-[:checked]:ring-blue-500"
  >
    <input
      type="checkbox"
      name="roles"
      value={role.id}
      class="h-4 w-4 border-gray-300 text-blue-600 focus:ring-offset-0 focus:outline-none"

      checked={selectedValues.has(role.id)}
      onchange={(e) => onToggle(role.id, e.currentTarget.checked)}
    />
    <span class="text-sm">
      {#if depth > 0}
        <span class="mr-1 text-gray-400">└</span>
      {/if}
      {role.name}
    </span>
  </label>
</div>

{#if role.children.length > 0}
  <div class="mt-2 flex flex-col gap-2">
    {#each role.children as child (child.id)}
      <SubscriberRoleOption role={child} depth={depth + 1} {selectedValues} {onToggle} />
    {/each}
  </div>
{/if}
