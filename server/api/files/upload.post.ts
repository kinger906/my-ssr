import { put } from '@vercel/blob'
import { query } from '~/server/db'
import { ensureTable } from '~/server/db/schema'
import { validateFile } from '~/server/utils/validation'
import type { ApiResponse, FileUploadResult } from '~/types'

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

  const formData = await readMultipartFormData(event)
  if (!formData || formData.length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'No file uploaded'
    })
  }

  const fileField = formData[0]
  const { filename, data, type } = fileField
  const originalName = filename || 'unknown'

  const fileObj = {
    originalname: filename,
    mimetype: type || 'application/octet-stream',
    size: data.length,
    buffer: data
  }

  validateFile(fileObj)

  let itemId: number | null = null
  const itemIdField = formData.find((f) => f.name === 'item_id')
  if (itemIdField) {
    const idStr = itemIdField.data.toString('utf-8')
    const parsed = parseInt(idStr, 10)
    if (!isNaN(parsed) && parsed > 0) {
      itemId = parsed
    }
  }

  try {
    const blob = await put(originalName, data, {
      access: 'public',
      token
    })

    const result = await query(
      `INSERT INTO files (file_id, original_name, url, size, mime_type, item_id)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, file_id, original_name, url, size, mime_type`,
      [blob.url, originalName, blob.url, data.length, fileObj.mimetype, itemId]
    )

    const uploadedFile = result.rows[0] as FileUploadResult
    const response: ApiResponse<FileUploadResult> = {
      success: true,
      data: uploadedFile
    }

    setResponseStatus(event, 201)
    return response
  } catch (error) {
    console.error('[files] Upload failed:', error instanceof Error ? error.message : String(error))
    throw createError({
      statusCode: 500,
      statusMessage: 'File upload failed. Please try again.'
    })
  }
})