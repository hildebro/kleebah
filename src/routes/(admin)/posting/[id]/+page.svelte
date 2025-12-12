<script lang="ts">
  import PostingForm from '../PostingForm.svelte';

  let { data } = $props();
  let posting = $state({
    ...data.posting,
    roles: data.posting.postingToRole.map(v => v.roleId)
  })
</script>

<PostingForm
  posting={posting}
  filenames={data.filenames}
  formAction="?/update"
  roleTree={data.roleTree}
/>