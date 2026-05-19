import { query } from '~/server/db'
import { ensureTable } from '~/server/db/schema'
import { validateId } from '~/server/utils/validation'
import type { ApiResponse, Item } from '~/types'

export default defineEventHandler(async (event) => {
  await ensureTable()

  const id = validateId(getRouterParam(event, 'id')!)
  const result = await query('SELECT * FROM items WHERE id = $1', [id])

  if (result.rows.length === 0) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Item not found'
    })
  }

  const response: ApiResponse<Item> = {
    success: true,
    data: result.rows[0] as Item
  }

  return response
})