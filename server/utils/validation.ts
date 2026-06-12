import type { CreateItemInput, UpdateItemInput } from '../../types'
import { ALLOWED_IMAGE_TYPES, MAX_FILE_SIZE } from '../../types'

export function validateCreateItem(body: unknown): CreateItemInput {
  if (!body || typeof body !== 'object') {
    throw createError({
      statusCode: 400,
      statusMessage: 'Request body is required'
    })
  }

  const { name, description, status } = body as Record<string, unknown>

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Name is required and must be a non-empty string'
    })
  }

  if (name.trim().length > 255) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Name must not exceed 255 characters'
    })
  }

  return {
    name: name.trim(),
    description: typeof description === 'string' ? description.trim() : '',
    status: typeof status === 'string' && ['active', 'inactive', 'draft', 'archived'].includes(status)
      ? status
      : 'active'
  }
}

export function validateUpdateItem(body: unknown): UpdateItemInput {
  if (!body || typeof body !== 'object') {
    throw createError({
      statusCode: 400,
      statusMessage: 'Request body is required'
    })
  }

  const { name, description, status } = body as Record<string, unknown>
  const result: UpdateItemInput = {}

  if (name !== undefined) {
    if (typeof name !== 'string' || name.trim().length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Name must be a non-empty string'
      })
    }
    if (name.trim().length > 255) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Name must not exceed 255 characters'
      })
    }
    result.name = name.trim()
  }

  if (description !== undefined) {
    result.description = typeof description === 'string' ? description.trim() : ''
  }

  if (status !== undefined) {
    if (typeof status !== 'string' || !['active', 'inactive', 'draft', 'archived'].includes(status)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Status must be one of: active, inactive, draft, archived'
      })
    }
    result.status = status
  }

  if (Object.keys(result).length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'At least one field must be provided for update'
    })
  }

  return result
}

export function validateId(id: string): number {
  const numId = parseInt(id, 10)
  if (isNaN(numId) || numId < 1) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid ID'
    })
  }
  return numId
}

export function validateFile(file: { originalname?: string; mimetype?: string; size?: number; buffer?: Buffer } | null | undefined): asserts file is { originalname: string; mimetype: string; size: number; buffer: Buffer } {
  if (!file) {
    throw createError({
      statusCode: 400,
      statusMessage: 'No file provided'
    })
  }

  if (!file.originalname || !file.mimetype || !file.buffer || file.size === undefined) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid file data'
    })
  }

  if (file.size === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'File is empty'
    })
  }

  if (file.size > MAX_FILE_SIZE) {
    throw createError({
      statusCode: 400,
      statusMessage: `File size exceeds the maximum allowed size of ${MAX_FILE_SIZE / 1024 / 1024}MB`
    })
  }

  if (!ALLOWED_IMAGE_TYPES.includes(file.mimetype as typeof ALLOWED_IMAGE_TYPES[number])) {
    throw createError({
      statusCode: 400,
      statusMessage: `Unsupported file type: ${file.mimetype}. Allowed types: ${ALLOWED_IMAGE_TYPES.join(', ')}`
    })
  }
}