import { query } from '~/server/db'
import { ensureTable } from '~/server/db/schema'
import { validateId } from '~/server/utils/validation'
import type { ApiResponse, UploadedFile } from '~/types'

export default defineEventHandler(async (event) => {
  await ensureTable()

  const queryParams = getQuery(event)
  const itemIdStr = queryParams.item_id as string | undefined

  if (itemIdStr) {
    const itemId = validateId(itemIdStr)
    const result = await query(
      'SELECT * FROM files WHERE item_id = $1 ORDER BY created_at DESC',
      [itemId]
    )
    const response: ApiResponse<UploadedFile[]> = {
      success: true,
      data: result.rows as UploadedFile[]
    }
    return response
  }

  const result = await query('SELECT * FROM files ORDER BY created_at DESC')
  const response: ApiResponse<UploadedFile[]> = {
    success: true,
    data: result.rows as UploadedFile[]
  }
  return response
})