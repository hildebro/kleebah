<script lang="ts">
  import * as m from '$lib/paraglide/messages.js'
  import RoleOption from '../RoleOption.svelte'

  let { data } = $props()

  let nameValue = $state(data.role.name)
  let parentIdValue = $state(data.role.parentId)
</script>

<h1 class="mt-12 text-center text-2xl font-bold">{m.roles_create()}</h1>
<form class="flex flex-col items-stretch gap-3 rounded p-12 shadow-lg" method="post" action="?/update">
  <input type="hidden" name="id" value={data.role.id} />
  <label class="text-xs font-semibold" for="name">{m.roles_name()}</label>
  <input
    class="flex h-12 rounded px-4 focus:ring-2 focus:outline-none"
    type="text"
    name="name"
    value={nameValue}
  />
  <div class="text-xs font-semibold">{m.roles_parent()}</div>
  <div class="flex flex-col gap-2">
    <label
      class="flex h-12 cursor-pointer items-center gap-3 rounded px-4 ring-1 ring-gray-200 transition hover:bg-gray-50 has-[:checked]:ring-2 has-[:checked]:ring-blue-500"
    >
      <input
        type="radio"
        name="parentId"
        value="none"
        class="h-4 w-4 border-gray-300 text-blue-600 focus:ring-offset-0 focus:outline-none"
        checked={parentIdValue === null}
      />
      <span class="text-sm">{m.roles_none()}</span>
    </label>
    {#each data.roleTree as roleNode (roleNode.id)}
      <RoleOption role={roleNode} editingRole={data.role.id} selectedValue={parentIdValue ?? undefined} />
    {/each}
  </div>
  <div class="flex justify-between">
    <button
      class="h-12 w-64 rounded bg-blue-600 text-sm font-semibold text-blue-100 hover:bg-blue-700"
      type="submit"
    >
      {m.roles_commit()}
    </button>
    <button
      class="h-12 w-64 rounded bg-red-600 text-sm font-semibold text-red-100 hover:bg-red-700"
      type="submit"
      formaction="?/delete"
    >
      {m.roles_delete()}
    </button>
  </div>
</form>
