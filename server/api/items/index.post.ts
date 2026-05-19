import { query } from '~/server/db'
import { ensureTable } from '~/server/db/schema'
import { validateCreateItem } from '~/server/utils/validation'
import type { ApiResponse, Item } from '~/types'

export default defineEventHandler(async (event) => {
  await ensureTable()

  const body = await readBody(event)
  const input = validateCreateItem(body)

  const result = await query(
    `INSERT INTO items (name, description, status) VALUES ($1, $2, $3) RETURNING *`,
    [input.name, input.description, input.status]
  )

  const response: ApiResponse<Item> = {
    success: true,
    data: result.rows[0] as Item
  }

  setResponseStatus(event, 201)
  return response
})