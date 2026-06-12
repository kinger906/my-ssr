export interface Item {
  id: number
  name: string
  description: string
  status: string
  created_at: string
  updated_at: string
}

export interface CreateItemInput {
  name: string
  description?: string
  status?: string
}

export interface UpdateItemInput {
  name?: string
  description?: string
  status?: string
}

export interface UploadedFile {
  id: number
  file_id: string
  original_name: string
  url: string
  size: number
  mime_type: string
  item_id: number | null
  created_at: string
}

export interface FileUploadResult {
  id: number
  file_id: string
  original_name: string
  url: string
  size: number
  mime_type: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

export const VALID_STATUSES = ['active', 'inactive', 'draft', 'archived'] as const
export type ItemStatus = typeof VALID_STATUSES[number]

export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'] as const
export const ALLOWED_FILE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg'] as const
export const MAX_FILE_SIZE = 10 * 1024 * 1024