import type { PaginatedResponse, Item, CreateItemInput, UpdateItemInput, ApiResponse } from '~/types'

export function useItems() {
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchItems(params: {
    page?: number
    pageSize?: number
    search?: string
    sortBy?: string
    sortOrder?: string
  } = {}): Promise<PaginatedResponse<Item>> {
    loading.value = true
    error.value = null
    try {
      const query = new URLSearchParams()
      if (params.page) query.set('page', String(params.page))
      if (params.pageSize) query.set('pageSize', String(params.pageSize))
      if (params.search) query.set('search', params.search)
      if (params.sortBy) query.set('sortBy', params.sortBy)
      if (params.sortOrder) query.set('sortOrder', params.sortOrder)

      const response = await $fetch<ApiResponse<PaginatedResponse<Item>>>(
        `/api/items?${query.toString()}`
      )
      if (!response.success || !response.data) {
        throw new Error('Failed to fetch items')
      }
      return response.data
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'An error occurred while fetching items'
      error.value = message
      throw e
    } finally {
      loading.value = false
    }
  }

  async function fetchItem(id: number): Promise<Item> {
    loading.value = true
    error.value = null
    try {
      const response = await $fetch<ApiResponse<Item>>(`/api/items/${id}`)
      if (!response.success || !response.data) {
        throw new Error('Failed to fetch item')
      }
      return response.data
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'An error occurred while fetching the item'
      error.value = message
      throw e
    } finally {
      loading.value = false
    }
  }

  async function createItem(input: CreateItemInput): Promise<Item> {
    loading.value = true
    error.value = null
    try {
      const response = await $fetch<ApiResponse<Item>>('/api/items', {
        method: 'POST',
        body: input
      })
      if (!response.success || !response.data) {
        throw new Error('Failed to create item')
      }
      return response.data
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'An error occurred while creating the item'
      error.value = message
      throw e
    } finally {
      loading.value = false
    }
  }

  async function updateItem(id: number, input: UpdateItemInput): Promise<Item> {
    loading.value = true
    error.value = null
    try {
      const response = await $fetch<ApiResponse<Item>>(`/api/items/${id}`, {
        method: 'PUT',
        body: input
      })
      if (!response.success || !response.data) {
        throw new Error('Failed to update item')
      }
      return response.data
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'An error occurred while updating the item'
      error.value = message
      throw e
    } finally {
      loading.value = false
    }
  }

  async function deleteItem(id: number): Promise<void> {
    loading.value = true
    error.value = null
    try {
      const response = await $fetch<ApiResponse<null>>(`/api/items/${id}`, {
        method: 'DELETE'
      })
      if (!response.success) {
        throw new Error('Failed to delete item')
      }
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'An error occurred while deleting the item'
      error.value = message
      throw e
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    fetchItems,
    fetchItem,
    createItem,
    updateItem,
    deleteItem
  }
}