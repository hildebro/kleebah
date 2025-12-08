<script lang="ts">
  import type { RoleWithChildren } from '$lib/roles.ts'
  import RoleOption from './RoleOption.svelte'

  let {
    role,
    editingRole = undefined,
    selectedValue = undefined,
    depth = 0
  }: { role: RoleWithChildren; editingRole?: string; selectedValue?: string; depth?: number } = $props()
</script>

{#if role.id !== editingRole}
  <div style="padding-left: {depth * 1.5}rem;">
    <label
      class="flex h-12 cursor-pointer items-center gap-3 rounded px-4 ring-1 ring-gray-200 transition hover:bg-gray-50 has-[:checked]:ring-2 has-[:checked]:ring-blue-500"
    >
      <input
        type="radio"
        name="parentId"
        value={role.id}
        class="h-4 w-4 border-gray-300 text-blue-600 focus:ring-offset-0 focus:outline-none"
        checked={role.id === selectedValue}
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
        <RoleOption role={child} depth={depth + 1} {editingRole} {selectedValue} />
      {/each}
    </div>
  {/if}
{/if}
