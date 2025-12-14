<script lang="ts">
  import * as m from '$lib/paraglide/messages.js'
  import RoleTreeMultiSelect from '$lib/components/RoleTreeMultiSelect.svelte'

  let { data } = $props()
</script>

<h1 class="mt-12 text-center text-2xl font-bold">{m.subscribers_invite_link_generate()}</h1>
<form
  class="flex flex-col items-stretch gap-3 rounded p-12 shadow-lg"
  method="post"
>
  <RoleTreeMultiSelect roleTree={data.roleTree}/>
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