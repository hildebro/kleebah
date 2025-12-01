<script lang="ts">
  import { resolve } from '$app/paths'
  import * as m from '$lib/paraglide/messages'
</script>

<h1>{m.headline()}</h1>
<a href={resolve('/posting/create')}>{m.create_posting()}</a>
<br />
<a href={resolve('/read')}>{m.read_postings()}</a>
<br />
<br />
<a href={resolve('/subscriber')}>{m.subscribers()}</a>
<br />
<br />
<a href={resolve('/feed.xml')}>{m.rss_feed()}</a>
<br />
<br />
<a href={resolve('/settings')}>{m.settings()}</a>
