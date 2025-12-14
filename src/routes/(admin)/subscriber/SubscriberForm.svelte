<script lang="ts">
  import * as m from '$lib/paraglide/messages.js'
  import { SvelteMap, SvelteSet } from 'svelte/reactivity'
  import RoleTreeMultiSelect from '$lib/components/RoleTreeMultiSelect.svelte'
  import type { RoleWithChildren } from '$lib/roles.ts'

  interface SubscriberData {
    id?: string;
    username: string;
    password?: string | undefined;
    roles: string[];
  }

  interface Props {
    subscriber?: SubscriberData;
    formAction: string;
    roleTree: RoleWithChildren[]
  }

  let {
    subscriber = {
      username: '',
      password: undefined,
      roles: []
    },
    formAction,
    roleTree
  }: Props = $props()

  let username = $state(subscriber.username)
</script>

<h1 class="mt-12 text-center text-2xl font-bold">{m.subscribers_create()}</h1>
<form
  class="flex flex-col items-stretch gap-3 rounded p-12 shadow-lg"
  method="post"
  action={formAction}
>
  <input type="hidden" value={subscriber.id} name="id" />
  <label class="text-xs font-semibold" for="username">{m.welcome_username()}</label>
  <input
    class="flex h-12 rounded px-4 focus:ring-2 focus:outline-none"
    type="text"
    name="username"
    value={username}
  />
  <label class="text-xs font-semibold" for="password">{m.subscribers_edit_password()}</label>
  <input type="password" name="password" />
  <RoleTreeMultiSelect value={subscriber.roles} {roleTree} />
  <div class="flex justify-between">
    <button
      class="h-12 w-64 rounded bg-blue-600 text-sm font-semibold text-blue-100 hover:bg-blue-700"
      type="submit"
    >
      {m.subscribers_commit()}
    </button>
    <button
      class="h-12 w-64 rounded bg-red-600 text-sm font-semibold text-red-100 hover:bg-red-700"
      type="submit"
      formaction="?/delete"
    >
      {m.subscribers_delete()}
    </button>
  </div>
</form>
