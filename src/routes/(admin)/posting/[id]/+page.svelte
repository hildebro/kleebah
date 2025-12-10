<script lang="ts">
  import PostingForm from '../PostingForm.svelte';

  let { data } = $props();
</script>

<PostingForm
  posting={data.posting}
  filenames={data.filenames}
  formAction="?/update"
/>