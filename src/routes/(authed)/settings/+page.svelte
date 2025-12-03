<script lang="ts">
  import * as m from '$lib/paraglide/messages.js'

  let { data } = $props()
</script>

<h1>{m.settings()}</h1>
<br />
<div>
  <h2>{m.settings_2fa()}</h2>
  <img src={data.qrImage} alt="My QR Code" />
  <form method="post">
    <input type="hidden" name="hexSecret" value={data.hexSecret} />
    <label class="text-xs font-semibold" for="username">{m.settings_2fa_code()}</label>
    <input class="flex h-12 rounded px-4 focus:ring-2 focus:outline-none" type="text" name="totp" />
    <button
      class="h-12 w-64 rounded bg-blue-600 text-sm font-semibold text-blue-100 hover:bg-blue-700"
      type="submit"
    >
      {m.settings_2fa_commit()}
    </button>
  </form>
</div>
