import type { ApiResponse, FileUploadResult, UploadedFile } from '~/types'

export function useFileUpload() {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const uploadProgress = ref(0)

  async function uploadFile(file: File, itemId?: number): Promise<FileUploadResult> {
    loading.value = true
    error.value = null
    uploadProgress.value = 0

    try {
      const formData = new FormData()
      formData.append('file', file)
      if (itemId) {
        formData.append('item_id', String(itemId))
      }

      const response = await $fetch<ApiResponse<FileUploadResult>>('/api/files/upload', {
        method: 'POST',
        body: formData
      })

      if (!response.success || !response.data) {
        throw new Error('File upload failed')
      }

      uploadProgress.value = 100
      return response.data
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'An error occurred while uploading the file'
      error.value = message
      throw e
    } finally {
      loading.value = false
    }
  }

  async function fetchFiles(itemId?: number): Promise<UploadedFile[]> {
    loading.value = true
    error.value = null
    try {
      const queryStr = itemId ? `?item_id=${itemId}` : ''
      const response = await $fetch<ApiResponse<UploadedFile[]>>(`/api/files${queryStr}`)
      if (!response.success || !response.data) {
        throw new Error('Failed to fetch files')
      }
      return response.data
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'An error occurred while fetching files'
      error.value = message
      throw e
    } finally {
      loading.value = false
    }
  }

  async function deleteFile(id: number): Promise<void> {
    loading.value = true
    error.value = null
    try {
      const response = await $fetch<ApiResponse<null>>(`/api/files/${id}`, {
        method: 'DELETE'
      })
      if (!response.success) {
        throw new Error('Failed to delete file')
      }
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'An error occurred while deleting the file'
      error.value = message
      throw e
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    uploadProgress,
    uploadFile,
    fetchFiles,
    deleteFile
  }
}