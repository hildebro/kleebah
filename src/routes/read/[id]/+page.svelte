<script lang="ts">
  import { Carta, Markdown } from 'carta-md'
  import DOMPurify from 'isomorphic-dompurify'

  const carta = new Carta({
    sanitizer: DOMPurify.sanitize
  })

  let { data } = $props()
</script>

<div class="classless-isolation prose lg:prose-xl carta">
  <h1>{data.blog.title}</h1>
  <p>{data.blog.description}</p>
  <br />
  <Markdown {carta} value={data.blog.content} />
</div>
