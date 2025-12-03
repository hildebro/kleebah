<script lang="ts">
  import '../app.css'
  import '$lib/styles/main.css'
  import favicon from '$lib/assets/favicon.svg'
  import { resolve } from '$app/paths'
  import * as m from '$lib/paraglide/messages'

  let { children } = $props()
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

<nav class="p-5 flex flex-col gap-3 sm:flex-row">
  <a href={resolve('/')}>{m.home()}</a>
  <a href={resolve('/posting/create')}>{m.create_posting()}</a>
  <a href={resolve('/posting')}>{m.posting_edit()}</a>
  <a href={resolve('/read')}>{m.read_postings()}</a>
  <a href={resolve('/subscriber')}>{m.subscribers()}</a>
  <a href={resolve('/feed.xml')}>{m.rss_feed()}</a>
  <a href={resolve('/settings')}>{m.settings()}</a>
</nav>

{@render children()}
