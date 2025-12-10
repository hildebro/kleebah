<script lang="ts">
  import SubscriberForm from '../SubscriberForm.svelte'

  let { data } = $props()
</script>

<SubscriberForm roleTree={data.roleTree} formAction="?/create" />