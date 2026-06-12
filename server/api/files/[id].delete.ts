import { del } from '@vercel/blob'
import { query } from '~/server/db'
import { ensureTable } from '~/server/db/schema'
import { validateId } from '~/server/utils/validation'
import type { ApiResponse } from '~/types'

export default defineEventHandler(async (event) => {
  await ensureTable()

  const config = useRuntimeConfig()
  const token = config.blobReadWriteToken

  if (!token) {
    throw createError({
      statusCode: 500,
      statusMessage: 'BLOB_READ_WRITE_TOKEN is not configured'
    })
  }

  const id = validateId(getRouterParam(event, 'id')!)

  const existing = await query('SELECT * FROM files WHERE id = $1', [id])
  if (existing.rows.length === 0) {
    throw createError({
      statusCode: 404,
      statusMessage: 'File not found'
    })
  }

  const file = existing.rows[0]

  try {
    await del(file.url, { token })
  } catch (blobError) {
    console.error('[files] Blob deletion failed:', blobError instanceof Error ? blobError.message : String(blobError))
  }

  await query('DELETE FROM files WHERE id = $1', [id])

  const response: ApiResponse<null> = {
    success: true,
    data: null
  }

  return response
})