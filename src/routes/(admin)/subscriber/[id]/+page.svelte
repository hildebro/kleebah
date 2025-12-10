<script lang="ts">
  import SubscriberForm from '../SubscriberForm.svelte'

  let { data } = $props()

  let subscriber = $state({
    id: data.subscriber.id,
    username: data.subscriber.user.username,
    roles: data.subscriber.subscribersToRoles.map(v => v.roleId)
  })
</script>

<SubscriberForm {subscriber} roleTree={data.roleTree} formAction="?/update" />