<template>
  <div class="file-upload">
    <div class="upload-area" :class="{ 'upload-area--dragover': isDragover }" @dragover.prevent="isDragover = true" @dragleave.prevent="isDragover = false" @drop.prevent="onDrop">
      <input
        ref="fileInputRef"
        type="file"
        :accept="acceptTypes"
        class="upload-input"
        @change="onFileSelect"
      />
      <div class="upload-placeholder">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="32" height="32">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
        <span class="upload-text">点击选择文件或拖拽文件到此处</span>
        <span class="upload-hint">支持 JPG、PNG、WEBP、GIF、SVG 格式，最大 10MB</span>
      </div>
    </div>

    <div v-if="activePreview" class="preview-area">
      <div class="preview-header">
        <span class="preview-title">预览</span>
        <button class="preview-remove" @click="clearPreview" title="取消">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
      <div class="preview-image-wrapper">
        <img :src="activePreview" :alt="activeFileName" class="preview-image" />
      </div>
      <div class="preview-info">
        <span class="preview-name">{{ activeFileName }}</span>
        <span class="preview-size">{{ formatFileSize(activeFileSize) }}</span>
      </div>
      <div class="preview-actions">
        <button class="btn btn-secondary btn-sm" @click="clearPreview">取消</button>
        <button class="btn btn-primary btn-sm" :disabled="uploading" @click="doUpload">
          <span v-if="uploading" class="btn-spinner"></span>
          {{ uploading ? '上传中...' : '确认上传' }}
        </button>
      </div>
    </div>

    <div v-if="uploading" class="upload-progress">
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: uploadProgress + '%' }"></div>
      </div>
      <span class="progress-text">{{ uploadProgress }}%</span>
    </div>

    <div v-if="uploadedFiles.length > 0" class="uploaded-files">
      <span class="uploaded-title">已上传文件 ({{ uploadedFiles.length }})</span>
      <div class="uploaded-grid">
        <div v-for="file in uploadedFiles" :key="file.id" class="uploaded-item">
          <div class="uploaded-thumb">
            <img :src="file.url" :alt="file.original_name" />
          </div>
          <div class="uploaded-meta">
            <span class="uploaded-name" :title="file.original_name">{{ file.original_name }}</span>
            <span class="uploaded-size">{{ formatFileSize(file.size) }}</span>
          </div>
          <button class="uploaded-delete" @click="onDeleteFile(file)" title="删除文件">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <div v-if="uploadError" class="upload-error">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
        <circle cx="12" cy="12" r="10" />
        <line x1="15" y1="9" x2="9" y2="15" />
        <line x1="9" y1="9" x2="15" y2="15" />
      </svg>
      <span>{{ uploadError }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { UploadedFile } from '~/types'

const { uploadFile, deleteFile, loading, error, uploadProgress } = useFileUpload()

const props = defineProps<{
  itemId?: number
  acceptTypes?: string
}>()

const emit = defineEmits<{
  uploaded: [file: UploadedFile]
  deleted: [id: number]
}>()

const fileInputRef = ref<HTMLInputElement | null>(null)
const isDragover = ref(false)
const uploading = ref(false)
const uploadError = ref<string | null>(null)
const activePreview = ref<string | null>(null)
const activeFileName = ref('')
const activeFileSize = ref(0)
const activeFile = ref<File | null>(null)
const uploadedFiles = ref<UploadedFile[]>([])

const acceptTypes = computed(() => props.acceptTypes || 'image/jpeg,image/png,image/webp,image/gif,image/svg+xml')

function onFileSelect(event: Event) {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    setFile(input.files[0])
  }
  if (input) {
    input.value = ''
  }
}

function onDrop(event: DragEvent) {
  isDragover.value = false
  const files = event.dataTransfer?.files
  if (files && files[0]) {
    setFile(files[0])
  }
}

function setFile(file: File) {
  uploadError.value = null

  if (!file.type.match(/^image\/(jpeg|png|webp|gif|svg\+xml)$/)) {
    uploadError.value = '不支持的文件类型，请选择 JPG、PNG、WEBP、GIF 或 SVG 格式的图片'
    return
  }

  if (file.size > 10 * 1024 * 1024) {
    uploadError.value = '文件大小超过 10MB 限制'
    return
  }

  activeFile.value = file
  activeFileName.value = file.name
  activeFileSize.value = file.size

  const reader = new FileReader()
  reader.onload = (e) => {
    activePreview.value = e.target?.result as string
  }
  reader.readAsDataURL(file)
}

function clearPreview() {
  activePreview.value = null
  activeFileName.value = ''
  activeFileSize.value = 0
  activeFile.value = null
  uploadError.value = null
}

