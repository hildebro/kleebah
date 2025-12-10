<script lang="ts">
  import RoleForm from '../RoleForm.svelte'

  let { data } = $props()
</script>

<RoleForm role={data.role} roleTree={data.roleTree} formAction="?/update" />