<script lang="ts">
  import * as m from '$lib/paraglide/messages.js'

  let { data } = $props()

  let username = $state(data.subscriber.user.username)
</script>

<h1 class="mt-12 text-center text-2xl font-bold">{m.subscribers_create()}</h1>
<form class="flex flex-col items-stretch gap-3 rounded p-12 shadow-lg" method="post">
  <input type="hidden" value={data.subscriber.id} name="id" />
  <label class="text-xs font-semibold" for="username">{m.welcome_username()}</label>
  <input
    class="flex h-12 rounded px-4 focus:ring-2 focus:outline-none"
    type="text"
    name="username"
    value={username}
  />
  <label class="text-xs font-semibold" for="password">{m.subscribers_edit_password()}</label>
  <input type="password" name="password" />
  <button
    class="h-12 w-64 rounded bg-blue-600 text-sm font-semibold text-blue-100 hover:bg-blue-700"
    type="submit"
  >
    {m.subscribers_commit()}
  </button>
</form>
