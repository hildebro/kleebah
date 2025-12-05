<script lang="ts">
  import * as m from '$lib/paraglide/messages.js'
  import { enhance } from '$app/forms'

  let { data } = $props()
</script>

<h1>{m.settings()}</h1>
<div class="mt-4 flex flex-col gap-5">
  <div>
    <h2>{m.settings_rss_token()}</h2>
    <p>{m.settings_rss_token_description()}</p>
    <p>{m.settings_rss_token_label({ token: data.rssToken ?? '-' })}</p>
    <form method="POST" action="?/generate_rss_token" use:enhance>
      <button
        class="h-12 w-96 rounded bg-blue-600 text-sm font-semibold text-blue-100 hover:bg-blue-700"
        type="submit"
      >
        {m.settings_rss_token_generate()}
      </button>
    </form>
  </div>
  <div>
    <h2>{m.settings_2fa()}</h2>
    {#if data.qrImage && data.hexSecret}
      <p>{m.settings_2fa_description()}</p>
      <img src={data.qrImage} alt="My QR Code" />
      <form method="post" action="?/enable_2fa" use:enhance>
        <input type="hidden" name="hexSecret" value={data.hexSecret} />
        <label class="text-xs font-semibold" for="username">{m.settings_2fa_code()}</label>
        <input
          class="flex h-12 rounded px-4 focus:ring-2 focus:outline-none"
          type="text"
          name="totp"
        />
        <button
          class="h-12 w-64 rounded bg-blue-600 text-sm font-semibold text-blue-100 hover:bg-blue-700"
          type="submit"
        >
          {m.settings_2fa_commit()}
        </button>
      </form>
    {:else}
      {m.settings_2fa_enabled()}
      <form method="post" action="?/disable_2fa" use:enhance>
        <button
          class="h-12 w-96 rounded bg-blue-600 text-sm font-semibold text-blue-100 hover:bg-blue-700"
          type="submit"
        >
          {m.settings_2fa_disable()}
        </button>
      </form>
    {/if}
  </div>
</div>
