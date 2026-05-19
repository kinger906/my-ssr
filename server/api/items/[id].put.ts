import { query } from '~/server/db'
import { ensureTable } from '~/server/db/schema'
import { validateId, validateUpdateItem } from '~/server/utils/validation'
import type { ApiResponse, Item } from '~/types'

export default defineEventHandler(async (event) => {
  await ensureTable()

  const id = validateId(getRouterParam(event, 'id')!)
  const body = await readBody(event)
  const input = validateUpdateItem(body)

  const existing = await query('SELECT * FROM items WHERE id = $1', [id])
  if (existing.rows.length === 0) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Item not found'
    })
  }

  const setClauses: string[] = []
  const values: unknown[] = []
  let paramIndex = 1

  if (input.name !== undefined) {
    setClauses.push(`name = $${paramIndex++}`)
    values.push(input.name)
  }
  if (input.description !== undefined) {
    setClauses.push(`description = $${paramIndex++}`)
    values.push(input.description)
  }
  if (input.status !== undefined) {
    setClauses.push(`status = $${paramIndex++}`)
    values.push(input.status)
  }

  setClauses.push(`updated_at = NOW()`)
  values.push(id)

  const result = await query(
    `UPDATE items SET ${setClauses.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
    values
  )

  const response: ApiResponse<Item> = {
    success: true,
    data: result.rows[0] as Item
  }

  return response
})