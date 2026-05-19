import { query } from '~/server/db'
import { ensureTable } from '~/server/db/schema'
import type { PaginatedResponse, Item } from '~/types'

export default defineEventHandler(async (event) => {
  await ensureTable()

  const { page, pageSize, search, sortBy, sortOrder } = getQuery(event)

  const pageNum = Math.max(1, parseInt(page as string, 10) || 1)
  const pageSizeNum = Math.min(100, Math.max(1, parseInt(pageSize as string, 10) || 10))
  const offset = (pageNum - 1) * pageSizeNum

  const allowedSortColumns = ['id', 'name', 'status', 'created_at', 'updated_at']
  const sortCol = allowedSortColumns.includes(sortBy as string) ? sortBy as string : 'id'
  const sortDir = (sortOrder as string)?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC'

  let whereClause = ''
  const params: unknown[] = []

  if (search && String(search).trim()) {
    whereClause = 'WHERE name ILIKE $1 OR description ILIKE $1'
    params.push(`%${String(search).trim()}%`)
  }

  const countResult = await query(
    `SELECT COUNT(*) as total FROM items ${whereClause}`,
    params
  )
  const total = parseInt(countResult.rows[0].total, 10)

  const paramOffset = params.length
  const dataResult = await query(
    `SELECT * FROM items ${whereClause} ORDER BY ${sortCol} ${sortDir} LIMIT $${paramOffset + 1} OFFSET $${paramOffset + 2}`,
    [...params, pageSizeNum, offset]
  )

  const response: PaginatedResponse<Item> = {
    data: dataResult.rows as Item[],
    total,
    page: pageNum,
    pageSize: pageSizeNum,
    totalPages: Math.ceil(total / pageSizeNum)
  }

  return { success: true, data: response }
})