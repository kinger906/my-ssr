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