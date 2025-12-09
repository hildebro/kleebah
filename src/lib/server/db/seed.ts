import { db, generateUUID } from '$lib/server/db'
import { role, systemState } from '$lib/server/db/schema'
import { eq } from 'drizzle-orm'

export async function seed() {
  const alreadySeeded = await db
    .select()
    .from(systemState)
    .where(eq(systemState.key, 'database_seeded'))
    .get()

  if (alreadySeeded) {
    console.log('App already seeded. Skipping initial inserts.')
    return
  }

  console.log('Performing initial database seed...')

  await db.transaction(async (tx) => {
    // Seeding inserts.
    await tx.insert(role).values({
      id: generateUUID(),
      name: 'family',
      parentId: null
    })
    const friendId = generateUUID()
    await tx.insert(role).values({
      id: friendId,
      name: 'friends',
      parentId: null
    })
    await tx.insert(role).values({
      id: generateUUID(),
      name: 'closefriends',
      parentId: friendId
    })

    // Track the fact that seeding is complete.
    await tx.insert(systemState).values({
      key: 'database_seeded',
      value: 'true',
      updatedAt: new Date()
    })
  })

  console.log('Initial seed finished and flagged as complete.')
}
