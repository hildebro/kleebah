<script lang="ts">
  import RoleForm from '../RoleForm.svelte'

  let { data } = $props()
</script>

<RoleForm roleTree={data.roleTree} formAction="?/create" />