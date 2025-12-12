<script lang="ts">
  import * as m from '$lib/paraglide/messages.js'
  import { resolve } from '$app/paths'

  let { data } = $props()
</script>

<h1>{m.subscribers()}</h1>
<br />
<a href={resolve('/subscriber/invite-link')}>{m.subscribers_invite_link_generate()}</a>
<br />
{#if data.inviteLinks.length > 0}
  <br />
  <table class="w-full table-auto">
    <thead>
    <tr>
      <th scope="col">{m.subscribers_invite_link_generate_expiry()}</th>
      <th scope="col">{m.roles()}</th>
      <th scope="col"></th>
    </tr>
    </thead>
    <tbody>
    {#each data.inviteLinks as inviteLink (inviteLink.id)}
      <tr>
        <td>{inviteLink.expiresAt?.toDateString() ?? '-'}</td>
        <td>{inviteLink.roles.map(role => role.name).join(', ')}</td>
        <td>
          <form method="POST" action="?/deleteInviteLink">
            <input type="hidden" value={inviteLink.id} name="id" />
            <button
              class="h-12 w-64 rounded bg-red-600 text-sm font-semibold text-red-100 hover:bg-red-700"
              type="submit"
            >
              {m.subscribers_invite_link_delete()}
            </button>
          </form>
        </td>
      </tr>
    {/each}
    </tbody>
  </table>
{/if}
<br />
<a href={resolve('/subscriber/create')}>{m.subscribers_create()}</a>
<br />
<br />
{#if data.subscribers.length === 0}-{/if}
<ul>
  {#each data.subscribers as subscriber (subscriber.id)}
    <li>
      {subscriber.user.username}
      <a href={resolve('/(admin)/subscriber/[id]', { id: subscriber.id })}>{m.generic_edit()}</a>
    </li>
  {/each}
</ul>
