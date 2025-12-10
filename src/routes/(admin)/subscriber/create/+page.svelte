<script lang="ts">
  import * as m from '$lib/paraglide/messages.js'
  import SubscriberRoleOption from '../SubscriberRoleOption.svelte'

  let { data } = $props()
</script>

<h1 class="mt-12 text-center text-2xl font-bold">{m.subscribers_create()}</h1>
<form class="flex flex-col items-stretch gap-3 rounded p-12 shadow-lg" method="post">
  <label class="text-xs font-semibold" for="username">{m.welcome_username()}</label>
  <input class="flex h-12 rounded px-4 focus:ring-2 focus:outline-none" type="text" name="username" />
  <label class="text-xs font-semibold" for="password">{m.welcome_password()}</label>
  <input type="password" name="password" />
  <div class="text-xs font-semibold">{m.subscribers_roles()}</div>
  {#each data.roleTree as roleNode (roleNode.id)}
    <SubscriberRoleOption role={roleNode} />
  {/each}
  <button
    class="h-12 w-64 rounded bg-blue-600 text-sm font-semibold text-blue-100 hover:bg-blue-700"
    type="submit"
  >
    {m.subscribers_commit()}
  </button>
</form>