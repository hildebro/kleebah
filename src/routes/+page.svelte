<script lang="ts">
  import { resolve } from '$app/paths'
  import * as m from '$lib/paraglide/messages'
</script>

<h1>{m.headline()}</h1>
<a href={resolve('/write')}>{m.create_posting()}</a>
<br />
<a href={resolve('/read')}>{m.read_postings()}</a>
<br />
<br />
<a href={resolve('/feed.xml')}>{m.rss_feed()}</a>