async function doUpload() {
  if (!activeFile.value) return

  uploading.value = true
  uploadError.value = null

  try {
    const result = await uploadFile(activeFile.value, props.itemId)
    uploadedFiles.value = [result, ...uploadedFiles.value]
    emit('uploaded', result)
    clearPreview()
  } catch {
    uploadError.value = error.value || '上传失败，请重试'
  } finally {
    uploading.value = false
  }
}

async function onDeleteFile(file: UploadedFile) {
  try {
    await deleteFile(file.id)
    uploadedFiles.value = uploadedFiles.value.filter((f) => f.id !== file.id)
    emit('deleted', file.id)
  } catch {
    uploadError.value = error.value || '删除失败，请重试'
  }
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`
}

async function loadFiles() {
  try {
    const { fetchFiles } = useFileUpload()
    const files = await fetchFiles(props.itemId)
    uploadedFiles.value = files
  } catch {
    // silently fail on initial load
  }
}

onMounted(() => {
  loadFiles()
})

watch(() => props.itemId, () => {
  loadFiles()
})
</script>

<style scoped>
.file-upload {
  margin-bottom: 18px;
}

.upload-area {
  border: 2px dashed var(--color-border);
  border-radius: var(--radius);
  padding: 28px 16px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
  background: var(--color-bg);
}

.upload-area:hover,
.upload-area--dragover {
  border-color: var(--color-primary);
  background: rgba(79, 70, 229, 0.04);
}

.upload-input {
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: pointer;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: var(--color-text-muted);
}

.upload-text {
  font-size: 0.9rem;
  color: var(--color-text-secondary);
}

.upload-hint {
  font-size: 0.78rem;
  color: var(--color-text-muted);
}

.preview-area {
  margin-top: 12px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  overflow: hidden;
}

.preview-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  background: var(--color-bg);
  border-bottom: 1px solid var(--color-border);
}

.preview-title {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-text);
}

.preview-remove {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border: none;
  background: none;
  color: var(--color-text-muted);
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.15s;
}

.preview-remove:hover {
  background: var(--color-bg);
  color: var(--color-danger);
}

.preview-image-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
  background: #f1f5f9;
  min-height: 120px;
  max-height: 260px;
  overflow: hidden;
}

.preview-image {
  max-width: 100%;
  max-height: 230px;
  object-fit: contain;
  border-radius: 4px;
}

.preview-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  border-top: 1px solid var(--color-border);
}

.preview-name {
  font-size: 0.82rem;
  color: var(--color-text);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 60%;
}

.preview-size {
  font-size: 0.78rem;
  color: var(--color-text-muted);
}

.preview-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 10px 14px;
  border-top: 1px solid var(--color-border);
  background: var(--color-bg);
}

.upload-progress {
  margin-top: 12px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.progress-bar {
  flex: 1;
  height: 6px;
  background: var(--color-border);
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--color-primary);
  border-radius: 3px;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 0.78rem;
  color: var(--color-text-secondary);
  min-width: 36px;
  text-align: right;
}

.uploaded-files {
  margin-top: 16px;
}

.uploaded-title {
  display: block;
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--color-text-secondary);
  margin-bottom: 8px;
}

.uploaded-grid {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.uploaded-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: 6px;
  transition: border-color 0.15s;
}

.uploaded-item:hover {
  border-color: var(--color-primary);
}

.uploaded-thumb {
  width: 40px;
  height: 40px;
  border-radius: 4px;
  overflow: hidden;
  flex-shrink: 0;
  background: #e2e8f0;
}

.uploaded-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.uploaded-meta {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.uploaded-name {
  font-size: 0.82rem;
  color: var(--color-text);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.uploaded-size {
  font-size: 0.72rem;
  color: var(--color-text-muted);
}

.uploaded-delete {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: none;
  background: none;
  color: var(--color-text-muted);
  cursor: pointer;
  border-radius: 4px;
  flex-shrink: 0;
  transition: all 0.15s;
}

.uploaded-delete:hover {
  background: rgba(220, 38, 38, 0.08);
  color: var(--color-danger);
}

.upload-error {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 10px;
  padding: 8px 12px;
  background: rgba(220, 38, 38, 0.06);
  border: 1px solid rgba(220, 38, 38, 0.2);
  border-radius: 6px;
  color: var(--color-danger);
  font-size: 0.82rem;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px 20px;
  border: none;
  border-radius: var(--radius);
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-sm {
  padding: 6px 14px;
  font-size: 0.82rem;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background: var(--color-primary);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: var(--color-primary-hover);
}

.btn-secondary {
  background: var(--color-surface);
  color: var(--color-text);
  border: 1px solid var(--color-border);
}

.btn-secondary:hover:not(:disabled) {
  background: var(--color-bg);
}

.btn-spinner {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>