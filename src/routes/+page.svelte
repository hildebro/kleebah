<script lang="ts">
	import { resolve } from '$app/paths';
</script>

<h1>Welcome to Kleebah</h1>
<a href={resolve('/write')}>Write a blog</a>
<a href={resolve('/read')}>Read blogs</a>
<br/>
<a href={resolve('/feed.xml')}>RSS Feed</a>
