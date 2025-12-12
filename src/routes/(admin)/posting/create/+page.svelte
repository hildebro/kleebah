<script lang="ts">
  import PostingForm from '../PostingForm.svelte';

  let { data } = $props();
</script>

<PostingForm
  filenames={data.filenames}
  formAction="?/create"
  roleTree={data.roleTree}
/>