<template>
  <Teleport to="body">
    <div v-if="visible" class="modal-overlay" @click.self="$emit('close')">
      <div class="detail-container">
        <div class="detail-header">
          <h3>数据详情</h3>
          <button class="modal-close" @click="$emit('close')" title="关闭">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <div class="detail-body">
          <div v-if="loading" class="detail-loading">
            <div class="spinner"></div>
            <span>加载中...</span>
          </div>
          <div v-else-if="error" class="detail-error">{{ error }}</div>
          <div v-else-if="item" class="detail-content">
            <div class="detail-field">
              <span class="field-label">ID</span>
              <span class="field-value">{{ item.id }}</span>
            </div>
            <div class="detail-field">
              <span class="field-label">名称</span>
              <span class="field-value">{{ item.name }}</span>
            </div>
            <div class="detail-field">
              <span class="field-label">描述</span>
              <span class="field-value">{{ item.description || '无' }}</span>
            </div>
            <div class="detail-field">
              <span class="field-label">状态</span>
              <span class="field-value">
                <span class="status-badge" :class="'status-' + item.status">
                  {{ statusLabel(item.status) }}
                </span>
              </span>
            </div>
            <div class="detail-field">
              <span class="field-label">创建时间</span>
              <span class="field-value">{{ formatDate(item.created_at) }}</span>
            </div>
            <div class="detail-field">
              <span class="field-label">更新时间</span>
              <span class="field-value">{{ formatDate(item.updated_at) }}</span>
            </div>
            <FileUpload :item-id="item.id" />
          </div>
        </div>
        <div class="detail-footer">
          <button class="btn btn-secondary" @click="$emit('close')">关闭</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import type { Item, ItemStatus } from '~/types'

defineProps<{
  visible: boolean
  item: Item | null
  loading: boolean
  error: string | null
}>()

defineEmits<{
  close: []
}>()

const statusMap: Record<ItemStatus, string> = {
  active: '启用',
  inactive: '停用',
  draft: '草稿',
  archived: '归档'
}

function statusLabel(status: string): string {
  return statusMap[status as ItemStatus] || status
}

function formatDate(dateStr: string): string {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleString('zh-CN')
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(2px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.detail-container {
  background: var(--color-surface);
  border-radius: 12px;
  width: 100%;
  max-width: 540px;
  box-shadow: var(--shadow-lg);
  overflow: hidden;
}

.detail-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid var(--color-border);
}

.detail-header h3 {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--color-text);
}

.modal-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  background: none;
  color: var(--color-text-muted);
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s;
}

.modal-close:hover {
  background: var(--color-bg);
  color: var(--color-text);
}

.detail-body {
  padding: 24px;
}

.detail-loading,
.detail-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 40px 0;
  color: var(--color-text-secondary);
}

.spinner {
  width: 28px;
  height: 28px;
  border: 3px solid var(--color-border);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.detail-error {
  color: var(--color-danger);
}

.detail-field {
  display: flex;
  padding: 14px 0;
  border-bottom: 1px solid var(--color-border);
}

.detail-field:last-child {
  border-bottom: none;
}

.field-label {
  width: 90px;
  flex-shrink: 0;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-text-secondary);
}

.field-value {
  flex: 1;
  font-size: 0.9rem;
  color: var(--color-text);
  word-break: break-all;
}

.status-badge {
  display: inline-block;
  padding: 2px 10px;
  border-radius: 12px;
  font-size: 0.78rem;
  font-weight: 500;
}

.status-active {
  background: #dcfce7;
  color: #166534;
}

.status-inactive {
  background: #f1f5f9;
  color: #475569;
}

.status-draft {
  background: #fef9c3;
  color: #854d0e;
}

.status-archived {
  background: #fce7f3;
  color: #9d174d;
}

.detail-footer {
  display: flex;
  justify-content: flex-end;
  padding: 16px 24px;
  background: var(--color-bg);
  border-top: 1px solid var(--color-border);
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 20px;
  border: none;
  border-radius: var(--radius);
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-secondary {
  background: var(--color-surface);
  color: var(--color-text);
  border: 1px solid var(--color-border);
}

.btn-secondary:hover {
  background: var(--color-bg);
}
</style>