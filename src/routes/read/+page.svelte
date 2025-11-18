<script lang="ts">
	import { resolve } from '$app/paths';

	let { data } = $props();
</script>

<h1>Read blogs</h1>
<br />
{#await data.blogs then blogs}
	{#each blogs as blog (blog.id)}
		<div>
			<a href={resolve('/read/[slug]', {slug: blog.id})}>{blog.title}</a>
		</div>
	{/each}
{/await}