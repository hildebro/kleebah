import type { Role } from '$lib/server/db/schema.ts'

export type RoleWithChildren = Role & {
  children: RoleWithChildren[];
};

export function buildRoleTree(flatRoles: Role[]): RoleWithChildren[] {
  const root: RoleWithChildren[] = [];
  const map: Record<string, RoleWithChildren> = {};

  // 1. Initialize map
  flatRoles.forEach((role) => {
    map[role.id] = { ...role, children: [] };
  });

  // 2. Connect children to parents
  flatRoles.forEach((role) => {
    if (role.parentId && map[role.parentId]) {
      map[role.parentId].children.push(map[role.id]);
    } else {
      // If no parent (or parent not found), it's a root item
      root.push(map[role.id]);
    }
  });

  return root;
}